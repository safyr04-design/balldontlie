"""
Automated Prediction Fetching and Monitoring System

This script continuously monitors models and fetches predictions
for upcoming games, tracking performance and sending notifications.
"""

import time
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import schedule
from bdl_client import BDLLabClient, print_performance_summary, print_predictions


class PredictionMonitor:
    """Monitors models and automatically generates predictions"""
    
    def __init__(self, api_key: str, data_dir: str = "./data"):
        self.client = BDLLabClient(api_key)
        self.data_dir = data_dir
        self.state_file = os.path.join(data_dir, "monitor_state.json")
        self.predictions_dir = os.path.join(data_dir, "predictions")
        
        # Create directories
        os.makedirs(data_dir, exist_ok=True)
        os.makedirs(self.predictions_dir, exist_ok=True)
        
        # Load state
        self.state = self._load_state()
    
    def _load_state(self) -> Dict:
        """Load monitoring state from disk"""
        if os.path.exists(self.state_file):
            with open(self.state_file, 'r') as f:
                return json.load(f)
        return {
            "monitored_models": [],
            "last_run": None,
            "total_predictions": 0,
            "prediction_history": []
        }
    
    def _save_state(self):
        """Save monitoring state to disk"""
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)
    
    def add_model(self, model_id: int):
        """Add a model to monitoring"""
        if model_id not in self.state["monitored_models"]:
            self.state["monitored_models"].append(model_id)
            self._save_state()
            print(f"✅ Added model {model_id} to monitoring")
    
    def remove_model(self, model_id: int):
        """Remove a model from monitoring"""
        if model_id in self.state["monitored_models"]:
            self.state["monitored_models"].remove(model_id)
            self._save_state()
            print(f"❌ Removed model {model_id} from monitoring")
    
    def fetch_predictions_for_model(self, model_id: int) -> Optional[Dict]:
        """Fetch predictions for a specific model"""
        try:
            print(f"\n🔍 Fetching predictions for model {model_id}...")
            
            # Generate new predictions
            job = self.client.generate_predictions(model_id)
            job_id = job["id"]
            
            print(f"   Job {job_id} created, waiting for completion...")
            
            # Wait for job to complete
            completed_job = self.client.wait_for_job(job_id, timeout=120)
            
            if completed_job["status"] == "completed":
                count = completed_job["output"]["count"]
                print(f"   ✅ Generated {count} predictions")
                
                # Fetch the predictions
                predictions = self.client.list_predictions(model_id)
                
                # Save to file
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"model_{model_id}_{timestamp}.json"
                filepath = os.path.join(self.predictions_dir, filename)
                
                with open(filepath, 'w') as f:
                    json.dump(predictions, f, indent=2)
                
                print(f"   💾 Saved predictions to {filename}")
                
                return predictions
            
        except Exception as e:
            print(f"   ❌ Error fetching predictions: {e}")
            return None
    
    def run_prediction_cycle(self):
        """Run a full prediction cycle for all monitored models"""
        print("\n" + "="*70)
        print(f"🤖 AUTOMATED PREDICTION CYCLE - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
        
        if not self.state["monitored_models"]:
            print("⚠️  No models being monitored. Add models with add_model()")
            return
        
        successful = 0
        failed = 0
        
        for model_id in self.state["monitored_models"]:
            result = self.fetch_predictions_for_model(model_id)
            if result:
                successful += 1
                self.state["total_predictions"] += len(result.get("data", []))
            else:
                failed += 1
        
        # Update state
        self.state["last_run"] = datetime.now().isoformat()
        self.state["prediction_history"].append({
            "timestamp": datetime.now().isoformat(),
            "successful": successful,
            "failed": failed
        })
        
        # Keep only last 100 history entries
        self.state["prediction_history"] = self.state["prediction_history"][-100:]
        
        self._save_state()
        
        print(f"\n📊 Cycle complete: {successful} successful, {failed} failed")
        print(f"   Total predictions tracked: {self.state['total_predictions']}")
    
    def check_model_performance(self, model_id: int):
        """Check and display current performance for a model"""
        try:
            print(f"\n📈 Performance for model {model_id}:")
            
            # Get model details
            model = self.client.get_model(model_id)
            print(f"\n   Model: {model['name']}")
            print(f"   Sport: {model['sport'].upper()}")
            print(f"   Bet Type: {model['bet_type'].replace('_', ' ').title()}")
            
            # Get performance
            performance = self.client.get_model_performance(model_id)
            print_performance_summary(performance)
            
            # Get recent predictions
            predictions = self.client.list_predictions(model_id, per_page=5)
            if predictions.get("data"):
                print("\n📋 Recent Predictions:")
                print_predictions(predictions["data"])
            
        except Exception as e:
            print(f"   ❌ Error checking performance: {e}")
    
    def get_high_confidence_picks(self, min_confidence: float = 0.6) -> List[Dict]:
        """Get high-confidence picks from all monitored models"""
        print(f"\n🎯 Finding high-confidence picks (>{min_confidence*100}% confidence)...\n")
        
        all_picks = []
        
        for model_id in self.state["monitored_models"]:
            try:
                # Get model info
                model = self.client.get_model(model_id)
                
                # Get predictions
                predictions = self.client.list_predictions(model_id)
                
                for pred in predictions.get("data", []):
                    if pred.get("confidence", 0) >= min_confidence and not pred.get("result"):
                        game = pred.get("game", {})
                        all_picks.append({
                            "model_id": model_id,
                            "model_name": model["name"],
                            "sport": model["sport"],
                            "game": game,
                            "prediction": pred
                        })
            
            except Exception as e:
                print(f"⚠️  Error processing model {model_id}: {e}")
        
        # Sort by confidence
        all_picks.sort(key=lambda x: x["prediction"]["confidence"], reverse=True)
        
        if all_picks:
            print(f"Found {len(all_picks)} high-confidence picks:\n")
            for pick in all_picks:
                game = pick["game"]
                pred = pick["prediction"]
                home = game.get("home_team", {})
                visitor = game.get("visitor_team", {})
                
                print(f"🏆 {pick['sport'].upper()} | {pick['model_name']}")
                print(f"   {visitor.get('abbreviation')} @ {home.get('abbreviation')} ({game.get('date')})")
                print(f"   Confidence: {pred.get('confidence', 0)*100:.1f}%")
                print(f"   Predicted: {pred.get('predicted_value')}, Market: {pred.get('market_value')}")
                print()
        else:
            print("No high-confidence picks found at the moment.")
        
        return all_picks
    
    def generate_daily_report(self) -> str:
        """Generate a daily report of all monitored models"""
        report = []
        report.append("="*70)
        report.append(f"DAILY BETTING REPORT - {datetime.now().strftime('%Y-%m-%d')}")
        report.append("="*70)
        report.append("")
        
        if not self.state["monitored_models"]:
            report.append("No models currently monitored.")
            return "\n".join(report)
        
        for model_id in self.state["monitored_models"]:
            try:
                model = self.client.get_model(model_id)
                performance = self.client.get_model_performance(model_id)
                predictions = self.client.list_predictions(model_id)
                stats = self.client.get_prediction_stats(model_id)
                
                report.append(f"📊 {model['name']} (ID: {model_id})")
                report.append(f"   Sport: {model['sport'].upper()} | Bet Type: {model['bet_type'].replace('_', ' ').title()}")
                report.append("")
                
                # Performance
                if performance and performance.get("status") == "completed":
                    report.append(f"   Historical Performance:")
                    report.append(f"   • Win Rate: {performance.get('win_rate', 0)*100:.2f}%")
                    report.append(f"   • ROI: {performance.get('roi', 0)*100:+.2f}%")
                    report.append(f"   • Record: {performance.get('wins', 0)}-{performance.get('losses', 0)}-{performance.get('pushes', 0)}")
                    report.append("")
                
                # Live predictions
                live_count = len([p for p in predictions.get("data", []) if not p.get("result")])
                if live_count > 0:
                    report.append(f"   🎯 {live_count} upcoming predictions")
                    report.append("")
                
                report.append("-"*70)
                report.append("")
            
            except Exception as e:
                report.append(f"⚠️  Error processing model {model_id}: {e}")
                report.append("")
        
        report_text = "\n".join(report)
        
        # Save report
        date_str = datetime.now().strftime("%Y%m%d")
        report_file = os.path.join(self.data_dir, f"daily_report_{date_str}.txt")
        with open(report_file, 'w') as f:
            f.write(report_text)
        
        print(f"📄 Daily report saved to {report_file}")
        
        return report_text
    
    def schedule_tasks(self):
        """Schedule automated tasks"""
        # Run predictions every 6 hours
        schedule.every(6).hours.do(self.run_prediction_cycle)
        
        # Generate daily report at 8 AM
        schedule.every().day.at("08:00").do(self.generate_daily_report)
        
        # Check high-confidence picks every 4 hours
        schedule.every(4).hours.do(lambda: self.get_high_confidence_picks(0.6))
        
        print("\n✅ Scheduled tasks:")
        print("   • Prediction cycle: Every 6 hours")
        print("   • Daily report: Every day at 8:00 AM")
        print("   • High-confidence picks: Every 4 hours")
    
    def start_monitoring(self):
        """Start the monitoring loop"""
        print("\n🚀 Starting automated prediction monitoring...")
        print(f"   Monitoring {len(self.state['monitored_models'])} models")
        print(f"   Data directory: {self.data_dir}")
        
        self.schedule_tasks()
        
        # Run initial cycle
        self.run_prediction_cycle()
        
        # Main loop
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            print("\n\n⏹️  Monitoring stopped")
            self._save_state()


# ==================== CLI Interface ====================

def main():
    """Main CLI interface for the prediction monitor"""
    import sys
    
    if len(sys.argv) < 2:
        print("""
Usage: python prediction_monitor.py <command> [args]

Commands:
  start                 - Start continuous monitoring
  add <model_id>       - Add a model to monitoring
  remove <model_id>    - Remove a model from monitoring
  list                 - List monitored models
  run                  - Run a single prediction cycle
  report               - Generate daily report
  picks <confidence>   - Show high-confidence picks (0-1)
  performance <model_id> - Check model performance
  
Environment Variables:
  BDL_API_KEY          - Your Ball Don't Lie Lab API key
  BDL_DATA_DIR         - Data directory (default: ./data)
""")
        sys.exit(1)
    
    # Get API key from environment
    api_key = os.getenv("BDL_API_KEY")
    if not api_key:
        print("❌ Error: BDL_API_KEY environment variable not set")
        sys.exit(1)
    
    data_dir = os.getenv("BDL_DATA_DIR", "./data")
    
    monitor = PredictionMonitor(api_key, data_dir)
    command = sys.argv[1].lower()
    
    if command == "start":
        monitor.start_monitoring()
    
    elif command == "add":
        if len(sys.argv) < 3:
            print("❌ Error: model_id required")
            sys.exit(1)
        model_id = int(sys.argv[2])
        monitor.add_model(model_id)
    
    elif command == "remove":
        if len(sys.argv) < 3:
            print("❌ Error: model_id required")
            sys.exit(1)
        model_id = int(sys.argv[2])
        monitor.remove_model(model_id)
    
    elif command == "list":
        print("\n📋 Monitored Models:")
        for model_id in monitor.state["monitored_models"]:
            print(f"   • Model {model_id}")
        print(f"\nTotal: {len(monitor.state['monitored_models'])}")
    
    elif command == "run":
        monitor.run_prediction_cycle()
    
    elif command == "report":
        report = monitor.generate_daily_report()
        print("\n" + report)
    
    elif command == "picks":
        confidence = float(sys.argv[2]) if len(sys.argv) > 2 else 0.6
        monitor.get_high_confidence_picks(confidence)
    
    elif command == "performance":
        if len(sys.argv) < 3:
            print("❌ Error: model_id required")
            sys.exit(1)
        model_id = int(sys.argv[2])
        monitor.check_model_performance(model_id)
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()

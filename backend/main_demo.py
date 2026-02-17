"""
Main Demo Script - Ball Don't Lie Lab Integration
Demonstrates all functionality of the betting analysis system
"""

import os
import sys
from bdl_client import (
    BDLLabClient, Sport, BetType, ModelMode, Importance,
    print_model_summary, print_performance_summary, print_predictions
)
from model_strategies import (
    ALL_STRATEGIES, print_all_strategies,
    NBARestAndDefense, NBAOffensiveExplosion,
    NFLTurnoverEdge, NHLGoalieAdvantage,
    MLBPitcherDominance
)
from factor_analyzer import FactorAnalyzer
from prediction_monitor import PredictionMonitor


def demo_basic_api_usage(client: BDLLabClient):
    """Demonstrate basic API operations"""
    print("\n" + "="*80)
    print("1️⃣  BASIC API OPERATIONS")
    print("="*80)
    
    try:
        # List factors
        print("\n📋 Fetching NBA factors...")
        factors = client.list_factors(Sport.NBA)
        print(f"   Found {len(factors)} factors")
        
        # Show first few factors
        print("\n   Sample factors:")
        for factor in factors[:3]:
            print(f"   • {factor.name} ({factor.category})")
        
        # List existing models
        print("\n📊 Fetching your models...")
        models_response = client.list_models()
        models = models_response.get("data", [])
        print(f"   You have {len(models)} models")
        
        if models:
            print("\n   Your models:")
            for model in models[:3]:
                print(f"   • {model['name']} ({model['sport'].upper()} {model['bet_type']})")
        
        print("\n✅ Basic API operations working!")
        
    except Exception as e:
        print(f"\n❌ API Error: {e}")
        print("\n⚠️  Note: API access requires a paid subscription (LAB PRO or ALL-ACCESS)")


def demo_model_creation(client: BDLLabClient):
    """Demonstrate model creation using pre-built strategies"""
    print("\n" + "="*80)
    print("2️⃣  MODEL CREATION WITH STRATEGIES")
    print("="*80)
    
    # Show available strategies
    print_all_strategies()
    
    try:
        print("\n🔨 Creating NBA Rest & Defense model...")
        strategy = NBARestAndDefense()
        model = strategy.create_model(client)
        
        print_model_summary(model)
        
        print("✅ Model created successfully!")
        return model['id']
        
    except Exception as e:
        print(f"\n❌ Error creating model: {e}")
        return None


def demo_model_evaluation(client: BDLLabClient, model_id: int):
    """Demonstrate model backtesting and evaluation"""
    print("\n" + "="*80)
    print("3️⃣  MODEL EVALUATION & BACKTESTING")
    print("="*80)
    
    try:
        print(f"\n📈 Running backtest for model {model_id}...")
        print("   This evaluates the model against historical data...")
        
        # Start evaluation job
        job = client.evaluate_performance(model_id, season="2024-25")
        job_id = job["id"]
        
        print(f"   Evaluation job {job_id} started")
        print("   Waiting for completion (this may take 30-60 seconds)...")
        
        # Wait for completion
        completed_job = client.wait_for_job(job_id, timeout=180)
        
        if completed_job["status"] == "completed":
            print("\n✅ Evaluation complete!")
            
            # Fetch performance results
            performance = client.get_model_performance(model_id)
            print_performance_summary(performance)
            
            return True
        
    except Exception as e:
        print(f"\n❌ Error during evaluation: {e}")
        return False


def demo_prediction_generation(client: BDLLabClient, model_id: int):
    """Demonstrate prediction generation"""
    print("\n" + "="*80)
    print("4️⃣  PREDICTION GENERATION")
    print("="*80)
    
    try:
        print(f"\n🎯 Generating predictions for model {model_id}...")
        
        # Generate predictions
        job = client.generate_predictions(model_id)
        job_id = job["id"]
        
        print(f"   Prediction job {job_id} started")
        print("   Waiting for completion...")
        
        # Wait for completion
        completed_job = client.wait_for_job(job_id, timeout=120)
        
        if completed_job["status"] == "completed":
            count = completed_job["output"]["count"]
            print(f"\n✅ Generated {count} predictions!")
            
            # Fetch predictions
            predictions = client.list_predictions(model_id, per_page=10)
            print_predictions(predictions.get("data", []))
            
            # Get prediction stats
            stats = client.get_prediction_stats(model_id)
            print(f"\n📊 Prediction Statistics:")
            print(f"   Total: {stats['total']}")
            print(f"   Wins: {stats['wins']}")
            print(f"   Losses: {stats['losses']}")
            print(f"   Pushes: {stats['pushes']}")
            if stats['total'] > 0:
                print(f"   Win Rate: {stats['win_rate']:.2f}%")
            
            return True
        
    except Exception as e:
        print(f"\n❌ Error generating predictions: {e}")
        return False


def demo_factor_analysis(client: BDLLabClient):
    """Demonstrate factor analysis capabilities"""
    print("\n" + "="*80)
    print("5️⃣  FACTOR ANALYSIS & INSIGHTS")
    print("="*80)
    
    try:
        analyzer = FactorAnalyzer(client.api_key)
        
        # Show factor summary for NBA
        print("\n📊 Analyzing NBA factors...")
        analyzer.print_factor_summary(Sport.NBA)
        
        # Generate recommendations for NBA spread betting
        print("\n💡 Generating recommendations for NBA spread betting...")
        analyzer.generate_factor_recommendations(Sport.NBA, BetType.SPREAD, top_n=5)
        
        # Suggest complete model composition
        print("\n🎨 Suggesting complete model composition...")
        suggested_factors = analyzer.suggest_model_composition(
            Sport.NBA,
            BetType.SPREAD,
            style="balanced"
        )
        
        print(f"✅ Analysis complete! Suggested {len(suggested_factors)} factors")
        
    except Exception as e:
        print(f"\n❌ Error during analysis: {e}")


def demo_automated_monitoring():
    """Demonstrate automated prediction monitoring"""
    print("\n" + "="*80)
    print("6️⃣  AUTOMATED PREDICTION MONITORING")
    print("="*80)
    
    api_key = os.getenv("BDL_API_KEY", "eb22453f-3efd-4b06-884d-996ebca1a436")
    
    try:
        monitor = PredictionMonitor(api_key, data_dir="./data")
        
        print("\n🤖 Prediction Monitor Features:")
        print("   • Automatic prediction generation every 6 hours")
        print("   • Daily performance reports")
        print("   • High-confidence pick alerts")
        print("   • Historical prediction tracking")
        
        print("\n📋 Current monitoring state:")
        print(f"   Monitored models: {len(monitor.state['monitored_models'])}")
        print(f"   Total predictions tracked: {monitor.state['total_predictions']}")
        if monitor.state['last_run']:
            print(f"   Last run: {monitor.state['last_run']}")
        
        print("\n💡 To start automated monitoring:")
        print("   export BDL_API_KEY='your-api-key'")
        print("   python backend/prediction_monitor.py start")
        
    except Exception as e:
        print(f"\n❌ Error setting up monitoring: {e}")


def demo_strategy_comparison(client: BDLLabClient):
    """Compare multiple strategies using preview"""
    print("\n" + "="*80)
    print("7️⃣  STRATEGY COMPARISON")
    print("="*80)
    
    strategies_to_test = [
        NBARestAndDefense(),
        NBAOffensiveExplosion()
    ]
    
    print("\n🔬 Testing multiple strategies with preview...")
    print("   Preview allows you to test models without saving them\n")
    
    for strategy in strategies_to_test:
        try:
            print(f"\n📊 Testing: {strategy.name}")
            print(f"   {strategy.description}")
            
            # Create preview job
            job = client.create_preview(
                bet_type=strategy.bet_type,
                mode=ModelMode.SIMPLE,
                factors=strategy.get_factors(),
                sport=strategy.sport
            )
            
            job_id = job["id"]
            print(f"   Preview job {job_id} started, waiting...")
            
            # Wait for completion
            completed_job = client.wait_for_job(job_id, timeout=180)
            
            if completed_job["status"] == "completed":
                output = completed_job["output"]
                historical = output["historical"]
                
                print(f"\n   ✅ Results:")
                print(f"      Win Rate: {historical['win_rate']*100:.2f}%")
                print(f"      ROI: {historical['roi']*100:+.2f}%")
                print(f"      Total Games: {historical['total_games']}")
                print(f"      Record: {historical['wins']}-{historical['losses']}-{historical['pushes']}")
        
        except Exception as e:
            print(f"   ❌ Error: {e}")


def create_demo_models_for_all_sports(client: BDLLabClient):
    """Create one model for each sport"""
    print("\n" + "="*80)
    print("8️⃣  CREATING MODELS FOR ALL SPORTS")
    print("="*80)
    
    strategies = [
        NBARestAndDefense(),
        NFLTurnoverEdge(),
        NHLGoalieAdvantage(),
        MLBPitcherDominance()
    ]
    
    created_models = []
    
    for strategy in strategies:
        try:
            print(f"\n🔨 Creating {strategy.name}...")
            model = strategy.create_model(client)
            created_models.append(model)
            print(f"   ✅ Model {model['id']} created!")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return created_models


def print_usage_guide():
    """Print comprehensive usage guide"""
    print("\n" + "="*80)
    print("📚 BALL DON'T LIE LAB - USAGE GUIDE")
    print("="*80)
    
    print("""
This system provides comprehensive tools for sports betting analysis:

🔧 PYTHON SDK (backend/bdl_client.py)
   • Full API client with all endpoints
   • Easy-to-use methods for factors, models, predictions
   • Job polling and error handling
   
   Example:
     from bdl_client import BDLLabClient, Sport, BetType
     client = BDLLabClient("your-api-key")
     factors = client.list_factors(Sport.NBA)

🎯 PRE-BUILT STRATEGIES (backend/model_strategies.py)
   • 9 ready-to-use betting strategies
   • NBA: Rest & Defense, Offensive Explosion, Home Court
   • NFL: Turnover Edge, Trench Warfare
   • NHL: Goalie Advantage, Special Teams Edge
   • MLB: Pitcher Dominance, Totals Prediction
   
   Example:
     from model_strategies import NBARestAndDefense
     strategy = NBARestAndDefense()
     model = strategy.create_model(client)

🤖 AUTOMATED MONITORING (backend/prediction_monitor.py)
   • Continuous prediction generation
   • Daily performance reports
   • High-confidence pick alerts
   • Historical tracking
   
   Usage:
     export BDL_API_KEY="your-api-key"
     python backend/prediction_monitor.py start

📊 FACTOR ANALYSIS (backend/factor_analyzer.py)
   • Analyze factors by sport and category
   • Get recommendations for bet types
   • Suggest complete model compositions
   • Compare factors across sports
   
   Usage:
     python backend/factor_analyzer.py recommend nba spread
     python backend/factor_analyzer.py suggest nba over_under balanced

📁 PROJECT STRUCTURE:
   backend/
   ├── bdl_client.py          - Core API client
   ├── model_strategies.py     - Pre-built strategies
   ├── prediction_monitor.py   - Automated monitoring
   ├── factor_analyzer.py      - Factor analysis tools
   └── main_demo.py           - This demo script
   
   frontend/
   └── (React dashboard - to be built)
   
   data/
   ├── predictions/           - Generated predictions
   ├── monitor_state.json     - Monitoring state
   └── daily_report_*.txt     - Daily reports

🚀 QUICK START:
   1. Set your API key: export BDL_API_KEY="your-key"
   2. Run demo: python backend/main_demo.py
   3. Create models: python backend/model_strategies.py
   4. Start monitoring: python backend/prediction_monitor.py start

📖 API DOCUMENTATION:
   • Full OpenAPI spec: openapi.yaml
   • Online docs: https://lab.balldontlie.io/docs/

⚠️  IMPORTANT:
   • API access requires LAB PRO ($99.99/mo) or ALL-ACCESS ($299.99/mo)
   • Free tier provides UI access only
   • Rate limit: 100 requests per minute

💡 TIPS:
   • Start with preview jobs to test strategies without saving
   • Use factor analysis to understand which factors work best
   • Monitor multiple models for diversification
   • Focus on high-confidence predictions (>60%)
   • Track ROI over time to validate strategies
""")


def main():
    """Main demo execution"""
    print("\n" + "="*80)
    print("🏀 BALL DON'T LIE LAB - COMPREHENSIVE DEMO")
    print("="*80)
    
    # Get API key
    api_key = os.getenv("BDL_API_KEY", "eb22453f-3efd-4b06-884d-996ebca1a436")
    
    if not api_key or api_key == "eb22453f-3efd-4b06-884d-996ebca1a436":
        print("\n⚠️  Using provided API key (requires paid subscription)")
        print("   Set BDL_API_KEY environment variable for your own key")
    
    # Initialize client
    client = BDLLabClient(api_key)
    
    # Run demos
    try:
        # 1. Basic API operations
        demo_basic_api_usage(client)
        
        # 2. Show usage guide
        if len(sys.argv) > 1 and sys.argv[1] == "guide":
            print_usage_guide()
            return
        
        # 3. Model creation
        if len(sys.argv) > 1 and sys.argv[1] == "create":
            model_id = demo_model_creation(client)
            if model_id:
                demo_model_evaluation(client, model_id)
                demo_prediction_generation(client, model_id)
        
        # 4. Factor analysis
        elif len(sys.argv) > 1 and sys.argv[1] == "analyze":
            demo_factor_analysis(client)
        
        # 5. Strategy comparison
        elif len(sys.argv) > 1 and sys.argv[1] == "compare":
            demo_strategy_comparison(client)
        
        # 6. Create all sports models
        elif len(sys.argv) > 1 and sys.argv[1] == "all-sports":
            create_demo_models_for_all_sports(client)
        
        # 7. Automated monitoring
        elif len(sys.argv) > 1 and sys.argv[1] == "monitor":
            demo_automated_monitoring()
        
        # Default: show usage
        else:
            print("\n" + "="*80)
            print("DEMO COMMANDS")
            print("="*80)
            print("\nUsage: python backend/main_demo.py <command>\n")
            print("Commands:")
            print("  guide        - Show comprehensive usage guide")
            print("  create       - Create and evaluate a model")
            print("  analyze      - Run factor analysis")
            print("  compare      - Compare multiple strategies")
            print("  all-sports   - Create models for all sports")
            print("  monitor      - Show monitoring capabilities")
            print("\nExamples:")
            print("  python backend/main_demo.py guide")
            print("  python backend/main_demo.py create")
            print("  python backend/main_demo.py analyze")
            
            print("\n💡 For automated monitoring:")
            print("  python backend/prediction_monitor.py start")
            
            print("\n💡 For factor analysis:")
            print("  python backend/factor_analyzer.py recommend nba spread")
    
    except KeyboardInterrupt:
        print("\n\n⏹️  Demo interrupted")
    
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "="*80)
    print("Demo complete! Check out the usage guide for more details.")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()

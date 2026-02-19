#!/usr/bin/env python3
"""
Get Live Predictions from Ball Don't Lie Lab API
Fetches the latest predictions for all active models
"""

import os
import sys
from datetime import datetime
from bdl_client import BDLLabClient, Sport
from typing import List, Dict, Any
import json
import requests


def format_prediction(pred: Dict[str, Any]) -> str:
    """Format a prediction for display"""
    lines = []
    lines.append("=" * 80)
    lines.append(f"🎯 PREDICTION #{pred.get('id', 'N/A')}")
    lines.append("=" * 80)
    
    # Game info
    game_info = pred.get('game', {})
    lines.append(f"🏀 Game: {game_info.get('home_team', {}).get('name', 'N/A')} vs {game_info.get('away_team', {}).get('name', 'N/A')}")
    lines.append(f"📅 Date: {game_info.get('date', 'N/A')}")
    lines.append(f"🏟️  Venue: Home")
    lines.append("")
    
    # Prediction details
    lines.append(f"📊 Prediction: {pred.get('predicted_side', 'N/A')}")
    lines.append(f"📈 Line: {pred.get('line', 'N/A')}")
    lines.append(f"💯 Confidence: {pred.get('confidence_score', 0):.1f}%")
    
    # Confidence level
    confidence = pred.get('confidence_score', 0)
    if confidence >= 80:
        level = "🔥 VERY HIGH"
        color = "GREEN"
    elif confidence >= 70:
        level = "✅ HIGH"
        color = "BLUE"
    elif confidence >= 60:
        level = "⚠️  MEDIUM"
        color = "YELLOW"
    else:
        level = "❓ LOW"
        color = "GRAY"
    lines.append(f"🎚️  Level: {level}")
    lines.append("")
    
    # Model info
    model_info = pred.get('model', {})
    lines.append(f"🤖 Model: {model_info.get('name', 'N/A')}")
    lines.append(f"🏅 Sport: {model_info.get('sport', 'N/A').upper()}")
    lines.append(f"🎲 Bet Type: {model_info.get('bet_type', 'N/A')}")
    lines.append("")
    
    # Factor breakdown
    factors = pred.get('factor_scores', {})
    if factors:
        lines.append("🧮 Factor Breakdown:")
        for factor_name, score in factors.items():
            lines.append(f"   • {factor_name}: {score:.2f}")
        lines.append("")
    
    # Result (if available)
    result = pred.get('result')
    if result:
        result_emoji = "✅" if result == "win" else "❌" if result == "loss" else "⏸️"
        lines.append(f"{result_emoji} Result: {result.upper()}")
        lines.append("")
    
    return "\n".join(lines)


def get_live_predictions(api_key: str, sport: str = None, limit: int = 10):
    """
    Fetch live predictions from BDL Lab API
    
    Args:
        api_key: Your BDL Lab API key
        sport: Filter by sport (nba, nfl, nhl, mlb) or None for all
        limit: Maximum number of predictions to fetch
    """
    print("=" * 80)
    print("🎯 BALL DON'T LIE LAB - LIVE PREDICTIONS")
    print("=" * 80)
    print()
    
    # Check API key
    if not api_key or api_key == "your-api-key-here":
        print("❌ ERROR: No valid API key provided!")
        print()
        print("📝 Your current key is FREE TIER (UI only)")
        print("   Key: eb22453f-3efd-4b06-884d-996ebca1a436")
        print()
        print("🔓 To get live predictions via API, you need to upgrade:")
        print("   • LAB PRO: $99.99/mo - Full API access")
        print("   • ALL-ACCESS: $299.99/mo - Full API + Live sports data")
        print()
        print("🔗 Upgrade at: https://lab-app.balldontlie.io/settings/billing")
        print()
        print("💡 Showing demo predictions instead...")
        print()
        show_demo_predictions()
        return
    
    # Initialize client
    try:
        client = BDLLabClient(api_key)
        print(f"✅ Connected to BDL Lab API")
        print(f"🔑 Using API key: {api_key[:8]}...{api_key[-4:]}")
        print()
        
        # Fetch predictions
        print(f"📡 Fetching predictions...")
        if sport:
            print(f"   Sport: {sport.upper()}")
        print(f"   Limit: {limit}")
        print()
        
        params = {
            'limit': limit,
            'status': 'pending'  # Get upcoming/pending predictions
        }
        
        if sport:
            params['sport'] = sport
        
        predictions = client.list_predictions(**params)
        
        if not predictions:
            print("⚠️  No predictions found!")
            print()
            print("💡 This could mean:")
            print("   • No active models with predictions")
            print("   • No upcoming games in the selected sport")
            print("   • Predictions not yet generated")
            print()
            print("🎯 Try generating predictions:")
            print("   1. Go to dashboard: https://3003-i89pt90gl83mn7gkol6v2-dfc00ec5.sandbox.novita.ai")
            print("   2. Navigate to Predictions page")
            print("   3. Click 'Generate Predictions' button")
            print("   4. Select your models and generate")
            print()
            return
        
        # Display predictions
        print(f"🎉 Found {len(predictions)} predictions!")
        print()
        
        for i, pred in enumerate(predictions, 1):
            print(format_prediction(pred))
            if i < len(predictions):
                print()
        
        # Summary stats
        print("=" * 80)
        print("📊 SUMMARY")
        print("=" * 80)
        
        high_conf = sum(1 for p in predictions if p.get('confidence_score', 0) >= 70)
        avg_conf = sum(p.get('confidence_score', 0) for p in predictions) / len(predictions)
        
        print(f"Total Predictions: {len(predictions)}")
        print(f"High Confidence (≥70%): {high_conf}")
        print(f"Average Confidence: {avg_conf:.1f}%")
        
        # By sport
        sports_count = {}
        for pred in predictions:
            sport_name = pred.get('model', {}).get('sport', 'Unknown')
            sports_count[sport_name] = sports_count.get(sport_name, 0) + 1
        
        print()
        print("By Sport:")
        for sport_name, count in sports_count.items():
            print(f"   {sport_name.upper()}: {count}")
        
        print()
        print("=" * 80)
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            print("❌ ERROR: Authentication failed!")
            print()
            print("🔑 Your API key is not valid for programmatic access")
            print("   Current key (FREE TIER): eb22453f-3efd-4b06-884d-996ebca1a436")
            print()
            print("📝 Free tier keys only work in the web dashboard")
            print("   They cannot be used for API calls from code")
            print()
            print("🔓 To use the API programmatically, upgrade to:")
            print("   • LAB PRO: $99.99/mo")
            print("   • ALL-ACCESS: $299.99/mo")
            print()
            print("🔗 Upgrade: https://lab-app.balldontlie.io/settings/billing")
            print()
            print("💡 Showing demo predictions instead...")
            print()
            show_demo_predictions()
        elif e.response.status_code == 429:
            print("❌ ERROR: Rate limit exceeded!")
            print("   Please wait a moment and try again")
        else:
            print(f"❌ ERROR: {e}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print()
        print("💡 Showing demo predictions instead...")
        print()
        show_demo_predictions()


def show_demo_predictions():
    """Show demo predictions when API is not available"""
    demo_predictions = [
        {
            'id': 'DEMO-1',
            'game': {
                'home_team': {'name': 'Los Angeles Lakers'},
                'away_team': {'name': 'Golden State Warriors'},
                'date': '2024-02-18 19:30:00'
            },
            'predicted_side': 'Lakers -4.5',
            'line': -4.5,
            'confidence_score': 87.3,
            'model': {
                'name': 'NBA Rest & Defense',
                'sport': 'nba',
                'bet_type': 'spread'
            },
            'factor_scores': {
                'team_last_n_pts_allowed_avg': 8.5,
                'rest_days': 9.2,
                'back_to_back': 7.8,
                'team_ats_record': 8.1
            }
        },
        {
            'id': 'DEMO-2',
            'game': {
                'home_team': {'name': 'Boston Celtics'},
                'away_team': {'name': 'Miami Heat'},
                'date': '2024-02-18 20:00:00'
            },
            'predicted_side': 'Over 215.5',
            'line': 215.5,
            'confidence_score': 82.1,
            'model': {
                'name': 'NBA Offensive Explosion',
                'sport': 'nba',
                'bet_type': 'over_under'
            },
            'factor_scores': {
                'team_last_n_pts_scored_avg': 9.1,
                'pace_of_play': 8.7,
                'opponent_defensive_rating': 7.9
            }
        },
        {
            'id': 'DEMO-3',
            'game': {
                'home_team': {'name': 'Dallas Cowboys'},
                'away_team': {'name': 'Philadelphia Eagles'},
                'date': '2024-02-18 13:00:00'
            },
            'predicted_side': 'Cowboys ML',
            'line': -150,
            'confidence_score': 75.6,
            'model': {
                'name': 'NFL Turnover Edge',
                'sport': 'nfl',
                'bet_type': 'moneyline'
            },
            'factor_scores': {
                'turnover_differential': 9.5,
                'defensive_pressure_rate': 8.2,
                'home_field_advantage': 7.8
            }
        }
    ]
    
    print("=" * 80)
    print("🎮 DEMO MODE - SAMPLE PREDICTIONS")
    print("=" * 80)
    print()
    print("ℹ️  These are sample predictions for demonstration purposes")
    print("   To get real live predictions, upgrade to LAB PRO or ALL-ACCESS")
    print()
    
    for pred in demo_predictions:
        print(format_prediction(pred))
        print()
    
    print("=" * 80)
    print("📝 NOTE: These are DEMO predictions, not real API data")
    print("=" * 80)
    print()
    print("🔓 Get Real Predictions:")
    print("   1. Upgrade at: https://lab-app.balldontlie.io/settings/billing")
    print("   2. Choose LAB PRO ($99.99/mo) or ALL-ACCESS ($299.99/mo)")
    print("   3. Get your new API key")
    print("   4. Run: export BDL_API_KEY='your-new-key'")
    print("   5. Run this script again!")
    print()


def main():
    """Main entry point"""
    # Get API key from environment or argument
    api_key = os.environ.get('BDL_API_KEY', 'eb22453f-3efd-4b06-884d-996ebca1a436')
    
    # Parse command line arguments
    sport = None
    limit = 10
    
    if len(sys.argv) > 1:
        if sys.argv[1] in ['nba', 'nfl', 'nhl', 'mlb']:
            sport = sys.argv[1]
        elif sys.argv[1] in ['--help', '-h']:
            print("Usage: python get_live_predictions.py [sport] [limit]")
            print()
            print("Arguments:")
            print("  sport   Filter by sport: nba, nfl, nhl, mlb (optional)")
            print("  limit   Number of predictions to fetch (default: 10)")
            print()
            print("Examples:")
            print("  python get_live_predictions.py")
            print("  python get_live_predictions.py nba")
            print("  python get_live_predictions.py nba 20")
            print()
            print("Environment:")
            print("  BDL_API_KEY   Your Ball Don't Lie Lab API key")
            print()
            return
    
    if len(sys.argv) > 2:
        try:
            limit = int(sys.argv[2])
        except ValueError:
            print(f"❌ Invalid limit: {sys.argv[2]}")
            return
    
    # Fetch predictions
    get_live_predictions(api_key, sport, limit)


if __name__ == "__main__":
    main()

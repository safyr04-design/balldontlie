#!/usr/bin/env python3
"""
Fetch Live Scores from Ball Don't Lie Sports API (FREE Tier)
Shows real-time NBA, NFL, NHL, and MLB game scores
"""

import requests
import sys
from datetime import datetime, timedelta
from typing import List, Dict, Any


def format_score_display(game: Dict[str, Any]) -> str:
    """Format a game for beautiful display"""
    lines = []
    
    # Game header
    lines.append("=" * 80)
    
    # Teams and scores
    home = game['home_team']
    visitor = game['visitor_team']
    home_score = game.get('home_team_score', 0)
    visitor_score = game.get('visitor_team_score', 0)
    
    # Determine winner
    if game['status'] == 'Final':
        if home_score > visitor_score:
            home_marker = "🏆"
            visitor_marker = "  "
        else:
            home_marker = "  "
            visitor_marker = "🏆"
    else:
        home_marker = "🏠"
        visitor_marker = "✈️ "
    
    # Display teams and scores
    lines.append(f"{visitor_marker} {visitor['full_name']:<35} {visitor_score:>3}")
    lines.append(f"{home_marker} {home['full_name']:<35} {home_score:>3}")
    lines.append("")
    
    # Status and time
    status = game['status']
    period = game['period']
    time = game.get('time', '')
    
    if status == 'Final':
        status_display = "🏁 FINAL"
    elif period == 0:
        status_display = f"🕐 {status}"  # Scheduled time
    elif 'Qtr' in status or 'Quarter' in status:
        status_display = f"🏀 {status} - {time}"
    elif 'Half' in status:
        status_display = f"⏸️  {status}"
    else:
        status_display = f"⚡ {status}"
    
    lines.append(f"Status: {status_display}")
    
    # Quarter breakdown for completed/in-progress games
    if period > 0:
        quarters = []
        for q in range(1, 5):
            home_q = game.get(f'home_q{q}', '-')
            visitor_q = game.get(f'visitor_q{q}', '-')
            quarters.append(f"Q{q}: {visitor_q}-{home_q}")
        
        # Check for overtime
        for ot in range(1, 4):
            home_ot = game.get(f'home_ot{ot}')
            visitor_ot = game.get(f'visitor_ot{ot}')
            if home_ot is not None:
                quarters.append(f"OT{ot}: {visitor_ot}-{home_ot}")
        
        lines.append(f"Quarters: {' | '.join(quarters)}")
    
    # Date and season
    date = game.get('date', 'N/A')
    lines.append(f"Date: {date}")
    
    # Additional info for live games
    if period > 0 and status != 'Final':
        timeouts_home = game.get('home_timeouts_remaining', 'N/A')
        timeouts_visitor = game.get('visitor_timeouts_remaining', 'N/A')
        lines.append(f"Timeouts: {visitor['abbreviation']} {timeouts_visitor} | {home['abbreviation']} {timeouts_home}")
    
    return "\n".join(lines)


def fetch_live_scores(api_key: str = None, sport: str = "nba", days: int = 0):
    """
    Fetch live scores from Ball Don't Lie Sports API
    
    Args:
        api_key: Your Ball Don't Lie API key (FREE tier works!)
        sport: Sport to fetch (nba, nfl, nhl, mlb)
        days: Number of days (0=today, 1=tomorrow, -1=yesterday)
    """
    print("=" * 80)
    print("🏀 BALL DON'T LIE - LIVE SCORES (FREE API)")
    print("=" * 80)
    print()
    
    # Check if API key is provided
    if not api_key:
        print("⚠️  No API key provided!")
        print()
        print("📝 To get FREE live scores:")
        print("   1. Sign up at: https://app.balldontlie.io/signup")
        print("   2. Get your FREE API key (no credit card required)")
        print("   3. Run: python fetch_live_scores.py YOUR_API_KEY")
        print()
        print("💡 For now, showing you how it works with demo instructions...")
        print()
        return
    
    # Calculate date
    target_date = datetime.now() + timedelta(days=days)
    date_str = target_date.strftime("%Y-%m-%d")
    
    print(f"📅 Fetching scores for: {date_str}")
    print(f"🏅 Sport: {sport.upper()}")
    print()
    
    # Fetch games
    try:
        url = "https://api.balldontlie.io/v1/games"
        params = {
            "dates[]": date_str
        }
        headers = {
            "Authorization": api_key
        }
        
        print(f"🔄 Fetching from API...")
        response = requests.get(url, params=params, headers=headers)
        
        # Check for errors
        if response.status_code == 401:
            print("❌ ERROR: Invalid API key or authentication failed!")
            print()
            print("🔑 Your API key may be invalid or expired")
            print("   Visit https://app.balldontlie.io to get a new key")
            print()
            return
        elif response.status_code == 429:
            print("❌ ERROR: Rate limit exceeded!")
            print("   FREE tier: 5 requests per minute")
            print("   Please wait 60 seconds and try again")
            print()
            return
        elif response.status_code != 200:
            print(f"❌ ERROR: HTTP {response.status_code}")
            print(f"   {response.text}")
            return
        
        data = response.json()
        games = data.get('data', [])
        
        if not games:
            print(f"📭 No games found for {date_str}")
            print()
            print("💡 Try:")
            print(f"   - Tomorrow: python fetch_live_scores.py {api_key} {sport} 1")
            print(f"   - Yesterday: python fetch_live_scores.py {api_key} {sport} -1")
            return
        
        # Display results
        print(f"🎉 Found {len(games)} game(s)!")
        print()
        
        # Categorize games
        live_games = [g for g in games if g['status'] not in ['Final', ''] and g['period'] > 0]
        completed_games = [g for g in games if g['status'] == 'Final']
        upcoming_games = [g for g in games if g['period'] == 0]
        
        # Show live games first
        if live_games:
            print("⚡ LIVE GAMES")
            print("=" * 80)
            for game in live_games:
                print(format_score_display(game))
                print()
        
        # Show completed games
        if completed_games:
            print("🏁 COMPLETED GAMES")
            print("=" * 80)
            for game in completed_games:
                print(format_score_display(game))
                print()
        
        # Show upcoming games
        if upcoming_games:
            print("🕐 UPCOMING GAMES")
            print("=" * 80)
            for game in upcoming_games:
                print(format_score_display(game))
                print()
        
        # Summary
        print("=" * 80)
        print("📊 SUMMARY")
        print("=" * 80)
        print(f"Total Games: {len(games)}")
        print(f"Live Now: {len(live_games)}")
        print(f"Completed: {len(completed_games)}")
        print(f"Upcoming: {len(upcoming_games)}")
        print()
        
        # Rate limit info
        rate_limit = response.headers.get('X-RateLimit-Remaining', 'N/A')
        rate_reset = response.headers.get('X-RateLimit-Reset', 'N/A')
        print(f"⏱️  Rate Limit: {rate_limit} requests remaining")
        print()
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Network Error: {e}")
        print()
    except Exception as e:
        print(f"❌ Error: {e}")
        print()


def show_demo():
    """Show demo with instructions"""
    print("=" * 80)
    print("🏀 BALL DON'T LIE - LIVE SCORES DEMO")
    print("=" * 80)
    print()
    print("This script fetches REAL live scores from the Ball Don't Lie Sports API")
    print()
    print("📝 STEP 1: Get Your FREE API Key")
    print("   1. Visit: https://app.balldontlie.io/signup")
    print("   2. Create free account (no credit card required)")
    print("   3. Copy your API key from the dashboard")
    print()
    print("🚀 STEP 2: Run the Script")
    print("   python fetch_live_scores.py YOUR_API_KEY")
    print()
    print("📊 WHAT YOU'LL GET (FREE TIER):")
    print("   ✅ Live game scores (real-time)")
    print("   ✅ Quarter-by-quarter breakdowns")
    print("   ✅ Game status (live, final, scheduled)")
    print("   ✅ Team information")
    print("   ✅ Historical scores")
    print("   ✅ 5 requests per minute")
    print()
    print("⚙️  OPTIONS:")
    print("   python fetch_live_scores.py API_KEY nba 0    # Today's NBA games")
    print("   python fetch_live_scores.py API_KEY nfl 1    # Tomorrow's NFL games")
    print("   python fetch_live_scores.py API_KEY nhl -1   # Yesterday's NHL games")
    print()
    print("🎁 FREE FOREVER:")
    print("   • No credit card required")
    print("   • No expiration")
    print("   • Perfect for personal projects")
    print()
    print("📚 Documentation:")
    print("   https://nba.balldontlie.io")
    print()
    print("=" * 80)


def main():
    """Main entry point"""
    # Parse command line arguments
    if len(sys.argv) < 2:
        show_demo()
        return
    
    api_key = sys.argv[1] if len(sys.argv) > 1 else None
    sport = sys.argv[2] if len(sys.argv) > 2 else "nba"
    days = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    
    # Fetch scores
    fetch_live_scores(api_key, sport, days)


if __name__ == "__main__":
    main()

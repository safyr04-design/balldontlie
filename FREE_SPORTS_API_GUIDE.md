# 🆓 YES! Sports API Has FREE Live Scores

## ✅ **Free Tier Available**

Yes! Ball Don't Lie Sports API **does offer a FREE tier** for live scores!

---

## 🎁 **FREE Tier Details**

### What You Get for $0/month

**Rate Limit**: 5 requests per minute  
**Cost**: $0 (completely free)  
**Duration**: Forever (no credit card required)  

### Free Endpoints (Basic)

✅ **Teams** - Get all teams, team info  
✅ **Players** - Search players, get player profiles  
✅ **Games** - **Live scores**, game schedules, results  

❌ **NOT Included in Free Tier**:
- Game Player Stats
- Active Players List
- Player Injuries
- Season Averages
- Box Scores
- Team Standings
- Betting Odds
- Player Props
- Advanced Stats
- Lineups

---

## 🏀 **What Live Scores CAN You Get for FREE?**

### 1. Live Game Scores ✅
```python
import requests

# Get today's NBA games (FREE!)
response = requests.get(
    "https://api.balldontlie.io/v1/games?dates[]=2026-02-17",
    headers={"Authorization": "your-free-api-key"}
)

games = response.json()

for game in games['data']:
    print(f"{game['home_team']['full_name']} {game['home_team_score']}")
    print(f"{game['visitor_team']['full_name']} {game['visitor_team_score']}")
    print(f"Status: {game['status']}")
    print(f"Period: {game['period']}")
    print(f"Time: {game['time']}")
```

**Output Example**:
```
Cleveland Cavaliers 115
Charlotte Hornets 105
Status: Final
Period: 4
Time: Final
```

### 2. Game Details ✅
For each game, you get:
- **Final scores** (home and visitor)
- **Quarter scores** (Q1, Q2, Q3, Q4, OT)
- **Game status** ("7:00 pm ET", "1st Qtr", "Halftime", "Final")
- **Period** (0 = not started, 1-4 = quarters)
- **Time remaining** (e.g., "3:44")
- **Date and season**
- **Team information**
- **Timeouts remaining**
- **Bonus status**
- **Postponement status**

### 3. Historical Games ✅
```python
# Get games from a specific date range
response = requests.get(
    "https://api.balldontlie.io/v1/games",
    headers={"Authorization": "your-free-api-key"},
    params={
        "start_date": "2026-01-01",
        "end_date": "2026-01-31"
    }
)
```

### 4. Filter by Team ✅
```python
# Get Lakers games
response = requests.get(
    "https://api.balldontlie.io/v1/games?team_ids[]=14",
    headers={"Authorization": "your-free-api-key"}
)
```

---

## 🚫 **What You CANNOT Get for FREE**

### Limited Features (Paid Only)

❌ **Player Stats** - Points, rebounds, assists per game  
❌ **Betting Odds** - Live betting lines and props  
❌ **Season Averages** - Player season statistics  
❌ **Box Scores** - Detailed game breakdowns  
❌ **Team Standings** - Current league standings  
❌ **Injury Reports** - Player injury status  
❌ **Advanced Stats** - PER, true shooting %, etc.  
❌ **Lineups** - Starting lineups and rotations  

---

## 💰 **Pricing Comparison**

| Tier | Cost | Rate Limit | Live Scores | Player Stats | Betting Odds |
|------|------|------------|-------------|--------------|--------------|
| **FREE** | $0/mo | 5 req/min | ✅ Yes | ❌ No | ❌ No |
| **ALL-STAR** | $9.99/mo | 60 req/min | ✅ Yes | ✅ Yes | ❌ No |
| **GOAT** | $39.99/mo | 600 req/min | ✅ Yes | ✅ Yes | ✅ Yes |
| **ALL-ACCESS** | $299.99/mo | 600 req/min | ✅ All Sports | ✅ All Sports | ✅ All Sports |

---

## 🚀 **How to Get FREE Live Scores**

### Step 1: Create Free Account
1. Visit: https://app.balldontlie.io/signup
2. Sign up with email (no credit card required)
3. Verify your email

### Step 2: Get Your FREE API Key
1. Log in to https://app.balldontlie.io
2. Go to API Keys section
3. Copy your free API key
4. No payment needed!

### Step 3: Start Fetching Scores
```python
import requests

FREE_API_KEY = "your-free-api-key"

# Get today's NBA games
response = requests.get(
    "https://api.balldontlie.io/v1/games",
    headers={"Authorization": FREE_API_KEY},
    params={
        "dates": ["2026-02-17"]
    }
)

games = response.json()
print(f"Found {len(games['data'])} games today!")

for game in games['data']:
    home = game['home_team']['full_name']
    visitor = game['visitor_team']['full_name']
    home_score = game['home_team_score']
    visitor_score = game['visitor_team_score']
    status = game['status']
    
    print(f"{home} {home_score} - {visitor_score} {visitor}")
    print(f"Status: {status}\n")
```

---

## 📊 **Free Tier API Examples**

### Example 1: Today's Games
```bash
curl "https://api.balldontlie.io/v1/games?dates[]=2026-02-17" \
  -H "Authorization: YOUR_FREE_API_KEY"
```

### Example 2: Specific Team Games
```bash
curl "https://api.balldontlie.io/v1/games?team_ids[]=14" \
  -H "Authorization: YOUR_FREE_API_KEY"
```

### Example 3: Date Range
```bash
curl "https://api.balldontlie.io/v1/games?start_date=2026-02-01&end_date=2026-02-17" \
  -H "Authorization: YOUR_FREE_API_KEY"
```

### Example 4: Teams List
```bash
curl "https://api.balldontlie.io/v1/teams" \
  -H "Authorization: YOUR_FREE_API_KEY"
```

### Example 5: Players Search
```bash
curl "https://api.balldontlie.io/v1/players?search=LeBron" \
  -H "Authorization: YOUR_FREE_API_KEY"
```

---

## ⚠️ **Free Tier Limitations**

### Rate Limits
- **5 requests per minute** maximum
- Exceeding limit = 429 error (Too Many Requests)
- Wait 1 minute before retrying

### Example Rate Limit Handling:
```python
import requests
import time

def get_games_with_retry(api_key, date):
    try:
        response = requests.get(
            f"https://api.balldontlie.io/v1/games?dates[]={date}",
            headers={"Authorization": api_key}
        )
        
        if response.status_code == 429:
            print("Rate limit exceeded. Waiting 60 seconds...")
            time.sleep(60)
            return get_games_with_retry(api_key, date)
        
        return response.json()
    except Exception as e:
        print(f"Error: {e}")
        return None
```

### Data Limitations
Free tier only includes:
- **Basic game data** (scores, teams, dates)
- **Basic player data** (names, positions, teams)
- **Basic team data** (names, divisions, conferences)

For detailed stats, you need to upgrade.

---

## 🎯 **Real-World Use Cases (FREE)**

### 1. Simple Score Tracker
```python
def track_todays_games(api_key):
    """Track all today's NBA games"""
    from datetime import date
    
    today = date.today().strftime("%Y-%m-%d")
    response = requests.get(
        f"https://api.balldontlie.io/v1/games?dates[]={today}",
        headers={"Authorization": api_key}
    )
    
    games = response.json()['data']
    
    print(f"=== NBA Games for {today} ===\n")
    
    for game in games:
        home = game['home_team']['abbreviation']
        visitor = game['visitor_team']['abbreviation']
        home_score = game['home_team_score']
        visitor_score = game['visitor_team_score']
        status = game['status']
        
        print(f"{visitor} @ {home}: {visitor_score}-{home_score} ({status})")
```

### 2. Team Schedule
```python
def get_team_schedule(api_key, team_id):
    """Get all games for a specific team"""
    response = requests.get(
        f"https://api.balldontlie.io/v1/games?team_ids[]={team_id}",
        headers={"Authorization": api_key},
        params={"per_page": 100}
    )
    
    return response.json()['data']
```

### 3. Score Notifications
```python
def check_for_final_scores(api_key):
    """Check if any games finished"""
    from datetime import date
    
    today = date.today().strftime("%Y-%m-%d")
    response = requests.get(
        f"https://api.balldontlie.io/v1/games?dates[]={today}",
        headers={"Authorization": api_key}
    )
    
    games = response.json()['data']
    final_games = [g for g in games if g['status'] == 'Final']
    
    for game in final_games:
        home = game['home_team']['full_name']
        visitor = game['visitor_team']['full_name']
        home_score = game['home_team_score']
        visitor_score = game['visitor_team_score']
        
        winner = home if home_score > visitor_score else visitor
        print(f"FINAL: {winner} wins! {home} {home_score} - {visitor_score}")
```

---

## 🆚 **FREE vs PAID Comparison**

### What FREE Gets You
✅ Live game scores (updated in real-time)  
✅ Game status (in progress, final, scheduled)  
✅ Quarter/period scores  
✅ Team information  
✅ Player names and basic info  
✅ Historical game data  
✅ 5 requests/minute  

### What PAID Adds
✅ Player game stats (points, rebounds, assists)  
✅ Betting odds and props  
✅ Season averages  
✅ Team standings  
✅ Injury reports  
✅ Box scores  
✅ Advanced analytics  
✅ 60-600 requests/minute  

---

## 💡 **Tips for FREE Tier Users**

### 1. Cache Results
```python
import json
from datetime import datetime, timedelta

cache = {}

def get_games_cached(api_key, date):
    if date in cache:
        return cache[date]
    
    response = requests.get(
        f"https://api.balldontlie.io/v1/games?dates[]={date}",
        headers={"Authorization": api_key}
    )
    
    cache[date] = response.json()
    return cache[date]
```

### 2. Batch Requests
```python
# Instead of 7 requests (one per day)
# Make 1 request for a date range
response = requests.get(
    "https://api.balldontlie.io/v1/games",
    headers={"Authorization": api_key},
    params={
        "start_date": "2026-02-10",
        "end_date": "2026-02-17"
    }
)
```

### 3. Use Pagination Wisely
```python
# Get more results per request (up to 100)
response = requests.get(
    "https://api.balldontlie.io/v1/games",
    headers={"Authorization": api_key},
    params={"per_page": 100}
)
```

---

## 📚 **Documentation**

### Official Resources
- **Main Website**: https://balldontlie.io
- **NBA API Docs**: https://nba.balldontlie.io
- **NFL API Docs**: https://nfl.balldontlie.io
- **MLB API Docs**: https://mlb.balldontlie.io
- **Getting Started**: https://www.balldontlie.io/blog/getting-started/

### SDKs
- **Python**: `pip install balldontlie`
- **JavaScript**: `npm install @balldontlie/sdk`

---

## ✅ **Final Answer**

### Question: Is Sports API free for live scores (basic)?

### Answer: **YES!** ✅

**Free Tier Includes**:
- ✅ Live game scores
- ✅ Game status and details
- ✅ Quarter/period scores
- ✅ Team information
- ✅ Player names
- ✅ Historical games
- ✅ 5 requests/minute
- ✅ **No credit card required**
- ✅ **Forever free**

**Sign up**: https://app.balldontlie.io/signup  
**Cost**: $0  
**Credit Card**: Not required  
**Duration**: Unlimited  

**Limitations**:
- ❌ No player game stats
- ❌ No betting odds
- ❌ No advanced analytics
- ⚠️ Only 5 requests/minute

**Perfect For**:
- Personal projects
- Learning and testing
- Simple score tracking
- Small apps and websites

**Not Enough? Upgrade**:
- **ALL-STAR**: $9.99/mo (60 req/min + player stats)
- **GOAT**: $39.99/mo (600 req/min + odds)
- **ALL-ACCESS**: $299.99/mo (all sports)

---

**Start now**: https://app.balldontlie.io/signup (FREE forever) 🎉

---

**Last Updated**: 2026-02-17  
**Documentation Version**: 1.0.0

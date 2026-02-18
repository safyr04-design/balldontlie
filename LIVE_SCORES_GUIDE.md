# 🏀 Live Scores from Ball Don't Lie - Complete Guide

## ✅ Yes! Ball Don't Lie Provides Live Scores

Ball Don't Lie offers **real-time live scores** and sports data through their **Sports API**, which is **separate** from the Lab API you're currently using.

---

## 🎯 Two Different APIs

### 1. **Lab API** (What You Have Now)
**Purpose**: Betting model creation, backtesting, predictions  
**Your Key**: `eb22453f-3efd-4b06-884d-996ebca1a436` (FREE tier)  
**Features**:
- ✅ Build betting models
- ✅ Run backtests
- ✅ Generate predictions
- ✅ Factor analysis
- ❌ **NO live scores**
- ❌ **NO real-time game data**

**Pricing**:
- FREE: UI only
- LAB PRO: $99.99/mo (API access)
- ALL-ACCESS: $299.99/mo (Lab API + Sports API)

### 2. **Sports API** (For Live Scores)
**Purpose**: Real-time game data, live scores, player stats  
**Features**:
- ✅ **Live scores** (updated every second)
- ✅ **Real-time stats** during games
- ✅ **Player statistics**
- ✅ **Team data**
- ✅ **Betting odds** (live)
- ✅ **Play-by-play data**
- ✅ **Historical data**

**Pricing**:
- FREE: 5 requests/min (basic)
- STARTER: $29/mo - 60 req/min
- PRO: $99/mo - 600 req/min (one sport)
- ELITE: $299/mo - 600 req/min (all sports)
- ENTERPRISE: Custom pricing

---

## 🏆 What Sports Have Live Scores?

### 20+ Sports Leagues Supported

**Basketball**:
- 🏀 NBA (National Basketball Association)
- 🏀 WNBA (Women's NBA)
- 🏀 NCAAB (College Basketball - Men)
- 🏀 NCAAW (College Basketball - Women)

**Football**:
- 🏈 NFL (National Football League)
- 🏈 NCAAF (College Football)

**Soccer**:
- ⚽ EPL (English Premier League)
- ⚽ La Liga (Spain)
- ⚽ Serie A (Italy)
- ⚽ Bundesliga (Germany)
- ⚽ Ligue 1 (France)
- ⚽ UCL (UEFA Champions League)
- ⚽ MLS (Major League Soccer)
- ⚽ World Cup

**Other Sports**:
- ⚾ MLB (Baseball)
- 🏒 NHL (Hockey)
- 🥊 MMA (Mixed Martial Arts)
- 🎮 CS2 (Counter-Strike 2 Esports)
- 🎮 LOL (League of Legends Esports)
- 🎮 Dota 2 (Esports)
- ⛳ PGA (Golf)
- 🎾 ATP (Men's Tennis)
- 🎾 WTA (Women's Tennis)
- 🏎️ F1 (Formula 1)

---

## 📊 Live Data Features

### 1. **Real-Time Scores**
Updated **every second** during games:
```json
{
  "home_team": {
    "name": "Lakers",
    "score": 98
  },
  "away_team": {
    "name": "Warriors",
    "score": 95
  },
  "period": 4,
  "time_remaining": "2:45",
  "status": "in_progress"
}
```

### 2. **Live Player Stats**
During games:
```json
{
  "player": "LeBron James",
  "points": 27,
  "rebounds": 8,
  "assists": 11,
  "field_goals": "10/18",
  "three_pointers": "2/5"
}
```

### 3. **Live Betting Odds**
Real-time line movements:
```json
{
  "game": "Lakers vs Warriors",
  "spread": {
    "lakers": -4.5,
    "line": -110
  },
  "moneyline": {
    "lakers": -180,
    "warriors": +155
  },
  "total": {
    "over": 224.5,
    "under": 224.5
  }
}
```

### 4. **Player Props**
Live prop bets:
```json
{
  "player": "LeBron James",
  "prop": "points",
  "line": 27.5,
  "over": -110,
  "under": -110
}
```

---

## 🚀 How to Get Live Scores

### Option 1: ALL-ACCESS Plan (Recommended)
**Cost**: $299.99/month  
**Includes**:
- ✅ Lab API (betting models)
- ✅ Sports API (live scores)
- ✅ All sports (20+ leagues)
- ✅ 600 requests/min
- ✅ Priority support

**How to Get**:
1. Visit: https://lab-app.balldontlie.io/settings/billing
2. Choose "ALL-ACCESS" plan
3. Get your API key
4. Access both Lab API and Sports API

### Option 2: Sports API Separately
**Cost**: Starting at $29/month  
**Website**: https://balldontlie.io  

**Plans**:
- **FREE**: 5 req/min (basic endpoints)
- **STARTER**: $29/mo - 60 req/min (game & team data)
- **PRO**: $99/mo - 600 req/min (one sport, all data)
- **ELITE**: $299/mo - 600 req/min (all sports)

**How to Get**:
1. Visit: https://balldontlie.io
2. Sign up for Sports API
3. Choose a plan
4. Get your Sports API key (different from Lab API)

### Option 3: FREE Tier
**Cost**: Free  
**Limits**: 5 requests/minute  
**Access**: Basic endpoints only  

**Good for**:
- Testing the API
- Small personal projects
- Learning and experimentation

---

## 💻 Code Examples

### Fetch Live NBA Scores

#### Python
```python
import requests

# Sports API key (different from Lab API)
SPORTS_API_KEY = "your-sports-api-key"

# Get today's NBA games
response = requests.get(
    "https://api.balldontlie.io/v1/games",
    headers={"Authorization": SPORTS_API_KEY},
    params={
        "dates": ["2026-02-17"],
        "league": "nba"
    }
)

games = response.json()

for game in games['data']:
    print(f"{game['home_team']['name']} {game['home_team_score']} - "
          f"{game['away_team_score']} {game['away_team']['name']}")
    print(f"Status: {game['status']}")
    print(f"Time: {game['time']}")
    print()
```

#### JavaScript
```javascript
const SPORTS_API_KEY = "your-sports-api-key";

// Get live NBA scores
async function getLiveScores() {
  const response = await fetch(
    "https://api.balldontlie.io/v1/games?dates[]=2026-02-17&league=nba",
    {
      headers: {
        "Authorization": SPORTS_API_KEY
      }
    }
  );
  
  const data = await response.json();
  
  data.data.forEach(game => {
    console.log(`${game.home_team.name} ${game.home_team_score} - 
                 ${game.away_team_score} ${game.away_team.name}`);
    console.log(`Status: ${game.status}`);
  });
}

getLiveScores();
```

### Get Player Stats
```python
# Get LeBron James stats
response = requests.get(
    "https://api.balldontlie.io/v1/stats",
    headers={"Authorization": SPORTS_API_KEY},
    params={
        "player_ids": [237],  # LeBron's ID
        "dates": ["2026-02-17"]
    }
)

stats = response.json()

for stat in stats['data']:
    print(f"Points: {stat['pts']}")
    print(f"Rebounds: {stat['reb']}")
    print(f"Assists: {stat['ast']}")
```

### Get Live Odds
```python
# Get live betting odds for today
response = requests.get(
    "https://api.balldontlie.io/v1/odds",
    headers={"Authorization": SPORTS_API_KEY},
    params={
        "dates": ["2026-02-17"],
        "league": "nba"
    }
)

odds = response.json()

for game in odds['data']:
    print(f"Game: {game['home_team']} vs {game['away_team']}")
    print(f"Spread: {game['spread']['home']}")
    print(f"Over/Under: {game['total']}")
    print()
```

---

## 🔗 API Endpoints (Sports API)

### Games
```bash
GET https://api.balldontlie.io/v1/games
```
Get game scores, schedules, and results

### Stats
```bash
GET https://api.balldontlie.io/v1/stats
```
Get player statistics

### Teams
```bash
GET https://api.balldontlie.io/v1/teams
```
Get team information

### Players
```bash
GET https://api.balldontlie.io/v1/players
```
Get player profiles

### Odds
```bash
GET https://api.balldontlie.io/v1/odds
```
Get live betting odds

### Standings
```bash
GET https://api.balldontlie.io/v1/standings
```
Get league standings

---

## 🆚 Comparison: Lab API vs Sports API

| Feature | Lab API | Sports API |
|---------|---------|------------|
| **Purpose** | Betting models | Live data |
| **Live Scores** | ❌ No | ✅ Yes |
| **Player Stats** | ❌ No | ✅ Yes |
| **Betting Odds** | ❌ No | ✅ Yes |
| **Create Models** | ✅ Yes | ❌ No |
| **Backtesting** | ✅ Yes | ❌ No |
| **Predictions** | ✅ Yes | ❌ No |
| **Real-Time Updates** | ❌ No | ✅ Yes (every second) |
| **Historical Data** | ✅ Yes (6 years) | ✅ Yes (decades) |
| **API Key** | Separate | Separate |
| **Pricing** | $99-$299/mo | $0-$299/mo |

---

## 📱 No-Code Options

### Google Sheets Integration
Pull live scores into spreadsheets **without coding**:

```
=BDL_NBA_GAMES("2026-02-17")
=BDL_NBA_STANDINGS(2026)
=BDL_NBA_PLAYERS("LeBron")
=BDL_NFL_ODDS("2026-01-27")
```

**Features**:
- 150+ functions
- Real-time data updates
- No programming required
- Easy setup (copy/paste script)

**Setup**: https://www.balldontlie.io/blog/google-sheets-integration

---

## 🤖 AI Integration

Ball Don't Lie has **native AI support** via MCP (Model Context Protocol):

### Connect to AI Assistants
```json
{
  "mcpServers": {
    "balldontlie-api": {
      "url": "https://mcp.balldontlie.io/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "YOUR_API_KEY"
      }
    }
  }
}
```

### Ask AI for Live Scores
- "What are today's NBA games?"
- "Show me LeBron's season stats"
- "Get the Lakers roster"
- "Current NBA standings"

**Works with**: Claude Desktop, ChatGPT, Gemini, any MCP client

---

## 📊 Use Cases

### 1. Live Score Dashboard
Build a dashboard showing real-time scores:
- Update every second
- Show all games in progress
- Display player stats
- Track betting lines

### 2. Fantasy Sports
Track player performance:
- Real-time stat updates
- Player comparisons
- Injury reports
- Lineup optimization

### 3. Betting Analysis
Combine Lab API + Sports API:
- Generate predictions (Lab API)
- Track live odds (Sports API)
- Monitor line movements
- Compare predictions vs results

### 4. Sports Analytics
Deep dive into data:
- Historical trends
- Player performance
- Team statistics
- Advanced metrics

---

## 💰 Pricing Recommendation

### For Your Use Case (Betting Models + Live Scores)

**BEST OPTION: ALL-ACCESS - $299.99/month**
- ✅ Lab API (betting models, predictions, backtests)
- ✅ Sports API (live scores, real-time data)
- ✅ All 20+ sports leagues
- ✅ 600 requests/min (both APIs)
- ✅ Single subscription, one API key per service
- ✅ Priority support

**Why ALL-ACCESS?**
- Get both APIs in one subscription
- Save vs buying separately ($99 + $299 = $398)
- Seamless integration between predictions and live data
- Track prediction accuracy with real scores
- Update models based on live game data

---

## 🚀 Getting Started Steps

### Step 1: Upgrade to ALL-ACCESS
1. Visit: https://lab-app.balldontlie.io/settings/billing
2. Select "ALL-ACCESS" plan ($299.99/mo)
3. Complete payment

### Step 2: Get API Keys
You'll receive **TWO separate API keys**:
1. **Lab API Key**: For betting models, predictions
2. **Sports API Key**: For live scores, stats

### Step 3: Update Your Code
```python
# Lab API (for predictions)
LAB_API_KEY = "your-lab-api-key"

# Sports API (for live scores)
SPORTS_API_KEY = "your-sports-api-key"
```

### Step 4: Start Fetching Live Scores
```python
import requests

# Get live NBA scores
response = requests.get(
    "https://api.balldontlie.io/v1/games",
    headers={"Authorization": SPORTS_API_KEY},
    params={"dates": ["2026-02-17"], "league": "nba"}
)

games = response.json()
print(games)
```

---

## 📚 Resources

### Documentation
- **Sports API Docs**: https://balldontlie.io/docs
- **Lab API Docs**: https://lab.balldontlie.io/docs
- **Getting Started**: https://www.balldontlie.io/blog/getting-started/
- **Google Sheets Guide**: https://www.balldontlie.io/blog/google-sheets-integration

### SDKs & Tools
- **JavaScript SDK**: `@balldontlie/sdk`
- **Python SDK**: `balldontlie`
- **OpenAPI Spec**: https://balldontlie.io/openapi.yml
- **MCP Server**: https://github.com/balldontlie-api/mcp

### Support
- **Email**: hello@balldontlie.io
- **Discord**: https://discord.gg/cQJhfTPn8j
- **Website**: https://balldontlie.io

---

## ✅ Summary

**Question**: Do we get live scores from Ball Don't Lie?  
**Answer**: **YES!** Through the **Sports API** (separate from Lab API)

**Your Current Setup**:
- ✅ Lab API key (FREE tier, UI only)
- ❌ No Sports API key yet
- ❌ No live scores access yet

**To Get Live Scores**:
1. **Upgrade** to ALL-ACCESS ($299.99/mo)
2. Get **Sports API key** (separate from Lab key)
3. Use **Sports API** endpoints for live data
4. **Real-time updates** every second
5. **20+ sports** leagues supported

**Best Value**:
- **ALL-ACCESS**: Both Lab API + Sports API in one subscription
- **Single price**: $299.99/mo (vs $398/mo separately)
- **Full access**: Betting models + live scores together

**Ready to get live scores?**  
👉 Upgrade now: https://lab-app.balldontlie.io/settings/billing

---

**Last Updated**: 2026-02-17  
**Documentation Version**: 1.0.0  
**APIs Covered**: Lab API v1.0, Sports API v1.0

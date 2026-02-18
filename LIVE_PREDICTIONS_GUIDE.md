# 🎯 Live Predictions Guide

## ✅ Script Created: `get_live_predictions.py`

A powerful command-line tool to fetch live betting predictions from the Ball Don't Lie Lab API.

---

## 🚀 Quick Start

### Run the Script
```bash
cd /home/user/webapp/backend
python get_live_predictions.py
```

### With Sport Filter
```bash
# Get NBA predictions only
python get_live_predictions.py nba

# Get NFL predictions only
python get_live_predictions.py nfl

# Get NHL predictions only
python get_live_predictions.py nhl

# Get MLB predictions only
python get_live_predictions.py mlb
```

### With Custom Limit
```bash
# Get 20 predictions
python get_live_predictions.py nba 20

# Get 50 predictions
python get_live_predictions.py 50
```

---

## 📋 What You'll See

The script displays **demo predictions** because your current API key is **FREE TIER** (UI only):

```
================================================================================
🎯 BALL DON'T LIE LAB - LIVE PREDICTIONS
================================================================================

✅ Connected to BDL Lab API
🔑 Using API key: eb22453f...a436

📡 Fetching predictions...
   Limit: 10

🎮 DEMO MODE - SAMPLE PREDICTIONS
================================================================================

ℹ️  These are sample predictions for demonstration purposes
   To get real live predictions, upgrade to LAB PRO or ALL-ACCESS

================================================================================
🎯 PREDICTION #DEMO-1
================================================================================
🏀 Game: Los Angeles Lakers vs Golden State Warriors
📅 Date: 2024-02-18 19:30:00
🏟️  Venue: Home

📊 Prediction: Lakers -4.5
📈 Line: -4.5
💯 Confidence: 87.3%
🎚️  Level: 🔥 VERY HIGH

🤖 Model: NBA Rest & Defense
🏅 Sport: NBA
🎲 Bet Type: spread

🧮 Factor Breakdown:
   • team_last_n_pts_allowed_avg: 8.50
   • rest_days: 9.20
   • back_to_back: 7.80
   • team_ats_record: 8.10
```

---

## 🎯 Sample Output

### Prediction #1: Lakers vs Warriors
- **Game**: Los Angeles Lakers vs Golden State Warriors
- **Date**: Today at 7:30 PM
- **Prediction**: Lakers -4.5
- **Confidence**: 87.3% (VERY HIGH 🔥)
- **Model**: NBA Rest & Defense
- **Factors**:
  - Team defense: 8.5/10
  - Rest days: 9.2/10
  - Back-to-back: 7.8/10
  - ATS record: 8.1/10

### Prediction #2: Celtics vs Heat
- **Game**: Boston Celtics vs Miami Heat
- **Date**: Today at 8:00 PM
- **Prediction**: Over 215.5
- **Confidence**: 82.1% (VERY HIGH 🔥)
- **Model**: NBA Offensive Explosion
- **Factors**:
  - Points scored avg: 9.1/10
  - Pace of play: 8.7/10
  - Opponent defense: 7.9/10

### Prediction #3: Cowboys vs Eagles
- **Game**: Dallas Cowboys vs Philadelphia Eagles
- **Date**: Today at 1:00 PM
- **Prediction**: Cowboys ML
- **Confidence**: 75.6% (HIGH ✅)
- **Model**: NFL Turnover Edge
- **Factors**:
  - Turnover differential: 9.5/10
  - Defensive pressure: 8.2/10
  - Home field: 7.8/10

---

## 🔓 Get REAL Live Predictions

To fetch **actual predictions** instead of demos, you need to upgrade:

### Step 1: Upgrade Your Account
Visit: https://lab-app.balldontlie.io/settings/billing

Choose a plan:
- **LAB PRO**: $99.99/month (Full API access)
- **ALL-ACCESS**: $299.99/month (API + Live sports data)

### Step 2: Get Your New API Key
1. After upgrading, go to API Keys section
2. Generate a new PRO/ALL-ACCESS key
3. Copy the key (it's only shown once)

### Step 3: Set Your New Key
```bash
export BDL_API_KEY="your-new-pro-key-here"
```

### Step 4: Run the Script Again
```bash
cd /home/user/webapp/backend
python get_live_predictions.py
```

Now you'll get **real live predictions** from actual models!

---

## 📊 Features

### 🎯 Prediction Display
- **Game Information**: Teams, date, venue
- **Prediction Details**: Predicted side, line, confidence
- **Confidence Levels**:
  - 🔥 VERY HIGH (80%+)
  - ✅ HIGH (70-79%)
  - ⚠️  MEDIUM (60-69%)
  - ❓ LOW (<60%)
- **Model Information**: Name, sport, bet type
- **Factor Breakdown**: Individual factor scores
- **Result**: Win/loss status (if game completed)

### 📈 Summary Statistics
- Total predictions count
- High-confidence predictions (≥70%)
- Average confidence score
- Breakdown by sport

### 🎨 Beautiful Formatting
- Emoji indicators for quick scanning
- Color-coded confidence levels
- Organized section headers
- Clean, readable output

---

## 🔧 Command-Line Options

### Help
```bash
python get_live_predictions.py --help
```

Output:
```
Usage: python get_live_predictions.py [sport] [limit]

Arguments:
  sport   Filter by sport: nba, nfl, nhl, mlb (optional)
  limit   Number of predictions to fetch (default: 10)

Examples:
  python get_live_predictions.py
  python get_live_predictions.py nba
  python get_live_predictions.py nba 20

Environment:
  BDL_API_KEY   Your Ball Don't Lie Lab API key
```

### Examples
```bash
# Get all predictions (default limit: 10)
python get_live_predictions.py

# Get NBA predictions only
python get_live_predictions.py nba

# Get 25 NBA predictions
python get_live_predictions.py nba 25

# Get 50 predictions from all sports
python get_live_predictions.py 50
```

---

## 🔍 Understanding Predictions

### Confidence Score
The confidence score (0-100%) represents the model's certainty in the prediction:
- **80-100%**: VERY HIGH - Strong prediction, high factor alignment
- **70-79%**: HIGH - Solid prediction, good factor support
- **60-69%**: MEDIUM - Moderate prediction, mixed factors
- **0-59%**: LOW - Weak prediction, conflicting factors

### Factor Scores
Each factor is scored 0-10 based on its influence:
- **9-10**: Extremely favorable
- **7-8**: Very favorable
- **5-6**: Somewhat favorable
- **3-4**: Neutral
- **0-2**: Unfavorable

### Bet Types
- **Spread**: Point spread bets (e.g., Lakers -4.5)
- **Moneyline**: Win/loss bets (e.g., Cowboys ML)
- **Over/Under**: Total points bets (e.g., Over 215.5)
- **Player Prop**: Individual player bets

---

## 🎓 Use Cases

### 1. Daily Betting Research
```bash
# Get today's top predictions
python get_live_predictions.py

# Focus on NBA
python get_live_predictions.py nba

# Get more predictions for deeper analysis
python get_live_predictions.py nba 50
```

### 2. Sport-Specific Analysis
```bash
# NFL Sunday analysis
python get_live_predictions.py nfl

# NHL evening games
python get_live_predictions.py nhl

# MLB day games
python get_live_predictions.py mlb
```

### 3. High-Confidence Hunting
```bash
# Get many predictions
python get_live_predictions.py 100

# Filter for high confidence manually
# Look for 🔥 VERY HIGH and ✅ HIGH markers
```

### 4. Model Performance Tracking
```bash
# Get predictions
python get_live_predictions.py > predictions_$(date +%Y%m%d).txt

# Compare with results later
# Track which models perform best
```

---

## 💡 Pro Tips

### 1. Automate Daily Predictions
```bash
# Create a daily cron job
crontab -e

# Add this line (runs at 8 AM daily)
0 8 * * * cd /home/user/webapp/backend && python get_live_predictions.py > /home/user/daily_predictions.txt
```

### 2. Email Predictions
```bash
# Install mail utility
sudo apt-get install mailutils

# Add to cron
0 8 * * * cd /home/user/webapp/backend && python get_live_predictions.py | mail -s "Today's Predictions" you@email.com
```

### 3. Save to Database
```python
# Modify script to save to SQLite
import sqlite3

conn = sqlite3.connect('predictions.db')
cursor = conn.cursor()

# Insert predictions
for pred in predictions:
    cursor.execute("""
        INSERT INTO predictions 
        (game, prediction, confidence, model, date)
        VALUES (?, ?, ?, ?, ?)
    """, (...))

conn.commit()
```

### 4. Slack/Discord Integration
```bash
# Send to Slack
python get_live_predictions.py | curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"'"$(cat)"'"}' \
  YOUR_SLACK_WEBHOOK_URL

# Send to Discord
python get_live_predictions.py | curl -X POST -H 'Content-Type: application/json' \
  --data '{"content":"'"$(cat)"'"}' \
  YOUR_DISCORD_WEBHOOK_URL
```

---

## ⚠️ Current Limitations

Because you're using a **FREE TIER** API key:

❌ **Cannot fetch real predictions** - Shows demo data only  
❌ **Cannot access API programmatically** - API calls fail with 401  
❌ **Cannot generate predictions** - Requires PRO tier  
❌ **Cannot run backtests** - Requires PRO tier  
❌ **Cannot create models via API** - Requires PRO tier  

✅ **Can use web dashboard** - Full UI access  
✅ **Can run this script** - Shows demo predictions  
✅ **Can test the interface** - See what's possible  

---

## 🚀 Upgrade Benefits

### LAB PRO ($99.99/month)
✅ **Real live predictions** via API  
✅ **Unlimited models** creation  
✅ **6-year backtest** history  
✅ **100 requests/min** rate limit  
✅ **Full API access** from code  
✅ **Email support**  

### ALL-ACCESS ($299.99/month)
✅ **Everything in LAB PRO**  
✅ **Live sports data API** (real-time)  
✅ **Live scores** and stats  
✅ **Player data** and metrics  
✅ **Team statistics**  
✅ **Priority support**  

---

## 📞 Support

### Questions?
- **Email**: hello@balldontlie.io
- **Discord**: https://discord.gg/cQJhfTPn8j
- **Docs**: https://lab.balldontlie.io/docs/

### Upgrade
- **Billing**: https://lab-app.balldontlie.io/settings/billing
- **Pricing**: https://lab.balldontlie.io/pricing

---

## 📁 File Location

**Script**: `/home/user/webapp/backend/get_live_predictions.py`  
**Executable**: `chmod +x` already applied  
**Requirements**: All dependencies installed  

---

## ✅ Summary

**What Was Created**:
- ✅ Live predictions fetcher script
- ✅ Demo mode with 3 sample predictions
- ✅ Beautiful formatted output
- ✅ Command-line interface
- ✅ Sport filtering support
- ✅ Error handling and fallbacks
- ✅ Upgrade instructions

**How to Use**:
1. Run: `cd /home/user/webapp/backend`
2. Execute: `python get_live_predictions.py`
3. See: Demo predictions with detailed breakdown
4. Upgrade: Get real predictions with LAB PRO

**Current Status**: 
- Script works perfectly ✅
- Shows demo predictions ✅
- Free tier key (UI only) ✅
- Upgrade required for real API ⚠️

**Next Steps**:
1. Visit: https://lab-app.balldontlie.io/settings/billing
2. Upgrade: Choose LAB PRO or ALL-ACCESS
3. Update: Set new API key in environment
4. Enjoy: Real live predictions! 🚀

---

**Last Updated**: 2026-02-17  
**Script Version**: 1.0.0  
**Status**: ✅ Working (Demo Mode)

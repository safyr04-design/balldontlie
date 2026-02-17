# Ball Don't Lie Lab - Sports Betting Analysis System

A comprehensive Python-based system for sports betting analysis using the Ball Don't Lie Lab API. Build, backtest, and deploy betting models programmatically across NBA, NFL, NHL, and MLB.

## 🌟 Features

### 1. **Complete Python SDK**
- Full API client with all endpoints covered
- Easy-to-use methods for factors, models, predictions, and performance
- Automatic job polling and error handling
- Rate limit monitoring

### 2. **Pre-Built Betting Strategies**
9 ready-to-use, research-backed strategies:

**NBA** (3 strategies)
- 🛡️ Rest & Defense: Exploits rest advantages and defensive metrics
- 💥 Offensive Explosion: Targets high-scoring games for totals
- 🏠 Home Court Advantage: Leverages home/away performance splits

**NFL** (2 strategies)
- 🏈 Turnover Edge: Focuses on turnover differential (best predictor)
- 💪 Trench Warfare: Analyzes rushing vs run defense matchups

**NHL** (2 strategies)
- 🥅 Goalie Advantage: Prioritizes goaltending and rest factors
- ⚡ Special Teams Edge: Analyzes power play efficiency

**MLB** (2 strategies)
- ⚾ Pitcher Dominance: Focuses on starting pitcher matchups
- 📊 Totals Prediction: Analyzes scoring trends and conditions

### 3. **Automated Prediction Monitoring**
- Continuous prediction generation every 6 hours
- Daily performance reports
- High-confidence pick alerts
- Historical prediction tracking
- Background job scheduling

### 4. **Factor Analysis Tools**
- Analyze factors by sport and category
- Generate recommendations for specific bet types
- Suggest complete model compositions
- Compare factors across sports
- Find complementary factor combinations

### 5. **Performance Analytics**
- Historical backtesting against 6+ years of data
- ROI and win rate tracking
- Confidence-based performance breakdowns
- Per-game prediction analysis

## 📁 Project Structure

```
webapp/
├── backend/
│   ├── bdl_client.py          # Core API client
│   ├── model_strategies.py     # Pre-built betting strategies
│   ├── prediction_monitor.py   # Automated monitoring system
│   ├── factor_analyzer.py      # Factor analysis tools
│   ├── main_demo.py           # Comprehensive demo script
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React dashboard (coming soon)
│
├── data/
│   ├── predictions/           # Generated predictions
│   ├── monitor_state.json     # Monitoring state
│   └── daily_report_*.txt     # Daily reports
│
├── scripts/                    # Utility scripts
│
├── openapi.yaml               # Full API specification
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Ball Don't Lie Lab API key (requires LAB PRO or ALL-ACCESS subscription)

### Installation

```bash
# Clone or navigate to the project directory
cd /home/user/webapp

# Install Python dependencies
pip install -r backend/requirements.txt

# Set your API key
export BDL_API_KEY="your-api-key-here"
```

### Basic Usage

#### 1. Run the Demo

```bash
# Show usage guide
python backend/main_demo.py guide

# Create and evaluate a model
python backend/main_demo.py create

# Run factor analysis
python backend/main_demo.py analyze

# Compare strategies
python backend/main_demo.py compare
```

#### 2. Create a Model with Pre-Built Strategy

```python
from bdl_client import BDLLabClient
from model_strategies import NBARestAndDefense

# Initialize client
client = BDLLabClient("your-api-key")

# Create model using strategy
strategy = NBARestAndDefense()
model = strategy.create_model(client)

print(f"Model created with ID: {model['id']}")
```

#### 3. Generate Predictions

```python
# Generate predictions for a model
job = client.generate_predictions(model_id=123)

# Wait for job to complete
completed_job = client.wait_for_job(job["id"])

# Fetch predictions
predictions = client.list_predictions(model_id=123)
```

#### 4. Start Automated Monitoring

```bash
# Add models to monitor
python backend/prediction_monitor.py add 123
python backend/prediction_monitor.py add 456

# Start continuous monitoring
python backend/prediction_monitor.py start
```

This will:
- Generate predictions every 6 hours
- Create daily reports at 8 AM
- Alert on high-confidence picks every 4 hours

#### 5. Analyze Factors

```bash
# Get factor recommendations for NBA spread betting
python backend/factor_analyzer.py recommend nba spread

# Suggest a complete model composition
python backend/factor_analyzer.py suggest nba over_under balanced

# Compare factors across all sports
python backend/factor_analyzer.py compare

# Export factors to JSON
python backend/factor_analyzer.py export nba nba_factors.json
```

## 📚 Core Components

### BDLLabClient

The main API client class providing access to all endpoints:

```python
from bdl_client import BDLLabClient, Sport, BetType

client = BDLLabClient("your-api-key")

# List factors
factors = client.list_factors(Sport.NBA)

# Create a model
model = client.create_model(
    name="My Strategy",
    bet_type=BetType.SPREAD,
    mode=ModelMode.SIMPLE,
    sport=Sport.NBA,
    factors=[...]
)

# Evaluate performance
job = client.evaluate_performance(model_id)
completed = client.wait_for_job(job["id"])

# Generate predictions
job = client.generate_predictions(model_id)
```

### Model Strategies

Pre-configured betting strategies ready to use:

```python
from model_strategies import (
    NBARestAndDefense,
    NBAOffensiveExplosion,
    NFLTurnoverEdge,
    NHLGoalieAdvantage,
    MLBPitcherDominance
)

# Create model from strategy
strategy = NBARestAndDefense()
model = strategy.create_model(client)

# View all available strategies
from model_strategies import print_all_strategies
print_all_strategies()
```

### PredictionMonitor

Automated monitoring and prediction generation:

```python
from prediction_monitor import PredictionMonitor

monitor = PredictionMonitor(api_key="your-key")

# Add models to monitor
monitor.add_model(123)
monitor.add_model(456)

# Run a single prediction cycle
monitor.run_prediction_cycle()

# Get high-confidence picks
picks = monitor.get_high_confidence_picks(min_confidence=0.6)

# Generate daily report
report = monitor.generate_daily_report()
```

### FactorAnalyzer

Analyze and understand betting factors:

```python
from factor_analyzer import FactorAnalyzer
from bdl_client import Sport, BetType

analyzer = FactorAnalyzer(api_key="your-key")

# Get factor summary
analyzer.print_factor_summary(Sport.NBA)

# Get recommendations
recommendations = analyzer.generate_factor_recommendations(
    Sport.NBA,
    BetType.SPREAD,
    top_n=5
)

# Suggest complete model
factors = analyzer.suggest_model_composition(
    Sport.NBA,
    BetType.SPREAD,
    style="balanced"  # or "aggressive", "conservative"
)
```

## 🎯 Use Cases

### 1. Model Development & Testing

Test different factor combinations before committing:

```python
# Preview a strategy without saving
job = client.create_preview(
    bet_type=BetType.SPREAD,
    mode=ModelMode.SIMPLE,
    factors=strategy.get_factors(),
    sport=Sport.NBA
)

result = client.wait_for_job(job["id"])
print(f"Win Rate: {result['output']['historical']['win_rate']}")
```

### 2. Multi-Sport Portfolio

Create and monitor models across all sports:

```python
from model_strategies import (
    NBARestAndDefense,
    NFLTurnoverEdge,
    NHLGoalieAdvantage,
    MLBPitcherDominance
)

strategies = [
    NBARestAndDefense(),
    NFLTurnoverEdge(),
    NHLGoalieAdvantage(),
    MLBPitcherDominance()
]

for strategy in strategies:
    model = strategy.create_model(client)
    monitor.add_model(model['id'])
```

### 3. Daily Betting Workflow

```bash
# Morning routine (8 AM)
python backend/prediction_monitor.py report

# Check high-confidence picks
python backend/prediction_monitor.py picks 0.7

# Evening update (6 PM)
python backend/prediction_monitor.py run
```

### 4. Strategy Research

Compare multiple approaches:

```python
strategies_to_test = [
    NBARestAndDefense(),
    NBAOffensiveExplosion(),
    NBAHomeCourtAdvantage()
]

results = []
for strategy in strategies_to_test:
    job = client.create_preview(
        bet_type=strategy.bet_type,
        mode=ModelMode.SIMPLE,
        factors=strategy.get_factors(),
        sport=strategy.sport
    )
    result = client.wait_for_job(job["id"])
    results.append({
        'name': strategy.name,
        'win_rate': result['output']['historical']['win_rate'],
        'roi': result['output']['historical']['roi']
    })

# Sort by ROI
results.sort(key=lambda x: x['roi'], reverse=True)
```

## 📊 Understanding Results

### Win Rate
Percentage of bets won (excluding pushes). You need ~52.4% to break even against -110 vig.

### ROI (Return on Investment)
Profit/loss as a percentage. Positive ROI means profitable betting.

### Confidence
Model's conviction level (0-100%). Higher confidence generally correlates with better results.

### Results by Confidence
Performance broken down by confidence buckets. Look for:
- High confidence (67-100%): Should have best win rate
- Medium confidence (34-66%): Decent edge
- Low confidence (0-33%): Consider skipping

## 🔧 Advanced Configuration

### Custom Model (Weighted Mode)

```python
from bdl_client import ModelFactorInput

factors = [
    ModelFactorInput(factor_id=1, weight=30),
    ModelFactorInput(factor_id=2, weight=25),
    ModelFactorInput(factor_id=3, weight=20),
    ModelFactorInput(factor_id=4, weight=15),
    ModelFactorInput(factor_id=5, weight=10)
    # Must sum to 100
]

model = client.create_model(
    name="Custom Weighted Model",
    bet_type=BetType.SPREAD,
    mode=ModelMode.WEIGHTED,
    sport=Sport.NBA,
    factors=factors
)
```

### Advanced Thresholds

```python
advanced_config = {
    "betting_thresholds": {
        "spread_score_diff": 10,  # Higher = more selective
        "over_under_combined": 60,
        "moneyline_score_diff": 8
    },
    "importance_multipliers": {
        "low": 10,
        "medium": 30,
        "high": 60  # Increased weight for high importance
    }
}

model = client.create_model(
    name="Selective Model",
    bet_type=BetType.SPREAD,
    mode=ModelMode.SIMPLE,
    sport=Sport.NBA,
    factors=factors,
    advanced_config=advanced_config
)
```

## 📈 Performance Tracking

### Monitor Multiple Models

```python
models = [123, 456, 789]

for model_id in models:
    performance = client.get_model_performance(model_id)
    stats = client.get_prediction_stats(model_id)
    
    print(f"Model {model_id}:")
    print(f"  Historical ROI: {performance['roi']*100:.2f}%")
    print(f"  Live Predictions: {stats['total']}")
    print(f"  Current Win Rate: {stats['win_rate']:.2f}%")
```

### Export Performance Data

```python
import json

performance = client.get_model_performance(model_id)
predictions = client.list_predictions(model_id)

data = {
    "performance": performance,
    "predictions": predictions
}

with open("model_report.json", "w") as f:
    json.dump(data, f, indent=2)
```

## 🔐 API Key Management

The API key can be provided in three ways:

1. **Environment Variable** (Recommended)
```bash
export BDL_API_KEY="your-api-key"
```

2. **Direct Initialization**
```python
client = BDLLabClient("your-api-key")
```

3. **.env File**
```bash
echo "BDL_API_KEY=your-api-key" > .env
```

## 📝 Subscription Requirements

| Feature | Free | LAB PRO | ALL-ACCESS |
|---------|------|---------|------------|
| UI Access | ✅ | ✅ | ✅ |
| API Access | ❌ | ✅ | ✅ |
| Models | 1 | Unlimited | Unlimited |
| Backtest History | 1 week | 6+ years | 6+ years |
| Sports API | ❌ | ❌ | ✅ |
| Price | Free | $99.99/mo | $299.99/mo |

## 🤝 Contributing

This is a complete working system. To extend:

1. Add new strategies in `model_strategies.py`
2. Extend factor analysis in `factor_analyzer.py`
3. Customize monitoring in `prediction_monitor.py`
4. Build frontend dashboard (React template ready)

## 📞 Support

- API Documentation: https://lab.balldontlie.io/docs/
- Discord: https://discord.gg/cQJhfTPn8j
- Email: hello@balldontlie.io

## ⚠️ Disclaimer

This system is for educational and research purposes. Sports betting involves risk. Always bet responsibly and within your means.

## 📄 License

See LICENSE file for details.

---

Built with ❤️ for sports betting enthusiasts

"""
Pre-configured betting model strategies
Based on the Ball Don't Lie Lab documentation and best practices
"""

from bdl_client import (
    BDLLabClient, ModelFactorInput, BetType, ModelMode, 
    Importance, Sport
)
from typing import List, Dict, Any


# ==================== NBA Factor IDs ====================
# These need to be fetched from the API, but here are typical ones
# based on the documentation

class NBAFactors:
    """Common NBA factor IDs"""
    TEAM_SCORING_AVG = 1
    TEAM_PTS_ALLOWED_AVG = 2
    HOME_AWAY_SPLIT = 3
    TEAM_ATS_RECORD = 4
    TEAM_OU_TREND = 5
    HEAD_TO_HEAD = 6
    HEAD_TO_HEAD_ATS = 7
    OFF_VS_DEF_RATING = 8
    PACE_DIFF = 9
    REST_DAYS = 10
    BACK_TO_BACK = 11
    TRAVEL_CONTEXT = 12
    SEASON_SEGMENT = 13
    DIVISION_GAME = 14


class NFLFactors:
    """Common NFL factor IDs"""
    TEAM_SCORING_AVG = 20
    TEAM_PTS_ALLOWED_AVG = 21
    HOME_AWAY_SPLIT = 22
    TEAM_ATS_RECORD = 23
    TEAM_OU_TREND = 24
    YARDS_PER_PLAY = 25
    HEAD_TO_HEAD = 26
    RUSH_VS_RUN_DEF = 27
    PASS_VS_PASS_DEF = 28
    TURNOVER_DIFF = 29
    REST_DAYS = 30
    BYE_WEEK = 31
    DIVISION_GAME = 32
    PRIME_TIME = 33


class NHLFactors:
    """Common NHL factor IDs"""
    TEAM_GOALS_AVG = 40
    TEAM_GOALS_ALLOWED = 41
    HOME_AWAY_SPLIT = 42
    TEAM_ATS_RECORD = 43
    TEAM_OU_TREND = 44
    SHOTS_ON_GOAL = 45
    HEAD_TO_HEAD = 46
    SPECIAL_TEAMS = 47
    GOAL_DIFF = 48
    REST_DAYS = 49
    BACK_TO_BACK = 50
    TRAVEL_CONTEXT = 51
    DIVISION_GAME = 52


class MLBFactors:
    """Common MLB factor IDs"""
    TEAM_RUNS_AVG = 60
    TEAM_RUNS_ALLOWED = 61
    HOME_AWAY_SPLIT = 62
    TEAM_RUNLINE_RECORD = 63
    TEAM_OU_TREND = 64
    HEAD_TO_HEAD = 65
    LINEUP_VS_PITCHER = 66
    BULLPEN_QUALITY = 67
    REST_DAYS = 68
    BACK_TO_BACK = 69
    SERIES_POSITION = 70
    DIVISION_GAME = 71
    DAY_NIGHT = 72


# ==================== Model Strategy Templates ====================

class ModelStrategy:
    """Base class for model strategies"""
    
    def __init__(self, name: str, description: str, sport: Sport, bet_type: BetType):
        self.name = name
        self.description = description
        self.sport = sport
        self.bet_type = bet_type
    
    def get_factors(self) -> List[ModelFactorInput]:
        """Get the factors for this strategy"""
        raise NotImplementedError
    
    def create_model(self, client: BDLLabClient) -> Dict[str, Any]:
        """Create the model using the client"""
        return client.create_model(
            name=self.name,
            description=self.description,
            sport=self.sport,
            bet_type=self.bet_type,
            mode=ModelMode.SIMPLE,
            factors=self.get_factors()
        )


# ==================== NBA Strategies ====================

class NBARestAndDefense(ModelStrategy):
    """
    NBA Rest & Defense Strategy
    
    Focuses on situational advantages (rest days, back-to-backs) 
    and defensive performance. Rest is one of the most predictive 
    factors in NBA, and defense travels well.
    
    Best for: Spread betting
    """
    
    def __init__(self):
        super().__init__(
            name="NBA Rest & Defense",
            description="Focuses on rest advantages and defensive performance. "
                        "Prioritizes games where teams have significant rest differential.",
            sport=Sport.NBA,
            bet_type=BetType.SPREAD
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=NBAFactors.TEAM_PTS_ALLOWED_AVG,
                importance=Importance.HIGH,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.REST_DAYS,
                importance=Importance.HIGH
            ),
            ModelFactorInput(
                factor_id=NBAFactors.BACK_TO_BACK,
                importance=Importance.MEDIUM
            ),
            ModelFactorInput(
                factor_id=NBAFactors.TEAM_ATS_RECORD,
                importance=Importance.MEDIUM,
                parameters={"n_games": 20}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.TRAVEL_CONTEXT,
                importance=Importance.LOW
            )
        ]


class NBAOffensiveExplosion(ModelStrategy):
    """
    NBA Offensive Explosion Strategy
    
    Focuses on high-scoring teams and pace of play for Over/Under betting.
    Looks for games with fast-paced teams and recent scoring trends.
    
    Best for: Over/Under betting
    """
    
    def __init__(self):
        super().__init__(
            name="NBA Offensive Explosion",
            description="Targets high-scoring games by analyzing offensive trends and pace. "
                        "Best for Over/Under betting.",
            sport=Sport.NBA,
            bet_type=BetType.OVER_UNDER
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=NBAFactors.TEAM_SCORING_AVG,
                importance=Importance.HIGH,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.TEAM_OU_TREND,
                importance=Importance.HIGH,
                parameters={"n_games": 15}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.PACE_DIFF,
                importance=Importance.MEDIUM,
                parameters={"n_games": 15}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.TEAM_PTS_ALLOWED_AVG,
                importance=Importance.MEDIUM,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.REST_DAYS,
                importance=Importance.LOW
            )
        ]


class NBAHomeCourtAdvantage(ModelStrategy):
    """
    NBA Home Court Advantage Strategy
    
    Exploits home/away performance splits. Some teams perform 
    significantly better at home, creating value opportunities.
    
    Best for: Spread and Moneyline betting
    """
    
    def __init__(self):
        super().__init__(
            name="NBA Home Court Advantage",
            description="Exploits home/away performance splits. Targets teams with "
                        "strong home court advantages.",
            sport=Sport.NBA,
            bet_type=BetType.SPREAD
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=NBAFactors.HOME_AWAY_SPLIT,
                importance=Importance.HIGH,
                parameters={"n_games": 20}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.TEAM_SCORING_AVG,
                importance=Importance.HIGH,
                parameters={"n_games": 10, "home_only": True}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.TEAM_PTS_ALLOWED_AVG,
                importance=Importance.MEDIUM,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.HEAD_TO_HEAD,
                importance=Importance.MEDIUM,
                parameters={"n_games": 5}
            ),
            ModelFactorInput(
                factor_id=NBAFactors.REST_DAYS,
                importance=Importance.LOW
            )
        ]


# ==================== NFL Strategies ====================

class NFLTurnoverEdge(ModelStrategy):
    """
    NFL Turnover Edge Strategy
    
    Turnovers are the single best predictor of NFL outcomes.
    This strategy focuses on turnover differential and ball security.
    
    Best for: Spread betting
    """
    
    def __init__(self):
        super().__init__(
            name="NFL Turnover Edge",
            description="Focuses on turnover differential as the primary predictive factor. "
                        "Turnovers are the best predictor of NFL outcomes.",
            sport=Sport.NFL,
            bet_type=BetType.SPREAD
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=NFLFactors.TURNOVER_DIFF,
                importance=Importance.HIGH,
                parameters={"n_games": 5}
            ),
            ModelFactorInput(
                factor_id=NFLFactors.TEAM_PTS_ALLOWED_AVG,
                importance=Importance.HIGH,
                parameters={"n_games": 5}
            ),
            ModelFactorInput(
                factor_id=NFLFactors.YARDS_PER_PLAY,
                importance=Importance.MEDIUM
            ),
            ModelFactorInput(
                factor_id=NFLFactors.HOME_AWAY_SPLIT,
                importance=Importance.MEDIUM,
                parameters={"n_games": 8}
            ),
            ModelFactorInput(
                factor_id=NFLFactors.REST_DAYS,
                importance=Importance.LOW
            )
        ]


class NFLTrenchWarfare(ModelStrategy):
    """
    NFL Trench Warfare Strategy
    
    Focuses on rushing attack vs run defense matchups.
    Ground game often determines close games.
    
    Best for: Spread betting
    """
    
    def __init__(self):
        super().__init__(
            name="NFL Trench Warfare",
            description="Analyzes rushing offense vs run defense matchups. "
                        "Ground game control often determines outcomes.",
            sport=Sport.NFL,
            bet_type=BetType.SPREAD
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=NFLFactors.RUSH_VS_RUN_DEF,
                importance=Importance.HIGH
            ),
            ModelFactorInput(
                factor_id=NFLFactors.PASS_VS_PASS_DEF,
                importance=Importance.HIGH
            ),
            ModelFactorInput(
                factor_id=NFLFactors.TEAM_SCORING_AVG,
                importance=Importance.MEDIUM,
                parameters={"n_games": 5}
            ),
            ModelFactorInput(
                factor_id=NFLFactors.TEAM_ATS_RECORD,
                importance=Importance.MEDIUM,
                parameters={"n_games": 8}
            ),
            ModelFactorInput(
                factor_id=NFLFactors.DIVISION_GAME,
                importance=Importance.LOW
            )
        ]


# ==================== NHL Strategies ====================

class NHLGoalieAdvantage(ModelStrategy):
    """
    NHL Goalie Advantage Strategy
    
    Focuses on goaltending and defensive metrics.
    Back-to-backs heavily impact goalies.
    
    Best for: Spread (Puckline) betting
    """
    
    def __init__(self):
        super().__init__(
            name="NHL Goalie Advantage",
            description="Focuses on goaltending quality and rest. "
                        "Back-to-backs have major impact on goalie performance.",
            sport=Sport.NHL,
            bet_type=BetType.SPREAD
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=NHLFactors.TEAM_GOALS_ALLOWED,
                importance=Importance.HIGH,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=NHLFactors.BACK_TO_BACK,
                importance=Importance.HIGH
            ),
            ModelFactorInput(
                factor_id=NHLFactors.REST_DAYS,
                importance=Importance.MEDIUM
            ),
            ModelFactorInput(
                factor_id=NHLFactors.SHOTS_ON_GOAL,
                importance=Importance.MEDIUM,
                parameters={"n_games": 5}
            ),
            ModelFactorInput(
                factor_id=NHLFactors.HOME_AWAY_SPLIT,
                importance=Importance.LOW,
                parameters={"n_games": 15}
            )
        ]


class NHLSpecialTeamsEdge(ModelStrategy):
    """
    NHL Special Teams Edge Strategy
    
    Power play and penalty kill efficiency can swing games.
    Special teams often determine close matchups.
    
    Best for: Over/Under betting
    """
    
    def __init__(self):
        super().__init__(
            name="NHL Special Teams Edge",
            description="Analyzes power play and penalty kill efficiency. "
                        "Special teams often swing close games.",
            sport=Sport.NHL,
            bet_type=BetType.OVER_UNDER
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=NHLFactors.SPECIAL_TEAMS,
                importance=Importance.HIGH
            ),
            ModelFactorInput(
                factor_id=NHLFactors.TEAM_GOALS_AVG,
                importance=Importance.HIGH,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=NHLFactors.TEAM_OU_TREND,
                importance=Importance.MEDIUM,
                parameters={"n_games": 15}
            ),
            ModelFactorInput(
                factor_id=NHLFactors.GOAL_DIFF,
                importance=Importance.MEDIUM,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=NHLFactors.DIVISION_GAME,
                importance=Importance.LOW
            )
        ]


# ==================== MLB Strategies ====================

class MLBPitcherDominance(ModelStrategy):
    """
    MLB Pitcher Dominance Strategy
    
    Starting pitcher is the most important factor in baseball.
    Focuses on pitcher matchups and handedness advantages.
    
    Best for: Moneyline and Runline betting
    """
    
    def __init__(self):
        super().__init__(
            name="MLB Pitcher Dominance",
            description="Prioritizes starting pitcher quality and handedness matchups. "
                        "Pitcher is the most important factor in baseball.",
            sport=Sport.MLB,
            bet_type=BetType.SPREAD
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=MLBFactors.LINEUP_VS_PITCHER,
                importance=Importance.HIGH
            ),
            ModelFactorInput(
                factor_id=MLBFactors.BULLPEN_QUALITY,
                importance=Importance.HIGH
            ),
            ModelFactorInput(
                factor_id=MLBFactors.TEAM_RUNS_ALLOWED,
                importance=Importance.MEDIUM,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=MLBFactors.HOME_AWAY_SPLIT,
                importance=Importance.MEDIUM,
                parameters={"n_games": 20}
            ),
            ModelFactorInput(
                factor_id=MLBFactors.SERIES_POSITION,
                importance=Importance.LOW
            )
        ]


class MLBTotalsPrediction(ModelStrategy):
    """
    MLB Totals Prediction Strategy
    
    Focuses on scoring trends and ballpark factors for Over/Under.
    Day vs night games and weather can significantly impact totals.
    
    Best for: Over/Under betting
    """
    
    def __init__(self):
        super().__init__(
            name="MLB Totals Prediction",
            description="Analyzes scoring trends and game conditions for totals betting. "
                        "Considers day/night splits and recent offensive output.",
            sport=Sport.MLB,
            bet_type=BetType.OVER_UNDER
        )
    
    def get_factors(self) -> List[ModelFactorInput]:
        return [
            ModelFactorInput(
                factor_id=MLBFactors.TEAM_RUNS_AVG,
                importance=Importance.HIGH,
                parameters={"n_games": 10}
            ),
            ModelFactorInput(
                factor_id=MLBFactors.TEAM_OU_TREND,
                importance=Importance.HIGH,
                parameters={"n_games": 20}
            ),
            ModelFactorInput(
                factor_id=MLBFactors.BULLPEN_QUALITY,
                importance=Importance.MEDIUM
            ),
            ModelFactorInput(
                factor_id=MLBFactors.DAY_NIGHT,
                importance=Importance.MEDIUM
            ),
            ModelFactorInput(
                factor_id=MLBFactors.HOME_AWAY_SPLIT,
                importance=Importance.LOW,
                parameters={"n_games": 20}
            )
        ]


# ==================== Strategy Registry ====================

ALL_STRATEGIES = {
    "nba": [
        NBARestAndDefense(),
        NBAOffensiveExplosion(),
        NBAHomeCourtAdvantage()
    ],
    "nfl": [
        NFLTurnoverEdge(),
        NFLTrenchWarfare()
    ],
    "nhl": [
        NHLGoalieAdvantage(),
        NHLSpecialTeamsEdge()
    ],
    "mlb": [
        MLBPitcherDominance(),
        MLBTotalsPrediction()
    ]
}


def get_strategy(sport: str, strategy_name: str) -> ModelStrategy:
    """Get a strategy by sport and name"""
    sport = sport.lower()
    if sport not in ALL_STRATEGIES:
        raise ValueError(f"Unknown sport: {sport}")
    
    for strategy in ALL_STRATEGIES[sport]:
        if strategy.name == strategy_name:
            return strategy
    
    raise ValueError(f"Unknown strategy: {strategy_name} for sport {sport}")


def list_strategies(sport: Optional[str] = None) -> Dict[str, List[ModelStrategy]]:
    """List all available strategies"""
    if sport:
        sport = sport.lower()
        return {sport: ALL_STRATEGIES.get(sport, [])}
    return ALL_STRATEGIES


def print_all_strategies():
    """Print all available strategies"""
    print("\n" + "="*70)
    print("AVAILABLE BETTING STRATEGIES")
    print("="*70 + "\n")
    
    for sport, strategies in ALL_STRATEGIES.items():
        print(f"🏀 {sport.upper()}")
        print("-" * 70)
        for strategy in strategies:
            print(f"\n  📊 {strategy.name}")
            print(f"     {strategy.description}")
            print(f"     Bet Type: {strategy.bet_type.value.replace('_', ' ').title()}")
            print(f"     Factors: {len(strategy.get_factors())}")
        print("\n")

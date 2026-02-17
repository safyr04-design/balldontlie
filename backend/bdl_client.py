"""
Ball Don't Lie Lab API Client
A comprehensive Python SDK for the BDL Lab API
"""

import requests
import time
from typing import Dict, List, Optional, Any, Literal
from dataclasses import dataclass, asdict
from enum import Enum


class Sport(str, Enum):
    """Supported sports"""
    NBA = "nba"
    NFL = "nfl"
    NHL = "nhl"
    MLB = "mlb"


class BetType(str, Enum):
    """Types of bets"""
    SPREAD = "spread"
    MONEYLINE = "moneyline"
    OVER_UNDER = "over_under"
    PLAYER_PROP = "player_prop"


class ModelMode(str, Enum):
    """Model calculation modes"""
    SIMPLE = "simple"
    WEIGHTED = "weighted"


class Importance(str, Enum):
    """Factor importance levels for simple mode"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class JobStatus(str, Enum):
    """Background job statuses"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class Factor:
    """Represents a betting factor"""
    id: int
    slug: str
    name: str
    description: Optional[str]
    category: str
    sport: str
    output_type: str
    raw_value_unit: Optional[str]
    configurable_params: Optional[Dict[str, Any]]


@dataclass
class ModelFactorInput:
    """Factor input for model creation"""
    factor_id: int
    importance: Optional[Importance] = None
    weight: Optional[float] = None
    parameters: Optional[Dict[str, Any]] = None
    conditions: Optional[Dict[str, Any]] = None

    def to_dict(self):
        result = {"factor_id": self.factor_id}
        if self.importance:
            result["importance"] = self.importance.value if isinstance(self.importance, Importance) else self.importance
        if self.weight is not None:
            result["weight"] = self.weight
        if self.parameters:
            result["parameters"] = self.parameters
        if self.conditions:
            result["conditions"] = self.conditions
        return result


class BDLLabClient:
    """Client for interacting with the Ball Don't Lie Lab API"""
    
    BASE_URL = "https://api.balldontlie.io"
    
    def __init__(self, api_key: str):
        """
        Initialize the client
        
        Args:
            api_key: Your BDL Lab API key
        """
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": api_key,
            "Content-Type": "application/json"
        })
    
    def _make_request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None
    ) -> Dict:
        """Make an API request"""
        url = f"{self.BASE_URL}{endpoint}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                params=params,
                json=data
            )
            
            # Check rate limits
            if "X-RateLimit-Remaining" in response.headers:
                remaining = int(response.headers["X-RateLimit-Remaining"])
                if remaining < 10:
                    print(f"⚠️  Low rate limit: {remaining} requests remaining")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            error_msg = f"API Error: {e}"
            try:
                error_data = e.response.json()
                error_msg = f"API Error: {error_data.get('error', str(e))}"
            except:
                pass
            raise Exception(error_msg)
    
    # ==================== Factors ====================
    
    def list_factors(
        self,
        sport: Sport = Sport.NBA,
        category: Optional[str] = None
    ) -> List[Factor]:
        """
        List all available factors
        
        Args:
            sport: Sport to filter by
            category: Factor category to filter by
        
        Returns:
            List of Factor objects
        """
        params = {"sport": sport.value}
        if category:
            params["category"] = category
        
        response = self._make_request("GET", "/lab/v1/factors", params=params)
        return [Factor(**f) for f in response["data"]]
    
    def get_factor(self, factor_id: int) -> Factor:
        """Get details of a specific factor"""
        response = self._make_request("GET", f"/lab/v1/factors/{factor_id}")
        return Factor(**response["data"])
    
    # ==================== Models ====================
    
    def list_models(
        self,
        sport: Optional[str] = None,
        bet_type: Optional[str] = None,
        per_page: int = 25,
        cursor: Optional[int] = None
    ) -> Dict:
        """List user's models"""
        params = {"per_page": per_page}
        if sport:
            params["sport"] = sport
        if bet_type:
            params["bet_type"] = bet_type
        if cursor:
            params["cursor"] = cursor
        
        return self._make_request("GET", "/lab/v1/models", params=params)
    
    def get_model(self, model_id: int) -> Dict:
        """Get details of a specific model"""
        response = self._make_request("GET", f"/lab/v1/models/{model_id}")
        return response["data"]
    
    def create_model(
        self,
        name: str,
        bet_type: BetType,
        mode: ModelMode,
        factors: List[ModelFactorInput],
        sport: Sport = Sport.NBA,
        description: Optional[str] = None,
        advanced_config: Optional[Dict] = None
    ) -> Dict:
        """
        Create a new prediction model
        
        Args:
            name: Model name
            bet_type: Type of bet to predict
            mode: Model calculation mode
            factors: List of factors to include
            sport: Sport for the model
            description: Optional model description
            advanced_config: Optional advanced configuration
        
        Returns:
            Created model data
        """
        data = {
            "name": name,
            "bet_type": bet_type.value if isinstance(bet_type, BetType) else bet_type,
            "mode": mode.value if isinstance(mode, ModelMode) else mode,
            "sport": sport.value if isinstance(sport, Sport) else sport,
            "factors": [f.to_dict() for f in factors]
        }
        
        if description:
            data["description"] = description
        if advanced_config:
            data["advanced_config"] = advanced_config
        
        response = self._make_request("POST", "/lab/v1/models", data=data)
        return response["data"]
    
    def update_model(
        self,
        model_id: int,
        name: Optional[str] = None,
        description: Optional[str] = None,
        bet_type: Optional[BetType] = None,
        mode: Optional[ModelMode] = None,
        factors: Optional[List[ModelFactorInput]] = None
    ) -> Dict:
        """Update an existing model"""
        data = {}
        if name:
            data["name"] = name
        if description:
            data["description"] = description
        if bet_type:
            data["bet_type"] = bet_type.value
        if mode:
            data["mode"] = mode.value
        if factors:
            data["factors"] = [f.to_dict() for f in factors]
        
        response = self._make_request("PUT", f"/lab/v1/models/{model_id}", data=data)
        return response["data"]
    
    def delete_model(self, model_id: int):
        """Delete a model"""
        self._make_request("DELETE", f"/lab/v1/models/{model_id}")
    
    # ==================== Predictions ====================
    
    def list_predictions(
        self,
        model_id: int,
        result: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        per_page: int = 25,
        cursor: Optional[int] = None
    ) -> Dict:
        """List predictions for a model"""
        params = {"model_id": model_id, "per_page": per_page}
        if result:
            params["result"] = result
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if cursor:
            params["cursor"] = cursor
        
        return self._make_request("GET", "/lab/v1/predictions", params=params)
    
    def get_prediction_stats(self, model_id: int) -> Dict:
        """Get aggregate statistics for a model's predictions"""
        response = self._make_request(
            "GET",
            "/lab/v1/predictions/stats",
            params={"model_id": model_id}
        )
        return response["data"]
    
    def generate_predictions(self, model_id: int) -> Dict:
        """
        Generate predictions for upcoming games
        Returns a job object - poll get_job() until complete
        """
        response = self._make_request(
            "POST",
            f"/lab/v1/models/{model_id}/predictions/generate"
        )
        return response["data"]
    
    # ==================== Performance ====================
    
    def create_preview(
        self,
        bet_type: BetType,
        mode: ModelMode,
        factors: List[ModelFactorInput],
        sport: Sport = Sport.NBA,
        start_season: Optional[str] = None,
        end_season: Optional[str] = None,
        advanced_config: Optional[Dict] = None
    ) -> Dict:
        """
        Create a preview job to test model performance without saving
        Returns a job object - poll get_job() until complete
        """
        data = {
            "bet_type": bet_type.value if isinstance(bet_type, BetType) else bet_type,
            "mode": mode.value if isinstance(mode, ModelMode) else mode,
            "sport": sport.value if isinstance(sport, Sport) else sport,
            "factors": [f.to_dict() for f in factors]
        }
        
        if start_season:
            data["start_season"] = start_season
        if end_season:
            data["end_season"] = end_season
        if advanced_config:
            data["advanced_config"] = advanced_config
        
        response = self._make_request("POST", "/lab/v1/performance/preview", data=data)
        return response["data"]
    
    def get_model_performance(self, model_id: int) -> Optional[Dict]:
        """Get performance evaluation results for a model"""
        response = self._make_request("GET", f"/lab/v1/models/{model_id}/performance")
        return response["data"]
    
    def evaluate_performance(
        self,
        model_id: int,
        season: Optional[str] = None
    ) -> Dict:
        """
        Trigger performance evaluation for a model
        Returns a job object - poll get_job() until complete
        """
        data = {}
        if season:
            data["season"] = season
        
        response = self._make_request(
            "POST",
            f"/lab/v1/models/{model_id}/performance",
            data=data if data else None
        )
        return response["data"]
    
    def get_performance_games(
        self,
        model_id: int,
        limit: int = 25,
        offset: int = 0,
        result: Optional[str] = None
    ) -> Dict:
        """Get per-game performance details"""
        params = {"limit": limit, "offset": offset}
        if result:
            params["result"] = result
        
        return self._make_request(
            "GET",
            f"/lab/v1/models/{model_id}/performance/games",
            params=params
        )
    
    def clear_performance(self, model_id: int):
        """Clear all performance data for a model"""
        self._make_request("DELETE", f"/lab/v1/models/{model_id}/performance")
    
    # ==================== Jobs ====================
    
    def get_job(self, job_id: str) -> Dict:
        """Get status and output of a background job"""
        response = self._make_request("GET", f"/lab/v1/jobs/{job_id}")
        return response["data"]
    
    def cancel_job(self, job_id: str) -> Dict:
        """Cancel a pending or running job"""
        response = self._make_request("DELETE", f"/lab/v1/jobs/{job_id}")
        return response["data"]
    
    def get_active_jobs(self, model_id: int) -> List[Dict]:
        """Get all active jobs for a model"""
        response = self._make_request(
            "GET",
            f"/lab/v1/models/{model_id}/jobs/active"
        )
        return response["data"]
    
    def wait_for_job(
        self,
        job_id: str,
        timeout: int = 300,
        poll_interval: int = 2
    ) -> Dict:
        """
        Wait for a job to complete
        
        Args:
            job_id: Job ID to wait for
            timeout: Maximum time to wait in seconds
            poll_interval: Time between polls in seconds
        
        Returns:
            Completed job data
        """
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            job = self.get_job(job_id)
            status = job["status"]
            
            if status == JobStatus.COMPLETED.value:
                return job
            elif status == JobStatus.FAILED.value:
                raise Exception(f"Job failed: {job.get('error_message', 'Unknown error')}")
            elif status == JobStatus.CANCELLED.value:
                raise Exception("Job was cancelled")
            
            time.sleep(poll_interval)
        
        raise TimeoutError(f"Job did not complete within {timeout} seconds")


# ==================== Helper Functions ====================

def print_model_summary(model: Dict):
    """Print a formatted summary of a model"""
    print(f"\n{'='*60}")
    print(f"Model: {model['name']}")
    print(f"{'='*60}")
    print(f"ID: {model['id']}")
    print(f"Sport: {model['sport'].upper()}")
    print(f"Bet Type: {model['bet_type'].replace('_', ' ').title()}")
    print(f"Mode: {model['mode'].title()}")
    
    if model.get('description'):
        print(f"Description: {model['description']}")
    
    print(f"\nFactors ({len(model['factors'])}):")
    for f in model['factors']:
        if model['mode'] == 'simple':
            print(f"  • {f['factor_name']} ({f['importance'].upper()})")
        else:
            print(f"  • {f['factor_name']} ({f['weight']}%)")
    print()


def print_performance_summary(performance: Dict):
    """Print a formatted summary of model performance"""
    if not performance:
        print("No performance data available")
        return
    
    print(f"\n{'='*60}")
    print("Performance Summary")
    print(f"{'='*60}")
    
    if performance.get("status") != "completed":
        print(f"Status: {performance.get('status', 'unknown').title()}")
        return
    
    print(f"Games Evaluated: {performance.get('games_evaluated', 0):,}")
    print(f"Date Range: {performance.get('date_range_start')} to {performance.get('date_range_end')}")
    print(f"\nRecord: {performance.get('wins', 0)}-{performance.get('losses', 0)}-{performance.get('pushes', 0)}")
    print(f"Win Rate: {performance.get('win_rate', 0) * 100:.2f}%")
    print(f"ROI: {performance.get('roi', 0) * 100:+.2f}%")
    print(f"Avg Confidence: {performance.get('avg_confidence', 0) * 100:.1f}%")
    
    results_by_conf = performance.get('results_by_confidence', [])
    if results_by_conf:
        print(f"\nResults by Confidence:")
        for bucket in results_by_conf:
            print(f"  {bucket['bucket']:12} | {bucket['wins']}-{bucket['losses']}-{bucket['pushes']} | "
                  f"WR: {bucket['win_rate']*100:.1f}% | ROI: {bucket['roi']*100:+.1f}%")
    print()


def print_predictions(predictions: List[Dict]):
    """Print formatted predictions"""
    print(f"\n{'='*60}")
    print(f"Predictions ({len(predictions)})")
    print(f"{'='*60}\n")
    
    for pred in predictions[:10]:  # Show first 10
        game = pred.get('game', {})
        home = game.get('home_team', {})
        visitor = game.get('visitor_team', {})
        
        print(f"📅 {game.get('date')} | {visitor.get('abbreviation')} @ {home.get('abbreviation')}")
        print(f"   Predicted: {pred.get('predicted_value')}")
        print(f"   Confidence: {pred.get('confidence', 0)*100:.1f}%")
        print(f"   Market: {pred.get('market_value')}")
        if pred.get('result'):
            print(f"   Result: {pred['result'].upper()}")
        print()

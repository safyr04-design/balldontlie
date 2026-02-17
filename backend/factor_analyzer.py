"""
Factor Analysis and Insights Generator

Analyzes the available factors for each sport and generates
insights about which factors are most effective for different bet types.
"""

from bdl_client import BDLLabClient, Sport, BetType, ModelMode, ModelFactorInput, Importance
from typing import Dict, List, Tuple
import json


class FactorAnalyzer:
    """Analyzes factors and generates betting insights"""
    
    def __init__(self, api_key: str):
        self.client = BDLLabClient(api_key)
        self.factor_cache = {}
    
    def fetch_all_factors(self, sport: Sport) -> List[Dict]:
        """Fetch all factors for a sport"""
        if sport.value not in self.factor_cache:
            factors = self.client.list_factors(sport=sport)
            self.factor_cache[sport.value] = [f.__dict__ for f in factors]
        return self.factor_cache[sport.value]
    
    def categorize_factors(self, sport: Sport) -> Dict[str, List[Dict]]:
        """Organize factors by category"""
        factors = self.fetch_all_factors(sport)
        categorized = {}
        
        for factor in factors:
            category = factor['category']
            if category not in categorized:
                categorized[category] = []
            categorized[category].append(factor)
        
        return categorized
    
    def print_factor_summary(self, sport: Sport):
        """Print a detailed summary of all factors for a sport"""
        print(f"\n{'='*80}")
        print(f"{sport.value.upper()} FACTORS ANALYSIS")
        print(f"{'='*80}\n")
        
        categorized = self.categorize_factors(sport)
        
        for category, factors in sorted(categorized.items()):
            print(f"📂 {category.replace('_', ' ').title()} ({len(factors)} factors)")
            print("-" * 80)
            
            for factor in factors:
                print(f"\n  🔹 {factor['name']}")
                if factor['description']:
                    print(f"     {factor['description'][:100]}...")
                
                print(f"     • Output: {factor['output_type']}")
                if factor['raw_value_unit']:
                    print(f"     • Unit: {factor['raw_value_unit']}")
                
                if factor['configurable_params']:
                    print(f"     • Configurable: {', '.join(factor['configurable_params'].keys())}")
            
            print()
    
    def analyze_factor_for_bet_type(
        self,
        sport: Sport,
        category: str,
        bet_type: BetType
    ) -> List[Dict]:
        """
        Analyze which factors in a category are most suitable for a bet type
        
        Returns factors with suitability scores
        """
        factors = self.fetch_all_factors(sport)
        category_factors = [f for f in factors if f['category'] == category]
        
        # Define factor suitability rules
        suitability_rules = {
            BetType.SPREAD: {
                'team_performance': ['scoring', 'defense', 'margin', 'efficiency'],
                'matchup': ['head_to_head', 'style', 'pace'],
                'situational': ['rest', 'travel', 'back_to_back'],
                'player': ['star_impact', 'injuries'],
                'market': ['line_movement', 'public']
            },
            BetType.OVER_UNDER: {
                'team_performance': ['scoring', 'pace', 'tempo'],
                'matchup': ['pace_differential', 'total_history'],
                'situational': ['weather', 'altitude'],
                'player': ['offensive_stars', 'scorers'],
                'market': ['total_trend']
            },
            BetType.MONEYLINE: {
                'team_performance': ['win_percentage', 'pythagorean'],
                'matchup': ['head_to_head', 'dominance'],
                'situational': ['home_field'],
                'player': ['star_power'],
                'market': ['odds_value']
            }
        }
        
        keywords = suitability_rules.get(bet_type, {}).get(category, [])
        
        scored_factors = []
        for factor in category_factors:
            score = 0
            factor_text = f"{factor['name']} {factor.get('description', '')}".lower()
            
            for keyword in keywords:
                if keyword in factor_text:
                    score += 1
            
            scored_factors.append({
                **factor,
                'suitability_score': score
            })
        
        # Sort by suitability
        scored_factors.sort(key=lambda x: x['suitability_score'], reverse=True)
        
        return scored_factors
    
    def generate_factor_recommendations(
        self,
        sport: Sport,
        bet_type: BetType,
        top_n: int = 5
    ) -> List[Tuple[Dict, str]]:
        """
        Generate factor recommendations for a specific sport and bet type
        
        Returns list of (factor, reason) tuples
        """
        print(f"\n{'='*80}")
        print(f"FACTOR RECOMMENDATIONS: {sport.value.upper()} {bet_type.value.replace('_', ' ').title()}")
        print(f"{'='*80}\n")
        
        categorized = self.categorize_factors(sport)
        all_recommendations = []
        
        for category in categorized.keys():
            suitable_factors = self.analyze_factor_for_bet_type(sport, category, bet_type)
            
            if suitable_factors and suitable_factors[0]['suitability_score'] > 0:
                top_factor = suitable_factors[0]
                
                # Generate reason based on bet type and category
                reasons = {
                    (BetType.SPREAD, 'team_performance'): 
                        "Recent performance strongly correlates with spread outcomes",
                    (BetType.SPREAD, 'matchup'): 
                        "Head-to-head history and style matchups impact margin of victory",
                    (BetType.SPREAD, 'situational'): 
                        "Rest and travel significantly affect performance against spread",
                    (BetType.OVER_UNDER, 'team_performance'): 
                        "Scoring trends directly predict total points",
                    (BetType.OVER_UNDER, 'matchup'): 
                        "Pace matchups determine game tempo and total scoring",
                    (BetType.MONEYLINE, 'team_performance'): 
                        "Win probability is highly correlated with recent form",
                    (BetType.MONEYLINE, 'matchup'): 
                        "Historical matchups reveal dominance patterns",
                }
                
                reason = reasons.get(
                    (bet_type, category),
                    f"Relevant for {bet_type.value.replace('_', ' ')} betting"
                )
                
                all_recommendations.append((top_factor, reason, category))
        
        # Sort by suitability score
        all_recommendations.sort(key=lambda x: x[0]['suitability_score'], reverse=True)
        
        # Print recommendations
        print("🎯 Top Recommended Factors:\n")
        
        for i, (factor, reason, category) in enumerate(all_recommendations[:top_n], 1):
            print(f"{i}. {factor['name']}")
            print(f"   Category: {category.replace('_', ' ').title()}")
            print(f"   Reason: {reason}")
            print(f"   Suitability Score: {factor['suitability_score']}/5")
            
            if factor['configurable_params']:
                print(f"   Configurable: {', '.join(factor['configurable_params'].keys())}")
            print()
        
        return all_recommendations[:top_n]
    
    def compare_sports_factors(self):
        """Compare factor availability across all sports"""
        print(f"\n{'='*80}")
        print("CROSS-SPORT FACTOR COMPARISON")
        print(f"{'='*80}\n")
        
        sports_data = {}
        
        for sport in Sport:
            try:
                factors = self.fetch_all_factors(sport)
                categorized = self.categorize_factors(sport)
                
                sports_data[sport.value] = {
                    'total': len(factors),
                    'by_category': {cat: len(facts) for cat, facts in categorized.items()}
                }
            except Exception as e:
                print(f"⚠️  Could not fetch factors for {sport.value}: {e}")
        
        # Print comparison table
        print(f"{'Sport':<10} {'Total':<10} {'Team Perf':<12} {'Matchup':<10} {'Situational':<12} {'Player':<10}")
        print("-" * 80)
        
        for sport, data in sports_data.items():
            by_cat = data['by_category']
            print(f"{sport.upper():<10} {data['total']:<10} "
                  f"{by_cat.get('team_performance', 0):<12} "
                  f"{by_cat.get('matchup', 0):<10} "
                  f"{by_cat.get('situational', 0):<12} "
                  f"{by_cat.get('player', 0):<10}")
        
        print()
    
    def export_factors_to_json(self, sport: Sport, filename: str):
        """Export all factors for a sport to JSON"""
        factors = self.fetch_all_factors(sport)
        
        with open(filename, 'w') as f:
            json.dump(factors, f, indent=2)
        
        print(f"✅ Exported {len(factors)} factors to {filename}")
    
    def find_complementary_factors(
        self,
        sport: Sport,
        primary_factor_id: int
    ) -> List[Dict]:
        """
        Find factors that complement a given primary factor
        
        Returns factors from different categories that work well together
        """
        factors = self.fetch_all_factors(sport)
        primary = next((f for f in factors if f['id'] == primary_factor_id), None)
        
        if not primary:
            print(f"❌ Factor {primary_factor_id} not found")
            return []
        
        print(f"\n🔍 Finding factors that complement: {primary['name']}")
        print(f"   Category: {primary['category']}\n")
        
        # Get factors from different categories
        complementary = []
        
        for factor in factors:
            if factor['id'] != primary_factor_id and factor['category'] != primary['category']:
                complementary.append(factor)
        
        print(f"Found {len(complementary)} complementary factors from other categories:\n")
        
        # Group by category
        by_category = {}
        for factor in complementary:
            cat = factor['category']
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(factor)
        
        for category, facts in sorted(by_category.items()):
            print(f"📂 {category.replace('_', ' ').title()}")
            for factor in facts[:3]:  # Show top 3 per category
                print(f"   • {factor['name']}")
            print()
        
        return complementary
    
    def suggest_model_composition(
        self,
        sport: Sport,
        bet_type: BetType,
        style: str = "balanced"
    ) -> List[ModelFactorInput]:
        """
        Suggest a complete model composition
        
        Args:
            sport: Sport for the model
            bet_type: Type of bet
            style: 'aggressive', 'balanced', or 'conservative'
        
        Returns:
            List of ModelFactorInput ready for model creation
        """
        print(f"\n{'='*80}")
        print(f"MODEL COMPOSITION SUGGESTION")
        print(f"Sport: {sport.value.upper()} | Bet Type: {bet_type.value.replace('_', ' ').title()}")
        print(f"Style: {style.title()}")
        print(f"{'='*80}\n")
        
        recommendations = self.generate_factor_recommendations(sport, bet_type, top_n=7)
        
        # Define importance distribution based on style
        importance_distributions = {
            'aggressive': [Importance.HIGH, Importance.HIGH, Importance.HIGH, 
                          Importance.MEDIUM, Importance.LOW],
            'balanced': [Importance.HIGH, Importance.HIGH, Importance.MEDIUM,
                        Importance.MEDIUM, Importance.LOW],
            'conservative': [Importance.HIGH, Importance.MEDIUM, Importance.MEDIUM,
                           Importance.LOW, Importance.LOW]
        }
        
        distribution = importance_distributions.get(style, importance_distributions['balanced'])
        
        model_factors = []
        
        print("📊 Suggested Model Configuration:\n")
        
        for i, (factor, reason, category) in enumerate(recommendations[:5]):
            importance = distribution[i] if i < len(distribution) else Importance.LOW
            
            # Add configurable parameters based on factor type
            parameters = {}
            if 'n_games' in factor.get('configurable_params', {}):
                parameters['n_games'] = 10
            
            model_factor = ModelFactorInput(
                factor_id=factor['id'],
                importance=importance,
                parameters=parameters if parameters else None
            )
            
            model_factors.append(model_factor)
            
            print(f"{i+1}. {factor['name']}")
            print(f"   Importance: {importance.value.upper()}")
            print(f"   Category: {category.replace('_', ' ').title()}")
            print(f"   Reason: {reason}")
            print()
        
        print("✅ Model ready to create with these factors\n")
        
        return model_factors


# ==================== CLI Interface ====================

def main():
    """CLI interface for factor analysis"""
    import sys
    import os
    
    if len(sys.argv) < 2:
        print("""
Usage: python factor_analyzer.py <command> [args]

Commands:
  summary <sport>              - Print factor summary for a sport
  compare                      - Compare factors across all sports
  recommend <sport> <bet_type> - Get factor recommendations
  suggest <sport> <bet_type> [style] - Suggest complete model composition
  export <sport> <filename>    - Export factors to JSON
  complement <sport> <factor_id> - Find complementary factors
  
Sports: nba, nfl, nhl, mlb
Bet Types: spread, moneyline, over_under
Styles: aggressive, balanced, conservative

Environment Variables:
  BDL_API_KEY - Your Ball Don't Lie Lab API key
""")
        sys.exit(1)
    
    api_key = os.getenv("BDL_API_KEY")
    if not api_key:
        print("❌ Error: BDL_API_KEY environment variable not set")
        sys.exit(1)
    
    analyzer = FactorAnalyzer(api_key)
    command = sys.argv[1].lower()
    
    if command == "summary":
        if len(sys.argv) < 3:
            print("❌ Error: sport required")
            sys.exit(1)
        sport = Sport(sys.argv[2].lower())
        analyzer.print_factor_summary(sport)
    
    elif command == "compare":
        analyzer.compare_sports_factors()
    
    elif command == "recommend":
        if len(sys.argv) < 4:
            print("❌ Error: sport and bet_type required")
            sys.exit(1)
        sport = Sport(sys.argv[2].lower())
        bet_type = BetType(sys.argv[3].lower())
        analyzer.generate_factor_recommendations(sport, bet_type)
    
    elif command == "suggest":
        if len(sys.argv) < 4:
            print("❌ Error: sport and bet_type required")
            sys.exit(1)
        sport = Sport(sys.argv[2].lower())
        bet_type = BetType(sys.argv[3].lower())
        style = sys.argv[4] if len(sys.argv) > 4 else "balanced"
        analyzer.suggest_model_composition(sport, bet_type, style)
    
    elif command == "export":
        if len(sys.argv) < 4:
            print("❌ Error: sport and filename required")
            sys.exit(1)
        sport = Sport(sys.argv[2].lower())
        filename = sys.argv[3]
        analyzer.export_factors_to_json(sport, filename)
    
    elif command == "complement":
        if len(sys.argv) < 4:
            print("❌ Error: sport and factor_id required")
            sys.exit(1)
        sport = Sport(sys.argv[2].lower())
        factor_id = int(sys.argv[3])
        analyzer.find_complementary_factors(sport, factor_id)
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()

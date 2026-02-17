/**
 * Auto-generated TypeScript types from OpenAPI specification
 * Ball Don't Lie Lab API
 * DO NOT EDIT MANUALLY
 */

// ===== Common Types =====

export interface Error {
  /** Error message */
  error?: string;
}

export interface CursorPagination {
  /** Cursor for the next page of results */
  next_cursor?: number | null;
  /** Cursor for the previous page of results */
  prev_cursor?: number | null;
  /** Number of results per page */
  per_page?: number;
}

export interface OffsetPagination {
  /** Total number of results */
  total?: number;
  /** Number of results per page */
  limit?: number;
  /** Number of results skipped */
  offset?: number;
}

export interface FactorConfigParam {
  type?: any;
  /** Default value for the parameter */
  default?: any;
  /** Minimum value (for integer type) */
  min?: number;
  /** Maximum value (for integer type) */
  max?: number;
  /** Available options (for string type) */
  options?: string[];
  /** Description of what the parameter controls */
  description?: string;
}

export interface Factor {
  /** Unique factor identifier */
  id?: number;
  /** URL-friendly factor identifier */
  slug?: string;
  /** Human-readable factor name */
  name?: string;
  /** Detailed description of the factor */
  description?: string | null;
  /** Factor category (team_performance, matchup, situational, player, market) */
  category?: string;
  /** Sport this factor applies to */
  sport?: string;
  /** Type of output the factor produces */
  output_type?: string;
  /** Unit of measurement for raw values */
  raw_value_unit?: string | null;
  /** Configurable parameters for this factor */
  configurable_params?: any;
}

export interface ImportanceMultipliers {
  /** Weight multiplier for low importance factors */
  low?: number;
  /** Weight multiplier for medium importance factors */
  medium?: number;
  /** Weight multiplier for high importance factors */
  high?: number;
}

export interface BettingThresholds {
  /** Score difference threshold for spread bets */
  spread_score_diff?: number;
  /** Combined score threshold for over/under bets */
  over_under_combined?: number;
  /** Score difference threshold for moneyline bets */
  moneyline_score_diff?: number;
}

export interface ModelFactorInput {
  /** ID of the factor to include in the model */
  factor_id: number;
  importance?: any;
  /** Weight of this factor (0-100, must sum to 100 in weighted mode) */
  weight?: number;
  /** Custom parameters for this factor */
  parameters?: Record<string, any>;
  /** Conditions for when this factor applies */
  conditions?: Record<string, any>;
}

export interface ModelFactor {
  /** ID of the factor */
  factor_id?: number;
  /** URL-friendly factor identifier */
  factor_slug?: string;
  /** Human-readable factor name */
  factor_name?: string;
  importance?: any;
  /** Weight of this factor (0-100) */
  weight?: number | null;
  /** Custom parameters for this factor */
  parameters?: any;
  /** Conditions for when this factor applies */
  conditions?: any;
}

export interface ModelSlim {
  /** Unique model identifier */
  id?: number;
  /** Model name */
  name?: string;
  /** Model description */
  description?: string | null;
  /** Sport this model predicts */
  sport?: string;
  bet_type?: any;
  /** Specific prop type (for player_prop bet_type) */
  prop_type?: string | null;
  mode?: any;
  advanced_config?: any;
  /** Timestamp when the model was created */
  created_at?: string  // ISO 8601 datetime;
  /** Timestamp when the model was last updated */
  updated_at?: string  // ISO 8601 datetime;
}

export interface CreateModelRequest {
  /** Model name */
  name: string;
  /** Model description */
  description?: string;
  sport?: any;
  bet_type: any;
  /** Specific prop type (for player_prop bet_type) */
  prop_type?: string;
  mode: any;
  /** Factors to include in the model */
  factors: any[];
}

export interface UpdateModelRequest {
  /** Model name */
  name?: string;
  /** Model description */
  description?: string;
  bet_type?: any;
  /** Specific prop type (for player_prop bet_type) */
  prop_type?: string;
  mode?: any;
  /** Factors to include in the model */
  factors?: any[];
}

export interface ResultsByConfidence {
  /** Confidence bucket range (e.g., "0.5-0.6") */
  bucket?: string;
  /** Number of games in this bucket */
  games?: number;
  /** Number of wins */
  wins?: number;
  /** Number of losses */
  losses?: number;
  /** Number of pushes */
  pushes?: number;
  /** Win rate as decimal */
  win_rate?: number;
  /** Return on investment as decimal */
  roi?: number;
}

export interface ResultsOverTime {
  /** Date or period */
  date?: string;
  /** Cumulative wins up to this date */
  cumulative_wins?: number;
  /** Cumulative losses up to this date */
  cumulative_losses?: number;
  /** Cumulative ROI up to this date */
  cumulative_roi?: number;
}

export interface TeamInfo {
  /** Team ID */
  id?: number;
  /** Team name */
  name?: string;
  /** Team abbreviation */
  abbreviation?: string;
}

export interface GameInfo {
  /** Game ID */
  id?: number;
  /** Game date (YYYY-MM-DD) */
  date?: string  // YYYY-MM-DD;
  home_team?: any;
  visitor_team?: any;
  /** Home team final score (null if game not completed) */
  home_team_score?: number | null;
  /** Visitor team final score (null if game not completed) */
  visitor_team_score?: number | null;
  /** Game status (e.g., "Final", "Scheduled") */
  status?: string | null;
}

export interface Prediction {
  /** Unique prediction identifier */
  id?: number;
  /** ID of the model that made this prediction */
  model_id?: number;
  /** ID of the game being predicted */
  game_id?: number;
  /** Predicted value */
  predicted_value?: number | null;
  /** Confidence level (0-1) */
  confidence?: number | null;
  /** Market line value at prediction time */
  market_value?: number | null;
  /** Edge over market */
  edge?: number | null;
  /** Actual result value */
  actual_value?: number | null;
  result?: any;
  /** Home team moneyline odds at prediction time */
  home_ml?: number | null;
  /** Away team moneyline odds at prediction time */
  away_ml?: number | null;
  /** Timestamp when prediction was created */
  created_at?: string  // ISO 8601 datetime;
  /** Timestamp when prediction was resolved */
  resolved_at?: string | null;
}

export interface PredictionStats {
  /** Total predictions */
  total?: number;
  /** Number of wins */
  wins?: number;
  /** Number of losses */
  losses?: number;
  /** Number of pushes */
  pushes?: number;
  /** Win rate as percentage */
  win_rate?: number;
}

export interface PerformanceTeamInfo {
  /** Team ID */
  id?: number;
  /** Team abbreviation */
  abbreviation?: string;
  /** Team name */
  name?: string;
}

export interface FactorValue {
  /** Factor identifier */
  factor_slug?: string;
  /** Raw factor value */
  raw_value?: any;
  /** Normalized score (0-100) */
  score?: number;
  /** Parameters used for calculation */
  parameters?: Record<string, any>;
}

export interface PerformanceGameResult {
  /** Game ID */
  game_id?: number;
  /** Game date (YYYY-MM-DD) */
  date?: string  // YYYY-MM-DD;
  home_team?: any;
  away_team?: any;
  /** Home team score */
  home_score?: number | null;
  /** Away team score */
  away_score?: number | null;
  /** Market line value */
  market_value?: number;
  /** Model's score for home team */
  home_model_score?: number;
  /** Model's score for away team */
  away_model_score?: number;
  predicted_side?: any;
  /** Confidence level */
  confidence?: number;
  result?: any;
  /** Whether this is a future game (prediction only) */
  is_future?: boolean;
  /** Detailed factor values for each team */
  factor_details?: Record<string, any>;
}

export interface ModelPerformance {
  /** ID of the model */
  model_id?: number;
  status?: any;
  /** Error message if status is failed */
  error_message?: string | null;
  /** Timestamp when evaluation completed */
  evaluated_at?: string | null;
  /** Number of games evaluated */
  games_evaluated?: number | null;
  /** Start of evaluation date range (YYYY-MM-DD) */
  date_range_start?: string | null;
  /** End of evaluation date range (YYYY-MM-DD) */
  date_range_end?: string | null;
  /** Total number of bets */
  total_bets?: number | null;
  /** Number of wins */
  wins?: number | null;
  /** Number of losses */
  losses?: number | null;
  /** Number of pushes */
  pushes?: number | null;
  /** Win rate as decimal */
  win_rate?: number | null;
  /** Return on investment as decimal */
  roi?: number | null;
  /** Average confidence */
  avg_confidence?: number | null;
  /** Results by confidence bucket */
  results_by_confidence?: any;
  /** Results over time */
  results_over_time?: any;
}

export interface EvaluatePerformanceRequest {
  /** Season to evaluate (format "YYYY-YY", e.g., "2024-25"). Allowed range 2020-21 to 2025-26. */
  season?: string;
}

export interface PreviewFactorInput {
  /** ID of the factor */
  factor_id: number;
  importance?: any;
  /** Weight (0-100) */
  weight?: number;
  /** Factor parameters */
  parameters?: Record<string, any>;
}

export interface PreviewRequest {
  bet_type: any;
  mode: any;
  sport?: any;
  advanced_config?: any;
  /** Factors for the preview */
  factors: any[];
  /** Start season (format "YYYY-YY", e.g., "2023-24") */
  start_season?: string;
  /** End season (format "YYYY-YY", e.g., "2024-25") */
  end_season?: string;
}

export interface PreviewPrediction {
  /** Game ID */
  game_id?: number;
  /** Game date (YYYY-MM-DD) */
  date?: string  // YYYY-MM-DD;
  home_team?: any;
  away_team?: any;
  /** Market line value */
  market_value?: number;
  predicted_side?: any;
  /** Confidence level */
  confidence?: number;
  /** Model's score for home team */
  home_model_score?: number;
  /** Model's score for away team */
  away_model_score?: number;
}

export interface PreviewOutput {
  historical?: Record<string, any>;
  /** Predictions for upcoming games */
  predictions?: any[];
}

export interface EvaluateOutput {
  /** Whether evaluation completed successfully */
  success?: boolean;
}

export interface GeneratePredictionsOutput {
  /** Number of predictions generated */
  count?: number;
}

export interface Job {
  /** Unique job identifier (UUID) */
  id?: string;
  /** ID of the associated model (null for preview jobs) */
  model_id?: number | null;
  job_type?: any;
  status?: any;
  /** Job output (structure depends on job_type) */
  output?: any;
  /** Error message if status is failed */
  error_message?: string | null;
  /** Timestamp when job was created */
  created_at?: string  // ISO 8601 datetime;
  /** Timestamp when job started processing */
  started_at?: string | null;
  /** Timestamp when job completed */
  completed_at?: string | null;
}

// ===== API Response Types =====

export interface ApiResponse<T = any> {
  data: T;
  meta?: CursorPagination | OffsetPagination;
}

export interface ApiError {
  error: string;
  status?: number;
}

// ===== Enums =====

export enum Sport {
  NBA = "nba",
  NFL = "nfl",
  NHL = "nhl",
  MLB = "mlb",
}

export enum BetType {
  SPREAD = "spread",
  MONEYLINE = "moneyline",
  OVER_UNDER = "over_under",
}

export enum ModelMode {
  SIMPLE = "simple",
  WEIGHTED = "weighted",
}

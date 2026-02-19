# Ball Don't Lie Lab API Reference

**Version:** 1.0.0
**Base URL:** https://api.balldontlie.io

## Table of Contents

- [Factors](#factors)
- [Jobs](#jobs)
- [Models](#models)
- [Performance](#performance)
- [Predictions](#predictions)

## Factors

### List all factors

**Method:** `GET`  
**Path:** `/lab/v1/factors`

Returns all available factors for building prediction models.
Factors are pre-built analytical components that can be combined to create models.


**Parameters:**

- `category` (optional): Filter by factor category (team_performance, matchup, situational, player, market)
- `sport` (optional): Filter by sport (default nba)

---

### Get a factor

**Method:** `GET`  
**Path:** `/lab/v1/factors/{id}`

Returns details of a specific factor.

**Parameters:**

- `id` (required): Factor ID

---

## Jobs

### Get job status

**Method:** `GET`  
**Path:** `/lab/v1/jobs/{id}`

Returns the status and output of a background job.
Poll this endpoint until status is "completed" or "failed".


**Parameters:**

- `id` (required): Job ID (UUID)

---

### Cancel a job

**Method:** `DELETE`  
**Path:** `/lab/v1/jobs/{id}`

Cancels a pending or running job. Only jobs with status "pending" or "running" can be cancelled.
Cancelled jobs have their status set to "cancelled" with error message "Cancelled by user".


**Parameters:**

- `id` (required): Job ID (UUID)

---

### Get active jobs for a model

**Method:** `GET`  
**Path:** `/lab/v1/models/{id}/jobs/active`

Returns all pending and running jobs for a specific model.
Used to determine if a model has jobs in progress that would prevent new jobs from being created.


**Parameters:**

- `id` (required): Model ID

---

## Models

### List user's models

**Method:** `GET`  
**Path:** `/lab/v1/models`

Returns all models owned by the authenticated user.

**Parameters:**

- `sport` (optional): Filter by sport
- `bet_type` (optional): Filter by bet type
- `per_page` (optional): Number of results per page
- `cursor` (optional): Cursor for pagination

---

### Create a model

**Method:** `POST`  
**Path:** `/lab/v1/models`

Creates a new prediction model.

For weighted mode, factor weights must sum to 100.


**Request Body:**

```json
// See API documentation for schema
```

---

### Get a model

**Method:** `GET`  
**Path:** `/lab/v1/models/{id}`

Returns details of a specific model owned by the user.

**Parameters:**

- `id` (required): Model ID

---

### Update a model

**Method:** `PUT`  
**Path:** `/lab/v1/models/{id}`

Updates an existing model.

For weighted mode, factor weights must sum to 100.

**Note:** Editing factors, mode, bet_type, or advanced_config clears any existing performance data.


**Parameters:**

- `id` (required): Model ID

**Request Body:**

```json
// See API documentation for schema
```

---

### Delete a model

**Method:** `DELETE`  
**Path:** `/lab/v1/models/{id}`

Deletes a model and all associated data (predictions, performance, jobs).

**Parameters:**

- `id` (required): Model ID

---

## Performance

### Create preview job

**Method:** `POST`  
**Path:** `/lab/v1/performance/preview`

Creates a background job to preview model performance without saving.
Returns historical performance and predictions for upcoming games.
Poll the job endpoint to get results.


**Request Body:**

```json
// See API documentation for schema
```

---

### Get model performance

**Method:** `GET`  
**Path:** `/lab/v1/models/{id}/performance`

Returns performance evaluation results for a model.
Returns null if evaluation has not been run yet.


**Parameters:**

- `id` (required): Model ID

---

### Trigger performance evaluation

**Method:** `POST`  
**Path:** `/lab/v1/models/{id}/performance`

Creates a background job to run performance evaluation for a model against historical data.
Returns immediately with a job object - poll the job endpoint to get results.
Clears any existing performance data before running.

**Season Format:** "YYYY-YY" (e.g., "2024-25")
**Allowed Seasons:** 2020-21 through 2025-26

**Note:** Only one evaluation job can run per model at a time. If a pending or running
evaluation job already exists, a 409 Conflict is returned.


**Parameters:**

- `id` (required): Model ID

**Request Body:**

```json
// See API documentation for schema
```

---

### Clear performance data

**Method:** `DELETE`  
**Path:** `/lab/v1/models/{id}/performance`

Clears all performance evaluation data for a model.

**Parameters:**

- `id` (required): Model ID

---

### Get per-game performance details

**Method:** `GET`  
**Path:** `/lab/v1/models/{id}/performance/games`

Returns paginated per-game breakdown of performance evaluation.

**Parameters:**

- `id` (required): Model ID
- `limit` (optional): Number of results per page
- `offset` (optional): Number of results to skip
- `result` (optional): Filter by result

---

## Predictions

### List predictions for a model

**Method:** `GET`  
**Path:** `/lab/v1/predictions`

Returns predictions for a specific model with game details.

**Parameters:**

- `model_id` (required): Model ID (required)
- `result` (optional): Filter by result (win, loss, push)
- `start_date` (optional): Filter by start date (ISO8601)
- `end_date` (optional): Filter by end date (ISO8601)
- `per_page` (optional): Number of results per page
- `cursor` (optional): Cursor for pagination

---

### Get prediction statistics

**Method:** `GET`  
**Path:** `/lab/v1/predictions/stats`

Returns aggregate statistics for a model's predictions.

**Parameters:**

- `model_id` (required): Model ID (required)

---

### Get a prediction

**Method:** `GET`  
**Path:** `/lab/v1/predictions/{id}`

Returns details of a specific prediction.

**Parameters:**

- `id` (required): Prediction ID

---

### Generate predictions

**Method:** `POST`  
**Path:** `/lab/v1/models/{id}/predictions/generate`

Creates a background job to generate predictions for upcoming games.
Poll the job endpoint to get results.

**Note:** Only one prediction generation job can run per model at a time. If a pending
or running job already exists, a 409 Conflict is returned.


**Parameters:**

- `id` (required): Model ID

---

# OpenAPI Integration Guide

## Overview

This project is fully integrated with the **Ball Don't Lie Lab OpenAPI specification**, providing:
- ✅ Complete API documentation in the dashboard
- ✅ Auto-generated TypeScript types
- ✅ API coverage validation
- ✅ Interactive API documentation UI

---

## 📁 Files Structure

```
webapp/
├── openapi-full.yaml                    # Complete OpenAPI 3.1 specification
├── API_REFERENCE.md                     # Generated Markdown reference
├── backend/
│   ├── openapi_integration.py          # Integration tooling
│   └── bdl_client.py                   # Python API client (73.7% coverage)
└── frontend/
    ├── src/
    │   ├── types/
    │   │   └── api.ts                  # Auto-generated TypeScript types
    │   └── pages/
    │       └── ApiDocs.jsx             # Interactive API documentation
    └── ...
```

---

## 🎯 Features

### 1. **Interactive API Documentation** (`/api-docs`)

Beautiful, searchable API documentation built into the dashboard:

- **Categorized Endpoints**: Organized by Factors, Models, Predictions, Performance, Jobs
- **Method Badges**: Color-coded HTTP methods (GET, POST, PATCH, DELETE)
- **Live Examples**: Copy-paste ready cURL commands with your API key
- **Parameter Details**: Type information, required/optional flags, descriptions
- **Search**: Quick filtering across all endpoints

**Access:** Visit https://3003-i89pt90gl83mn7gkol6v2-dfc00ec5.sandbox.novita.ai/api-docs

### 2. **TypeScript Type Definitions**

Auto-generated TypeScript interfaces from OpenAPI schemas:

```typescript
// frontend/src/types/api.ts

export interface Factor {
  id?: number;
  slug?: string;
  name?: string;
  sport?: string;
  category?: string;
  description?: string;
  // ... and more
}

export interface Model {
  id?: number;
  name?: string;
  sport?: string;
  bet_type?: string;
  factors?: ModelFactor[];
  // ... and more
}

export enum Sport {
  NBA = "nba",
  NFL = "nfl",
  NHL = "nhl",
  MLB = "mlb",
}
```

**Benefits:**
- Type-safe API calls
- IntelliSense in VSCode
- Compile-time error checking
- Auto-complete for API responses

### 3. **API Coverage Validation**

The `openapi_integration.py` script validates that the Python client covers all API endpoints:

```bash
python3 backend/openapi_integration.py
```

**Current Coverage:** 14/19 endpoints (73.7%)

**Covered Endpoints:**
- ✅ GET /lab/v1/factors
- ✅ GET /lab/v1/factors/{id}
- ✅ GET /lab/v1/models
- ✅ GET /lab/v1/models/{id}
- ✅ DELETE /lab/v1/models/{id}
- ✅ GET /lab/v1/predictions
- ✅ GET /lab/v1/predictions/stats
- ✅ GET /lab/v1/predictions/{id}
- ✅ GET /lab/v1/models/{id}/performance
- ✅ DELETE /lab/v1/models/{id}/performance
- ✅ GET /lab/v1/models/{id}/performance/games
- ✅ GET /lab/v1/jobs/{id}
- ✅ DELETE /lab/v1/jobs/{id}
- ✅ GET /lab/v1/models/{id}/jobs/active

**Missing Endpoints:**
- ❌ POST /lab/v1/models (create model)
- ❌ PUT /lab/v1/models/{id} (update model)
- ❌ POST /lab/v1/models/{id}/predictions/generate
- ❌ POST /lab/v1/performance/preview
- ❌ POST /lab/v1/models/{id}/performance

### 4. **Markdown API Reference**

Complete API documentation in Markdown format:

```bash
# View the reference
cat API_REFERENCE.md
```

**Includes:**
- Table of contents
- Endpoint grouping by category
- Method and path for each endpoint
- Parameter documentation
- Request/response examples

---

## 🚀 Usage

### View API Docs in Dashboard

1. Navigate to the dashboard
2. Click **"API Docs"** in the sidebar
3. Browse endpoints by category
4. Click an endpoint to see details
5. Copy cURL examples with your API key pre-filled

### Use TypeScript Types in Frontend

```typescript
import { Factor, Model, Sport, BetType } from './types/api';

// Type-safe API calls
const fetchFactors = async (sport: Sport): Promise<Factor[]> => {
  const response = await fetch(
    `https://api.balldontlie.io/lab/v1/factors?sport=${sport}`,
    {
      headers: { Authorization: apiKey }
    }
  );
  return response.json();
};

// Type-safe model creation
const createModel = async (model: Partial<Model>) => {
  // TypeScript ensures correct structure
};
```

### Regenerate Types After OpenAPI Updates

```bash
cd /home/user/webapp

# Update openapi-full.yaml with new spec
# Then run:
python3 backend/openapi_integration.py

# This regenerates:
# - frontend/src/types/api.ts
# - API_REFERENCE.md
# And validates client coverage
```

---

## 📊 OpenAPI Specification Details

### Version
- **OpenAPI:** 3.1.0
- **API Version:** 1.0.0
- **Base URL:** https://api.balldontlie.io

### Authentication
- **Type:** API Key
- **Header:** `Authorization`
- **Format:** Raw key or `Bearer <key>`

### Rate Limits
- **Requests per minute:** 100
- **Headers returned:**
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Supported Sports
- 🏀 NBA (`nba`)
- 🏈 NFL (`nfl`)
- 🏒 NHL (`nhl`)
- ⚾ MLB (`mlb`)

### Bet Types
- Point Spread (`spread`)
- Moneyline (`moneyline`)
- Over/Under (`over_under`)

### Model Modes
- Simple (`simple`) - Low/Medium/High importance
- Weighted (`weighted`) - Percentage-based (sum to 100%)

---

## 🔧 Integration Tools

### OpenAPI Integration Script

**File:** `backend/openapi_integration.py`

**Features:**
- Loads and validates OpenAPI YAML
- Generates TypeScript type definitions
- Creates Markdown API reference
- Validates Python client coverage
- Reports missing endpoints

**Usage:**
```bash
python3 backend/openapi_integration.py
```

**Dependencies:**
```bash
pip install pyyaml
```

### Type Generation

The script extracts OpenAPI schemas and converts them to TypeScript interfaces:

- Maps OpenAPI types to TypeScript types
- Preserves descriptions as JSDoc comments
- Handles union types (e.g., `number | null`)
- Generates enums for known values
- Creates generic response wrappers

### Coverage Validation

Analyzes the Python client to determine which endpoints are implemented:

- Parses OpenAPI paths and methods
- Searches client code for matching implementations
- Reports coverage percentage
- Lists missing endpoints

---

## 🎨 API Documentation UI

### Features

**Sidebar Navigation:**
- Categorized endpoints
- Method badges (GET=blue, POST=green, PATCH=yellow, DELETE=red)
- Active endpoint highlighting
- Smooth animations

**Main Content:**
- Endpoint header with method and path
- Parameter documentation with types
- Request body schemas
- Copy-to-clipboard cURL examples
- Pre-filled with your API key

**Search:**
- Real-time filtering
- Searches across titles, paths, and descriptions
- Instant results

**Design:**
- Dark theme matching dashboard
- Glassmorphism effects
- Framer Motion animations
- Responsive layout
- Mobile-friendly

---

## 📚 API Reference Quick Links

### Factors
- `GET /lab/v1/factors` - List all factors
- `GET /lab/v1/factors/{id}` - Get factor details

### Models
- `GET /lab/v1/models` - List models
- `POST /lab/v1/models` - Create model
- `GET /lab/v1/models/{id}` - Get model
- `PUT /lab/v1/models/{id}` - Update model
- `DELETE /lab/v1/models/{id}` - Delete model

### Predictions
- `GET /lab/v1/predictions` - List predictions
- `GET /lab/v1/predictions/{id}` - Get prediction
- `GET /lab/v1/predictions/stats` - Prediction stats
- `POST /lab/v1/models/{id}/predictions/generate` - Generate predictions

### Performance
- `GET /lab/v1/models/{id}/performance` - Get performance
- `POST /lab/v1/models/{id}/performance` - Run backtest
- `DELETE /lab/v1/models/{id}/performance` - Clear performance
- `GET /lab/v1/models/{id}/performance/games` - Per-game results

### Jobs
- `GET /lab/v1/jobs/{id}` - Job status
- `DELETE /lab/v1/jobs/{id}` - Cancel job
- `GET /lab/v1/models/{id}/jobs/active` - Active jobs

---

## 🔄 Keeping Integration Updated

### When OpenAPI Spec Changes

1. **Replace the spec file:**
   ```bash
   cp /path/to/new/openapi.yaml /home/user/webapp/openapi-full.yaml
   ```

2. **Regenerate types and docs:**
   ```bash
   python3 backend/openapi_integration.py
   ```

3. **Review coverage report:**
   - Check for new endpoints
   - Update Python client if needed
   - Update frontend API calls

4. **Update API Docs UI:**
   - Add new endpoints to `ApiDocs.jsx`
   - Update categories if needed
   - Add new parameters or body schemas

5. **Commit changes:**
   ```bash
   git add openapi-full.yaml frontend/src/types/api.ts API_REFERENCE.md
   git commit -m "chore: Update OpenAPI spec to v[version]"
   ```

---

## 🎯 Best Practices

### Using Types in Frontend

```typescript
// ✅ Good: Type-safe API calls
import { Factor, ApiResponse } from './types/api';

async function fetchFactors(): Promise<ApiResponse<Factor[]>> {
  const response = await fetch(url, { headers });
  return response.json();
}

// ❌ Bad: No type safety
async function fetchFactors(): Promise<any> {
  // ...
}
```

### Error Handling

```typescript
import { ApiError } from './types/api';

try {
  const data = await fetchFactors();
} catch (error) {
  const apiError = error as ApiError;
  console.error(apiError.error);
}
```

### Enum Usage

```typescript
import { Sport, BetType } from './types/api';

// Type-safe sport selection
const sport: Sport = Sport.NBA;  // ✅
const sport = 'nba';              // ❌ No type checking
```

---

## 🔗 Resources

- **OpenAPI Spec:** `/home/user/webapp/openapi-full.yaml`
- **TypeScript Types:** `/home/user/webapp/frontend/src/types/api.ts`
- **API Reference:** `/home/user/webapp/API_REFERENCE.md`
- **Integration Script:** `/home/user/webapp/backend/openapi_integration.py`
- **API Docs UI:** https://3003-i89pt90gl83mn7gkol6v2-dfc00ec5.sandbox.novita.ai/api-docs
- **Official Docs:** https://lab.balldontlie.io/docs/

---

## ✨ Summary

This project provides **complete OpenAPI integration** with:

✅ Interactive API documentation in the dashboard  
✅ Auto-generated TypeScript types for type safety  
✅ Markdown API reference for offline docs  
✅ Coverage validation for Python client  
✅ Tools to keep integration updated  

**Next Steps:**
1. Explore the API docs at `/api-docs` in the dashboard
2. Use generated types in your frontend code
3. Review coverage report and implement missing endpoints
4. Keep OpenAPI spec updated as API evolves

Happy coding! 🚀

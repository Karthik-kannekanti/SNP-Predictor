# GenomicAI Insights: Clincal SNP Pathogenicity Predictor

A production-ready, full-stack web application for an AI-based Missense SNP Pathogenicity Predictor designed for clinical genomics workflows. 
It accepts variants, extracts features, runs a pre-trained XGBoost model, provides predictions with bootstrapped confidence intervals, and explains the results using SHAP values.

## System Architecture
* **Backend**: FastAPI, Python 3.11, Pydantic v2, XGBoost, SHAP
* **Frontend**: Next.js 14 (App Router), React Query, Recharts, TailwindCSS, shadcn/ui
* **Deployment**: Docker, Docker Compose, Nginx

## Deployment Instructions

1. **Clone/Setup Repository**: This project assumes the directory structure provided.
2. **Environment Variables**: Modify `./backend/.env` according to your production settings if necessary (default provided in `backend/app/core/config.py`).
3. **Launch Docker Compose**:
   ```bash
   docker-compose up --build -d
   ```
4. **Access the App**:
   - Frontend web application: `http://localhost:3000` (or `http://localhost/` via Nginx reversed proxy on port 80).
   - FastAPI Backend Swagger UI: `http://localhost:8000/api/v1/openapi.json` or `http://localhost:8000/docs` (if enabled).

### Testing the Application locally without Docker

**Backend setup**:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

**Frontend setup**:
```bash
cd frontend
npm install
npm install @radix-ui/react-progress  # Make sure all deps are installed
npm run dev
```

## Sample API Requests

### 1. Health Endpoint
```bash
curl -X GET "http://localhost:8000/api/v1/health"
```

### 2. Predict Single Endpoint
```bash
curl -X POST "http://localhost:8000/api/v1/predict-single" \
     -H "Content-Type: application/json" \
     -d '{
       "gene": "BRCA1",
       "cdna_change": "c.181T>G",
       "protein_change": "p.Cys61Gly"
     }'
```

### Response Example:
```json
{
  "variant_id": "BRCA1:c.181T>G",
  "probability": 0.82,
  "classification": "Pathogenic",
  "confidence_interval": [0.72, 0.92],
  "shap_explanation": {
    "base_value": 0.5,
    "features": [
      {"feature": "conservation_score", "importance": 0.15},
      {"feature": "gnomad_maf", "importance": 0.08}
    ],
    "summary_text": "The model prediction was heavily influenced by conservation_score, which increased the pathogenic probability."
  },
  "structural_impact": "High likelihood of destabilizing protein core.",
  "warning_flags": []
}
```

## Dummy Data / Model Loader
A simulated XGBoost model and feature extraction is used currently to demonstrate a fully functional pipeline. Replace the `ModelInference` and `FeatureExtractor` logic to integrate the real pre-trained weights (`/app/models/xgboost_model.json`) and database calls.  The system automatically generates a deterministic dummy model using the variant details to provide reproducible outputs for demonstration.

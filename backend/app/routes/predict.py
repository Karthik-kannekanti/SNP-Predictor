from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from app.schemas.variant import SingleVariantRequest, PredictionResponse
from app.services.feature_extractor import feature_extractor
from app.services.model_inference import model_inference
from app.services.shap_explainer import shap_explainer
import time

router = APIRouter()

@router.post("/predict-single", response_model=PredictionResponse)
async def predict_single(variant: SingleVariantRequest):
    """
    Predict pathogenicity for a single variant.
    """
    start_time = time.time()
    
    # 1. Feature Extraction
    features = feature_extractor.extract_features(variant.gene, variant.protein_change)
    
    # 2. Model Inference
    prediction = model_inference.predict(features)
    
    # 3. SHAP Explanation
    explanation = shap_explainer.explain(features)
    
    # Structural impact summary logic
    structural_impact = None
    if features['structural_proxy'].iloc[0] > 0.8:
        structural_impact = "High likelihood of destabilizing protein core."
        
    return PredictionResponse(
        variant_id=f"{variant.gene}:{variant.cdna_change}",
        probability=prediction["probability"],
        classification=prediction["classification"],
        confidence_interval=[prediction["ci_lower"], prediction["ci_upper"]],
        shap_explanation=explanation,
        structural_impact=structural_impact,
        warning_flags=[] if features['domain_annotation'].iloc[0] == 1 else ["No explicit active domain mapped."]
    )

@router.post("/predict-batch")
async def predict_batch(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    VCF Upload: Max 10MB async processing job queue handling.
    In real system, we'd use Celery/Redis for job queueing. Here we simulate it.
    """
    job_id = f"job_{int(time.time())}"
    
    # Simulate processing in background
    def process_vcf(filename):
        time.sleep(5)
        print(f"Finished processing {filename}")
        
    background_tasks.add_task(process_vcf, file.filename)
    
    return {"message": "Batch processing started.", "job_id": job_id}

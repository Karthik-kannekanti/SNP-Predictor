from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SingleVariantRequest(BaseModel):
    gene: str = Field(..., example="BRCA1", description="Gene symbol")
    cdna_change: str = Field(..., example="c.181T>G", description="Transcript change")
    protein_change: str = Field(..., example="p.Cys61Gly", description="Protein change")

class FeatureImportance(BaseModel):
    feature: str
    importance: float
    description: Optional[str] = None

class ShapExplanation(BaseModel):
    base_value: float
    features: List[FeatureImportance]
    summary_text: str

class PredictionResponse(BaseModel):
    variant_id: str
    probability: float = Field(..., description="Probability of being pathogenic (0.0 to 1.0)")
    classification: str = Field(..., description="Benign or Pathogenic")
    confidence_interval: List[float] = Field(..., description="Lower and upper bounds of 95% CI")
    shap_explanation: Optional[ShapExplanation] = None
    structural_impact: Optional[str] = None
    warning_flags: Optional[List[str]] = None

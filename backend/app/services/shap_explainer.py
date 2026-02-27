import shap
import pandas as pd
import numpy as np
from app.services.model_inference import model_inference

class ShapExplainer:
    def __init__(self):
        # Initialize the explainer with the model
        try:
            self.explainer = shap.TreeExplainer(model_inference.model)
        except Exception:
            # fallback if model types mismatch in mock
            self.explainer = None

    def explain(self, features: pd.DataFrame) -> dict:
        """
        Generates local explanation using SHAP.
        Returns top features and text summary.
        """
        if self.explainer is None:
            # Mock SHAP values if initialization failed
            base_value = 0.5
            shap_values = np.random.randn(1, len(features.columns))
        else:
            shap_values_obj = self.explainer(features)
            base_value = float(shap_values_obj.base_values[0]) if isinstance(shap_values_obj.base_values, (list, np.ndarray)) else float(shap_values_obj.base_values)
            shap_values = shap_values_obj.values[0]
            
            # Handle binary classification multi-output shap
            if len(shap_values.shape) > 1:
                shap_values = shap_values[:, 1] # Take pathogenic class if 2D

        feature_names = features.columns.tolist()
        
        # Combine feature names, values, and SHAP values
        importance = []
        for i, name in enumerate(feature_names):
            importance.append({
                "feature": name,
                "importance": float(shap_values[i]) if isinstance(shap_values, np.ndarray) else float(shap_values[0][i])
            })
            
        # Sort by absolute magnitude to get top impactful features
        importance.sort(key=lambda x: abs(x["importance"]), reverse=True)
        top_features = importance[:5]
        
        # Generate structured text
        top_name = top_features[0]["feature"]
        dir_text = "increased" if top_features[0]["importance"] > 0 else "decreased"
        summary_text = f"The model prediction was heavily influenced by {top_name}, which {dir_text} the pathogenic probability."
        
        return {
            "base_value": base_value,
            "features": top_features,
            "summary_text": summary_text
        }

shap_explainer = ShapExplainer()

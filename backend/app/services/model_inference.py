import xgboost as xg
import numpy as np
import pandas as pd
import os
import pickle
from app.services.feature_extractor import feature_extractor

class ModelInference:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        """
        Load XGBoost model from disk.
        For demonstration, if it doesn't exist, we create and train a dummy model.
        """
        model_path = "/app/models/xgboost_model.json"
        if not os.path.exists("/app/models"):
            os.makedirs("/app/models", exist_ok=True)
            
        if os.path.exists(model_path):
            self.model = xg.XGBClassifier()
            self.model.load_model(model_path)
        else:
            # Create a mock model for the sake of having a runnable app
            print("Creating a mock XGBoost model since none was found.")
            X_dummy = pd.DataFrame(np.random.rand(100, 6), columns=feature_extractor.feature_names)
            y_dummy = np.random.randint(0, 2, 100)
            self.model = xg.XGBClassifier()
            self.model.fit(X_dummy, y_dummy)
            self.model.save_model(model_path)

    def predict(self, features: pd.DataFrame) -> dict:
        """
        Runs model inference on extracted features.
        Returns pathogenic probability and calibration metrics.
        """
        # Ensure correct column order
        features = features[self.model.feature_names_in_] if hasattr(self.model, 'feature_names_in_') else features
        
        # Inference
        proba_pathogenic = float(self.model.predict_proba(features)[0][1])
        
        # Mock Bootstrapped CI Estimation
        # Real CI would involve bootstrapping or quantile regression
        ci_lower = max(0.0, proba_pathogenic - 0.1)
        ci_upper = min(1.0, proba_pathogenic + 0.1)
        
        return {
            "probability": proba_pathogenic,
            "classification": "Pathogenic" if proba_pathogenic >= 0.5 else "Benign",
            "ci_lower": ci_lower,
            "ci_upper": ci_upper
        }

model_inference = ModelInference()

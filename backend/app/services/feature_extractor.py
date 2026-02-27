import pandas as pd
import numpy as np

class FeatureExtractor:
    """
    Mock Feature Extraction Layer.
    In a real scenario, this would interface with an external database or API
    to get features like gnomAD MAF, BLOSUM62, Conservation scores, etc.
    """
    def __init__(self):
        # Feature names expected by the model
        self.feature_names = [
            'conservation_score',
            'blosum62',
            'grantham_dist',
            'gnomad_maf',
            'domain_annotation',
            'structural_proxy'
        ]

    def extract_features(self, gene: str, protein_change: str) -> pd.DataFrame:
        """
        Extract features for a given gene and protein change.
        Returns a Pandas DataFrame formatted for XGBoost.
        """
        # Mocking the feature values
        # We try to generate somewhat deterministic values based on hash of gene/change
        # to simulate reproducible feature extraction
        seed_value = sum(ord(c) for c in (gene + protein_change))
        np.random.seed(seed_value)
        
        features = {
            'conservation_score': np.random.uniform(0.0, 1.0),
            'blosum62': np.random.randint(-4, 11),
            'grantham_dist': np.random.randint(5, 215),
            'gnomad_maf': np.random.beta(0.1, 10.0), # right-skewed, most are small
            'domain_annotation': np.random.choice([0, 1]),
            'structural_proxy': np.random.uniform(0.0, 1.0)
        }
        
        return pd.DataFrame([features])

feature_extractor = FeatureExtractor()

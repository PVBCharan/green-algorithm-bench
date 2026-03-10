"""
LightGBM Model for Stock Prediction
"""

import numpy as np
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class LightGBMModel:
    """LightGBM Gradient Boosting Regressor."""

    def __init__(self, n_estimators=100, learning_rate=0.1, num_leaves=31, random_state=42):
        self.model = LGBMRegressor(
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            num_leaves=num_leaves,
            random_state=random_state,
            verbose=-1,
            n_jobs=-1
        )
        self.name = "LightGBM"

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)

    def predict(self, X_test):
        return self.model.predict(X_test)

    def evaluate(self, y_true, y_pred):
        return {
            "mae": round(float(mean_absolute_error(y_true, y_pred)), 4),
            "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 4),
            "r2": round(float(r2_score(y_true, y_pred)), 4),
        }

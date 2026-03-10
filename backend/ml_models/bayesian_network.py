"""
Bayesian Network (Bayesian Ridge Regression) Model for Stock Prediction

Uses BayesianRidge from scikit-learn — a probabilistic regression model
that provides uncertainty estimates, suitable for continuous stock prediction.
"""

import numpy as np
from sklearn.linear_model import BayesianRidge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class BayesianNetworkModel:
    """Bayesian Ridge Regression using scikit-learn (probabilistic approach)."""

    def __init__(self):
        self.model = BayesianRidge()
        self.name = "BayesianNetwork"

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

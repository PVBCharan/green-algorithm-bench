"""
K-Nearest Neighbors Model for Stock Prediction
"""

import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class KNNModel:
    """KNN Regressor using scikit-learn."""

    def __init__(self, n_neighbors=5):
        self.model = KNeighborsRegressor(n_neighbors=n_neighbors)
        self.name = "KNN"

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

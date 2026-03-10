"""
Support Vector Regression (SVR) Model for Stock Prediction
"""

import numpy as np
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class SVRModel:
    """Support Vector Regressor with RBF kernel using scikit-learn."""

    def __init__(self, kernel="rbf", C=1.0, epsilon=0.1):
        self.model = SVR(kernel=kernel, C=C, epsilon=epsilon)
        self.name = "SVR"

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

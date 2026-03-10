"""
ML Models Registry

Maps algorithm names to their model classes for the benchmark runner.
"""

from ml_models.linear_regression import LinearRegressionModel
from ml_models.knn import KNNModel
from ml_models.random_forest import RandomForestModel
from ml_models.xgboost_model import XGBoostModel
from ml_models.lightgbm_model import LightGBMModel
from ml_models.svr_model import SVRModel
from ml_models.bayesian_network import BayesianNetworkModel

# Deep learning models - optional (large dependencies)
try:
    from ml_models.cnn_model import CNNModel
    _CNN_AVAILABLE = True
except ImportError:
    _CNN_AVAILABLE = False

try:
    from ml_models.lstm_model import LSTMModel
    _LSTM_AVAILABLE = True
except ImportError:
    _LSTM_AVAILABLE = False

try:
    from ml_models.dqn_model import DQNModel
    _DQN_AVAILABLE = True
except ImportError:
    _DQN_AVAILABLE = False


def get_model_registry():
    """
    Return the full model registry with available models.

    Returns:
        dict: mapping of algorithm name -> model class
    """
    registry = {
        "LinearRegression": LinearRegressionModel,
        "KNN": KNNModel,
        "RandomForest": RandomForestModel,
        "XGBoost": XGBoostModel,
        "LightGBM": LightGBMModel,
        "SVR": SVRModel,
        "BayesianNetwork": BayesianNetworkModel,
    }

    if _CNN_AVAILABLE:
        registry["CNN"] = CNNModel
    if _LSTM_AVAILABLE:
        registry["LSTM"] = LSTMModel
    if _DQN_AVAILABLE:
        registry["DQN"] = DQNModel

    return registry


MODEL_REGISTRY = get_model_registry()

AVAILABLE_ALGORITHMS = list(MODEL_REGISTRY.keys())

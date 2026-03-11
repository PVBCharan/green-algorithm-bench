"""
DQN (Deep Q-Network) Model for Stock Prediction

Simplified DQN agent that learns price movement patterns.
Uses PyTorch for the neural network. Predicts the next-day price
by learning value function of price states.
"""

import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

try:
    import torch
    import torch.nn as nn
    import torch.optim as optim

    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False


class _DQNNetwork(nn.Module):
    """Simple feedforward network for DQN value estimation."""

    def __init__(self, input_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
        )

    def forward(self, x):
        return self.net(x)


class DQNModel:
    """
    DQN-based regression for stock price prediction using PyTorch.

    This is a simplified adaptation — instead of full RL with environment/actions,
    the DQN network is trained to directly predict the next-day price,
    leveraging the deep Q-network architecture for function approximation.
    """

    def __init__(self, epochs=30, learning_rate=0.001, batch_size=32):
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch is required for DQN model")
        self.model = None
        self.epochs = epochs
        self.lr = learning_rate
        self.batch_size = batch_size
        self.name = "DQN"

    def train(self, X_train, y_train):
        input_dim = X_train.shape[1]
        self.model = _DQNNetwork(input_dim)
        optimizer = optim.Adam(self.model.parameters(), lr=self.lr)
        criterion = nn.MSELoss()

        X_tensor = torch.FloatTensor(X_train)
        y_tensor = torch.FloatTensor(y_train).unsqueeze(1)

        dataset = torch.utils.data.TensorDataset(X_tensor, y_tensor)
        loader = torch.utils.data.DataLoader(
            dataset, batch_size=self.batch_size, shuffle=True
        )

        self.model.train()
        for epoch in range(self.epochs):
            for batch_X, batch_y in loader:
                optimizer.zero_grad()
                predictions = self.model(batch_X)
                loss = criterion(predictions, batch_y)
                loss.backward()
                optimizer.step()

    def predict(self, X_test):
        self.model.eval()
        with torch.no_grad():
            X_tensor = torch.FloatTensor(X_test)
            predictions = self.model(X_tensor).numpy().flatten()
        return predictions

    def evaluate(self, y_true, y_pred):
        mape = float(np.mean(np.abs((y_true - y_pred) / np.where(y_true == 0, 1, y_true))) * 100)
        return {
            "mae": round(float(mean_absolute_error(y_true, y_pred)), 4),
            "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 4),
            "r2": round(float(r2_score(y_true, y_pred)), 4),
            "mape": round(mape, 4),
        }

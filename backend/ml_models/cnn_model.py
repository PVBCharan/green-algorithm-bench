"""
CNN (1D Convolutional Neural Network) Model for Stock Prediction

Uses TensorFlow/Keras to build a 1D CNN for time-series regression.
"""

import numpy as np
import os

# Suppress TensorFlow warnings
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import tensorflow as tf

tf.get_logger().setLevel("ERROR")


class CNNModel:
    """1D CNN for time-series stock price prediction using TensorFlow/Keras."""

    def __init__(self, epochs=50, batch_size=32):
        self.model = None
        self.epochs = epochs
        self.batch_size = batch_size
        self.name = "CNN"

    def _build_model(self, input_shape):
        model = tf.keras.Sequential(
            [
                tf.keras.layers.Reshape(
                    (input_shape, 1), input_shape=(input_shape,)
                ),
                tf.keras.layers.Conv1D(
                    filters=64, kernel_size=3, activation="relu", padding="same"
                ),
                tf.keras.layers.Conv1D(
                    filters=32, kernel_size=3, activation="relu", padding="same"
                ),
                tf.keras.layers.GlobalAveragePooling1D(),
                tf.keras.layers.Dense(64, activation="relu"),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.Dense(1),
            ]
        )
        model.compile(optimizer="adam", loss="mse")
        return model

    def train(self, X_train, y_train):
        self.model = self._build_model(X_train.shape[1])
        self.model.fit(
            X_train,
            y_train,
            epochs=self.epochs,
            batch_size=self.batch_size,
            verbose=0,
            validation_split=0.1,
        )

    def predict(self, X_test):
        return self.model.predict(X_test, verbose=0).flatten()

    def evaluate(self, y_true, y_pred):
        return {
            "mae": round(float(mean_absolute_error(y_true, y_pred)), 4),
            "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 4),
            "r2": round(float(r2_score(y_true, y_pred)), 4),
        }

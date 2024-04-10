import os
from dotenv import load_dotenv

env_path = ".env"
load_dotenv(env_path, verbose=True)


class ENV:
    def __init__(self) -> None:
        """Add environment variables here"""
        self.DATABASE_NAME = os.getenv("DATABASE_NAME")
        self.DATABASE_USER = os.getenv("DATABASE_USER")
        self.DATABASE_PWD = os.getenv("DATABASE_PWD")
        self.REDIS_PORT = os.getenv("REDIS_PORT")

env = ENV()
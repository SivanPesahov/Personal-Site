from dotenv import load_dotenv
from app import create_app
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)

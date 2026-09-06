from pathlib import Path

from flask import Flask, jsonify, send_from_directory


BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/api/health")
def health():
    return jsonify(status="ok")


@app.get("/<path:filename>")
def frontend_asset(filename):
    allowed_assets = {"styles.css", "script.js"}
    if filename not in allowed_assets:
        return ("Not found", 404)
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "TB_the_wolf says ram ram"})

if __name__ == '__main__':
    print("✅ Flask API is running on http://127.0.0.1:5000/api/test")
    app.run(debug=True)

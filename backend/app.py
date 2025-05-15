from flask import Flask, request, jsonify
from flask_cors import CORS
from db.login_and_register import login_user, register_user
from utils.graph_builder import build_graph_and_analyze  # ✅ Import the graph analysis logic

app = Flask(__name__)
CORS(app)

# 🔐 Auth endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    success, message = login_user(username, password)
    return jsonify({'success': success, 'message': message})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    success, message = register_user(username, password)
    return jsonify({'success': success, 'message': message})

# 📊 Graph analysis endpoint
@app.route('/api/analyse', methods=['POST'])
def analyse_graph():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data received'}), 400

    try:
        result = build_graph_and_analyze(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("✅ Flask backend running on http://127.0.0.1:5000")
    app.run(debug=True)

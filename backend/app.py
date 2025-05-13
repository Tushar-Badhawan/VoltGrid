from flask import Flask, request, jsonify
from flask_cors import CORS
from db.login_and_register import login_user, register_user

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    print("✅ Flask backend running on http://127.0.0.1:5000")
    app.run(debug=True)

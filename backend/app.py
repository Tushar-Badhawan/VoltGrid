from flask import Flask, request, jsonify
from flask_cors import CORS
from db.login_and_register import login_user, register_user
from utils.graph_builder import build_graph
from utils.graph_connectivity import fix_disconnected_nodes
from utils.fordfulkerson import calculate_max_flow 

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

@app.route('/api/analyse', methods=['POST'])
def analyse_graph():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data received'}), 400
    try:
        graph = build_graph(data)
        fix_disconnected_nodes(graph)

        # ✅ Max Flow Calculation
        result = calculate_max_flow(data)
        total_supply = result['total_supply']
        total_demand = result['total_demand']
        max_flow = result['max_flow']
        fully_satisfied = result['max_flow'] >= result['total_demand']

        # ✅ Console log
        print("\n📊 Analysis Summary:")
        print(f"  Total Supply : {total_supply} kW")
        print(f"  Total Demand : {total_demand} kW")
        print(f"  Max Flow     : {max_flow} kW")
        print("  ✅ Demand Fully Met!" if fully_satisfied else "  ⚠️  Demand NOT Fully Met")

        return jsonify({
            "node_count": graph.number_of_nodes(),
            "edge_count": graph.number_of_edges(),
            "total_supply": total_supply,
            "total_demand": total_demand,
            "max_flow": max_flow,
            "fully_satisfied": fully_satisfied
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(" Flask backend running on http://127.0.0.1:5000")
    app.run(debug=True)

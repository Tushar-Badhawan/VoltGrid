import networkx as nx
import json

def build_graph_and_analyze(data):
    nodes = data['nodes']
    edges = data['edges']

    G = nx.DiGraph()

    # Add nodes with attributes
    for node in nodes:
        node_id = node['id']
        node_type = node['data'].get('type')
        supply = node['data'].get('supply', 0)
        demand = node['data'].get('demand', 0)
        priority = node['data'].get('priority', 0)

        G.add_node(node_id, type=node_type, supply=supply, demand=demand, priority=priority)

    # Add edges (set default capacity, or adjust logic later)
    for edge in edges:
        src = edge['source']
        tgt = edge['target']
        G.add_edge(src, tgt, capacity=1000)

    # ✅ PRINT the constructed graph for backend debugging
    print("\n📥 Received Graph Data:")
    print(json.dumps(data, indent=2))

    print("\n✅ Graph Structure Built:")
    print("Nodes:")
    for n, attr in G.nodes(data=True):
        print(f"  {n}: {attr}")
    print("Edges:")
    for u, v, attr in G.edges(data=True):
        print(f"  {u} -> {v} (capacity={attr['capacity']})")

    # Example summary data for frontend (you can replace with Ford-Fulkerson logic later)
    total_supply = sum(G.nodes[n]['supply'] for n in G if G.nodes[n]['type'] == 'Power Source')
    total_demand = sum(G.nodes[n]['demand'] for n in G if G.nodes[n]['type'] in ['Consumer', 'Hospital', 'School'])

    result = {
        "node_count": G.number_of_nodes(),
        "edge_count": G.number_of_edges(),
        "total_supply": total_supply,
        "total_demand": total_demand
    }

    return result

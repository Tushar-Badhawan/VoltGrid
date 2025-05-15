import json

class VoltGridGraph:
    def __init__(self):
        self.nodes = {}  # node_id -> attribute dict
        self.edges = []  # list of (source, target, capacity)

    def add_node(self, node_id, **attrs):
        self.nodes[node_id] = attrs

    def add_edge(self, source, target, capacity=1000):
        self.edges.append((source, target, capacity))

    def number_of_nodes(self):
        return len(self.nodes)

    def number_of_edges(self):
        return len(self.edges)


def build_graph_and_analyze(data):
    nodes = data['nodes']
    edges = data['edges']

    G = VoltGridGraph()

    # Add nodes with attributes
    for node in nodes:
        node_id = node['id']
        node_type = node['data'].get('type')
        supply = node['data'].get('supply', 0)
        demand = node['data'].get('demand', 0)
        priority = node['data'].get('priority', 0)

        G.add_node(node_id, type=node_type, supply=supply, demand=demand, priority=priority)

    # Add edges (default capacity)
    for edge in edges:
        src = edge['source']
        tgt = edge['target']
        G.add_edge(src, tgt, capacity=1000)

    # ✅ PRINT the constructed graph for backend debugging
    print("\n📥 Received Graph Data:")
    print(json.dumps(data, indent=2))

    print("\n✅ Graph Structure Built:")
    print("Nodes:")
    for n, attr in G.nodes.items():
        print(f"  {n}: {attr}")
    print("Edges:")
    for src, tgt, cap in G.edges:
        print(f"  {src} -> {tgt} (capacity={cap})")

    # Example summary data for frontend
    total_supply = sum(attr['supply'] for attr in G.nodes.values() if attr['type'] == 'Power Source')
    total_demand = sum(attr['demand'] for attr in G.nodes.values() if attr['type'] in ['Consumer', 'Hospital', 'School'])

    result = {
        "node_count": G.number_of_nodes(),
        "edge_count": G.number_of_edges(),
        "total_supply": total_supply,
        "total_demand": total_demand
    }

    return result

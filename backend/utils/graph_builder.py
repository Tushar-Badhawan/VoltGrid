import json
from utils.graph_connectivity import VoltGridGraph  # Importing the correct class from connectivity

def build_graph(data):
    nodes = data['nodes']
    edges = data['edges']

    G = VoltGridGraph()

    for node in nodes:
        nodeId = node['id']
        nodeType = node['data'].get('type')
        supply = node['data'].get('supply', 0)
        demand = node['data'].get('demand', 0)
        priority = node['data'].get('priority', 0)
        position = node.get('position', {'x': 0, 'y': 0})

        G.add_node(nodeId, type=nodeType, supply=supply, demand=demand, priority=priority, position=position)

    for edge in edges:
        src = edge['source']
        tgt = edge['target']
        G.add_edge(src, tgt)

    print("\n📥 Received Graph Data:")
    print(json.dumps(data, indent=2))

    print("\n✅ Constructed Graph:")
    print("Nodes:")
    for n, attr in G.nodes.items():
        print(f"  {n}: {attr}")
    print("Edges:")
    for src, tgt, cap in G.edges:
        print(f"  {src} -> {tgt} (capacity={cap})")

    return G

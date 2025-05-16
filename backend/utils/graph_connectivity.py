from collections import deque

class VoltGridGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = []

    def add_node(self, nodeId, **attrs):
        self.nodes[nodeId] = attrs

    def add_edge(self, source, target, capacity=1000):
        self.edges.append((source, target, capacity))

    def number_of_nodes(self):
        return len(self.nodes)

    def number_of_edges(self):
        return len(self.edges)

def find_nodes_connected(graph, start_node):
    visited = set()
    queue = deque([start_node])

    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            neighbors = [tgt for (src, tgt, _) in graph.edges if src == node]
            neighbors += [src for (src, tgt, _) in graph.edges if tgt == node]
            for neighbor in neighbors:
                if neighbor not in visited:
                    queue.append(neighbor)
    return visited

def get_all_substations(graph):
    return [node for node, data in graph.nodes.items() if data['type'] == 'Substation']

def distance(pos1, pos2):
    return ((pos1['x'] - pos2['x'])**2 + (pos1['y'] - pos2['y'])**2) ** 0.5

def fix_disconnected_nodes(graph):
    all_nodes = set(graph.nodes.keys())
    if not all_nodes:
        return

    start = next(iter(all_nodes))
    connected = find_nodes_connected(graph, start)
    disconnected = all_nodes - connected

    print("\n🔍 Connectivity Check:")
    print(f"Connected nodes: {len(connected)} / {len(all_nodes)}")
    if not disconnected:
        print("✅ Everything’s connected. No worries!")
        return

    print(f"⚠️ Disconnected nodes found: {disconnected}")

    positions = {node: graph.nodes[node].get('position', {'x':0, 'y':0}) for node in graph.nodes}

    subs = get_all_substations(graph)
    if not subs:
        print("❌ Oops! No substations found to connect the disconnected nodes.")
        return

    for node in disconnected:
        pos = positions.get(node, {'x':0, 'y':0})
        nearest_sub = min(subs, key=lambda s: distance(pos, positions.get(s, {'x':0, 'y':0})))
        graph.add_edge(node, nearest_sub)
        print(f"🔗 Connected node {node} to nearest substation {nearest_sub}")

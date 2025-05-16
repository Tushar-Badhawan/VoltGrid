from collections import deque

class MaxFlowGraph:
    def __init__(self):
        self.graph = {}  # adjacency list: node -> list of (neighbor, capacity)
        self.flow = {}   # (u, v) -> current flow

    def add_edge(self, u, v, capacity):
        if u not in self.graph:
            self.graph[u] = []
        if v not in self.graph:
            self.graph[v] = []
        self.graph[u].append((v, capacity))
        self.graph[v].append((u, 0))  # reverse edge with 0 capacity
        self.flow[(u, v)] = 0
        self.flow[(v, u)] = 0

    def bfs(self, source, sink, parent):
        visited = set()
        queue = deque([source])
        visited.add(source)

        while queue:
            u = queue.popleft()
            for v, capacity in self.graph.get(u, []):
                if v not in visited and self.flow[(u, v)] < capacity:
                    parent[v] = u
                    visited.add(v)
                    if v == sink:
                        return True
                    queue.append(v)
        return False

    def ford_fulkerson(self, source, sink):
        parent = {}
        max_flow = 0

        while self.bfs(source, sink, parent):
            # Find the max flow through the path found
            path_flow = float('inf')
            s = sink
            while s != source:
                u = parent[s]
                for v, cap in self.graph[u]:
                    if v == s:
                        path_flow = min(path_flow, cap - self.flow[(u, v)])
                        break
                s = parent[s]

            # Update the flow values
            v = sink
            while v != source:
                u = parent[v]
                self.flow[(u, v)] += path_flow
                self.flow[(v, u)] -= path_flow
                v = parent[v]

            max_flow += path_flow

        return max_flow

def calculate_max_flow(data):
    nodes = data['nodes']
    edges = data['edges']

    G = MaxFlowGraph()

    node_types = {node['id']: node['data'].get('type') for node in nodes}
    supply = {node['id']: node['data'].get('supply', 0) for node in nodes if node['data'].get('type') == 'Power Source'}
    demand = {node['id']: node['data'].get('demand', 0) for node in nodes if node['data'].get('type') in ['Consumer', 'Hospital', 'School']}

    # Add all graph edges with default capacity
    for edge in edges:
        src = edge['source']
        tgt = edge['target']
        G.add_edge(src, tgt, 1000)

    # Create super source and super sink
    super_source = 'SUPER_SOURCE'
    super_sink = 'SUPER_SINK'

    for node, value in supply.items():
        G.add_edge(super_source, node, value)

    for node, value in demand.items():
        G.add_edge(node, super_sink, value)

    maxflow = G.ford_fulkerson(super_source, super_sink)
    return {
        "max_flow": maxflow,
        "total_demand": sum(demand.values()),
        "total_supply": sum(supply.values())
    }

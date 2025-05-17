import json
from collections import deque

class MaxFlowGraph:
    def __init__(self):
        self.graph = {}
        self.flow = {}

    def add_edge(self, u, v, capacity):
        if u not in self.graph:
            self.graph[u] = []
        if v not in self.graph:
            self.graph[v] = []
        self.graph[u].append((v, capacity))
        self.graph[v].append((u, 0))
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
            path_flow = float('inf')
            s = sink
            while s != source:
                u = parent[s]
                for v, cap in self.graph[u]:
                    if v == s:
                        path_flow = min(path_flow, cap - self.flow[(u, v)])
                        break
                s = parent[s]

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

    for edge in edges:
        src = edge['source']
        tgt = edge['target']
        G.add_edge(src, tgt, 1000)

    super_source = 'SUPER_SOURCE'
    super_sink = 'SUPER_SINK'

    for node, value in supply.items():
        G.add_edge(super_source, node, value)

    for node, value in demand.items():
        G.add_edge(node, super_sink, value)

    maxflow = G.ford_fulkerson(super_source, super_sink)

    edge_flows = {}
    for (u, v), flow in G.flow.items():
        if (u.startswith("SUPER_") or v.startswith("SUPER_")):
            continue
        for neighbor, cap in G.graph[u]:
            if neighbor == v:
                edge_flows[f"{u}->{v}"] = {
                    "flow": flow,
                    "capacity": cap
                }
                break

    node_status = {}
    for node in demand:
        incoming = 0
        for u in G.graph.get(node, []):
            src = u[0]
            incoming += G.flow.get((src, node), 0)
        required = demand[node]
        if incoming >= required:
            node_status[node] = "met"
        elif incoming > 0:
            node_status[node] = "partially_met"
        else:
            node_status[node] = "unmet"

    return {
        "max_flow": maxflow,
        "total_demand": sum(demand.values()),
        "total_supply": sum(supply.values()),
        "edge_flows": edge_flows,
        "node_status": node_status
    }

# JSON Graph Data
data = {
  "nodes": [
    {
      "id": "1",
      "type": "default",
      "position": { "x": 440, "y": 169 },
      "data": {
        "label": "Power Source",
        "type": "Power Source",
        "supply": 10
      }
    },
    {
      "id": "2",
      "type": "Substation",
      "position": { "x": 482, "y": 301 },
      "data": {
        "label": "Substation",
        "type": "Substation"
      }
    },
    {
      "id": "3",
      "type": "Consumer",
      "position": { "x": 495, "y": 433 },
      "data": {
        "label": "Consumer",
        "type": "Consumer",
        "demand": 5
      }
    }
  ],
  "edges": [
    {
      "source": "1",
      "sourceHandle": None,
      "target": "2",
      "targetHandle": None,
      "animated": True,
      "id": "reactflow__edge-1-2"
    },
    {
      "source": "2",
      "sourceHandle": "bottom",
      "target": "3",
      "targetHandle": None,
      "animated": True,
      "id": "reactflow__edge-2bottom-3"
    }
  ]
}

# Run the max flow calculation
result = calculate_max_flow(data)
print(json.dumps(result, indent=2))

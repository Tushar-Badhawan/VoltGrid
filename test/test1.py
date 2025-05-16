import json

with open('host.json','r') as file:
    data=json.load(file)

nodes=data["nodes"]

for node in nodes:
    print(f"node: \n", node['id'])
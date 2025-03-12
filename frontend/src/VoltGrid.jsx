import React, { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

const nodeStyles = {
  "Power Source": { background: "#ffebcc", width: 180, height: 60 },
  Substation: { background: "#ccffeb", width: 100, height: 60 },
  Consumer: { background: "#ebccff", width: 80, height: 60, borderRadius: "70px" },
};

const VoltGrid = () => {
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const style = nodeStyles[nodeType] || {};
      const newNode = {
        id: `${nodes.length + 1}`,
        type: "default",
        position,
        data: { label: nodeType },
        style,
        draggable: true,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, project, setNodes]
  );

  const exportGraph = () => {
    const graphData = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([graphData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "voltgrid_graph.json";
    link.click();
  };

  return (
    <div style={{ display: "flex", height: "90vh", width: "100vw" }}>
      <div
        style={{
          width: "200px",
          background: "#f0f0f0",
          padding: "10px",
          textAlign: "center",
          borderRight: "1px solid #ccc",
        }}
      >
        <h3>Drag Nodes</h3>
        {Object.keys(nodeStyles).map((nodeType) => (
          <div
            key={nodeType}
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData("application/reactflow", nodeType)
            }
            style={{
              margin: "10px",
              padding: "10px",
              background: "#fff",
              cursor: "grab",
              border: "1px solid #aaa",
              borderRadius: "5px",
            }}
          >
            {nodeType}
          </div>
        ))}
        <button
          onClick={exportGraph}
          style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
        >
          Export Graph
        </button>
      </div>
      <div
        ref={reactFlowWrapper}
        style={{ flexGrow: 1, position: "relative", border: "1px solid #ddd" }}
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView={false}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

const VoltGridWrapper = () => (
  <ReactFlowProvider>
    <VoltGrid />
  </ReactFlowProvider>
);

export default VoltGridWrapper;

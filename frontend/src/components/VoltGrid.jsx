import React, { useCallback, useRef, useState, useEffect } from "react";
import Analyst from './Analyst';
import { Handle, Position } from "reactflow";
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

// 🔶 Custom Nodes
const ConsumerNode = ({ data }) => (
  <div style={nodeStyle("#ebccff", 80)}>
    {data.label}
    <Handle type="target" position={Position.Top} style={handleStyle} />
  </div>
);

const SubStationNode = ({ data }) => (
  <div style={nodeStyle("#ccffeb", 100)}>
    {data.label}
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle id="left" type="source" position={Position.Left} style={handleStyle} />
    <Handle id="right" type="source" position={Position.Right} style={handleStyle} />
    <Handle id="bottom" type="source" position={Position.Bottom} style={handleStyle} />
  </div>
);

const HospitalNode = ({ data }) => (
  <div style={{ ...nodeStyle("#ffe6e6", 90), border: "2px solid #ff4d4d", flexDirection: "column" }}>
    <div style={{ color: "#e60000", fontSize: "24px" }}>✚</div>
    <div>{data.label || "Hospital"}</div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
  </div>
);

const SchoolNode = ({ data }) => (
  <div style={{ ...nodeStyle("#e6f2ff", 90), border: "2px solid #3399ff", flexDirection: "column" }}>
    <div style={{ fontSize: "20px" }}>📘</div>
    <div>{data.label || "School"}</div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
  </div>
);

const nodeStyle = (bg, width = 80) => ({
  background: bg,
  width,
  height: 60,
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  border: "1px solid #aaa",
  position: "relative",
  flexDirection: "column",
});



const handleStyle = { background: "#555" };

const nodeTypes = {
  Consumer: ConsumerNode,
  Substation: SubStationNode,
  Hospital: HospitalNode,
  School: SchoolNode,
};

const nodeStyles = {
  "Power Source": {
    background: "#ffebcc",
    width: 180,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #aaa",
    textAlign: "center",
  },
};

const VoltGrid = () => {
  const reactFlowWrapper = useRef(null);
  const fileInputRef = useRef(null);
  const { project } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  //selects edge
  const [selectedEdge, setSelectedEdge] = useState(null);

  //selects file
  const [fileSelected, setFileSelected] = useState(false);

  // add metadata
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // analyse
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState({
  maxFlow: 0,
  edgeFlows: {},
  nodeStatus: {},
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setAnalysisError] = useState(null);
  const analysisRef = useRef(null);
   useEffect(() => {if (showAnalysis && analysisRef.current) {
    analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });} 
    }, [showAnalysis]);



  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const isCustom = ["Consumer", "Substation", "Hospital", "School"].includes(nodeType);
      const style = !isCustom ? nodeStyles[nodeType] || {} : undefined;

      const baseData = {
        label: nodeType,
        type: nodeType,
      };

      if (nodeType === "Power Source") baseData.supply = 100;
      if (nodeType === "Consumer") baseData.demand = 10;
      if (nodeType === "Hospital") {
        baseData.demand = 20;
        baseData.priority = 10;
      }
      if (nodeType === "School") {
        baseData.demand = 15;
        baseData.priority = 5;
      }

      const newNode = {
        id: `${nodes.length + 1}`,
        type: isCustom ? nodeType : "default",
        position,
        data: baseData,
        style,
        draggable: true,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, project, setNodes]
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onEdgeClick = (e, edge) => {
    e.stopPropagation();
    setSelectedEdge(edge.id);
  };

  const onPaneClick = () => {
    setSelectedEdge(null);
    setSelectedNodeId(null);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedEdge) {
        setEdges((eds) => eds.filter((e) => e.id !== selectedEdge));
        setSelectedEdge(null);
      }
    },
    [selectedEdge, setEdges]
  );

  const exportGraph = () => {
    const fileName = prompt("Enter filename:", "voltgrid_graph");
    if (!fileName) return;
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    link.click();
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setFileSelected(false);
    setSelectedNodeId(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { nodes: loadedNodes, edges: loadedEdges } = JSON.parse(e.target.result);
        setNodes(loadedNodes || []);
        setEdges(loadedEdges || []);
        setFileSelected(true);
      } catch {
        alert("Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  const handleSubmit = async () => {
  setIsAnalyzing(true);
  setAnalysisError(null);
  try {
    const graphData = { nodes, edges };

    const response = await fetch('http://localhost:5000/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphData),
    });

    if (!response.ok) throw new Error('Failed to fetch analysis data');

    const result = await response.json();
    setAnalysisData(result);
    setShowAnalysis(true);

  } catch (error) {
    setAnalysisError(error.message);
  } finally {
    setIsAnalyzing(false);
  }
};


  const updateNodeMetadata = (key, value) => {
    const parsedValue = key === "demand" || key === "priority" || key === "supply" ? Number(value) : value;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [key]: parsedValue,
              },
            }
          : node
      )
    );
  };

  const totalSupply = nodes.reduce((sum, node) => sum + (node.data.supply || 0), 0);
  const totalDemand = nodes.reduce((sum, node) => sum + (node.data.demand || 0), 0);


  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }} tabIndex={0} onKeyDown={handleKeyDown}>
      <div style={{ width: "200px", background: "#f0f0f0", padding: "10px", borderRight: "1px solid #ccc" }}>
        <h3>VoltGrid workbench</h3>
        {["Power Source", "Substation", "Consumer", "Hospital", "School"].map((type) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("application/reactflow", type)}
            style={{
              margin: "10px",
              padding: "10px",
              background: "#fff",
              cursor: "grab",
              border: "1px solid #aaa",
              borderRadius: "5px",
            }}
          >
            {type}
          </div>
        ))}
        <button onClick={nodes.length ? exportGraph : null} disabled={!nodes.length} style={buttonStyle}>
          Export Graph
        </button>

        <button onClick={clearGraph} style={buttonStyle}>Clear Screen</button>
        <button onClick={triggerFileUpload} style={buttonStyle}>
          {fileSelected ? "Graph Loaded ✅" : "Upload Graph (.json)"}
        </button>
        
        <button onClick={handleSubmit} disabled={!nodes.length || isAnalyzing} style={buttonStyle}>
          {isAnalyzing ? 'Analyzing...' : 'Analyse'}
        </button>


        <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
      </div>

      {selectedNode && (
        <div style={metadataStyle}>
          <h4>Edit Node Metadata</h4>
          <label>Label:</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateNodeMetadata("label", e.target.value)}
            style={inputStyle}
          />
          {"supply" in selectedNode.data && (
            <>
              <label>Supply:</label>
              <input
                type="number"
                value={selectedNode.data.supply}
                onChange={(e) => updateNodeMetadata("supply", e.target.value)}
                style={inputStyle}
              />
            </>
          )}
          {"demand" in selectedNode.data && (
            <>
              <label>Demand:</label>
              <input
                type="number"
                value={selectedNode.data.demand}
                onChange={(e) => updateNodeMetadata("demand", e.target.value)}
                style={inputStyle}
              />
            </>
          )}
          {"priority" in selectedNode.data && (
            <>
              <label>Priority:</label>
              <input
                type="number"
                value={selectedNode.data.priority}
                onChange={(e) => updateNodeMetadata("priority", e.target.value)}
                style={inputStyle}
              />
            </>
          )}
        </div>
      )}

      <div
        ref={reactFlowWrapper}
        style={{ flexGrow: 1, border: "1px solid #ddd" }}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView={false}
        >

          <MiniMap
            nodeStrokeColor={() => "#555"}
            nodeColor={() => "#999"}
            maskColor="rgba(200, 200, 200, 0.6)" 
            style={{ backgroundColor: "#e0e0e0" }} 
          />
          <div style={{ padding: "10px", backgroundColor: "#eef", borderBottom: "1px solid #ccc" }}>
             🔋 Total Supply: {totalSupply} kW | ⚡ Total Demand: {totalDemand} kW
          </div>

          <Controls />
          <Background />
        </ReactFlow>
        
        {showAnalysis && (
          <div ref={analysisRef}>
             <Analyst 
              data={analysisData} 
              maxFlow={analysisData.max_flow}
              edgeFlows={analysisData.edgeFlows}
              nodeStatus={analysisData.nodeStatus}/>
          </div>
        )}


      </div>
    </div>
  );
};

const buttonStyle = { marginTop: 10, padding: "8px", fontSize: "12px", width: "100%" };

const metadataStyle = {
   position: "absolute",
  top: "10px",
  right: "10px",
  width: "250px",
  backgroundColor: "#f1f1f1",
  border: "1px solid #aaa",
  borderRadius: "8px",
  padding: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000,
  overflowY: "auto",
  maxHeight: "90vh",
};

const inputStyle = { width: "100%", marginBottom: "10px" };

const VoltGridWrapper = () => (
  <ReactFlowProvider>
    <VoltGrid />
  </ReactFlowProvider>
);

export default VoltGridWrapper;

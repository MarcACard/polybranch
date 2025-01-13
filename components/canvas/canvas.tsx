"use client";

import {
  ReactFlow,
  Background,
  Controls,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MessageNode } from "@/components/canvas/message-node";
import { MessageNode as MessageNodeType } from "@/types/nodes";

const nodeTypes = { message: MessageNode };

export function Canvas({
  nodes,
  edges,
  handleNodeChanges,
  handleEdgeChanges,
}: {
  nodes: MessageNodeType[];
  edges: Edge[];
  handleNodeChanges: (changes: NodeChange<MessageNodeType>[]) => void;
  handleEdgeChanges: (changes: EdgeChange[]) => void;
}) {
  return (
    <>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodeChanges}
        onEdgesChange={handleEdgeChanges}
        minZoom={0.001}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </>
  );
}

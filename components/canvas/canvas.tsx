"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { storage } from "@/lib/local-storage";
import { StorageKeys } from "@/constants/storage-keys";
import { MessageNode } from "@/components/canvas/message-node";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/messages";
import { logger } from "@/lib/logger";
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
      <div className="absolute top-20 left-4 z-10">
        {/* TODO: Re-implement test node functionality. */}
        {/* <Button onClick={addTestNode}>Add Test Node</Button> */}
      </div>
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

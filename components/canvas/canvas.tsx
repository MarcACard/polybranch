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

const nodeTypes = { message: MessageNode };

const testMessageData: Message = {
  id: `msg-${Date.now()}`,
  parentId: null,
  role: "user",
  content: "This is a user test node",
  timestamp: Date.now(),
};

// const testNode = {
//   id:
// }

export function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    storage.get<Node[]>(StorageKeys.CANVAS_NODES) ?? [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    storage.get<Edge[]>(StorageKeys.CANVAS_EDGES) ?? [],
  );

  const handleNodeChange = useCallback(
    (changes: NodeChange[]) => {
      logger.debug("Node Change Detected", changes);
      onNodesChange(changes);
      storage.set(StorageKeys.CANVAS_NODES, nodes);
    },
    [nodes, onNodesChange],
  );

  const handleEdgeChanges = useCallback(
    (changes: EdgeChange[]) => {
      logger.debug("Edge Change Detected", changes);
      onEdgesChange(changes);
      storage.set(StorageKeys.CANVAS_EDGES, edges);
    },
    [edges, onEdgesChange],
  );

  const addTestNode = () => {
    setNodes([
      ...nodes,
      {
        id: Date.now().toString(),
        type: "message",
        position: {
          x: -79.24426326976337,
          y: -306.89658063526133,
        },
        data: {
          message: {
            id: "1736291567229",
            parentId: null,
            role: "user",
            content: `Test Message ${Date.now()}`,
            timestamp: 1736291567229,
            metadata: {
              promptTokens: 42,
            },
          },
        },
        measured: {
          width: 720,
          height: 135,
        },
        selected: false,
        dragging: false,
      },
    ]);
  };

  return (
    <>
      <div className="absolute top-20 left-4 z-10">
        {/* TODO: Re-implement test node functionality. */}
        <Button onClick={addTestNode}>Add Test Node</Button>
      </div>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodeChange}
        onEdgesChange={handleEdgeChanges}
        minZoom={0.001}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </>
  );
}

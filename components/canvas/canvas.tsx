"use client";

import { useState, useEffect, useCallback } from "react";
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
import { logger } from "@/lib/logger";

const nodeTypes = { message: MessageNode };

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

  return (
    <>
      <div className="absolute top-20 left-4 z-10">
        {/* TODO: Re-implement test node functionality. */}
        {/* <Button onClick={() => consoel.log("add test node")}>Add Test Node</Button> */}
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

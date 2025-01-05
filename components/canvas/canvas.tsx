"use client";

import { useEffect, useMemo } from "react";
import { ReactFlow, Background, Controls, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MessageNode } from "@/components/canvas/message-node";
import { usePolyBranch } from "@/contexts/polybranch-context";
import { Button } from "@/components/ui/button";
import { storage, StorageKeys } from "@/lib/storage";

export function Canvas() {
  const nodeTypes = useMemo(() => ({ message: MessageNode }), []);
  const { setViewport } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onSelectionChange,
    addTestNode,
  } = usePolyBranch();

  // If no localStorage data, set viewport to default state
  useEffect(() => {
    const hasStoredCanvas = storage.get(StorageKeys.CANVAS_NODES);
    if (!hasStoredCanvas) {
      setViewport({ x: 0, y: 0, zoom: 1 });
    }
  }, [setViewport]);

  return (
    <>
      {/* TEMP FOR TESTING */}
      <div className="absolute top-20 left-4 z-10">
        <Button onClick={() => addTestNode()}>Add Test Node</Button>
      </div>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        minZoom={0.001}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </>
  );
}

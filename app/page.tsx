"use client";

import { useEffect, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { storage, StorageKeys } from "@/lib/storage";
import { AppLayout } from "@/components/app-layout";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import { MessageNode } from "@/components/canvas/message-node";
import "@xyflow/react/dist/style.css";
import { useCanvas } from "@/hooks/use-canvas";
import { MessageRole } from "@/types/messages";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <AppLayout>
      <Canvas />
    </AppLayout>
  );
}

function Canvas() {
  const nodeTypes = useMemo(() => ({ message: MessageNode }), []);
  const { setViewport } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addMessageNode,
    onSelectionChange,
  } = useCanvas();

  useEffect(() => {
    // Set initial viewport if no stored state
    const hasStoredCanvas = storage.get(StorageKeys.CANVAS_NODES);
    if (!hasStoredCanvas) {
      setViewport({ x: 0, y: 0, zoom: 1 });
    }
  }, [setViewport]);

  const handleAddTestNode = () => {
    const testMessage = {
      id: Date.now().toString(),
      parentId: null,
      role: "user" as MessageRole,
      content: "Test Message " + new Date().toISOString(),
      timestamp: Date.now(),
      metadata: {
        promptTokens: 42,
      },
    };

    const position = { x: 100, y: 100 };
    addMessageNode(null, testMessage, position);
  };

  return (
    <>
      <div className="absolute top-20 left-4 z-10">
        <Button onClick={handleAddTestNode}>Add Test Node</Button>
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

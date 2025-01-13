"use client";

import { ReactFlowProvider } from "@xyflow/react";
import {
  ReactFlow,
  Background,
  Controls,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useChatTree } from "@/hooks/use-chat-tree";
import ApiKeyContext from "@/contexts/api-key-context";
import { AppTopBar } from "@/components/app-top-bar";
import { Chat } from "@/components/chat/chat";
import { DebugToolbar } from "@/components/debug-toolbar";
import { MessageNode } from "@/components/canvas/message-node";

const nodeTypes = { message: MessageNode };

export default function Home() {
  const {
    nodes,
    edges,
    handleNodeChanges,
    handleEdgeChanges,
    getSelectedNodes,
    addMessage,
    addTestMessage,
    deleteAll,
  } = useChatTree();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ApiKeyContext>
        <ReactFlowProvider>
          <main className="w-full h-full">
            <AppTopBar />
            <DebugToolbar addTestMessage={addTestMessage} deleteAll={deleteAll} />
            <Chat addMessage={addMessage} />
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
          </main>
        </ReactFlowProvider>
      </ApiKeyContext>
    </div>
  );
}

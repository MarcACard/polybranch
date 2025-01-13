"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ApiKeyContext from "@/contexts/api-key-context";
import { AppTopBar } from "@/components/app-top-bar";
import { Canvas } from "@/components/canvas/canvas";
import { Chat } from "@/components/chat/chat";
import { useChatTree } from "@/hooks/use-chat-tree";
import { DebugToolbar } from "@/components/debug-toolbar";

export default function Home() {
  const chatTree = useChatTree();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ApiKeyContext>
        <ReactFlowProvider>
          <main className="w-full h-full">
            <AppTopBar />
            <DebugToolbar addTestMessage={chatTree.addTestMessage} deleteAll={chatTree.deleteAll} />
            <Chat addMessage={chatTree.addMessage} />
            <Canvas {...chatTree} />
          </main>
        </ReactFlowProvider>
      </ApiKeyContext>
    </div>
  );
}

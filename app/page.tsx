"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ApiKeyContext from "@/contexts/api-key-context";
import { AppTopBar } from "@/components/app-top-bar";
import { Canvas } from "@/components/canvas/canvas";
import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ApiKeyContext>
        <ReactFlowProvider>
          <main className="w-full h-full">
            <AppTopBar />
            <Chat />
            <Canvas />
          </main>
        </ReactFlowProvider>
      </ApiKeyContext>
    </div>
  );
}

"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { AppTopBar } from "@/components/app-top-bar"
import { PolyBranchProvider } from "@/contexts/polybranch-context";
import { Canvas } from "@/components/canvas/canvas"
import { Chat } from "@/components/chat/chat"

export default function Home() {
 return (
  <div className="relative w-full h-screen overflow-hidden">
    <ReactFlowProvider>
      <PolyBranchProvider>
        <main className="w-full h-full">
          <AppTopBar />
          <Chat />
          <Canvas />
        </main>
      </PolyBranchProvider>
    </ReactFlowProvider>
  </div>
 );
}
import { AppLayout } from "@/components/app-layout";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Home() {
  return (
    <AppLayout>
      <ReactFlow nodes={[]} edges={[]}>
        <Background />
        <Controls />
      </ReactFlow>
    </AppLayout>
  );
}
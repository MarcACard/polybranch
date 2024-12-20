import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export function Flow() {
  return (
      <ReactFlow nodes={[]} edges={[]}>
        <Background />
        <Controls />
    </ReactFlow>
  );
}

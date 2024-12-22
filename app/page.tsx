import { AppLayout } from "@/components/app-layout";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import { MessageNode } from "@/components/canvas/message-node";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  message: MessageNode,
};

const initialNodes = [
  {
    id: "1",
    type: "message",
    position: { x: 100, y: 100 },
    data: {
      message: {
        id: "1",
        parentId: null,
        role: "user",
        content:
          "Hello! How's it going? Is this thing on? \n\nThere once was a man from Peru; who dreamed he was eating his shoe...",
        timestamp: Date.now(),
        metadata: {
          promptTokens: 42,
        },
      },
    },
  },
  {
    id: "2",
    type: "message",
    position: { x: 100, y: 400 },  // Positioned below the first node
    data: {
      message: {
        id: "2",
        parentId: "1",
        role: "assistant",
        provider: "openai",
        content: "I'm working well! I see you've started a limerick. Let me complete it for you:\n\nThere once was a man from Peru,\nWho dreamed he was eating his shoe.\nHe woke with a fright,\nIn the middle of night,\nTo find that his dream had come true!",
        timestamp: Date.now(),
        metadata: {
          modelId: "gpt-4o-mini",
          promptTokens: 76,
        }
      }
    }
  }
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2"
  }
];

export default function Home() {
  return (
    <AppLayout>
      <ReactFlow nodeTypes={nodeTypes} nodes={initialNodes} edges={initialEdges}>
        <Background />
        <Controls />
      </ReactFlow>
    </AppLayout>
  );
}

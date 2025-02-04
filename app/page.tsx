"use client";

import { useCallback } from "react";
import { ReactFlowProvider, ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useChatTree } from "@/hooks/use-chat-tree";
import { useApiKeys } from "@/contexts/api-key-context";
import { sendLLMRequest } from "@/lib/ai-client";
import { AppMainMenu } from "@/components/app-main-menu";
import { Chat } from "@/components/chat/chat";
import { DebugToolbar } from "@/components/debug-toolbar";
import { MessageNode } from "@/components/canvas/message-node";

import { ProviderModel, ModelConfig } from "@/types/llm";

const nodeTypes = { message: MessageNode };

export default function Home() {
  const {
    nodes,
    edges,
    handleNodeChanges,
    handleEdgeChanges,
    handleConnection,
    getSelectedNodes,
    getContextChain,
    addMessage,
    addTestMessage,
    addSystemMessage,
    deleteAll,
  } = useChatTree();
  const { getApiKey } = useApiKeys();

  // TODO: Refactor
  const onChatSend = async (
    parentId: string,
    message: string,
    providerModel: ProviderModel,
    parameters: ModelConfig,
  ) => {
    const apiKey = getApiKey(providerModel.provider);
    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    // Add User Message to ReactFlow
    const userMsgId = addMessage(
      {
        message: {
          role: "user",
          content: message,
        },
        timestamp: Date.now(),
      },
      parentId,
    );

    const contextChain = getContextChain(parentId, { role: "user", content: message });

    // Make Call to LLM
    const res = await sendLLMRequest({
      providerModel,
      messages: contextChain,
      config: parameters,
      apiKey: apiKey.key,
    });

    // Add Response to ReactFlow
    addMessage(
      {
        message: {
          role: "assistant",
          content: res.content,
        },
        provider: res.provider,
        providerModel,
        timestamp: res.timestamp,
        tokenCount: res.tokenCount,
      },
      userMsgId,
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <main className="w-full h-full">
        <ReactFlowProvider>
          <DebugToolbar
            addTestMessage={addTestMessage}
            addSystemMessage={addSystemMessage}
            deleteAll={deleteAll}
          />
          <Chat onChatSend={onChatSend} getSelectedNodes={getSelectedNodes} />
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodeChanges}
            onEdgesChange={handleEdgeChanges}
            onConnect={handleConnection}
            minZoom={0.001}
          >
            <AppMainMenu />
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </main>
    </div>
  );
}

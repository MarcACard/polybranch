import { useCallback } from "react";
import { useCanvas } from "./use-canvas";
import { useProviderModels } from "./use-provider-models";
import { Message, MessageRole } from "@/types/messages";
import { useLLMAPI } from "@/lib/llm";
import { logger } from "@/lib/logger";

export const useMessageFlow = () => {
  const { addMessageNode, nodes, selectedNode } = useCanvas();
  logger.debug('useMessageFlow - selectedNodeId:', selectedNode)
  logger.debug('useMessageFlow - canSendMessage:', selectedNode!== null)

  const { getModelById } = useProviderModels();
  const { callAPI } = useLLMAPI();

  // Build context chain from selected node
  const buildContextChain = useCallback(
    (nodeId: string) => {
      const chain: Message[] = [];
      let currentId: string | null = nodeId;

      while (currentId) {
        const node = nodes.find((n) => n.id === currentId);
        if (!node) break;

        chain.unshift(node.data.message);
        currentId = node.data.message.parentId;
      }

      return chain;
    },
    [nodes]
  );

  const sendMessage = useCallback(
    async (
      content: string,
      modelId: string,
      parameters: Record<string, any>
    ) => {
      if (!selectedNode) {
        throw new Error("No node selected");
      }

      const model = getModelById(modelId);
      if (!model) {
        throw new Error("Invalid model");
      }

      // Create user message node
      const userMessage: Message = {
        id: Date.now().toString(),
        parentId: selectedNode,
        role: "user" as MessageRole,
        content,
        timestamp: Date.now(),
        metadata: {
          modelId,
          ...parameters,
        },
      };

      // Add user message to canvas
      const userPosition = { x: 100, y: 200 }; // Calculate based on parent
      await addMessageNode(selectedNode, userMessage, userPosition);

      // Get context and make API call
      const context = buildContextChain(userMessage.id);

      try {
        const response = await callAPI({
          messages: context,
          provider: model.provider,
          modelId: model.modelName,
          parameters,
        });

        // Create assistant message node
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          parentId: userMessage.id,
          role: "assistant",
          content: response.content,
          provider: model.provider,
          timestamp: Date.now(),
          metadata: {
            modelId,
            ...parameters,
          },
        };

        // Add assistant message to canvas
        const assistantPosition = { x: 100, y: 400 }; // Calculate based on parent
        await addMessageNode(
          userMessage.id,
          assistantMessage,
          assistantPosition
        );
      } catch (error) {
        logger.error("API call failed:", error);
      }
    },
    [selectedNode, addMessageNode, buildContextChain, getModelById, callAPI]
  );

  return {
    sendMessage,
    canSendMessage: selectedNode !== null,
  };
};

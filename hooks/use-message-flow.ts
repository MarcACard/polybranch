import { useCallback } from "react";
import { usePolyBranch } from "@/contexts/polybranch-context";
import { useProviderModels } from "./use-provider-models";
import { Message, MessageRole } from "@/types/messages";
import { CoreLLMParameters } from "@/types/llm-parameters";
import { useLLMAPI } from "@/lib/llm";
import { logger } from "@/lib/logger";

function buildContextChainFromNodes(
  nodeId: string,
  allNodes: { id: string; data: { message: Message } }[]
): Message[] {
  const chain: Message[] = [];
  let currentId: string | null = nodeId;

  while (currentId) {
    const node = allNodes.find((n) => n.id === currentId);
    if (!node) break;

    chain.unshift(node.data.message);
    currentId = node.data.message.parentId;
  }

  return chain;
}

export const useMessageFlow = () => {
  const { addMessageNode, nodes, selectedNodeId } = usePolyBranch();
  const { getModelById } = useProviderModels();
  const { callAPI } = useLLMAPI();

  // // Build context chain from selected node
  // const buildContextChain = useCallback((nodeId: string) => {
  //   logger.debug(`Building context chain starting from ${nodeId}`);
  //   const chain: Message[] = [];
  //   let currentId: string | null = nodeId;

  //   while (currentId) {
  //     const node = nodes.find((n) => n.id === currentId);
  //     if (!node) break;

  //     chain.unshift(node.data.message);
  //     currentId = node.data.message.parentId;
  //   }

  //   logger.debug("Context Chain:", chain);

  //   return chain;
  // }, [nodes]);

  const calculateNodePosition = useCallback(
    (parentId: string) => {
      const parentNode = nodes.find((n) => n.id === parentId);
      if (!parentId) {
        return { x: 100, y: 100 };
      }

      // Position new node below its parent with some offset
      return {
        x: parentNode?.position.x ?? 100,
        y: (parentNode?.position.y ?? 100) + 200,
      };
    },
    [nodes]
  );

  const sendMessage = useCallback(
    async (content: string, modelId: string, parameters: CoreLLMParameters) => {
      if (!selectedNodeId) {
        throw new Error("No node selected");
      }

      const model = getModelById(modelId);
      if (!model) {
        throw new Error("Invalid model");
      }

      // Create user message node
      const userMessage: Message = {
        id: Date.now().toString(),
        parentId: selectedNodeId,
        role: "user" as MessageRole,
        content,
        timestamp: Date.now(),
      };

      const userNode = {
        id: userMessage.id,
        data: { message: userMessage },
        position: calculateNodePosition(selectedNodeId),
      };
      const updatedNodes = [...nodes, userNode];
      const contextChain = buildContextChainFromNodes(
        userMessage.id,
        updatedNodes
      );

      // Add user message to canvas
      addMessageNode(selectedNodeId, userMessage, userNode.position);

      try {
        const response = await callAPI({
          messages: contextChain,
          provider: model.provider,
          modelId: model.modelName,
          parameters,
        });

        logger.info(response)

        // Create assistant message node
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          parentId: userMessage.id,
          role: "assistant",
          content: response.content,
          provider: model.provider,
          timestamp: response.created,
          metadata: {
            modelId: model.modelName,
            tokenCount: response.usage,
            completionTokens: response.usage,
            // Add parameters like temp, top, etc
          },
        };

        const assistantNode = {
          id: assistantMessage.id,
          data: { message: assistantMessage },
          position: calculateNodePosition(userMessage.id),
        };

        // Add assistant message to canvas
        addMessageNode(
          userMessage.id,
          assistantMessage,
          assistantNode.position
        );
      } catch (error) {
        logger.error("API call failed:", error);
      }
    },
    [
      selectedNodeId,
      addMessageNode,
      nodes,
      calculateNodePosition,
      getModelById,
      callAPI,
    ]
  );

  return {
    sendMessage,
    canSendMessage: selectedNodeId !== null,
  };
};

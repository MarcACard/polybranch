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

  const calculateNodePosition = useCallback(
    (parentId: string) => {
      logger.debug("Calculating new Node Position - parentId:", parentId)
      if (!parentId) {
        return { x: 100, y: 100 };
      }

      // Retreive Parent Node
      const parentNode = nodes.find((n) => n.id === parentId);

      if (parentNode === undefined) return { x: 100, y: 100 }

      logger.debug("Calculating new Node Position - parentNode:", parentNode)

      // Position new node below its parent with some offset
      return {
        x: parentNode.position.x, // Default straight line down. 
        y: parentNode.position.y + 100 + (parentNode?.measured?.height ?? 0), // Need to look into this more >.<
      };
    },
    [nodes]
  );

  const placeAssistantNode = (assistantMessage: Message, parentId: string) => {
    logger.debug("Placing Assistant Node")
    requestAnimationFrame(() => {

      const parentNode = nodes.find(n => n.id === parentId);
      logger.debug("Placing Assistant Node - parentNode", parentNode)
      const height = parentNode?.measured?.height ?? 0;

      logger.debug("Placing Assistant Node - height:", height)
      const assistantPos = {
        x: parentNode?.position.x ?? 0,
        y: (parentNode?.position.y ?? 0) + 100 + height
      }

      logger.debug("Placing Assistant Node - assistantPos:", assistantPos)
      addMessageNode(parentNode.id, assistantMessage, assistantPos)
    })
  }

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

      // Build a temp node in memory to build a context chain
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
      logger.debug("Placing User Message Node")
      addMessageNode(selectedNodeId, userMessage, userNode.position);

      await new Promise(resolve => setTimeout(resolve, 50)); // Hacky Solution

      try {
        logger.debug("Making call to API")
        const response = await callAPI({
          messages: contextChain,
          provider: model.provider,
          modelId: model.modelName,
          parameters,
        });
        logger.debug("Response Returned from API")

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

        // const assistantNode = {
        //   id: assistantMessage.id,
        //   data: { message: assistantMessage },
        //   position: calculateNodePosition(userMessage.id),
        // };

        // Add assistant message to canvas

        // placeAssistantNode(
        //   assistantMessage,
        //   userMessage.id
        // )

        addMessageNode(
          userMessage.id,
          assistantMessage,
          calculateNodePosition(userMessage.id)
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

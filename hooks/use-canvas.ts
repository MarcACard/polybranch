import { useCallback, useEffect, useState } from "react";
import { Edge, Node, useReactFlow } from "@xyflow/react";
import { MessageNodeData } from "@/types/nodes";
import { StorageKeys, storage } from "@/lib/storage";

export const useCanvas = () => {
  const { setNodes, setEdges, getNodes, getEdges, addNodes, addEdges } =
    useReactFlow();

  useEffect(() => {
    const storedNodes = storage.get<Node<MessageNodeData>[]>(
      StorageKeys.CANVAS_NODES
    );
    const storedEdges = storage.get<Edge[]>(StorageKeys.CANVAS_EDGES);

    if (storedNodes) setNodes(storedNodes);
    if (storedEdges) setEdges(storedEdges);
  }, [setNodes, setEdges]);

  const saveCanvas = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();

    storage.set(StorageKeys.CANVAS_NODES, currentNodes);
    storage.set(StorageKeys.CANVAS_EDGES, currentEdges);
  }, [getNodes, getEdges]);

  const addMessageNode = useCallback(
    (
      parentId: string | null,
      message: MessageNodeData["message"],
      position: { x: number; y: number }
    ) => {
      const newNode: Node<MessageNodeData> = {
        id: message.id,
        type: "message",
        position,
        data: { message },
      };

      addNodes(newNode);

      if (parentId) {
        const newEdge: Edge = {
          id: `e${parentId}=${message.id}`,
          source: parentId,
          target: message.id,
        };
        addEdges(newEdge);
      }

      saveCanvas();
    },
    [addNodes, addEdges, saveCanvas]
  );

  const calculateNewNodePosition = useCallback(
    (parentId: string | null) => {
      if (!parentId) {
        return { x: 100, y: 100 };
      }

      const parentNode = getNodes().find((node) => node.id === parentId);
      if (!parentNode) {
        return { x: 100, y: 100 };
      }

      return { x: parentNode.position.x, y: parentNode.position.y + 300 };
    },
    [getNodes]
  );

  return {
    addMessageNode,
    calculateNewNodePosition,
    saveCanvas,
  };
};

// hooks/use-canvas.ts
import { useCallback, useEffect, useState } from "react";
import {
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { MessageNodeData } from "@/types/nodes";
import { StorageKeys, storage } from "@/lib/storage";

export const useCanvas = () => {
  const [nodes, setNodes] = useState<Node<MessageNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const storedNodes = storage.get<Node<MessageNodeData>[]>(
      StorageKeys.CANVAS_NODES
    );
    const storedEdges = storage.get<Edge[]>(StorageKeys.CANVAS_EDGES);

    console.log("Loading from storage - nodes:", storedNodes);
    console.log("Loading from storage - edges:", storedEdges);

    if (storedNodes) setNodes(storedNodes);
    if (storedEdges) setEdges(storedEdges);
    setInitialized(true);
  }, []);

  // Save to storage when state changes
  useEffect(() => {
    if (!initialized) return;

    console.log("Saving to storage - nodes:", nodes);
    storage.set(StorageKeys.CANVAS_NODES, nodes);
    storage.set(StorageKeys.CANVAS_EDGES, edges);
  }, [nodes, edges, initialized]);

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

      setNodes((nds) => [...nds, newNode]);

      if (parentId) {
        const newEdge: Edge = {
          id: `e${parentId}-${message.id}`,
          source: parentId,
          target: message.id,
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    []
  );

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(
      (nds: Node<MessageNodeData>[]) =>
        applyNodeChanges(changes, nds) as Node<MessageNodeData>[]
    );
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const selected = selectedNodes[0]?.id || null;
      setSelectedNode(selected);
      console.log("Selected node:", selected);
    },
    []
  );

  return {
    nodes,
    edges,
    addMessageNode,
    onNodesChange,
    onEdgesChange,
    selectedNode,
    onSelectionChange,
  };
};

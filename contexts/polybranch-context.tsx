import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

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
import { Message } from "@/types/messages";
import { logger } from "@/lib/logger";

interface PolyBranchContextType {
  // State
  nodes: Node<MessageNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  // ReacFlow Event Handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onSelectionChange: ({ nodes }: { nodes: Node[] }) => void;

  // Node Operations
  addMessageNode: (
    parentId: string | null,
    message: Message,
    position: { x: number; y: number }
  ) => void;

  // Debug & Testing
  addTestNode: () => void;
}

export const PolyBranchContext = createContext<
  PolyBranchContextType | undefined
>(undefined);

export function PolyBranchProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage
  const [nodes, setNodes] = useState<Node<MessageNodeData>[]>(() => {
    return storage.get<Node<MessageNodeData>[]>(StorageKeys.CANVAS_NODES) || [];
  });

  const [edges, setEdges] = useState<Edge[]>(() => {
    return storage.get<Edge[]>(StorageKeys.CANVAS_EDGES) || [];
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // === ReactFlow Event Handlers ===
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    logger.debug("Node changing:", changes);
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(
        changes,
        nds
      ) as Node<MessageNodeData>[];
      return updatedNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    logger.debug("Edges changing:", changes);
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const selected = selectedNodes[0]?.id || null;
      logger.debug("Selection changed:", selected);
      setSelectedNodeId(selected);
    },
    []
  );

  // === Node Operations ===
  const addMessageNode = useCallback(
    (
      parentId: string | null,
      message: Message,
      position: { x: number; y: number }
    ) => {
      logger.debug("Adding message node:", { parentId, message });

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

  const addTestNode = useCallback(() => {
    const testMessage: Message = {
      id: Date.now().toString(),
      parentId: null,
      role: "user",
      content: "Test Message " + new Date().toISOString(),
      timestamp: Date.now(),
      metadata: {
        promptTokens: 42,
      },
    };

    const position = { x: 100, y: 100 };
    addMessageNode(null, testMessage, position);
  }, [addMessageNode]);

  // === Persis Changes to LocalStorage ===
  useEffect(() => {
    storage.set(StorageKeys.CANVAS_NODES, nodes);
    storage.set(StorageKeys.CANVAS_EDGES, edges);
  }, [nodes, edges]);

  // === Provide Context ===
  const value: PolyBranchContextType = {
    nodes,
    edges,
    selectedNodeId,
    onNodesChange,
    onEdgesChange,
    onSelectionChange,
    addMessageNode,
    addTestNode,
  };

  return (
    <PolyBranchContext.Provider value={value}>
      {children}
    </PolyBranchContext.Provider>
  );
}

export function usePolyBranch() {
  const context = useContext(PolyBranchContext);
  if (context === undefined) {
    throw new Error("usePolyBranch must be used within a PolyBranchProvider");
  }
  return context;
}

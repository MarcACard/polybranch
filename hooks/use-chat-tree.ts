import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type XYPosition,
  type Connection,
} from "@xyflow/react";

import { logger } from "@/lib/logger";
import { storage } from "@/lib/local-storage";
import { StorageKeys } from "@/constants/storage-keys";
import { MessageNode, MessageNodeData } from "@/types/nodes";
import { Message } from "@/types/llm";

export const useChatTree = () => {
  // CORE STATE, Init from Local Storage
  const [nodes, setNodes, onNodesChange] = useNodesState(
    storage.get<MessageNode[]>(StorageKeys.CANVAS_NODES) ?? [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    storage.get<Edge[]>(StorageKeys.CANVAS_EDGES) ?? [],
  );

  // Passed to ReactFlow and triggers whenever state changes take place with nodes or edges.
  // onNodeChange / onEdgeChange is a helper from Reactflow to merge new and existing state.
  // Might need to adjust in the future or customize.
  const handleNodeChanges = useCallback(
    (changes: NodeChange<MessageNode>[]) => {
      logger.debug("Node Change Detected", changes);
      onNodesChange(changes);
    },
    [onNodesChange],
  );

  const handleEdgeChanges = useCallback(
    (changes: EdgeChange[]) => {
      logger.debug("Edge Change Detected", changes);
      onEdgesChange(changes);
    },
    [onEdgesChange],
  );

  // useEffects for edge & nodes ensure that all state changes are persisted to local storage
  // Need this b/c handleNodeChanges & handleEdgeChanges won't account for net new edges and nodes.
  useEffect(() => {
    storage.set(StorageKeys.CANVAS_NODES, nodes);
    storage.set(StorageKeys.CANVAS_EDGES, edges);
  }, [nodes, edges]);

  // TODO: Add Validation to enforce the rooted tree structure
  const handleConnection = useCallback(
    ({ source, target }: Connection) => {
      const newEdge = {
        id: `e-${source}-${target}`,
        type: "smoothstep",
        source,
        target,
      };

      setEdges((prev) => [...prev, newEdge]);
    },
    [setEdges],
  );

  // === Utilities ====
  /**
   * Calculate Coordinates for a New Node
   */
  const calcNodeCoordinates = (
    parentNodePosition: XYPosition,
    parentNodeHeight?: number,
  ): XYPosition => {
    if (!parentNodeHeight) logger.warn("calcNodeCoordinates - parentNodeHeight undefined");
    const defaultGap = 75; // Default distance between two nodes.

    return {
      x: parentNodePosition.x,
      y: parentNodePosition.y + (parentNodeHeight ?? 0) + defaultGap,
    };
  };

  /**
   * Return All Nodes Currently Selected in ReactFlow Canvas
   */
  const getSelectedNodes = () => {
    return nodes.filter((node) => node.selected == true);
  };

  /**
   * Add a MessageNode to ReactFlow Canvas
   */
  const addMessage = (messageData: MessageNodeData, parentId?: string) => {
    // TODO: New ID Generation Method
    const id = Date.now().toString();
    logger.debug("Adding Message Node", { id, parentId, messageData });

    setNodes((nodes) => {
      const parentNode = nodes.find((node) => node.id === parentId);

      const newNode: MessageNode = {
        id,
        type: "message",
        position: parentNode
          ? calcNodeCoordinates(parentNode.position, parentNode.measured?.height)
          : { x: 0, y: 0 },
        data: messageData,
      };

      return [...nodes, newNode];
    });

    // Create & Add an edge if a parent Id exists.
    if (parentId !== undefined) {
      const edge: Edge = {
        id: `e-${parentId}-${id}`,
        type: "smoothstep",
        source: parentId,
        target: id,
      };
      setEdges((edges) => [...edges, edge]);
    }

    return id;
  };

  /**
   * Retreive a context chain from the hierarchy of nodes selected on the canvas.
   * @param parentId
   */
  const getContextChain = (parentId: string, userMsg: Message): Message[] => {
    let currentNodeId = parentId;
    let chain: Message[] = [userMsg];

    while (currentNodeId) {
      // Find the edge where current id is the target
      const currentEdge = edges.find((e) => e.target === currentNodeId);

      if (!currentEdge) break;

      // Use the edge source to find the preceeding node.
      const nextNode = nodes.find((n) => n.id === currentEdge.source);

      if (!nextNode) break;

      // Prepend the node data to the chain.
      chain.unshift(nextNode.data.message);
      // Setup currentNodeId for the next iteration.
      currentNodeId = nextNode.id;
    }

    return chain;
  };

  /**
   * Adds a test user node to ReactFlow. Used w/ Debug Toolbar
   */
  const addTestMessage = () => {
    const data: MessageNodeData = {
      message: {
        role: "user",
        content: `TEST MESSAGE | This is a new unique message. ${Date.now()}`,
      },
      timestamp: Date.now(),
    };

    addMessage(data);
  };
  /**
   * Adds a system message node to ReactFlow. Used w/ Debug Toolbar
   */
  const addSystemMessage = () => {
    const data: MessageNodeData = {
      message: {
        role: "system",
        content: "You are a helpful assistant.",
      },
      timestamp: Date.now(),
    };

    addMessage(data);
  };

  /**
   * Delete all Edges and Nodes. Used w/ Debug Toolbar
   */
  const deleteAll = () => {
    setNodes(() => []);
    setEdges(() => []);
  };

  return {
    // State
    nodes,
    edges,
    // Reactflow Callbacks
    handleNodeChanges,
    handleEdgeChanges,
    handleConnection,
    // Helpers
    getSelectedNodes,
    addMessage,
    getContextChain,
    // Debug Helpers
    addTestMessage,
    addSystemMessage,
    deleteAll,
  };
};

import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type XYPosition,
} from "@xyflow/react";

import { logger } from "@/lib/logger";
import { storage } from "@/lib/local-storage";
import { StorageKeys } from "@/constants/storage-keys";
import { MessageNode, MessageNodeData } from "@/types/nodes";

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

  // === Utilities ====
  /**
   * Calculate Coordinates for a New Node
   */
  const calcNodeCoordinates = (parentId?: string): XYPosition => {
    let x = 0;
    let y = 0;

    const parentNode = nodes.find((node) => node.id === parentId);
    logger.debug("calcNodeCoordinates, parent node:", parentNode);

    // Generate new position if parent exists
    if (parentNode) {
      x = parentNode.position.x;
      // Starting Location + Parent Node Height + "Buffer"
      y = parentNode.position.y + (parentNode.measured?.height ?? 0) + 75;
    }

    return {
      x,
      y,
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
  const addMessage = (messageData: MessageNodeData) => {
    // Determine if a single node is selected
    const selectedNodes = getSelectedNodes();
    const parentId = selectedNodes[0]?.id;

    const id = Date.now().toString(); // Generate Id
    const node: MessageNode = {
      id,
      type: "message",
      position: calcNodeCoordinates(parentId),
      data: messageData,
    };

    // Create & Add an edge if a parent Id exists.
    if (parentId !== undefined) {
      const edge: Edge = {
        id: `e-${id}`,
        source: parentId,
        target: id,
      };
      setEdges((edges) => [...edges, edge]);
    }
    setNodes((nodes) => [...nodes, node]);
  };

  /**
   * Adds a test user node to ReactFlow. Used w/ Debug Toolbar
   */
  const addTestMessage = () => {
    const data: MessageNodeData = {
      message: {
        role: "user",
        content: `TEST MESSAGE | This is a new unique message. ${Date.now()}`,
        timestamp: Date.now(),
      },
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
    nodes,
    edges,
    handleNodeChanges,
    handleEdgeChanges,
    getSelectedNodes,
    addMessage,
    addTestMessage,
    deleteAll,
  };
};

import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  type Edge,
  type NodeChange,
  type EdgeChange,
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
   * Return All Nodes Currently Selected in ReactFlow Canvas
   */
  const getSelectedNodes = () => {
    return nodes.filter((node) => node.selected == true);
  };

  /**
   * Add a MessageNode to ReactFlow Canvas
   */
  const addMessage = (messageData: MessageNodeData, parentId?: string) => {
    const id = Date.now().toString(); // Generate Id
    const node: MessageNode = {
      id,
      type: "message",
      // TODO: Generate a location dynamically based on parent id.
      position: {
        x: -79.24426326976337,
        y: -306.89658063526133,
      },
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
        content: `This is a new unique message. ${Date.now()}`,
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

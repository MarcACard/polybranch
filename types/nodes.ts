import { Node } from "@xyflow/react";
import { Message } from "@/types/messages";

export type MessageNodeData = {
  message: Message;
};

export type MessageNode = Node<MessageNodeData>;

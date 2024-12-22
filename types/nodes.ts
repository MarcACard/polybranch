import { Node } from "@xyflow/react";
import { Message } from "@/types/messages";

export interface MessageNodeData extends Record<string, unknown> {
  selected?: boolean;
  message: Message;
}

export type MessageNode = Node<MessageNodeData>;

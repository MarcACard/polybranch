"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { MessageNodeData } from "@/types/nodes";
import { Separator } from "@/components/ui/separator";
import { MessageNodeMenu } from "@/components/canvas/message-node-menu";
import { User } from "lucide-react";
import { PROVIDERS } from "@/constants/models";
import { cn } from "@/lib/utils";

interface MessageNodeProps extends NodeProps {
  data: MessageNodeData;
}

function formatTime(value: number, type: "unix" | "dateString") {
  let valueToFormat = value;

  if (type === "unix") {
    valueToFormat *= 1000;
  }

  return new Date(valueToFormat).toLocaleTimeString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageNode({ id, data, selected }: MessageNodeProps) {
  const { message } = data;
  const isUser = message.role === "user";

  const providerInfo = !isUser && message.provider ? PROVIDERS[message.provider] : null;
  const ProviderIcon = providerInfo?.icon;

  const formattedTime = isUser
    ? formatTime(message.timestamp, "dateString")
    : formatTime(message.timestamp, "unix");

  return (
    <div
      className={cn(
        "group relative rounded-lg border w-[720px] bg-background drop-shadow hover:drop-shadow-lg transition-shadow",
        selected && "ring-2 ring-primary",
      )}
    >
      {/* Top Handle */}
      {/* TODO: Conditionally Render Top Handle if it has a parent edge */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2" />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between ">
          <div className="flex gap-2 items-center">
            {isUser ? (
              <User className="size-6" />
            ) : ProviderIcon ? (
              <ProviderIcon className="size-6" />
            ) : null}
            <span className="text-lg font-semibold">
              {isUser ? "You" : providerInfo?.displayName}
            </span>
            {message.metadata?.modelId && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="font-mono text-muted-forground">{message.metadata.modelId}</div>
              </>
            )}
          </div>
          {/* MessageNode DropDown Menu */}
          <MessageNodeMenu id={id} role={data.message.role} />
        </div>

        <div className="whitespace-pre-wrap">{message.content}</div>

        <Separator />
        <div className="flex justify-between text-xs text-muted-foregorund">
          <div>
            <span className="font-semibold">Tokens: </span>
            {message.metadata?.tokenCount}
          </div>
          <div>{formattedTime}</div>
        </div>
      </div>
      {/* Bottom Handle */}
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2" />
    </div>
  );
}

MessageNode.displayName = "MessageNode";

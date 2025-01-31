"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { MessageNodeData } from "@/types/nodes";
import { Separator } from "@/components/ui/separator";
import { MessageNodeMenu } from "@/components/canvas/message-node-menu";
import { User, SquareChevronRight } from "lucide-react";
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

  // User Created Nodes may have a provider, but we don't want to show it on the node.
  const providerInfo = !isUser && data.provider ? PROVIDERS[data.provider] : null;
  const ProviderIcon = providerInfo?.icon;

  const formattedTime = isUser
    ? formatTime(data.timestamp, "dateString")
    : formatTime(data.timestamp, "unix");

  return (
    <div
      className={cn(
        "group relative rounded-lg border w-[720px] bg-background drop-shadow hover:drop-shadow-lg transition-shadow",
        selected && "ring-2 ring-primary",
      )}
    >
      {/* Top Handle */}
      {/* TODO: Conditionally Render Top Handle if it has a parent edge - e.g. the node is a target of an edge */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between ">
          {message.role === "user" && (
            <div className="flex gap-2 items-center">
              <User className="size-6" />
              <span className="text-lg font-semibold">You</span>
            </div>
          )}
          {message.role === "assistant" && (
            <div className="flex gap-2 items-center">
              {ProviderIcon && <ProviderIcon className="size-6" />}
              <span className="text-lg font-semibold">{providerInfo?.displayName}</span>
              <Separator orientation="vertical" className="h-4" />
              <div className="font-mono text-muted-foreground">{data.providerModel?.id}</div>
            </div>
          )}
          {message.role === "system" && (
            <div className="flex gap-2 items-center">
              <SquareChevronRight className="size-6" />
              <span className="text-lg font-semibold">System Prompt</span>
            </div>
          )}

          {/* MessageNode DropDown Menu */}
          <MessageNodeMenu id={id} role={data.message.role} />
        </div>

        <div className="whitespace-pre-wrap">{message.content}</div>

        {message.role !== "system" && (
          <>
            <Separator />
            <div className="flex justify-between text-xs text-muted-foregorund">
              <div>
                {data?.tokenCount && (
                  <>
                    <span className="font-semibold">Tokens: </span>
                    {data?.tokenCount}
                  </>
                )}
              </div>
              <div>{formattedTime}</div>
            </div>
          </>
        )}
      </div>
      {/* Bottom Handle */}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
    </div>
  );
}

MessageNode.displayName = "MessageNode";

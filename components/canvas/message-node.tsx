"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { MessageNodeData } from "@/types/nodes";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, Ellipsis } from "lucide-react";
import { PROVIDERS } from "@/constants/models";
import { cn } from "@/lib/utils";

interface MessageNodeProps extends NodeProps {
  data: MessageNodeData;
}

export function MessageNode({ data, selected }: MessageNodeProps) {
  const { message } = data;
  const isUser = message.role === "user";

  const providerInfo =
    !isUser && message.provider ? PROVIDERS[message.provider] : null;
  const ProviderIcon = providerInfo?.icon;

  const formattedTime = new Date(message.timestamp).toLocaleTimeString(
    "en-US",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      className={cn(
        "group relative rounded-lg border min-w-[200px] max-w-[400px] bg-background hover:drop-shadow transition-shadow",
        selected && "ring-1 ring-primary"
      )}
    >
      {/* Top Handle */}
      {message.parentId && (
        <Handle type="target" position={Position.Top} className="!w-2 !h-2" />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between ">
          <div className="flex gap-2 items-center">
            {isUser ? (
              <User className="size-5" />
            ) : ProviderIcon ? (
              <ProviderIcon className="size-4" />
            ) : null}
            <span className="font-semibold">
              {isUser ? "You" : providerInfo?.displayName}
            </span>
            {message.metadata?.modelId && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="text-xs font-mono text-muted-forground">
                  {message.metadata.modelId}
                </div>
              </>
            )}
          </div>
          <div>
            <Button variant="ghost" size="icon">
              <Ellipsis />
            </Button>
          </div>
        </div>

        <div className="whitespace-pre-wrap">{message.content}</div>

        <Separator />
        <div className="flex justify-between text-xs text-muted-foregorund">
          <div>
            <span className="font-semibold">Tokens: </span>
            {message.metadata?.promptTokens}
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

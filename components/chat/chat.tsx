"use client";

import React from "react";

import { DEFAULT_PARAMETERS } from "@/constants/parameters";
import { ChevronDown, ChevronUp, MoveUp } from "lucide-react";

import { ModelConfig, ProviderModel } from "@/types/llm";
import { MessageNode } from "@/types/nodes";

import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ModelConfiguration } from "@/components/chat/model-configuration";
import { ModelSelector } from "@/components/chat/model-selector";

interface ChatProps {
  onChatSend: (
    parentId: string,
    message: string,
    providerModel: ProviderModel,
    parameters: ModelConfig,
  ) => Promise<void>;
  getSelectedNodes: () => MessageNode[];
}

export function Chat({ onChatSend, getSelectedNodes }: ChatProps) {
  const [message, setMessage] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState<ProviderModel | null>(null);
  const [modelConfig, setModelConfig] = React.useState<Required<ModelConfig>>(DEFAULT_PARAMETERS);

  const { toast } = useToast();

  const selectedNodes = getSelectedNodes();
  const selectedNodeId = selectedNodes.length === 1 ? selectedNodes[0].id : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedNodeId);
    if (!message.trim() || !selectedModel || !selectedNodeId) return;

    try {
      // TODO: Need add "Loading State", otherwise you just see a delay.
      await onChatSend(selectedNodeId, message, selectedModel, modelConfig);
      setMessage("");
    } catch (error) {
      logger.error("Error sending message", error);
      toast({
        title: "Uh Oh...",
        description: `An issue occured trying to send your message. ${error}`,
      });
    }
  };

  /**
   * Returns True if all conditions are met to submit a message.
   * - Model is Selected
   * - A *Single* Node is Selected
   * - TextArea input is not empty
   * @returns boolean
   */
  const canSubmit = () => {
    return message.trim() && selectedModel && selectedNodeId;
  };

  return (
    <div
      className={cn(
        "z-50 fixed bottom-2 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4 drop-shadow-lg transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-[30%]",
      )}
    >
      {/* Chat Toggle Button */}
      <div className="relative">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="absolute top-0, left-1/2 -translate-x-1/2 bg-background rounded-t-lg px-6 py-2 z-10 border-x border-t"
        >
          {isVisible ? (
            <ChevronDown className="h-3 w-3 text-foreground/70" />
          ) : (
            <ChevronUp className="h-3 w-3 text-forground/70" />
          )}
        </button>
      </div>
      {/* Chat Box */}
      <div
        className={cn(
          "rounded-lg border box-shadow-lg mt-7 bg-background overflow-hidden transition-all duration-300 ease-in-out",
          isVisible ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {/* Primary Config Top */}
        <form onSubmit={handleSubmit}>
          <div className="px-3 py-3 border-b border-fborder/50 flex items-center justify-between gap-2">
            <div className="flex gap-2 items-center">
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              {/* TODO: Tie in Model Configuration to Backend Call */}
              <ModelConfiguration value={modelConfig} onChange={setModelConfig} />
            </div>
            <div>
              <Button
                type="submit"
                variant="default"
                size="icon"
                className="rounded-full"
                disabled={!canSubmit()} // TODO: Logic to disable when processing msg & response
              >
                <MoveUp />
              </Button>
            </div>
          </div>
          {/* Chat Input */}
          <div className="min-h-[100px]">
            <Textarea
              id="chatMessage"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message."
              className="min-h-[100px] w-full resize-none border-0 focus-visible:ring-0 py-4 px-4 bg-primary-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

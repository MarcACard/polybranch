"use client";

import React from "react";

import { useToast } from "@/hooks/use-toast";
// import { useMessageFlow } from "@/hooks/use-message-flow";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

import { ModelSelector } from "@/components/chat/model-selector";
import { ModelConfiguration } from "@/components/chat/model-configuration";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MoveUp } from "lucide-react";

export function Chat() {
  const [message, setMessage] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState("");
  // const { canSendMessage, sendMessage } = useMessageFlow();  // TODO: Rewrite

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedModel) return;

    try {
      // await sendMessage(message, selectedModel, {});
      console.log("message sent!");
      setMessage("");
    } catch (error) {
      logger.error("Error sending message", error);
      toast({
        title: "Uh Oh...",
        description: `An issue occured trying to send your message. ${error}`,
      });
    }
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
              <ModelSelector value={selectedModel} onChange={setSelectedModel} />
              {/* TODO: Tie in Model Configuration to Backend Call */}
              <ModelConfiguration />
            </div>
            <div>
              <Button
                type="submit"
                variant="default"
                size="icon"
                className="rounded-full"
                // disabled={} // TODO: Logic to disable when processing msg & response
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

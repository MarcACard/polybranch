"use client";

import React from "react";
import { useProviderModels } from "@/hooks/use-provider-models";
import { useProviderKeys } from "@/hooks/use-provider-keys";
import { PROVIDERS, PROVIDER_MODELS } from "@/constants/models";
import { LLMProvider } from "@/types/llm";
import {
  DEFAULT_PARAMETERS,
  PARAMETER_LIMITS,
  PARAMETERS_DISPLAY,
} from "@/constants/parameters";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Settings2,
  MoveUp,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { LLMParameter } from "@/types/llm-parameters";

interface SliderSelectorProps {
  id: string;
  name: string;
  description: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  step: number;
}

function SliderSelectors({
  id,
  name,
  description,
  minValue,
  maxValue,
  step,
  defaultValue,
}: SliderSelectorProps) {
  const [value, setValue] = React.useState<number[]>([defaultValue]);

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <HoverCardTrigger asChild>
              <Label htmlFor={name}>{name}</Label>
            </HoverCardTrigger>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-forground hover:border-border">
              {value[0]}
            </span>
          </div>
          <Slider
            id={name}
            min={minValue}
            max={maxValue}
            defaultValue={value}
            onValueChange={setValue}
            step={step}
            className="&_[role=slider]]:h-4 &_[role=slider]]:w-4"
            aria-label={name}
          />
        </div>
        <HoverCardContent
          align="center"
          className="w-[260px] text-sm"
          side="left"
        >
          {description}
        </HoverCardContent>
      </HoverCard>
      <div className=""></div>
    </div>
  );
}

function AdvancedModelConfiguration() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="ml-auto h-8 w-8"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          <div className="space-y-2">
            <h4 className="font-semibold leading-none">Model Configuration</h4>
            <p className="text-sm text-muted-forground">
              Fine-tune model behavior with these settings.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-1">
              {(Object.keys(DEFAULT_PARAMETERS) as LLMParameter[]).map(
                (parameter) => {
                  const paramLimits = PARAMETER_LIMITS[parameter];
                  const paramDisplay = PARAMETERS_DISPLAY[parameter];
                  const defaultValue = DEFAULT_PARAMETERS[parameter]
                    ? DEFAULT_PARAMETERS[parameter]
                    : 0;
                  return (
                    <div className="col-span-3">
                      <SliderSelectors
                        key={parameter}
                        id={parameter}
                        name={paramDisplay.display}
                        description={paramDisplay.description}
                        defaultValue={defaultValue}
                        minValue={paramLimits.min}
                        maxValue={paramLimits.max}
                        step={paramLimits.step}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ProviderModelComboBox() {
  const { getModelsForProvider } = useProviderModels();
  const { hasProviderKey } = useProviderKeys();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const activeProviders = (Object.keys(PROVIDERS) as LLMProvider[]).filter(
    (provider) => hasProviderKey(provider)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between pl-2 pr-1"
        >
          {value
            ? (() => {
                const selectedModel = PROVIDER_MODELS.find(
                  (model) => model.modelName === value
                );
                if (selectedModel) {
                  const providerInfo = PROVIDERS[selectedModel.provider];
                  const Icon = providerInfo.icon;
                  return (
                    <div className="flex items-center gap-2">
                      <Icon />
                      <span>{selectedModel.name}</span>
                    </div>
                  );
                }
                return "Select a Model";
              })()
            : "Select a Model"}
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" side="top">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            {activeProviders.map((provider, i, arr) => {
              const providerInfo = PROVIDERS[provider];
              const providerModels = getModelsForProvider(provider);

              return (
                <React.Fragment key={provider}>
                  <CommandGroup heading={providerInfo.displayName}>
                    {providerModels.map((model) => (
                      <CommandItem
                        key={model.modelName}
                        value={model.modelName}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <div>{model.name}</div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {model.modelName}
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              value === model.modelName
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {i !== arr.length - 1 && arr.length > 1 && (
                    <CommandSeparator />
                  )}
                </React.Fragment>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function MessageInput() {
  const [message, setMessage] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Message Submitted:", message);

    setMessage("");
  };

  return (
    <div
      className={cn(
        "fixed bottom-2 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4 drop-shadow-lg transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-[30%]"
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
          isVisible ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {/* Primary Config Top */}
        <form onSubmit={handleSubmit}>
          <div className="px-3 py-3 border-b border-border/50 flex items-center justify-between gap-2">
            <div className="flex gap-2 items-center">
              <ProviderModelComboBox />
              <AdvancedModelConfiguration />
            </div>
            <div>
              <Button
                type="submit"
                variant="default"
                size="icon"
                className="rounded-full"
                disabled={!message.trim()}
              >
                <MoveUp />
              </Button>
            </div>
          </div>
          {/* Chat Input */}
          <div className="min-h-[100px]">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message."
              className="min-h-[100px] w-full resize-none border-0 focus-visible:ring-0 py-4 px-4 bg-primary-foreground"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

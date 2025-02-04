import React from "react";

import { useProviderModels } from "@/hooks/use-provider-models";
import { useApiKeys } from "@/contexts/api-key-context";

import { cn } from "@/lib/utils";
import { PROVIDERS, PROVIDER_MODELS } from "@/constants/models";
import { LLMProvider, ProviderModel } from "@/types/llm";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChevronsUpDown, Check } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: ProviderModel | null;
  onModelChange: (model: ProviderModel | null) => void;
}

function ModelInfoCard({ displayName, id, price, description }: ProviderModel) {
  return (
    <HoverCardContent side="right">
      <div className="flex justify-between mb-2">
        <div>
          <h3 className="font-medium">{displayName}</h3>
          <div className="text-xs text-muted-foreground font-mono">{id}</div>
        </div>
        <div className="text-muted-foreground text-xs">{price}</div>
      </div>
      <div className="text-xs text-muted-foreground ">{description}</div>
    </HoverCardContent>
  );
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const { getAvailableProviders, getModelsForProvider } = useProviderModels();
  const [open, setOpen] = React.useState(false);

  const activeProviders = getAvailableProviders();

  const modelDisplayLabel = selectedModel ? (
    <div className="flex items-center gap-2">
      {React.createElement(PROVIDERS[selectedModel.provider].icon)}
      <span>{selectedModel.displayName}</span>
    </div>
  ) : (
    "Select a Model"
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
          {modelDisplayLabel}
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
              const providerModels = getModelsForProvider(provider) || [];

              return (
                <React.Fragment key={provider}>
                  <CommandGroup heading={providerInfo.displayName}>
                    {providerModels.map((model) => (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <CommandItem
                            key={model.id}
                            value={model.id}
                            onSelect={() => {
                              onModelChange(model);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col">
                                <div>{model.displayName}</div>
                                <div className="font-mono text-xs text-muted-foreground">
                                  {model.id}
                                </div>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  selectedModel?.id === model.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </div>
                          </CommandItem>
                        </HoverCardTrigger>
                        <ModelInfoCard {...model} />
                      </HoverCard>
                    ))}
                  </CommandGroup>
                  {i !== arr.length - 1 && arr.length > 1 && <CommandSeparator />}
                </React.Fragment>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

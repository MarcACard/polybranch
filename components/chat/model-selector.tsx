import React from "react";

import { useProviderModels } from "@/hooks/use-provider-models";
import { useApiKeys } from "@/contexts/api-key-context";

import { cn } from "@/lib/utils";
import { PROVIDERS, PROVIDER_MODELS } from "@/constants/models";
import { LLMProvider } from "@/types/llm";

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
import { ChevronsUpDown, Check } from "lucide-react";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const { getModelsForProvider } = useProviderModels();
  const { hasApiKey } = useApiKeys();
  const [open, setOpen] = React.useState(false);

  const activeProviders = (Object.keys(PROVIDERS) as LLMProvider[]).filter((provider) =>
    hasApiKey(provider),
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
                const selectedModel = PROVIDER_MODELS.find((model) => model.modelName === value);
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
                          onChange(currentValue === value ? "" : currentValue);
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
                              value === model.modelName ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </div>
                      </CommandItem>
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

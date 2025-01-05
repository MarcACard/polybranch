import React from "react";

import {
  DEFAULT_PARAMETERS,
  PARAMETER_LIMITS,
  PARAMETERS_DISPLAY,
} from "@/constants/parameters";

import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
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
              <Label htmlFor={id}>{name}</Label>
            </HoverCardTrigger>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-forground hover:border-border">
              {value[0]}
            </span>
          </div>
          <Slider
            id={id}
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

export function ModelConfiguration() {
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
                    <div className="col-span-3" key={parameter}>
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

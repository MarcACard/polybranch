import { Panel } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { MonitorCog, SquarePen, Group, LockKeyhole } from "lucide-react";

export function AppToolbar() {
  return (
    <Panel position="top-center">
      <div className="flex p-1 gap-1 drop-shadow-md rounded-md border bg-background">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <LockKeyhole />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Unlock Nodes</p>
          </TooltipContent>
        </Tooltip>
        <div className="py-1">
          <Separator orientation="vertical" />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <MonitorCog />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add System Prompt</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <SquarePen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Note</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <Group />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Group Messages</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </Panel>
  );
}

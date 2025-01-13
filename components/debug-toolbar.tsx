import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FilePlus, Trash2 } from "lucide-react";

// TODO: Conditionally Render? - Pass State from Layer up -> View / Hide
export function DebugToolbar({
  addTestMessage,
  deleteAll,
}: {
  addTestMessage: () => void;
  deleteAll: () => void;
}) {
  return (
    <div className="fixed bottom-1/2 right-0 mr-4 pointer-events-none z-50">
      <div className="pointer-events-auto  drop-shadow-md">
        <div className="flex flex-col p-1 gap-1 rounded-full bg-background border-2 border-destructive">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={addTestMessage} size="icon" variant="ghost" className="rounded-full">
                <FilePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add Test Message</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={deleteAll} size="icon" variant="ghost" className="rounded-full">
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Delete All</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

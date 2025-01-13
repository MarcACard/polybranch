import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FilePlus, FileX } from "lucide-react";

// TODO: Conditionally Render? - Pass State from Layer up -> View / Hide
export function DebugToolbar({ addTestMessage }: { addTestMessage: () => void }) {
  return (
    <div className="fixed bottom-1/2 right-0 mr-4 pointer-events-none z-50">
      <div className="pointer-events-auto  drop-shadow-md">
        <div className="flex flex-col p-1 gap-1 rounded bg-background border-2 border-red-500">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={addTestMessage} size="icon" variant="ghost">
                <FilePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add Test Message</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="">
                <FileX />
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

import { Handle, Position, NodeProps } from "@xyflow/react";
import { MessageNodeData } from "@/types/nodes";

import { Ellipsis, Trash2, Pencil, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageNodeMenuProps {
  id: string | null;
  role: "user" | "assistant" | "system";
}

export function MessageNodeMenu({ id, role }: MessageNodeMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Message Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {role === "user" && (
          // TODO: Setup Edit Functionality
          <DropdownMenuItem onClick={() => console.log(`Edit Node: ${id}`)}>
            <Pencil className="muted-text-foreground" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        {role === "assistant" && (
          // TODO: Setup Regenerate Functionality
          <DropdownMenuItem onClick={() => console.log(`Regenerate Node: ${id}`)}>
            <RefreshCcw className="muted-text-foreground" />
            <span>Regenerate</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Trash2 className="muted-text-foreground" />
            <span>Delete</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                // TODO: Setup Delete Functionality from Sub-Menu
                onClick={() => {
                  console.log(`Delete node: ${id}`);
                }}
              >
                Selected Node
              </DropdownMenuItem>
              <DropdownMenuItem
                // TODO: Setup Delete All Children Functionality from Sub-Menu
                onClick={() => {
                  console.log(`Delete sub node and all children of: ${id}`);
                }}
              >
                Selected Node & Below
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

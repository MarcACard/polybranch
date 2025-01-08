
import { Handle, Position, NodeProps } from "@xyflow/react";
import { MessageNodeData } from "@/types/nodes";
import { usePolyBranch} from "@/contexts/polybranch-context"

import { cn } from "@/lib/utils"
import { Ellipsis, Trash2, Pencil, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"

// TODO: Structure and pull from types?
interface MessageNodeMenuProps {
  id: string | null;
  parentId: string | null;
  role: "user" | "assistant" | "system"
}


export function MessageNodeMenu({ id, parentId, role }: MessageNodeMenuProps) {
  const { deleteMessageNode } = usePolyBranch();
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
          <DropdownMenuItem>
            <Pencil className="muted-text-foreground" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        {role === "assistant" && (<DropdownMenuItem>
          <RefreshCcw className="muted-text-foreground" />
          <span>Regenerate</span>
        </DropdownMenuItem>)}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Trash2 className="muted-text-foreground" />
            <span>Delete</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={()=> {deleteMessageNode(id)}}>Selected Node</DropdownMenuItem>
              <DropdownMenuItem>Selected Node & Below</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
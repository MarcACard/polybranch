import type { ReactNode } from "react";
import { Panel } from "@xyflow/react";

import { ProviderKeyManager } from "@/components/api-key-manager";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { SiX, SiGithub, IconType } from "@icons-pack/react-simple-icons";
import { Trash2, ImageDown, Menu, KeyRound, FolderDown } from "lucide-react";

interface ExternalLinkMenuItemProps {
  icon: IconType;
  children: ReactNode;
  href: string;
}

const ExternalLinkMenuItem = ({ icon: Icon, children, href }: ExternalLinkMenuItemProps) => (
  <DropdownMenuItem asChild>
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon size={16} />
      <span>{children}</span>
    </a>
  </DropdownMenuItem>
);

export function AppMainMenu({ onCanvasReset }: { onCanvasReset: () => void }) {
  return (
    <Panel position="top-left">
      <Sheet>
        <AlertDialog>
          <div className="pointer-events-auto inline-block drop-shadow-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-48"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <SheetTrigger asChild>
                  <DropdownMenuItem>
                    <KeyRound />
                    <span>API Keys</span>
                  </DropdownMenuItem>
                </SheetTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ImageDown />
                  <span>Export Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderDown />
                  <span>Export Data</span>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Trash2 />
                    <span>Reset Canvas</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <DropdownMenuSeparator />
                <ExternalLinkMenuItem
                  icon={SiGithub}
                  href="https://github.com/MarcACard/polybranch"
                >
                  Github
                </ExternalLinkMenuItem>
                <ExternalLinkMenuItem icon={SiX} href="https://x.com/marcard">
                  Say Hello
                </ExternalLinkMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <KeyRound />
                  <span>API Key Storage</span>
                </div>
              </SheetTitle>
              <SheetDescription>
                Manage your API Keys for supported providers. All keys will be stored locally within
                your browser client.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <ProviderKeyManager />
            </div>
          </SheetContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently{" "}
                <span className="font-bold">delete all</span> messages within the existing canvas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onCanvasReset}
                className={buttonVariants({ variant: "destructive" })}
              >
                Reset Canvas
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Sheet>
    </Panel>
  );
}

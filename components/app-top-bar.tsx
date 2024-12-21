import type { ReactNode } from "react";
import { SiGithub, SiX, IconType } from "@icons-pack/react-simple-icons";
import { Menu, KeyRound, MessageSquare, Scroll } from "lucide-react";

import { ProviderKeyManager} from "@/components/api-key-manager";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { DialogItem } from "@/components/ui/dialog-item";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SheetItem } from "@/components/ui/sheet-item";

interface ExternalLinkMenuItemProps {
  icon: IconType;
  children: ReactNode;
  href: string;
}

const ExternalLinkMenuItem = ({
  icon: Icon,
  children,
  href,
}: ExternalLinkMenuItemProps) => (
  <DropdownMenuItem asChild>
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon size={16} />
      <span>{children}</span>
    </a>
  </DropdownMenuItem>
);

export function AppTopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 p-4 pointer-events-none z-50">
      <div className="pointer-events-auto inline-block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-48">
            {/* API Keys Menu Item */}
            <SheetItem
              triggerChildren={
                <>
                  <KeyRound />
                  <span>API Keys</span>
                </>
              }
            >
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <KeyRound />
                    <span>API Key Storage</span>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  Manage your API Keys for supported providers. All keys will
                  be stored locally within your browser client.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <ProviderKeyManager />
              </div>
            </SheetItem>

            {/* Feedback Menu Item */}
            <DialogItem
              triggerChildren={
                <>
                  <MessageSquare />
                  <span>Give Feedback</span>
                </>
              }
            >
              <DialogHeader>Give Feedback</DialogHeader>
              <DialogDescription>Feedback Yo, ho ho ho</DialogDescription>
            </DialogItem>

            {/* Releaase Notes Menu Item */}
            <DialogItem
              triggerChildren={
                <>
                  <Scroll />
                  <span>Release Notes</span>
                </>
              }
            >
              <DialogHeader>Release Notes</DialogHeader>
              <DialogDescription>Feedback Yo, ho ho ho</DialogDescription>
            </DialogItem>

            <DropdownMenuSeparator />

            <ExternalLinkMenuItem icon={SiGithub} href="https://github.com/MarcACard/polybranch">
              Github
            </ExternalLinkMenuItem>

            <ExternalLinkMenuItem icon={SiX} href="https://www.x.com/marcard">
              Say Hello
            </ExternalLinkMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

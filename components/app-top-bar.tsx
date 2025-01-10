import type { ReactNode } from "react";

import { ProviderKeyManager } from "@/components/api-key-manager";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { SheetItem } from "@/components/ui/sheet-item";
import { SiGithub, IconType } from "@icons-pack/react-simple-icons";
import { Menu, KeyRound } from "lucide-react";

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

export function AppTopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 p-4 pointer-events-none z-50">
      <div className="pointer-events-auto inline-block drop-shadow-md">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" className="">
              <Menu />
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
                  Manage your API Keys for supported providers. All keys will be stored locally
                  within your browser client.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <ProviderKeyManager />
              </div>
            </SheetItem>

            <DropdownMenuSeparator />

            <ExternalLinkMenuItem icon={SiGithub} href="https://github.com/MarcACard/polybranch">
              Github
            </ExternalLinkMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

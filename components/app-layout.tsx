import { ReactFlowProvider } from "@xyflow/react";
import { AppTopBar } from "@/components/app-top-bar";
import { MessageInput } from "@/components/message-input";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ReactFlowProvider>
        <AppTopBar />
        <main className="w-full h-full">{children}</main>
        <MessageInput />
      </ReactFlowProvider>
    </div>
  );
}

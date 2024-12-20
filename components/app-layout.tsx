import { ReactFlowProvider } from "@xyflow/react";
import { AppTopBar } from "@/components/app-top-bar";


interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ReactFlowProvider>
        <AppTopBar />
        <main className="w-full h-full">{children}</main>
      </ReactFlowProvider>
    </div>
  );
}

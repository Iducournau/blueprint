"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header - visible only on mobile */}
      <MobileHeader />

      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          "md:pl-[var(--sidebar-width)]",
          "pb-20 md:pb-0"
        )}
        style={
          {
            "--sidebar-width": isCollapsed ? "80px" : "256px",
          } as React.CSSProperties
        }
      >
        {children}
      </main>

      {/* Bottom nav - visible only on mobile */}
      <BottomNav />
    </div>
  );
}
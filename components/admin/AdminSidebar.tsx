"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ADMIN_NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Wrench,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Gamepad2,
  Camera,
  Mail,
  Link as LinkIcon,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Map icon string to Lucide component
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  User,
  Wrench,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Gamepad2,
  Camera,
  Mail,
  Link: LinkIcon,
  Settings,
};

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("rianpedia_admin_token");
    router.push("/login");
  };

  const navContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border/60">
      {/* Brand Title header */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-heading text-sm font-bold tracking-wider text-gradient">
            {SITE_CONFIG.name.toUpperCase()} CMS
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>
        
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-sidebar-foreground border border-sidebar-border"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Nav List link list */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 no-scrollbar">
        {ADMIN_NAV_ITEMS.map((item) => {
          const IconComponent = iconMap[item.icon] || HelpCircle;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider font-heading uppercase transition-all duration-200 border",
                isActive
                  ? "bg-primary border-transparent text-white shadow-[0_0_10px_var(--crimson-glow)]"
                  : "bg-transparent border-transparent hover:bg-sidebar-accent hover:border-sidebar-border text-muted-foreground hover:text-foreground"
              )}
            >
              <IconComponent className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer logout area */}
      <div className="p-4 border-t border-sidebar-border/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider font-heading uppercase transition-all duration-200 bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white cursor-pointer select-none"
        >
          <LogOut className="h-4 w-4" />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden h-14 border-b border-border bg-background flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-30">
        <Link href="/" className="font-heading font-bold text-sm text-gradient">
          {SITE_CONFIG.name.toUpperCase()} CMS
        </Link>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-border"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Sidebar drawer */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile Overlay Sidebar drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
          <div className="w-64 h-full relative z-50">
            {navContent}
          </div>
          {/* backdrop close click */}
          <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}

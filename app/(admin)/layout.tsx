"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Spinner } from "@/components/ui/Spinner";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage (mock auth)
    const token = localStorage.getItem("jemiarian_admin_token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

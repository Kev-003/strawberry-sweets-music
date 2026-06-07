"use client";

import { useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/layout/AppSidebar";
import { AppHeader } from "@/layout/AppHeader";
import { Backdrop } from "@/layout/Backdrop";

export default function BandPage() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Band Dashboard
          </h1>
        </div>
      </div>
    </div>
  );
}

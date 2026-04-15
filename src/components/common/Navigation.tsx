"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Home, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/common/theme-provider";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const navItems = [
    {
      href: "/",
      label: "首页",
      icon: Home,
      description: "考试练习",
    },
    {
      href: "/photo-processor",
      label: "照片处理",
      icon: Camera,
      description: "报名照片",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card p-1 shadow-xs ring-1 ring-border">
                <Image
                  src="/pwa-icon.svg"
                  alt="网站图标"
                  width={32}
                  height={32}
                  className="h-full w-full"
                />
              </div>
              <span className="hidden font-semibold text-foreground sm:block">业余无线电考试</span>
            </div>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:block">{item.label}</span>
                    <span className="sm:hidden">{item.description}</span>
                  </Link>
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label={resolvedTheme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
              title={resolvedTheme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

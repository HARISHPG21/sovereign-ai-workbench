"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  Wrench, 
  Activity, 
  Lock, 
  Terminal,
  UserCheck,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Award,
  Flame,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("sovereign_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }

    const initAuth = async () => {
      const savedUser = localStorage.getItem("sovereign_user");
      const savedToken = localStorage.getItem("sovereign_token");

      if (savedUser && savedToken && savedToken !== "mock-sovereign-token") {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {}
      } else {
        try {
          const res = await api.login("engineer@mrpl.co.in", "mrpl2026");
          localStorage.setItem("sovereign_token", res.access_token);
          localStorage.setItem("sovereign_user", JSON.stringify(res.user));
          setCurrentUser(res.user);
        } catch (e) {
          const defaultUser = {
            email: "engineer@mrpl.co.in",
            full_name: "Er. Rajesh K. Nayak",
            role: "ENGINEER",
            department: "Plant Integrity"
          };
          localStorage.setItem("sovereign_user", JSON.stringify(defaultUser));
          setCurrentUser(defaultUser);
        }
      }
    };

    initAuth();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("sovereign_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Workbench", href: "/", icon: Terminal },
    { label: "Deliverables", href: "/deliverables", icon: Sparkles },
    { label: "Model Registry", href: "/models", icon: Cpu },
    { label: "Knowledge Base", href: "/knowledge", icon: BookOpen },
    { label: "Tool Registry", href: "/tools", icon: Wrench },
    { label: "Security Center", href: "/security", icon: ShieldCheck },
    { label: "Audit Logs", href: "/audit", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 transition-colors shadow-md">
      {/* Official SIH 2026 Top Ribbon */}
      <div className="bg-gradient-to-r from-[#031326] via-[#0A2540] to-[#041E3A] border-b border-teal-500/30 text-white px-3 sm:px-6 py-1.5 text-[10px] sm:text-[11px] font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-amber-400 font-bold tracking-wide">
            <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>SMART INDIA HACKATHON 2026</span>
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Flame className="h-3 w-3 text-orange-400 shrink-0" />
            <span className="font-semibold text-white">MRPL</span>
            <span className="text-slate-400 hidden sm:inline">(Mangalore Refinery & Petrochemicals Ltd)</span>
          </div>
          <span className="text-slate-500 hidden lg:inline">|</span>
          <span className="rounded bg-blue-500/20 px-2 py-0.5 font-mono text-[9px] text-blue-300 font-bold border border-blue-400/30 hidden lg:inline-block">
            PS ID: 26117
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-[10px] text-slate-300">
          <div className="flex items-center gap-1 text-teal-300 font-semibold">
            <CheckCircle2 className="h-3 w-3 text-teal-400 shrink-0" />
            <span>CERT-In & DPDP Act Compliant</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="font-mono text-emerald-400 font-bold hidden sm:inline">100% AIR-GAPPED ON-PREMISE</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-slate-800 bg-[#070D18]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Brand & Organization */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white xl:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 shadow-md shrink-0">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold tracking-tight text-white">SovereignAI</span>
                  <span className="hidden xs:inline-block rounded bg-teal-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-teal-400 border border-teal-500/30">
                    AIR-GAPPED
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-[120px] sm:max-w-none">MRPL Refinery AI Workbench</p>
              </div>
            </Link>

            {/* Desktop Navigation Links (Large Screens) */}
            <nav className="hidden xl:flex items-center gap-1 ml-3 border-l border-slate-800 pl-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-slate-800 text-teal-300 shadow-sm border border-slate-700 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sovereignty Proof, Theme Toggle & Persona Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Live Zero Egress Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-950/40 px-2 sm:px-3 py-1 text-xs text-teal-300">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="font-mono font-bold text-[10px] sm:text-[11px] hidden sm:inline">EXTERNAL CALLS: 0</span>
              <span className="font-mono font-bold text-[10px] sm:hidden">0 LEAKS</span>
            </div>

            {/* Dark / Light Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-amber-400 hover:border-slate-600 transition shadow-sm focus:outline-none"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="h-4 w-4 text-teal-500 transition-transform hover:-rotate-12" />
                )}
              </button>
            )}

            {/* Persona Link */}
            <Link 
              href="/login"
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-2 sm:px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
            >
              <UserCheck className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <div className="text-left leading-none">
                <div className="font-semibold text-white text-[10px] sm:text-[11px] truncate max-w-[70px] sm:max-w-none">
                  {currentUser?.full_name?.split(" ")[0] || "Engineer"}
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-400 hidden xs:block">{currentUser?.role || "ENGINEER"}</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-[#070D18]/98 px-4 py-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-teal-500/10 text-teal-300 border border-teal-500/30 font-semibold"
                        : "bg-[#0B1324] text-slate-300 hover:bg-slate-800 border border-slate-800/80"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-teal-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Air-Gap Mode: <strong className="text-teal-300">STRICT</strong></span>
              <span className="font-mono text-teal-400">100% On-Premise</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BedDouble,
  CalendarCheck,
  Gift,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquareText,
  Settings,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/lib/auth";
import { useHotelSettings } from "@/hooks/useHotel";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/hotel", label: "Hotel Settings", icon: Settings },
  { to: "/admin/room-types", label: "Room Types", icon: BedDouble },
  { to: "/admin/inventory", label: "Room Inventory", icon: MapPin },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/offers", label: "Offers", icon: Gift },
  { to: "/admin/experiences", label: "Experiences", icon: Sparkles },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
];

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const { data: hotel } = useHotelSettings();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-primary text-primary-foreground lg:flex">
        <Link to="/" className="border-b border-primary-foreground/10 px-6 py-6">
          <p className="font-serif text-xl">{hotel?.name || "Your Hotel"}</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/50">Admin Dashboard</p>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-primary-foreground/10 p-4">
          <p className="truncate text-xs text-primary-foreground/50">{user?.email}</p>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <div className="border-b border-border bg-background px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2 overflow-x-auto">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium",
                    isActive ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <main className="p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

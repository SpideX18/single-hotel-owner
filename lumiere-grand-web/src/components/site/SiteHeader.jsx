import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, CalendarCheck, Home, LayoutDashboard, LogOut, Menu, Sparkles, User2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { useHotelSettings } from "@/hooks/useHotel";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useContent";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/rooms", label: "Rooms" },
  { to: "/availability", label: "Availability" },
  { to: "/offers", label: "Offers" },
  { to: "/experiences", label: "Experiences" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { data: hotel } = useHotelSettings();
  const { data: notifications = [] } = useNotifications(!!user);
  const markRead = useMarkNotificationRead();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;
  const unread = notifications.filter((n) => !n.read).length;
  const hotelName = hotel?.name || "Your Hotel";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "border-b border-border bg-background/92 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 md:h-20 lg:px-12">
        <Link to="/" className="group flex items-baseline gap-2 min-w-0">
          <span
            className={cn(
              "truncate font-serif text-xl leading-none tracking-tight transition-colors md:text-2xl",
              solid ? "text-foreground" : "text-white"
            )}
          >
            {hotelName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative text-[0.8125rem] font-medium tracking-wide transition-colors",
                  solid ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white",
                  active && (solid ? "text-foreground" : "text-white")
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300",
                    active && "scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "relative hidden size-9 items-center justify-center rounded-full border transition-colors sm:flex",
                    solid ? "border-border text-foreground hover:border-gold" : "border-white/30 text-white"
                  )}
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  {unread > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-primary-foreground">
                      {unread}
                    </span>
                  ) : null}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <p className="px-2 py-3 text-xs text-muted-foreground">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className="flex cursor-pointer gap-3 px-2 py-2.5"
                      onClick={() => !n.read && markRead.mutate(n.id)}
                    >
                      <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.read ? "bg-border" : "bg-gold")} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">{n.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={solid ? "quiet" : "glass"} size="sm" className="hidden sm:inline-flex">
                  <User2 className="size-4" />
                  <span className="max-w-24 truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "admin" ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <LayoutDashboard className="size-4" /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings">
                      <CalendarCheck className="size-4" /> My Bookings
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant={solid ? "ghost" : "glass"} size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
          )}

          <Button asChild variant={solid ? "default" : "gold"} size="sm" className="hidden md:inline-flex">
            <Link to="/availability">Book a Stay</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex size-9 items-center justify-center rounded-sm border transition-colors lg:hidden",
                  solid ? "border-border text-foreground" : "border-white/30 text-white"
                )}
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto">
              <SheetTitle className="font-serif text-xl">{hotelName}</SheetTitle>
              <nav className="mt-8 flex flex-col">
                <Link to="/" onClick={() => setOpen(false)} className="hairline py-3.5 text-sm">
                  Home
                </Link>
                {nav.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="hairline py-3.5 text-sm">
                    {item.label}
                  </Link>
                ))}
                {user?.role === "admin" ? (
                  <Link to="/admin" onClick={() => setOpen(false)} className="hairline py-3.5 text-sm">
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/my-bookings" onClick={() => setOpen(false)} className="hairline py-3.5 text-sm">
                    My Bookings
                  </Link>
                )}
              </nav>
              <div className="mt-8 flex flex-col gap-3">
                <Button asChild variant="gold" size="lg" onClick={() => setOpen(false)}>
                  <Link to="/availability">Check Availability</Link>
                </Button>
                {user ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate("/");
                    }}
                  >
                    Sign out
                  </Button>
                ) : (
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/login">Sign in</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const mobileNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/rooms", label: "Rooms", icon: Sparkles },
  { to: "/availability", label: "Book", icon: CalendarCheck },
  { to: "/my-bookings", label: "Trips", icon: User2 },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4">
        {mobileNav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-colors",
                active ? "text-gold" : "text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

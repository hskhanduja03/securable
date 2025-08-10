import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  CreditCard,
  BarChart3,
  ArrowUpDown,
  CreditCardIcon,
  Settings,
  Menu,
  ChevronRight,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type NavChild = {
  label: string;
  href: string;
  id?: string;
};

type NavItem = {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  hasChildren?: boolean;
  children?: NavChild[];
};
const baseNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: CreditCard, label: "Cards", href: "/cards" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: ArrowUpDown, label: "Transactions", href: "/transactions" },
  {
    icon: CreditCardIcon,
    label: "Payment Methods",
    href: "/paymentgroups",
    hasChildren: true,
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { paymentMethods } = useAuth();

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const navItems = useMemo(() => {
    return baseNavItems.map((item) => {
      if (item.hasChildren && paymentMethods && Array.isArray(paymentMethods)) {
        return {
          ...item,
          children: paymentMethods.map((method) => ({
            label:
              method.name ||
              method.title ||
              `Payment Method ${method._id.slice(-4)}`,
            href: `/paymentgroups/${method._id}`,
            id: method._id,
          })),
        };
      }
      return item;
    });
  }, [paymentMethods]);

  const SidebarContent = () => (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative h-full bg-background border-r border-border flex flex-col justify-between",
        "transition-all duration-300 ease-in-out"
      )}
    >
      {/* Logo & Expand Button */}
      <Link
        href={"/dashboard"}
        className="flex items-center justify-between px-4 h-16 border-b border-border"
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600">
            <Target className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold">Trackr</span>
          )}
        </div>
      </Link>

      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isParentActive = pathname.startsWith(item.href);
          const isDropdownOpen = openDropdown === item.label;

          return (
            <div key={item.href}>
              {/* Parent link or dropdown trigger */}
              {item.children ? (
                <div
                  className={cn(
                    "group flex items-center justify-between transition-all px-4 py-3 text-sm font-medium",
                    isParentActive
                      ? "bg-orange-100 text-orange-600 border-l-4 border-orange-500"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  {/* Left part: navigates */}
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center flex-1"
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>

                  {/* Right part: dropdown toggle */}
                  {!isCollapsed && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // prevent Link navigation
                        e.stopPropagation(); // avoid bubbling
                        toggleDropdown(item.label);
                      }}
                      className="ml-2 p-1 rounded hover:bg-muted transition"
                    >
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          isDropdownOpen && "rotate-90"
                        )}
                      />
                    </button>
                  )}
                </div>
              ) : (
                // Regular link for non-dropdown items
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "group flex items-center transition-all px-4 py-3 text-sm font-medium",
                    isParentActive
                      ? "bg-orange-100 text-orange-600 border-l-4 border-orange-500"
                      : "hover:bg-muted text-muted-foreground",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              )}

              {/* Dropdown children */}
              <AnimatePresence>
                {item.children && isDropdownOpen && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-10 pr-4 space-y-1"
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "block px-2 py-2 rounded-md text-sm font-medium transition",
                            isChildActive
                              ? "bg-orange-50 text-orange-600"
                              : "hover:bg-muted text-muted-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Settings Icon */}
      <div className="border-t border-border p-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-all",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen fixed left-0 top-0 z-30">
        {SidebarContent()}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="fixed z-50 h-screen top-0 left-0 bg-background border-r border-border"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

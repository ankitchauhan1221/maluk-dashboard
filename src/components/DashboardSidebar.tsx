
import { Home, ShoppingBag, BarChart2, Users, Settings, FolderTree, Tag, Percent, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: ShoppingBag, label: "Products", href: "/products" },
  { icon: FolderTree, label: "Categories", href: "/categories" },
  { icon: Tag, label: "Subcategories", href: "/subcategories" },
  { icon: Percent, label: "Coupons", href: "/coupons" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className={cn("font-bold text-xl", collapsed && "hidden")}>Admin</h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={collapsed ? "M13 19l9-7 -9-7v14z" : "M11 19l-9-7 9-7v14z"}
            />
          </svg>
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors",
                  location.pathname === item.href && "bg-secondary"
                )}
              >
                <item.icon className="w-6 h-6 text-gray-500" />
                {!collapsed && (
                  <span className="font-medium text-gray-700">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

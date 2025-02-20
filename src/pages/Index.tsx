
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StatsCard } from "@/components/StatsCard";
import { DollarSign, ShoppingBag, Users, TrendingUp, Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  timestamp: Date;
}

const Index = () => {
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Simulate receiving new orders
    const interval = setInterval(() => {
      const newOrder: Order = {
        id: `ORD${Math.floor(Math.random() * 1000)}`,
        customer: "New Customer",
        items: Math.floor(Math.random() * 5) + 1,
        total: Math.floor(Math.random() * 500) + 50,
        timestamp: new Date(),
      };
      
      setNewOrders(prev => [...prev, newOrder]);
      setShowNotification(true);
    }, 30000); // New order every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const clearNotifications = () => {
    setNewOrders([]);
    setShowNotification(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Bar */}
      <div
        className={cn(
          "fixed top-0 left-64 right-0 bg-primary text-white p-4 transform transition-transform duration-300 z-50",
          showNotification ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span className="font-medium">
              {newOrders.length} New Order{newOrders.length !== 1 ? 's' : ''}
            </span>
            {newOrders.length > 0 && (
              <span className="text-sm">
                Latest: {newOrders[newOrders.length - 1].id} - ${newOrders[newOrders.length - 1].total}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = '/orders'}
            >
              View Orders
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="text-white hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <DashboardSidebar />
      <main className={cn(
        "ml-64 p-8 animate-fade-in",
        showNotification && "mt-16"
      )}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back to your store overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            icon={<DollarSign className="w-6 h-6 text-primary" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Orders"
            value="1,234"
            icon={<ShoppingBag className="w-6 h-6 text-primary" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Total Customers"
            value="3,456"
            icon={<Users className="w-6 h-6 text-primary" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Conversion Rate"
            value="2.4%"
            icon={<TrendingUp className="w-6 h-6 text-primary" />}
            trend={{ value: 1.1, isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[...newOrders].reverse().slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.items} items • ${order.total}</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                    New
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((product) => (
                <div key={product} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="font-medium">Product {product}</p>
                    <p className="text-sm text-gray-600">234 sales</p>
                  </div>
                  <p className="font-medium">$1,234</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

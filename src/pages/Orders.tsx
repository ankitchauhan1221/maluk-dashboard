
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Download,
  Upload,
  Filter,
  RefreshCw,
  Search,
  CheckSquare,
  XSquare,
  Clock,
  TruckIcon,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customer: "John Doe",
      date: "2024-03-15",
      total: 299.99,
      status: "pending",
      items: 3,
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      date: "2024-03-14",
      total: 159.99,
      status: "processing",
      items: 2,
    },
    {
      id: "ORD003",
      customer: "Bob Johnson",
      date: "2024-03-13",
      total: 499.99,
      status: "shipped",
      items: 5,
    },
  ]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      case "shipped":
        return <TruckIcon className="w-4 h-4" />;
      case "delivered":
        return <CheckSquare className="w-4 h-4" />;
      case "cancelled":
        return <XSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBulkStatusUpdate = (newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      selectedOrders.includes(order.id) 
        ? { ...order, status: newStatus } 
        : order
    ));
  };

  const handleSingleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    ));
  };

  const handleImport = () => {
    console.log("Importing orders...");
  };

  const handleExport = () => {
    console.log("Exporting orders...");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomOrder = {
        id: `ORD${Math.floor(Math.random() * 1000)}`,
        customer: "New Customer",
        items: Math.floor(Math.random() * 5) + 1,
      };
      
      toast.success(`New Order Received!`, {
        description: `Order ${randomOrder.id} from ${randomOrder.customer} (${randomOrder.items} items)`,
      });
    }, 30000); // Show notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="mt-2 text-gray-600">Manage and track your orders</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleImport} variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Import
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} orders selected
                  </span>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    onChange={(e) => handleBulkStatusUpdate(e.target.value as OrderStatus)}
                  >
                    <option value="">Update Status</option>
                    <option value="processing">Mark as Processing</option>
                    <option value="shipped">Mark as Shipped</option>
                    <option value="delivered">Mark as Delivered</option>
                    <option value="cancelled">Mark as Cancelled</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setSelectedOrders(
                          e.target.checked ? orders.map((order) => order.id) : []
                        );
                      }}
                      checked={selectedOrders.length === orders.length}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          setSelectedOrders(
                            e.target.checked
                              ? [...selectedOrders, order.id]
                              : selectedOrders.filter((id) => id !== order.id)
                          );
                        }}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2",
                            getStatusColor(order.status)
                          )}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                        value={order.status}
                        onChange={(e) => handleSingleStatusUpdate(order.id, e.target.value as OrderStatus)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;

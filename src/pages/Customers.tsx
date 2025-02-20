import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { baseurl, routes } from "@/common/config";
import { CustomerSkeleton } from "@/components/skeletons/customerskeleton";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    country: string;
    streetAddress: string;
    city: string;
    state: string;
  };
  status: "active" | "inactive";
  orders: number;
}


const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${baseurl}/api/profile/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      const customersOnly = users.filter((user: any) => user.role !== "admin");
      const customersWithAddress = customersOnly.map((user: any) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || {
          country: "Unknown",
          streetAddress: "Unknown",
          city: "Unknown",
          state: "Unknown",
        },
        status: user.status || "inactive",
        orders: user.orders || 0,
      }));

      setCustomers(customersWithAddress);
    } catch (error) {
      toast.error(`Error fetching customers: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleCustomerStatus = async (customerId: string) => {
    setIsLoading(true);
    try {
      const customer = customers.find(c => c._id === customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const newStatus = customer.status === "active" ? "inactive" : "active";

      // Optimistically update the state
      setCustomers(prevCustomers =>
        prevCustomers.map(customer =>
          customer._id === customerId
            ? { ...customer, status: newStatus }
            : customer
        )
      );

      console.log("Optimistic update:", newStatus);

      const response = await fetch(`${baseurl}${routes.toggleCustomerStatus(customer._id)}`, {
        method: 'PUT',
        body: JSON.stringify({ userId: customerId, status: newStatus }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update customer status");
      }

      const updatedCustomer = await response.json();

      console.log("API response:", updatedCustomer);

      // Update the state with the response from the server
      setCustomers(prevCustomers =>
        prevCustomers.map(customer =>
          customer._id === customerId
            ? { ...customer, status: newStatus }
            : customer
        )
      );

      toast.success("Customer status updated!");
    } catch (error) {
      console.error("Error updating customer status:", error);

      toast.error(`Error updating customer status: ${error.message}`);

      // Revert the state if the API call fails
      setCustomers(prevCustomers =>
        prevCustomers.map(customer =>
          customer._id === customerId
            ? { ...customer, status: customer.status === "active" ? "inactive" : "active" }
            : customer
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-2 text-gray-600">Manage your customer base</p>

        <div className="grid gap-6 !mt-8">
          {isLoading ? (
            // Show multiple skeleton cards while loading
            Array.from({ length: 3 }).map((_, index) => (
              <CustomerSkeleton key={index} />
            ))
          ) : (
            customers.map(customer => (
              <div key={customer._id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="grid gap-2 mt-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <div>
                            {customer.address.country}, {customer.address.streetAddress}, {customer.address.city}, {customer.address.state}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-4">
                    <div className="flex items-center gap-3 mb-2 justify-end">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Switch
                        checked={customer.status === "active"}
                        onCheckedChange={() => toggleCustomerStatus(customer._id)}
                      />
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        customer.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {customer.status === "active" ? "active" : "inactive"}
                    </span>
                    <p className="mt-2 text-sm text-gray-600">{customer.orders} orders</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Customers;
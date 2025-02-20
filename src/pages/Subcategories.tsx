import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, Edit, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { baseurl, routes } from "../common/config"; // Import API routes

interface Subcategory {
  _id: string; // Use _id for MongoDB
  name: string;
  category: string; // Use category instead of parentCategory
  productCount: number; // Use productCount instead of products
  status: "Active" | "Inactive";
}

interface Category {
  _id: string;
  name: string;
}

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    categoryId: "", // Use categoryId instead of parentCategory
  });
  const [categories, setCategories] = useState<Category[]>([]); // Store full category objects

  // Fetch subcategories and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subcategories
        const subcategoriesResponse = await fetch(`${baseurl}${routes.getAllSubcategories}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!subcategoriesResponse.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const subcategoriesData = await subcategoriesResponse.json();
        setSubcategories(subcategoriesData);

        // Fetch categories
        const categoriesResponse = await fetch(`${baseurl}${routes.getCategories}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData); // Store full category objects
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, []);

  // Toggle subcategory status
  const handleStatusToggle = async (id: string) => {
    try {
      const subcategory = subcategories.find((sub) => sub._id === id);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }

      console.log(subcategory,"wffnkwnkkn")
      const newStatus = subcategory.status === "Active" || subcategory.status === "active" ? "inactive" : "active";
      const response = await fetch(`${baseurl}${routes.toggleSubCategoryStatus(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle subcategory status");
      }

      const updatedSubcategory = await response.json();
      setSubcategories((prev) =>
        prev.map((sub) =>
          sub._id === id ? { ...sub, status: updatedSubcategory.status } : sub
        )
      );

      toast.success("Subcategory status updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Edit subcategory
  const handleEdit = (subcategory: Subcategory) => {
    setEditingId(subcategory._id);
    setEditName(subcategory.name);
  };

  // Save edited subcategory
  const handleSaveEdit = async (id: string) => {
    try {
      const response = await fetch(`${baseurl}${routes.editSubCategory(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subcategory");
      }

      const updatedSubcategory = await response.json();
      setSubcategories((prev) =>
        prev.map((sub) =>
          sub._id === id ? { ...sub, name: updatedSubcategory.name } : sub
        )
      );

      setEditingId(null);
      setEditName("");
      toast.success("Subcategory updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete subcategory
  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  // Confirm delete subcategory
  const confirmDelete = async () => {
    if (deletingId) {
      try {
        const response = await fetch(`${baseurl}${routes.deleteSubCategory(deletingId)}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete subcategory");
        }

        setSubcategories((prev) => prev.filter((sub) => sub._id !== deletingId));
        toast.success("Subcategory deleted successfully");
        setDeletingId(null);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Add new subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(`${baseurl}${routes.addSubcategory}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: newSubcategory.name,
          categoryId: newSubcategory.categoryId, // Use categoryId
          // status:'active'
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add subcategory");
      }

      const newSubcategoryData = await response.json();
      setSubcategories((prev) => [...prev, newSubcategoryData]);
      setIsAddOpen(false);
      setNewSubcategory({ name: "", categoryId: "" });
      toast.success("Subcategory added successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Subcategories</h1>
            <p className="mt-2 text-gray-600">Manage your product subcategories</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] mx-4 md:mx-0">
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
                <DialogDescription>
                  Create a new subcategory for your products
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subcategory Name</Label>
                  <Input
                    id="name"
                    value={newSubcategory.name}
                    onChange={(e) =>
                      setNewSubcategory({ ...newSubcategory, name: e.target.value })
                    }
                    placeholder="Enter subcategory name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentCategory">Parent Category</Label>
                  <select
                    id="parentCategory"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newSubcategory.categoryId}
                    onChange={(e) =>
                      setNewSubcategory({
                        ...newSubcategory,
                        categoryId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Parent Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <Button className="w-full sm:w-auto" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="w-full sm:w-auto" onClick={handleAddSubcategory}>
                    Add Subcategory
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
 
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Parent Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Products</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcategory) => (
                  <tr key={subcategory._id} className="border-b">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                          <Tag className="w-5 h-5 text-primary" />
                        </div>
                        {editingId === subcategory._id ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-8 w-full sm:w-[200px]"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(subcategory._id)}
                                className="h-8"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                className="h-8"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium">{subcategory.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                    {subcategory.category?.name || "N/A"}
                      </td>
                    <td className="px-6 py-4 text-gray-600">{subcategory.productCount} products</td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusToggle(subcategory._id)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          subcategory.status === "Active" ||
                          subcategory.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        )}
                      >
                      {subcategory?.status }
                      </Button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(subcategory)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subcategory?._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent className="mx-4 md:mx-0">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the subcategory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setDeletingId(null)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="w-full sm:w-auto">
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Subcategories;
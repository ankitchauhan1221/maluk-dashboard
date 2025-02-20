import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FolderTree, Edit, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, ReactNode, Key } from "react";
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

interface Category {
  _id: Key;
  subcategoryCount: ReactNode;
  productCount: ReactNode;
  id: number;
  name: string;
  products: number;
  status: "Active" | "Inactive";
  subcategories: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseurl}${routes.getCategories}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleStatusToggle = async (id: string) => {
    try {
      // Find the current category to determine the new status
      const category = categories.find((cat) => cat._id === id);
      if (!category) {
        throw new Error("Category not found");
      }

      // Convert status to lowercase for consistent comparison
      const currentStatus = category.status.toLowerCase();
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      // Send the request with the new status in the body
      const response = await fetch(`${baseurl}${routes.toggleCategoryStatus(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }), // Ensure correct status format
      });

      if (!response.ok) {
        throw new Error("Failed to toggle category status");
      }

      const updatedCategory = await response.json();
      console.log("Updated Category:", updatedCategory);

      // Update the state with the new category status
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === id ? { ...cat, status: updatedCategory.status } : cat
        )
      );

      toast.success("Category status updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };


  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setEditName(category.name);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const response = await fetch(`${baseurl}${routes.editCategory(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const updatedCategory = await response.json();

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id ? updatedCategory : category
        )
      );

      setEditingId(null);
      setEditName("");
      toast.success("Category name updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        const response = await fetch(`${baseurl}${routes.deleteCategory(deletingId)}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== deletingId)
        );

        toast.success("Category deleted successfully");
        setDeletingId(null);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const response = await fetch(`${baseurl}${routes.addCategory}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: newCategory.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const data = await response.json();

      const newCategoryData: Category = {
        id: data.id, // Assuming the response includes the new category ID
        name: data.name,
        products: 0,
        status: "active",
        subcategories: 0,
      };

      setCategories([...categories, newCategoryData]);
      setIsAddOpen(false);
      setNewCategory({ name: "" });
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categories</h1>
            <p className="mt-2 text-gray-600">Manage your product categories</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] mx-4 md:mx-0">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for your products
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Enter category name"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <Button className="w-full sm:w-auto" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="w-full sm:w-auto" onClick={handleAddCategory}>Add Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <FolderTree className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    {editingId === category._id ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 w-full sm:w-[200px]"
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(category?._id)}
                            className="h-8 w-full sm:w-auto"
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
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                    )}
                    <p className="text-sm text-gray-600">
                      {category.productCount} products • {category.subcategoryCount} subcategories
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusToggle(category?._id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium w-full sm:w-auto justify-center",
                      category.status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    )}
                  >
                    {category.status}
                  </Button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="w-full sm:w-auto"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category?._id)}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent className="mx-4 md:mx-0">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category.
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

export default Categories;
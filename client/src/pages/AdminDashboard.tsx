import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { AdminSession } from "@/types";
import { Plus, LogOut, Edit2, Trash2, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminDashboardProps {
  session: AdminSession;
  onLogout: () => void;
}

export default function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  // Initialize hooks first
  const utils = trpc.useUtils();
  const { data: products = [], isLoading: productsLoading, refetch } = trpc.products.getAll.useQuery(undefined, {
    refetchInterval: 5000, // Real-time sync with frontend
  });
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

  // State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-low" | "price-high">("newest");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",
  });

  // Refetch when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
        utils.products.getCategories.invalidate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetch, utils.products.getCategories]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      imageUrl: "",
    });
    setEditingId(null);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [products, searchQuery, sortBy]);

  const handleEdit = useCallback((productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        price: (product.price / 100).toString(),
        category: product.category,
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
      setEditingId(productId);
      setIsAddDialogOpen(true);
    }
  }, [products]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const priceInCents = Math.round(parseFloat(formData.price) * 100);

      if (editingId) {
        // Optimistic update for editing
        const previousData = utils.products.getAll.getData();
        utils.products.getAll.setData(undefined, (old) =>
          old?.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  name: formData.name || p.name,
                  price: priceInCents || p.price,
                  category: formData.category || p.category,
                  description: formData.description || p.description,
                  imageUrl: formData.imageUrl || p.imageUrl,
                }
              : p
          )
        );

        try {
          await updateMutation.mutateAsync({
            id: editingId,
            name: formData.name || undefined,
            price: priceInCents || undefined,
            category: formData.category || undefined,
            description: formData.description || undefined,
            imageUrl: formData.imageUrl || undefined,
          });
          toast.success("Product updated successfully!");
        } catch (error) {
          // Rollback on error
          utils.products.getAll.setData(undefined, previousData);
          throw error;
        }
      } else {
        // Create new product
        try {
          await createMutation.mutateAsync({
            name: formData.name,
            price: priceInCents,
            category: formData.category,
            description: formData.description || undefined,
            imageUrl: formData.imageUrl || undefined,
          });
          toast.success("Product created successfully!");
        } catch (error) {
          throw error;
        }
      }

      // Invalidate related queries to sync across all pages
      await utils.products.getAll.invalidate();
      await utils.products.getCategories.invalidate();
      await refetch();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  }, [editingId, formData, createMutation, updateMutation, utils, refetch, resetForm]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      // Optimistic update for deletion
      const previousData = utils.products.getAll.getData();
      utils.products.getAll.setData(undefined, (old) =>
        old?.filter((p) => p.id !== deleteId)
      );

      try {
        await deleteMutation.mutateAsync(deleteId);
        toast.success("Product deleted successfully!");
      } catch (error) {
        // Rollback on error
        utils.products.getAll.setData(undefined, previousData);
        throw error;
      }

      // Invalidate related queries to sync across all pages
      await utils.products.getAll.invalidate();
      await utils.products.getCategories.invalidate();
      await refetch();
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  }, [deleteId, deleteMutation, utils, refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold serif mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, <span className="font-semibold">{session.username}</span></p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card/50">
            <p className="text-muted-foreground text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>
          <Card className="p-6 bg-card/50">
            <p className="text-muted-foreground text-sm mb-2">Total Value</p>
            <p className="text-3xl font-bold">${(products.reduce((sum, p) => sum + p.price, 0) / 100).toFixed(2)}</p>
          </Card>
          <Card className="p-6 bg-card/50">
            <p className="text-muted-foreground text-sm mb-2">Categories</p>
            <p className="text-3xl font-bold">{new Set(products.map(p => p.category)).size}</p>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2" onClick={() => resetForm()}>
                <Plus className="w-5 h-5" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingId ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update the product details below"
                    : "Fill in the details to add a new product"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Premium Cotton T-Shirt"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price ($) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <Input
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="e.g., Shirts"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image URL
                    </label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Product description..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Saving..."
                      : editingId
                      ? "Update Product"
                      : "Add Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 mb-6 bg-card/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </Card>

        {/* Products Table */}
        <Card className="bg-card/50 overflow-hidden">
          {productsLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        ${(product.price / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product.id)}
                            className="gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(product.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4 text-lg">
                {searchQuery ? "No products match your search" : "No products yet"}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first product to get started!"}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone and will immediately sync across the storefront.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

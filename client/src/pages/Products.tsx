import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingCart, Search } from "lucide-react";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all products
  const { data: allProducts, isLoading: loadingAll } = trpc.products.getAll.useQuery();

  // Fetch categories
  const { data: categories } = trpc.products.getCategories.useQuery();

  // Fetch by category
  const { data: categoryProducts } =
    selectedCategory !== "all"
      ? trpc.products.getByCategory.useQuery({ category: selectedCategory })
      : { data: undefined };

  // Search products
  const { data: searchResults } =
    searchQuery.length > 0
      ? trpc.products.search.useQuery({ query: searchQuery })
      : { data: undefined };

  // Determine which products to display
  let displayProducts = allProducts || [];
  if (searchQuery.length > 0) {
    displayProducts = searchResults || [];
  } else if (selectedCategory !== "all") {
    displayProducts = categoryProducts || [];
  }

  const isLoading = loadingAll;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nail'd Designs</h1>
          <p className="text-gray-600">Discover our exclusive collection of 30+ unique nail art designs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Showing {displayProducts.length} of {allProducts?.length || 0} designs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product: any) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    <img
                      src={product.imageCompressed}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.category}
                    </div>
                  </div>

                  {/* Product Info */}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>

                  {/* Product Footer */}
                  <CardContent className="space-y-4">
                    {/* Pricing */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">
                        Profit: ${(product.price - product.cost).toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

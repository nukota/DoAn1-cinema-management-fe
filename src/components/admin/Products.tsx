import { useState, ChangeEvent, useEffect } from "react";
import Product from "./items/Product";
import SearchImg from "../../assets/images/search.svg";
import { ProductType } from "../../interfaces/types";
import CreateProduct from "./dialogs/CreateProduct";
import DetailProduct from "./dialogs/DetailProduct";
import { useProducts } from "../../providers/ProductsProvider";
import { toast } from "react-toastify";
import { CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { confirmDeletion } from "../../utils/confirmDeletion";

const Products: React.FC = () => {
  const {
    products,
    fetchProductsData,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  } = useProducts();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddNewClick = () => {
    setCreateDialogOpen(true);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInfoClick = (product: ProductType) => {
    setSelectedProduct(product);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setDetailDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAddNewProduct = async (
    newProduct: ProductType
  ): Promise<boolean> => {
    try {
      await createProduct(newProduct);
      await fetchProductsData();
      handleCloseDialog();
      toast.success("Product added successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleOnSave = async (
    updatedProduct: ProductType
  ): Promise<boolean> => {
    try {
      await updateProduct(updatedProduct);
      setSelectedProduct(updatedProduct);
      await fetchProductsData();
      toast.success("Product updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteProduct = async (product: ProductType) => {
    const confirmed = await confirmDeletion(
      "Delete Product",
      `Are you sure you want to delete ${product.name}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteProduct(product._id);
        await fetchProductsData();
        handleCloseDialog();
        toast.success("Product deleted successfully!");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };
  const filteredProducts = products.filter((product) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Food and Drinks"
        ? product.category === "Food" || product.category === "Drink"
        : activeTab === "Others"
        ? product.category !== "Food" &&
          product.category !== "Drink" &&
          product.category !== "Souvenirs"
        : product.category === activeTab);
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (product.name && product.name.toLowerCase().includes(searchTermLower)) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTermLower)) ||
      (product.price && product.price.toString().includes(searchTermLower));
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-4">
        <CircularProgress />
        <span className="text-2xl text-gray mt-4">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="products flex flex-col relative">
      <div className="text-40px font-medium text-dark-gray">Products</div>
      <div className="flex items-center mt-2">
        <div className="SearchBar relative w-full max-w-[240px] h-8">
          <input
            type="text"
            className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img
            src={SearchImg}
            alt="Search"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
        </div>
      </div>
      <div className="product-tabs flex mt-4 z-20">
        <button
          className={`tab ${activeTab === "All" ? "active" : ""}`}
          onClick={() => handleTabClick("All")}
        >
          <span>All</span>
        </button>
        <button
          className={`tab ${activeTab === "Food and Drinks" ? "active" : ""}`}
          onClick={() => handleTabClick("Food and Drinks")}
        >
          <span>Food and Drinks</span>
        </button>
        <button
          className={`tab ${activeTab === "Souvenirs" ? "active" : ""}`}
          onClick={() => handleTabClick("Souvenirs")}
        >
          <span>Souvenirs</span>
        </button>
        <button
          className={`tab ${activeTab === "Others" ? "active" : ""}`}
          onClick={() => handleTabClick("Others")}
        >
          <span>Others</span>
        </button>
      </div>
      <div className="relative -mt-[2px] min-w-[360px] sm:min-w-[680px] w-full flex-1 bg-white border-[2px] border-light-gray rounded-b-xl rounded-tr-xl rounded-tl-none pl-12 py-6 pr-4 flex flex-col">
        <div className="list flex-1 grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9 gap-2 py-3 overflow-y-auto overflow-x-clip max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-[550px] xl:max-h-[600px] list-scrollbar">
          {filteredProducts.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleInfoClick={() => handleInfoClick(product)}
            />
          ))}
        </div>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddNewClick}
          sx={{
            position: "absolute",
            bottom: 24,
            right: 36,
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
            zIndex: 20,
          }}
        >
          <AddIcon />
        </Fab>
      </div>
      {selectedProduct && (
        <DetailProduct
          product={selectedProduct}
          open={detailDialogOpen}
          onClose={handleCloseDialog}
          onDelete={() => handleDeleteProduct(selectedProduct)}
          onSave={handleOnSave}
        />
      )}
      <CreateProduct
        open={createDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewProduct}
      />
    </div>
  );
};

export default Products;

import { useState, ChangeEvent, useEffect } from "react";
import Product from "./items/Product";
import SearchImg from "../../assets/images/search.svg";
import addImg from "../../assets/images/add.svg";
import { ProductType } from "../../interfaces/types";
import CreateProduct from "./dialogs/CreateProduct";
import DetailProduct from "./dialogs/DetailProduct";
import { useProducts } from "../../providers/ProductsProvider";

const Products: React.FC = () => {
  const { products, fetchProductsData, createProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    fetchProductsData();
  }
  , []);

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
  const handleCheckConfirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setDetailDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAddNewProduct = async (newProduct: ProductType) => {
    try {
      await createProduct(newProduct);
      await fetchProductsData();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to add new product:", error);
      alert("An error occurred while adding the product. Please try again.");
    }
  };
  
  const handleOnSave = async (updatedProduct: ProductType) => {
    try {
      await updateProduct(updatedProduct);
      await fetchProductsData();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("An error occurred while saving the product. Please try again.");
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await fetchProductsData();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("An error occurred while deleting the product. Please try again.");
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

  return (
    <div className="products flex flex-col h-[673px] overflow-y-visible scrollbar-hide relative">
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
      <div className="relative -mt-[2px] min-w-[360px] sm:min-w-[680px] w-full h-full bg-white border-[2px] border-light-gray rounded-b-xl rounded-tr-xl rounded-tl-none pl-12 py-6 pr-4 overflow-y-scroll">
        <div className="list grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9 gap-2 py-3 overflow-y-visible overflow-x-clip">
          {filteredProducts.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleInfoClick={() => handleInfoClick(product)}
            />
          ))}
        </div>
        <button
          className="absolute bottom-6 right-9 size-11 rounded-2xl bg-red hover:bg-dark-red duration-200 z-20"
          onClick={handleAddNewClick}
        >
          <img
            className="size-11 invert brightness-0"
            src={addImg}
            alt="Add New"
          />
        </button>
      </div>         
      {selectedProduct && (
        <DetailProduct
          product={selectedProduct}
          open={detailDialogOpen}
          onClose={handleCloseDialog}
          onDelete={() => handleDeleteProduct(selectedProduct._id)}
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

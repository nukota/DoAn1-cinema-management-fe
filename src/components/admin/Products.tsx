import { useState, useEffect } from "react";
import Product from "./items/Product";
import { ProductType } from "../../interfaces/types";
import CreateProduct from "./dialogs/CreateProduct";
import DetailProduct from "./dialogs/DetailProduct";
import { useProducts } from "../../providers/ProductsProvider";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomTabs from "./elements/Tabs";

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
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleAddNewClick = () => {
    setCreateDialogOpen(true);
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

  const productTabs = [
    { label: "All", value: "All" },
    { label: "Food and Drinks", value: "Food and Drinks" },
    { label: "Souvenirs", value: "Souvenirs" },
    { label: "Others", value: "Others" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-4">
        <CircularProgress />
        <span className="text-2xl text-gray mt-4">Loading products...</span>
      </div>
    );
  }

  return (
    <>
      <CustomTabs
        title="Products"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={productTabs}
        data={products}
        gridCols="grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9"
        gap="gap-2"
        onAddNew={handleAddNewClick}
        searchColumns={["name", "category", "price"]}
      >
        {(filteredProducts: ProductType[]) =>
          filteredProducts.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleInfoClick={() => handleInfoClick(product)}
            />
          ))
        }
      </CustomTabs>
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
    </>
  );
};

export default Products;

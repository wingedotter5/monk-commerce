import { createContext, useState } from "react";
import { mergeArrayWithoutDuplicates } from "./utils";

export const ProductContext = createContext();

export default function ProductProvider({ children }) {
  const [selectedProducts, setSelectedProducts] = useState([
    {
      id: "e56b1019-b128-4116-ae9e-663717fbbec5",
      title: "Select Product",
      variants: [
        {
          id: "801960c1-9c5b-439e-8a7e-04ca97746c3e",
          product_id: "e56b1019-b128-4116-ae9e-663717fbbec5",
          title: "Default Title",
          price: "200",
          discount: { type: "flat", value: 10 },
        },
      ],
      discount: { type: "flat", value: 10 },
    },
    {
      id: "801960c1-9c5b-439e-8a7e-04ca97746c3e",
      title: "Select Product",
      variants: [
        {
          id: "e56b1019-b128-4116-ae9e-663717fbbec5",
          product_id: "801960c1-9c5b-439e-8a7e-04ca97746c3e",
          title: "Default Title",
          price: "200",
          discount: { type: "flat", value: 10 },
        },
      ],
      discount: { type: "flat", value: 10 },
    },
  ]);
  const [editingProductIndex, setEditingProductIndex] = useState(null);

  const addProduct = (products) => {
    const selectedProductsCopy = [...selectedProducts];

    // If the product is already selected then merge the variants without duplicates
    const newProducts = [];
    products.forEach((product) => {
      const productIndex = selectedProductsCopy.findIndex(
        (i) => i.id === product.id
      );
      if (productIndex !== -1) {
        selectedProductsCopy[productIndex] = {
          ...product,
          variants: mergeArrayWithoutDuplicates(
            selectedProductsCopy[productIndex].variants,
            product.variants
          ),
        };
      } else {
        newProducts.push(product);
      }
    });

    selectedProductsCopy.splice(editingProductIndex, 1, ...newProducts);

    setSelectedProducts(selectedProductsCopy);
  };

  const removeProduct = (id) => {
    const productIndex = selectedProducts.findIndex((p) => p.id === id);
    const selectedProductsCopy = [...selectedProducts];
    selectedProductsCopy.splice(productIndex, 1);
    setSelectedProducts(selectedProductsCopy);
  };

  const removeVariant = (pid, id) => {
    const selectedProductsCopy = [...selectedProducts];
    const productIndex = selectedProducts.findIndex((p) => p.id === pid);
    const productCopy = selectedProducts[productIndex];
    const { variants: variantsCopy } = productCopy;
    const variantIndex = variantsCopy.findIndex((v) => v.id === id);
    variantsCopy.splice(variantIndex, 1);
    productCopy[variantIndex] = variantsCopy;

    selectedProductsCopy[productIndex] = productCopy;
    setSelectedProducts(selectedProductsCopy);
  };

  return (
    <ProductContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        setEditingProductIndex,
        addProduct,
        removeProduct,
        removeVariant,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

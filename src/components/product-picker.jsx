import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useContext,
  useCallback,
} from "react";
import Checkbox, { CHECKBOX_STATES } from "./checkbox";
import { ProductContext } from "../product-context";
import useProductSearch from "../hooks/useProductSearch";
import Loading from "../assets/loading.gif";

const ProductPicker = ({ open, onClose }) => {
  if (!open) return;

  const { addProduct } = useContext(ProductContext);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { loading, hasMore, error, products, setProducts } = useProductSearch(
    search,
    page
  );

  const observer = useRef();
  const lastProductItemElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const onChangeHandler = (clickedId, isProduct) => {
    let productsCopy;
    if (isProduct) {
      productsCopy = products.map((product) => {
        if (product.id === clickedId) {
          if (product.checked === CHECKBOX_STATES.Checked) {
            const { variants } = product;
            const variantsCopy = variants.map((variant) => {
              const variantCopy = {
                ...variant,
                checked: CHECKBOX_STATES.Empty,
              };
              return variantCopy;
            });
            return {
              ...product,
              checked: CHECKBOX_STATES.Empty,
              variants: variantsCopy,
            };
          } else {
            const { variants } = product;
            const variantsCopy = variants.map((variant) => {
              const variantCopy = {
                ...variant,
                checked: CHECKBOX_STATES.Checked,
              };
              return variantCopy;
            });
            return {
              ...product,
              checked: CHECKBOX_STATES.Checked,
              variants: variantsCopy,
            };
          }
        } else {
          return product;
        }
      });
      setProducts(productsCopy);
      return;
    }

    let parentId;
    productsCopy = products.map((product) => {
      const { variants } = product;
      const variantsCopy = variants.map((variant) => {
        if (variant.id === clickedId) {
          parentId = variant.product_id;
          return {
            ...variant,
            checked:
              variant.checked === CHECKBOX_STATES.Checked
                ? CHECKBOX_STATES.Empty
                : CHECKBOX_STATES.Checked,
          };
        } else {
          return variant;
        }
      });
      return { ...product, variants: variantsCopy };
    });

    const parent = productsCopy.find((i) => i.id === parentId);

    if (
      parent.variants.length ===
      parent.variants.filter(
        (variant) => variant.checked === CHECKBOX_STATES.Checked
      ).length
    ) {
      productsCopy.find((i) => i.id === parentId).checked =
        CHECKBOX_STATES.Checked;
    } else if (
      parent.variants.length ===
      parent.variants.filter(
        (variant) => variant.checked === CHECKBOX_STATES.Empty
      ).length
    ) {
      productsCopy.find((i) => i.id === parentId).checked =
        CHECKBOX_STATES.Empty;
    } else {
      productsCopy.find((i) => i.id === parentId).checked =
        CHECKBOX_STATES.Indeterminate;
    }

    setProducts(productsCopy);
  };

  const numProductsSelected = products.filter(
    (p) => p.checked !== CHECKBOX_STATES.Empty
  ).length;

  return (
    <div
      className="fixed z-[1000] inset-0 flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="relative min-w-[600px] bg-white rounded border">
        <button className="absolute z-[1100] top-5 right-5" onClick={onClose}>
          X
        </button>
        <h2 className="p-5">Select Products</h2>
        <div className="py-2 px-8 border-y">
          <input
            className="bg-[url('/search.png')] bg-no-repeat bg-[10px_center] border w-full py-2 pl-[35px] pr-[20px] rounded"
            type="text"
            placeholder="Search product"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="max-h-[500px] overflow-auto">
          {loading && !products.length ? (
            <div className="flex items-center justify-center p-5">
              <img className="" src={Loading} />
            </div>
          ) : (
            <>
              {products.map((product, index) => {
                return products.length === index + 1 ? (
                  <ProductItem
                    ref={lastProductItemElementRef}
                    key={product.id}
                    product={product}
                    onChangeHandler={onChangeHandler}
                  />
                ) : (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onChangeHandler={onChangeHandler}
                  />
                );
              })}
            </>
          )}
        </div>
        <div className="w-full border p-2">
          <div className="flex justify-between items-center px-3">
            <div>{`${numProductsSelected} products selected`}</div>
            <div className="flex gap-2">
              <button
                className="bg-white px-3 py-1 text-slate-800 border rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-[#008064] px-3 py-1 text-white rounded disabled:opacity-25"
                disabled={numProductsSelected < 1}
                onClick={() => {
                  const selectedProducts = products.filter(
                    (product) =>
                      product.checked === CHECKBOX_STATES.Checked ||
                      product.checked === CHECKBOX_STATES.Indeterminate
                  );
                  const withVariants = selectedProducts.map((product) => {
                    const { variants } = product;
                    const selectedVariants = variants.filter(
                      (variant) => variant.checked === CHECKBOX_STATES.Checked
                    );
                    return { ...product, variants: selectedVariants };
                  });
                  addProduct(withVariants);
                  onClose();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductItem = forwardRef((props, ref) => {
  const { product, onChangeHandler } = props;
  return (
    <div ref={ref}>
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <label className="flex items-center gap-2">
          <Checkbox
            value={product.checked}
            onChange={() => onChangeHandler(product.id, true)}
          />
          <img className="w-10 h-10" src={product.image.src} alt="image" />
          <div>{product.title}</div>
        </label>
      </div>
      {product.variants.map((variant) => (
        <div
          key={variant.id}
          className="flex items-center justify-between gap-2 border-b px-10 py-2"
        >
          <label className="flex items-center gap-2">
            <Checkbox
              value={variant.checked}
              onChange={() => onChangeHandler(variant.id, false)}
            />
            <div>{variant.title}</div>
          </label>
          <div className="flex justify-end gap-4">
            {variant.inventory_quantity && (
              <div>{`${variant.inventory_quantity} available`}</div>
            )}
            <div>{`₹${variant.price}`}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ProductPicker;

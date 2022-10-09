import { useContext, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Select, Input, Title, Button } from "./product";
import ProductPicker from "./product-picker";
import { ProductContext } from "../product-context";
import { v4 } from "uuid";

import HandleIcon from "../assets/handle.png";
import EditIcon from "../assets/pencil.png";

const ProductList = () => {
  const { selectedProducts, setSelectedProducts } = useContext(ProductContext);
  const [open, setOpen] = useState(false);

  const openPicker = () => setOpen(true);
  const closePicker = () => setOpen(false);

  const createProduct = () => {
    const tempId = v4();
    const dummyProduct = {
      id: tempId,
      title: "Select Product",
      variants: [
        {
          id: v4(),
          product_id: tempId,
          title: "Default Title",
          price: "200",
          discount: { type: "flat", value: 10 },
        },
      ],
      discount: { type: "flat", value: 10 },
    };
    const selectedProductsCopy = [...selectedProducts];
    selectedProductsCopy.push(dummyProduct);
    setSelectedProducts(selectedProductsCopy);
  };

  const onDragEnd = ({ destination, source }) => {
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const selectedProductsCopy = [...selectedProducts];
    const product = selectedProductsCopy.splice(source.index, 1)[0];
    selectedProductsCopy.splice(destination.index, 0, product);
    setSelectedProducts(selectedProductsCopy);
  };

  return (
    <div className="max-w-[800px]">
      <h2 className="mb-4">Add Products</h2>
      <div className="flex justify-around py-4">
        <h3>Products</h3>
        <h3>Discount</h3>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <ol className="list-decimal">
          <Droppable droppableId="product-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {selectedProducts.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    index={index}
                    openPicker={openPicker}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ol>
      </DragDropContext>
      <Button className="float-right mt-5" onClick={createProduct}>
        Add Product
      </Button>
      <ProductPicker open={open} onClose={closePicker}></ProductPicker>
    </div>
  );
};

const ProductItem = ({ product, index, openPicker }) => {
  const [clicked, setClicked] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const {
    selectedProducts,
    setSelectedProducts,
    removeProduct,
    setEditingProductIndex,
  } = useContext(ProductContext);

  const showRemoveBtn = selectedProducts.length > 1;

  const onChangeHandler = (e, id) => {
    const selectedProductsCopy = [...selectedProducts];
    const targetProductIndex = selectedProductsCopy.findIndex(
      (p) => p.id === id
    );

    selectedProductsCopy[targetProductIndex] = {
      ...selectedProductsCopy[targetProductIndex],
      discount: {
        ...selectedProductsCopy[targetProductIndex].discount,
        [e.target.name]: e.target.value,
      },
    };

    setSelectedProducts(selectedProductsCopy);
  };

  const onDragEnd = (result, productId) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const selectedProductsCopy = [...selectedProducts];
    const productIndex = selectedProductsCopy.findIndex(
      (p) => p.id === productId
    );
    const product = selectedProductsCopy[productIndex];
    const { variants } = product;
    const variantsCopy = [...variants];
    const variant = variantsCopy.splice(source.index, 1)[0];
    variantsCopy.splice(destination.index, 0, variant);
    const updatedProduct = {
      ...product,
      variants: variantsCopy,
    };
    selectedProductsCopy[productIndex] = updatedProduct;

    setSelectedProducts(selectedProductsCopy);
  };

  return (
    <Draggable draggableId={product.id.toString()} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className="flex items-center gap-8">
            <img src={HandleIcon} {...provided.dragHandleProps} />
            <li className="w-full">
              <Title className="flex justify-between">
                <span>{product.title}</span>
                <button
                  onClick={() => {
                    setEditingProductIndex(index);
                    openPicker();
                  }}
                >
                  <img src={EditIcon} />
                </button>
              </Title>
            </li>
            <div className="flex gap-4 w-[400px]">
              {clicked ? (
                <>
                  <Input
                    type="number"
                    min={0}
                    onChange={(e) => onChangeHandler(e, product.id)}
                    name="value"
                    value={product.discount.value}
                  />
                  <Select
                    name="type"
                    value={product.discount.type}
                    onChange={(e) => onChangeHandler(e, product.id)}
                  >
                    <option value="flat">Flat Off</option>
                    <option value="percentage">% Off</option>
                  </Select>
                </>
              ) : (
                <Button
                  className="w-full"
                  primary
                  onClick={() => setClicked(true)}
                >
                  Add Discount
                </Button>
              )}
            </div>
            {showRemoveBtn && (
              <button onClick={() => removeProduct(product.id)}>X</button>
            )}
          </div>
          <div className="flex justify-end my-1">
            <button
              className="border-none underline text-sky-400"
              onClick={() => setShowVariants(!showVariants)}
            >
              {showVariants ? "Hide variants" : "Show variants"}
            </button>
          </div>
          {showVariants && (
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, product.id)}
            >
              <Droppable droppableId={product.id.toString()}>
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {product.variants.map((variant, index) => (
                      <ProductVariant
                        key={variant.id}
                        index={index}
                        variant={variant}
                        productId={product.id}
                        showRemoveBtn={product.variants.length > 1}
                      />
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      )}
    </Draggable>
  );
};

const ProductVariant = ({ variant, productId, showRemoveBtn, index }) => {
  const { removeVariant, selectedProducts, setSelectedProducts } =
    useContext(ProductContext);

  const onChangeHandler = (e, pid, vid) => {
    const selectedProductsCopy = [...selectedProducts];
    const targetProductIndex = selectedProductsCopy.findIndex(
      (p) => p.id === pid
    );
    const parentProduct = selectedProductsCopy[targetProductIndex];
    const parentProductCopy = {
      ...parentProduct,
    };
    const targetVariantIndex = parentProductCopy.variants.findIndex(
      (v) => v.id === vid
    );
    const updatedVariant = {
      ...parentProductCopy.variants[targetVariantIndex],
      discount: {
        ...parentProductCopy.variants[targetVariantIndex].discount,
        [e.target.name]: e.target.value,
      },
    };
    parentProductCopy.variants.splice(targetVariantIndex, 1, updatedVariant);

    setSelectedProducts(selectedProductsCopy);
  };

  return (
    <Draggable draggableId={variant.id.toString()} index={index}>
      {(provided) => (
        <li
          className="flex gap-8 mb-5 items-center"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <img src={HandleIcon} {...provided.dragHandleProps} />
          <Title rounded>{variant.title}</Title>
          <div className="flex gap-4 w-[400px]">
            <Input
              rounded
              type="number"
              min={0}
              onChange={(e) => onChangeHandler(e, productId, variant.id)}
              name="value"
              value={variant.discount.value}
            />
            <Select
              rounded
              name="type"
              value={variant.discount.type}
              onChange={(e) => onChangeHandler(e, productId, variant.id)}
            >
              <option value="flat">Flat Off</option>
              <option value="percentage">% Off</option>
            </Select>
          </div>
          {showRemoveBtn && (
            <button onClick={() => removeVariant(productId, variant.id)}>
              X
            </button>
          )}
        </li>
      )}
    </Draggable>
  );
};

export default ProductList;

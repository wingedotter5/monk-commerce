import ProductList from "./components/product-list";
import ProductProvider from "./product-context";

const App = () => {
  return (
    <div>
      <ProductProvider>
        <ProductList></ProductList>
      </ProductProvider>
    </div>
  );
};

export default App;

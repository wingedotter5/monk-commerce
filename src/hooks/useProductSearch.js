import { useEffect, useState } from "react";
import axios from "axios";
import { CHECKBOX_STATES } from "../components/checkbox";

const useProductSearch = (search, page) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setProducts([]);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "https://stageapibc.monkcommerce.app/admin/shop/product",
      params: { search, page },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        const dataCopy = res.data.map((product) => {
          const { variants } = product;
          const variantsCopy = variants.map((variant) => {
            const variantCopy = {
              ...variant,
              checked: CHECKBOX_STATES.Empty,
              discount: { type: "flat", value: 10 },
            };
            return variantCopy;
          });
          return {
            ...product,
            checked: CHECKBOX_STATES.Empty,
            variants: variantsCopy,
            discount: { type: "flat", value: 10 },
          };
        });
        setProducts((prevProducts) => [...prevProducts, ...dataCopy]);
        setHasMore(!(res.data.length < 10)); // Pending
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => cancel();
  }, [search, page]);

  return { loading, error, hasMore, products, setProducts };
};

export default useProductSearch;

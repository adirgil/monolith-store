import React, { useEffect, useState } from "react";
import { getProducts } from "../api/monolithData";
import Card from "../components/Card";
import "./Home.scss";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };
    getAllProducts();
  }, []);

  const renderProducts = () => {
    return products.map((product) => {
      return <Card key={product.id} product={product} />;
    });
  };

  return (
    <div id="home">
      <div className="header-div">
        <div className="product-header">products</div>
      </div>
      <div className="products">{renderProducts()}</div>
    </div>
  );
}

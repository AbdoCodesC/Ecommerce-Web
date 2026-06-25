import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { getProductById } from "../data/products";
import NotFound from "./NotFound";
import { useNavigate } from "react-router-dom";
import { set } from "react-hook-form";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    setIsLoading(true);
    const product = getProductById(parseInt(id));
    console.log(product);
    if (!product) {
      navigate("/not-found");
      return;
    }
    setProduct(product);
    setIsLoading(false);
  }, [id, navigate]);

  let productQuantityLabel = null;
  if (product) {
    const productInCart = cartItems.find((item) => product.id === item.id);
    productQuantityLabel = productInCart ? `(${productInCart.quantity})` : null;
  }

  return (
    <div className="page">
      {isLoading ? (
        <h1 className="page=title">Loading product details...</h1>
      ) : (
        <div className="container">
          <div className="product-detail">
            <div className="product-detail-image">
              <img src={product?.image} alt={product?.name} />
            </div>
            <div className="product-detail-content">
              <h1 className="product-detail-name">{product?.name}</h1>
              <p className="product-detail-price">
                ${product?.price.toFixed(2)}
              </p>
              <p className="product-detail-description">
                {product?.description}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => addToCart(product?.id)}
              >
                Add to Cart {productQuantityLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;

import { useContext, createContext, useState } from "react";
import { getProductById, getProducts } from "../data/products";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || [],
  );

  function addToCart(productId) {
    const existingItem = cartItems.find((item) => item.id === productId);
    if (existingItem) {
      const currQuant = existingItem.quantity;
      const updatedCartItem = cartItems.map((item) =>
        item.id === productId
          ? { id: productId, quantity: currQuant + 1 }
          : item,
      );
      setCartItems(updatedCartItem);
    } else {
      const newItem = {
        id: productId,
        quantity: 1,
      };
      setCartItems([...cartItems, newItem]);
    }
  }

  function getCartItemsWithProducts() {
    return cartItems
      .map((item) => ({
        ...item,
        product: getProductById(item.id),
      }))
      .filter((item) => item.product);
  }

  function removeFromCart(id) {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== id),
    );
  }

  function updateQuantity(quantity, id) {
    const existingItem = cartItems.find((item) => item.id === id);
    const currQuant = existingItem.quantity;
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === id ? { id: id, quantity: quantity } : item,
      ),
    );
  }

  function getCartTotal() {
    const total = cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);

    return total;
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartItemsWithProducts,
        updateQuantity,
        removeFromCart,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

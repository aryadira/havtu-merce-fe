"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, ProductShop, ShippingInfo } from "../types/product";

interface CartState {
  items: CartItem[];
  shippingInfo: ShippingInfo | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: ProductShop; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_SHIPPING_INFO"; info: ShippingInfo }
  | { type: "LOAD_CART"; state: CartState };

const initialState: CartState = {
  items: [],
  shippingInfo: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].item_qty += action.quantity || 1;
        return { ...state, items: newItems };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            item_id: `temp-${Date.now()}`, // Mock ID
            cart_id: "guest-cart", // Mock Cart ID
            product_id: action.product.id,
            product: action.product,
            item_qty: action.quantity || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, item_qty: action.quantity }
            : item
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [], shippingInfo: null };
    case "SET_SHIPPING_INFO":
      return { ...state, shippingInfo: action.info };
    case "LOAD_CART":
      return action.state;
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  shippingInfo: ShippingInfo | null;
  addItem: (product: ProductShop, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setShippingInfo: (info: ShippingInfo) => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "shop_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch({ type: "LOAD_CART", state: parsed });
      } catch (e) {
        console.error("Failed to load cart from storage");
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (product: ProductShop, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", product, quantity });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const setShippingInfo = (info: ShippingInfo) => {
    dispatch({ type: "SET_SHIPPING_INFO", info });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.item_qty, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.item_qty,
    0
  );
  const shipping = subtotal > 100 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        shippingInfo: state.shippingInfo,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setShippingInfo,
        itemCount,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

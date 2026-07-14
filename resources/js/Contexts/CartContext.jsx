import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Initialize from local storage if available
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (e) {
                return [];
            }
        }
        return [];
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        // Multi-vendor validation: only allow items from a single shop
        if (cartItems.length > 0 && product.shop_id) {
            const currentShopId = cartItems[0].shop_id;
            if (currentShopId && currentShopId !== product.shop_id) {
                alert('You can only order from one shop at a time. Please clear your cart to buy from this vendor.');
                return;
            }
        }

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.product_id === product.product_id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Automatically open the drawer
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
    };

    const updateQuantity = (productId, amount) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.product_id === productId) {
                    const newQuantity = item.quantity + amount;
                    if (newQuantity <= 0) return item;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    const toggleCartDrawer = () => {
        setIsCartOpen(!isCartOpen);
    };
    
    const closeCartDrawer = () => {
        setIsCartOpen(false);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const value = {
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCartDrawer,
        closeCartDrawer,
        clearCart,
        cartCount,
        cartSubtotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

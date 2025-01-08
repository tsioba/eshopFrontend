import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState({});
	const [products, setProducts] = useState({});
	const [token, setToken] = useState(null);

	// Αποθήκευση του καλαθιού στο localStorage κάθε φορά που αλλάζει το cartItems
	useEffect(() => {
		if (Object.keys(cartItems).length > 0) {
			localStorage.setItem('cartItems', JSON.stringify(cartItems));
		} else {
			localStorage.removeItem('cartItems');
		}
	}, [cartItems]);

	// Ανάκτηση προϊόντων από το API
	useEffect(() => {
		axios.get('http://localhost:8080/api/products')
			.then(response => {
				const productsById = response.data.reduce((acc, product) => {
					acc[product.id] = product;
					return acc;
				}, {});
				setProducts(productsById);

				// Καθαρισμός του καλαθιού από προϊόντα που δεν υπάρχουν πλέον
				setCartItems((prevCartItems) => {
					const updatedCartItems = { ...prevCartItems };
					Object.keys(prevCartItems).forEach(productId => {
						if (!productsById[productId]) {
							delete updatedCartItems[productId];
						}
					});
					return updatedCartItems;
				});
			})
			.catch(error => {
				setProducts({}); // Σε περίπτωση σφάλματος, κάνε reset τα προϊόντα
			});
	}, []);

	// Ανάκτηση του καλαθιού από το localStorage κατά την αρχική φόρτωση της σελίδας
	useEffect(() => {
		const savedCartItems = localStorage.getItem('cartItems');
		if (savedCartItems) {
			setCartItems(JSON.parse(savedCartItems));
		}
	}, []);

	const addToCart = (product, quantity, selectedSize) => {
		const key = `${product.id}-${selectedSize}`; // Συνδυασμός ID προϊόντος και μεγέθους

		setCartItems((prevCartItems) => ({
			...prevCartItems,
			[key]: {
				product,
				quantity: (prevCartItems[key]?.quantity || 0) + quantity,
				size: selectedSize, // Το μέγεθος για τον συγκεκριμένο συνδυασμό
			},
		}));
	};




	const removeFromCart = (key) => {
		setCartItems((prevCartItems) => {
			const updatedCart = { ...prevCartItems };
			delete updatedCart[key];
			return updatedCart;
		});
	};


	const updateCartItemQuantity = (productId, newQuantity) => {
		setCartItems((prevCartItems) => {
			if (newQuantity <= 0) {
				const { [productId]: removedItem, ...remainingItems } = prevCartItems;
				return remainingItems;
			} else {
				return {
					...prevCartItems,
					[productId]: {
						...prevCartItems[productId],
						quantity: newQuantity,
					},
				};
			}
		});
	};

	const clearCart = () => {
		setCartItems({});
		localStorage.removeItem('cartItems');
	};

	const value = {
		cartItems,
		products,
		token,
		setToken,
		addToCart,
		removeFromCart,
		updateCartItemQuantity,
		clearCart
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	return useContext(CartContext);
};

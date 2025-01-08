import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Δημιουργία του Context
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');

	const fetchProducts = async () => {
		try {
			const response = await axios.get('http://localhost:8080/api/products');
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	const getModelUrl = (filename) => {
		return `http://localhost:8080/api/products/model/${filename}`;
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<ProductContext.Provider value={{ products: filteredProducts, setSearchQuery, fetchProducts, getModelUrl }}>
			{children}
		</ProductContext.Provider>
	);
};


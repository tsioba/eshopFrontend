import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Style/style.css";
import { ProductContext } from '../contexts/ProductContext'; // Εισαγωγή του ProductContext

const ProductList = () => {
	const { products } = useContext(ProductContext); // Χρήση του ProductContext
	const navigate = useNavigate();

	const handleProductClick = (productId) => {
		navigate(`/product/${productId}`);
	};

	return (
		<div className="product-list2">
			<div className="product-list">
				{products.length > 0 ? (
					products.map(product => (
						<div key={product.id} className="product-item" onClick={() => handleProductClick(product.id)}>
							<div className="product-image">
								<img src={`http://localhost:8080/api/products/model/${product.filename}`} alt="Product Image"/>
							</div>
							<div className="product-details-container">
								<div className="product-details">
									<h3>{product.name}</h3>
									<p>{product.price} €</p>
								</div>
							</div>
						</div>
					))
				) : (
					<p>No products found</p>
				)}
			</div>
		</div>
	);
};

export default ProductList;


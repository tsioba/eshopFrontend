import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import "../Style/style.css";

const Product = () => {
	const { id } = useParams(); // Παίρνει το ID από τα URL params
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1); // Αρχική ποσότητα
	const { addToCart } = useCart(); // Πρόσβαση στη συνάρτηση addToCart από το context
	const [message, setMessage] = useState(''); // Κατάσταση για το μήνυμα επιτυχίας
	const [selectedSize, setSelectedSize] = useState(null);

	const sizes = Array.from({ length: 45 - 37 + 1 }, (_, i) => 37 + i);

	const handleSizeSelect = (size) => {
		setSelectedSize(size);
	};

	useEffect(() => {
		// Ανάκτηση λεπτομερειών προϊόντος με βάση το ID
		axios.get(`http://localhost:8080/api/products/${id}`)
			.then(response => {
				setProduct(response.data);
			})
			.catch(error => {
				console.error('There was an error fetching the product details!', error);
			});
	}, [id]);

	const incrementQuantity = () => {
		setQuantity(prevQuantity => prevQuantity + 1);
	};

	const decrementQuantity = () => {
		setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
	};

	const handleAddToCart = () => {
		// Προσθήκη της επιλεγμένης ποσότητας του προϊόντος στο καλάθι χρησιμοποιώντας το context
		addToCart(product, quantity,selectedSize);

		// Ορισμός του μηνύματος επιτυχίας
		setMessage('Το προϊόν προστέθηκε με επιτυχία στο καλάθι!');

		// Καθαρισμός του μηνύματος μετά από 3 δευτερόλεπτα
		setTimeout(() => {
			setMessage('');
		}, 3000);
	};

	if (!product) {
		return <div>Loading...</div>;
	}

	return (
		<div className="product-page">
			{/* Toast notification */}
			{message && (
				<div className="toast-message">
					<p>{message}</p>
				</div>
			)}

			<div className="product-detail">
				<div className="product-image">
					<img src={`http://localhost:8080/api/products/model/${product.filename}`} alt="Product Image"/>
				</div>
				<div className="product-info">
					<div className={"product-description"}>
						<h1>{product.name}</h1>
						<p>{product.price}€{" "}</p>
						<p>{product.description}</p>
						<select
							onChange={(e) => handleSizeSelect(e.target.value)}
							value={selectedSize || ""}
							className={"dropdown"}
						>
							<option value="" disabled>
								Επιλέξτε μέγεθος
							</option>
							{sizes.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>


					</div>

					<div className="product-controls">
						{/* Επιλογή ποσότητας */}
						<div className="product-count">
							<button
								className="count-button"
								onClick={decrementQuantity}
							>
								-
							</button>
							<span>{quantity}</span>
							<button
								className="count-button"
								onClick={incrementQuantity}
							>
								+
							</button>
						</div>

						{/* Προσθήκη στο καλάθι */}
						<button className="add-to-cart-button" onClick={handleAddToCart}>
							Προσθήκη στο καλάθι
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Product;



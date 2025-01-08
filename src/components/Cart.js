import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import binIcon from "../images/bin.svg";
import EmptyCart from "../images/emptyCart.svg";
import OrderForm from './OrderForm';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
	const { cartItems, removeFromCart, products, updateCartItemQuantity, clearCart } = useCart();
	const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
	const navigate = useNavigate();

	const calculateTotal = () => {
		return Object.keys(cartItems).reduce((total, key) => {
			const item = cartItems[key];
			const product = item.product; // Παίρνει το προϊόν απευθείας από το καλάθι
			if (product) {
				return total + (product.price * item.quantity);
			}
			return total;
		}, 0);
	};


	const handleRemove = (productId) => {
		removeFromCart(productId);
	};

	const handleQuantityChange = (productId, increment) => {
		const item = cartItems[productId];
		const newQuantity = increment ? item.quantity + 1 : Math.max(1, item.quantity - 1);
		updateCartItemQuantity(productId, newQuantity);
	};

	const handleOrderClick = () => {
		setIsOrderFormOpen(true);
	};

	const handleCloseModal = () => {
		setIsOrderFormOpen(false);
	};

	const handleContinueShopping = () => {
		navigate('/');
	};

	const handleOrderSuccess = () => {
		const message = 'Η παραγγελία σας καταχωρήθηκε επιτυχώς!';
		showToast(message, 'success');
		setIsOrderFormOpen(false);
		clearCart();

	};

	const handleOrderFailure = () => {
		const message = 'Σφάλμα κατά την καταχώρηση της παραγγελίας.';
		showToast(message, 'error');
	};

	const showToast = (message, type) => {
		if (type === 'success') {
			toast.success(message);
		} else if (type === 'error') {
			toast.error(message);
		} else {
			console.error('Άγνωστος τύπος ειδοποίησης:', type);
		}
	};

	if (Object.keys(cartItems).length === 0) {
		return (
			<div className="empty-cart">
				<img src={EmptyCart} alt="Empty Cart" className="empty-cart-icon" />
				<h2>Το καλάθι σας είναι άδειο!</h2>
				<p>Φαίνεται ότι δεν έχετε κάποιο προϊόν στο καλάθι.</p>
				<button className="continue-shopping-button" onClick={handleContinueShopping}>
					Συνεχίστε τις αγορές σας
				</button>
			</div>
		);
	}

	const totalItems = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
	const totalCost = calculateTotal();
	const shippingCost = 5;
	const finalCost = totalCost + shippingCost;

	return (
		<div className="cart-page">
			<div className="cart-products">
				<h1>Το Καλάθι σας</h1>
				<ul>
					{Object.keys(cartItems).map((key) => {
						const item = cartItems[key]; // Το αντικείμενο στο καλάθι
						const { product, size } = item; // Απόσπαση των δεδομένων

						if (!product || !product.filename) {
							return (
								<li key={key}>
									<p>Το προϊόν δεν είναι διαθέσιμο.</p>
								</li>
							);
						}

						return (
							<li key={key} className="cart-item">
								<div className="cart-product-image">
									<img
										src={`http://localhost:8080/api/products/model/${product.filename}`}
										alt="Product Image"
									/>
								</div>
								<div className="product-info">
									<div className={"product-name-price"}>
										<h2>{product.name}</h2>
										<h3 className="product-price">{product.price.toFixed(2)} €</h3>
									</div>
									<div className={"product-qstr"}>
										<div className={"product-qst"}>
											<p className="product-quantity">Ποσότητα: {item.quantity}</p>
											<p className="product-size">Νούμερο: {size}</p>
											<p className="product-total-price">
												Σύνολο: {(product.price * item.quantity).toFixed(2)} €
											</p>
										</div>
										<button onClick={() => handleRemove(key)}>
											<img src={binIcon} alt="Remove"/>
										</button>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="cart-summary">
			<h2>Σύνολο</h2>
				<p>Προϊόντα: {totalItems}</p>
				<p>Κόστος: {totalCost.toFixed(2)} €</p>
				<p>Έξοδα Αποστολής: {shippingCost.toFixed(2)} €</p>
				<div className="cart-summary-button">
					<h3>Σύνολο: {finalCost.toFixed(2)} €</h3>
					<button className="order-button" onClick={handleOrderClick}>
						Παραγγελία
					</button>
				</div>
			</div>

			{isOrderFormOpen && (
				<div className="modal">
					<div className="modal-content">
                    <span className="close-button" onClick={handleCloseModal}>
                        &times;
                    </span>
						<OrderForm
							totalAmount={finalCost}
							onSuccess={handleOrderSuccess}
							onFailure={handleOrderFailure}
						/>
					</div>
				</div>
			)}
		</div>
	);

};

export default Cart;


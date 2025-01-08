import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import "../Style/style.css";
import logo from '../images/Logo.png';
import AdminPage from './AdminPage';  // Προσθήκη AdminPage

const User = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const [orders, setOrders] = useState([]);
	const [orderItems, setOrderItems] = useState({});
	const [loading, setLoading] = useState(true);

	// Έλεγχος αν ο χρήστης είναι διαχειριστής
	const isAdmin = isAuthenticated && user?.role === 'ADMIN';

	useEffect(() => {
		if (isAuthenticated && user && !isAdmin) {
			// Φόρτωση παραγγελιών μόνο αν δεν είναι admin
			const fetchOrders = async () => {
				try {
					const response = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`);
					const fetchedOrders = response.data;
					setOrders(fetchedOrders);

					const itemsPromises = fetchedOrders.map(order =>
						axios.get(`http://localhost:8080/api/orders/${order.id}/items`)
					);

					const itemsResponses = await Promise.all(itemsPromises);
					const itemsData = itemsResponses.reduce((acc, res, index) => {
						acc[fetchedOrders[index].id] = res.data;
						return acc;
					}, {});

					setOrderItems(itemsData);
				} catch (error) {
					console.error('Error fetching orders and items:', error);
				} finally {
					setLoading(false);
				}
			};

			fetchOrders();
		} else {
			setLoading(false);
		}
	}, [isAuthenticated, user, isAdmin]);

	return (
		<div className="user-container">
			{/* Εάν ο χρήστης είναι διαχειριστής, εμφάνιση του AdminPage */}
			{isAuthenticated ? (
				isAdmin ? (
					<>
						<AdminPage />  {/* Εμφάνιση της AdminPage αν ο χρήστης είναι ADMIN */}
					</>
				) : (
					<div className="user-dashboard">
						{/* Πληροφορίες Χρήστη */}
						<div className="user-info">
							<h2>Πληροφορίες Χρήστη</h2>
							<p><strong>Username:</strong> {user?.username}</p>
							<p><strong>Ονοματεπώνυμο:</strong> {user?.fullname}</p>
							<p><strong>Email:</strong> {user?.email}</p>
							<div className="logout-button">
								<button onClick={logout}>Logout</button>
							</div>
						</div>

						{/* Παραγγελίες Χρήστη */}
						<div className="user-orders">
							<h2>Οι Παραγγελίες σας</h2>
							{loading ? (
								<p>Loading...</p>
							) : orders.length > 0 ? (
								<ul>
									{orders.map((order) => (
										<li key={order.id}>
											<div className="order-details">
												<p><strong>Αρ. Παραγγελίας:</strong> {order.id}</p>
												<p><strong>Ημερομηνία:</strong> {order.orderDate.split("T")[0]}</p>
											</div>
											<p><strong>Σύνολο:</strong> {order.totalAmount} €</p>

											<div className="order-items">
												<h3>Προϊόντα</h3>
												<ul>
													{orderItems[order.id]?.map((item) => (
														<li key={item.id}>
															<div className="cart-product-image">
																<img src={`http://localhost:8080/api/products/model/${item.product.filename}`}
																     alt="Product Image"/>

															</div>
															<p><strong>Όνομα προϊόντος:</strong> {item.product?.name || 'Δεν βρέθηκε όνομα προϊόντος'}</p>
															<p><strong>Ποσότητα:</strong> {item.quantity}</p>
															<p><strong>Τιμή:</strong> {item.product?.price ? `${item.product.price} €` : 'Δεν βρέθηκε τιμή'}</p>
														</li>
													)) || <p>Δεν βρέθηκαν προϊόντα!</p>}
												</ul>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p>Δεν βρέθηκαν παραγγελίες!</p>
							)}
						</div>
					</div>
				)
			) : (
				<div className="user-auth">
					<div className="user-logo">
						<img src={logo} alt="Logo" />
					</div>
					<h2>Συνέχεια με τον λογαριασμό σου</h2>
					<div className="user-auth-buttons">
						<Link to="/login">
							<button className="auth-button">Σύνδεση</button>
						</Link>
						<Link to="/register">
							<button className="auth-button">Εγγραφή</button>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default User;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext'; // Εισαγωγή του useAuth hook


const OrderForm = ({ totalAmount, onSuccess, onFailure }) => {
	const { cartItems, clearCart } = useCart(); // Χρήση του clearCart για άδειασμα του καλαθιού
	const { user } = useAuth(); // Χρήση του user από το context

	const [order, setOrder] = useState({
		fullname: '',
		email: '',
		phone: '',
		orderDate: new Date().toISOString(),
		totalAmount: totalAmount,
		userId: null
	});
	const [message, setMessage] = useState(null); // Καταχώριση του μηνύματος

	useEffect(() => {
		if (user) {
			setOrder(prevOrder => ({
				...prevOrder,
				fullname: user.fullname,
				email: user.email,
				phone: user.phone,
				userId: user.id
			}));
		}
	}, [user, totalAmount]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setOrder({
			...order,
			[name]: value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Δημιουργία των δεδομένων της παραγγελίας μαζί με τα orderItems
			const orderItems = Object.keys(cartItems).map(productId => {
				const item = cartItems[productId];
				return {
					productId: parseInt(productId), // Μετατροπή του productId σε ακέραιο
					quantity: item.quantity
				};
			});

			const orderData = {
				fullname: order.fullname,
				email: order.email,
				phone: order.phone,
				status: 'pending', // Προκαθορισμένη κατάσταση
				totalAmount: parseFloat(order.totalAmount.toFixed(2)),
				orderItems: orderItems // Ενσωμάτωση των orderItems
			};

			// Αποστολή των δεδομένων στο backend
			const response = await axios.post('http://localhost:8080/api/orders', orderData);

			// Ενέργειες σε περίπτωση επιτυχίας
			clearCart(); // Άδειασμα του καλαθιού
			setMessage('Η παραγγελία σας καταχωρήθηκε επιτυχώς!');

			if (onSuccess) onSuccess(); // Ειδοποίηση επιτυχίας
		} catch (error) {
			// Ενέργειες σε περίπτωση αποτυχίας
			console.error('There was an error placing the order:', error.response?.data || error.message);
			setMessage('Σφάλμα κατά την καταχώρηση της παραγγελίας.');

			if (onFailure) onFailure(); // Ειδοποίηση αποτυχίας
		}
	};

	//======================================================================================
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const handleOrder = async (e) => {
		e.preventDefault(); // Αποτροπή του default form submit για να μη φορτώσει η σελίδα

		setLoading(true);
		setError(null);

		const orderItems = Object.keys(cartItems).map(productId => {
			const item = cartItems[productId];
			return {
				productId: parseInt(productId), // Ανάγνωση του productId ως ακέραιο
				quantity: item.quantity
			};
		});

		const orderData = {
			fullname: order.fullname,
			email: order.email,
			phone: order.phone,
			status: 'pending', // Ή όποια κατάσταση επιθυμείς
			totalAmount: parseFloat(order.totalAmount.toFixed(2)),
			orderItems: orderItems // Εδώ είναι η σωστή θέση για τα orderItems
		};

		try {
			// Κλήση στο endpoint της Viva για να δημιουργήσεις την παραγγελία
			const response = await axios.post('http://192.168.1.64:8080/viva/order', orderData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200) {
				const data = response.data;

				// Παίρνουμε το orderCode από την απάντηση
				const orderCode = String(data.orderCode);

				// Δημιουργούμε το URL για το VivaPayments και το κάνουμε redirect
				const url = `https://demo.vivapayments.com/web/checkout?ref=${orderCode}`;


				// Κάνουμε το redirect στην ίδια καρτέλα
				window.location.href = url; // Το URL με το orderCode από το backend
			} else {
				throw new Error('Failed to create order');
			}
		} catch (err) {
			setError('There was an error while processing your order');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};







	return (
		<div>
			<form onSubmit={handleSubmit}>
				{/* Ολόκληρη η φόρμα αφαιρείται και το περιεχόμενο θα εμφανιστεί μόλις υποβληθεί */}
				{!message && (
					<div>
						<div>
							<label>Ονοματεπώνυμο:</label>
							<input
								type="text"
								name="fullname"
								value={order.fullname}
								onChange={handleChange}
								required
							/>
						</div>
						<div>
							<label>Email:</label>
							<input
								type="email"
								name="email"
								value={order.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div>
							<label>Τηλέφωνο:</label>
							<input
								type="text"
								name="phone"
								value={order.phone}
								onChange={handleChange}
								required
							/>
							{/*<small>Enter a 10-digit phone number</small>*/}
						</div>
						<div>
							<p>Σύνολο: €{order.totalAmount.toFixed(2)}</p>
						</div>
						<div className={"modal-order-button"}>
							<button type="submit">Ολοκλήρωση παραγγελίας</button>
						</div>
					</div>
				)}
			</form>
			{message && (
				<p style={{ color: message.includes('Σφάλμα') ? 'red' : 'green' }}>{message}</p>
			)}
		</div>
	);
};

export default OrderForm;

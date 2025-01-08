import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../Style/style.css";

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState(''); // State for toast message
	const [messageType, setMessageType] = useState(''); // State for toast message type (success or error)

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('http://localhost:8080/api/login', {
				username,
				password,
			});

			const { accessToken } = response.data;
			login({ accessToken });

			setMessage('Login successful!'); // Set success message
			setMessageType('success');
			setTimeout(() => {
				setMessage(''); // Clear the message after 3 seconds
			}, 3000);

			navigate('/user');

		} catch (error) {
			setMessage('Αποτυχία σύνδεσης. Ελέγξτε το όνομα χρήστη ή τον κωδικό πρόσβασης.'); // Set error message
			setMessageType('');

			setTimeout(() => {
				setMessage(''); // Clear the message after 3 seconds
			}, 3000);
		}
	};

	const toastStyle = {


		position: 'fixed',
		top: '20px',
		left: '50%',
		transform: 'translateX(-50%)',
		padding: '2px 20px',
		borderRadius: '50px',
		color: 'white',
		boxshadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
		zindex: "1000",
		animation: "fadein 0.5s, fadeout 0.5s 2.5s", /* Fade in and fade out effect */
		backgroundColor: messageType === 'success' ? 'rgba(68, 199, 68, 0.9)' : 'rgba(255, 69, 58, 0.8)'
	};

	return (
		<div className="login-container">
			{/* Toast notification */}
			{message && (
				<div  style={toastStyle}>
					<p>{message}</p>
				</div>
			)}

			<form onSubmit={handleLogin}>
				<h1>Login</h1>
				<div>
					<label>Username:</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="button-container">
					<button type="submit">Login</button>
				</div>
			</form>
		</div>
	);
};

export default Login;

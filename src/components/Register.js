import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import "../Style/style.css";

const Register = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [fullname, setFullname] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			await register({ username, password, fullname, email, phone });

			toast.success('Registration successful!');

			setTimeout(() => {
				navigate('/user');
			}, 2000);

		} catch (error) {
			// Έλεγχος αν το σφάλμα είναι 409 (Conflict)
			if (error.response && error.response.status === 409) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Σφάλμα κατά την εγγραφή');
			}
		}
	};



	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Sign Up</h1>
				<div>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="fullname">Full Name:</label>
					<input
						type="text"
						id="fullname"
						value={fullname}
						onChange={(e) => setFullname(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="phone">Phone:</label>
					<input
						type="text"
						id="phone"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<div className={"Button"}>
					<button type="submit">Sign Up</button>
				</div>
			</form>
			<ToastContainer />
		</div>
	);
};

export default Register;

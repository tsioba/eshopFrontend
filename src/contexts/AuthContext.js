import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Χρήση React Router για πλοήγηση

// Δημιουργία του Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const navigate = useNavigate(); // Χρησιμοποιούμε το useNavigate για πλοήγηση

	const login = async (data) => {
		try {
			setToken(data.accessToken);
			localStorage.setItem('token', data.accessToken);
			await fetchUserDetails(data.accessToken);
		} catch (error) {
			throw error;
		}
	};

	const register = async (data) => {
		try {
			const response = await axios.post('http://localhost:8080/api/register', data);
			const { accessToken } = response.data;
			await login({ accessToken });
		} catch (error) {
			throw error; // Για να χειριστείς το σφάλμα στο frontend
		}
	};

	const fetchUserDetails = async (token) => {
		if (token) {
			try {
				const response = await axios.get('http://localhost:8080/api/user-details', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUser(response.data);
			} catch (error) {
				logout(); // Αν αποτύχει η ανάκτηση του χρήστη, αποσύνδεση
			}
		}
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('token');
		navigate('/user'); // Χρησιμοποιούμε το React Router για να πλοηγηθούμε στη σελίδα χρήστη
	};

	useEffect(() => {
		const savedToken = localStorage.getItem('token');
		if (savedToken) {
			setToken(savedToken);
			fetchUserDetails(savedToken);
		}
	}, []);

	const isAuthenticated = !!token;

	return (
		<AuthContext.Provider value={{ token, login, register, logout, user, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

// Custom hook για χρήση του AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

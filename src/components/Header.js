import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Style/style.css';
import logo from '../images/Logo.png';
import cartIcon from "../images/cart.svg";
import profileIcon from "../images/profile.svg";
import searchIcon from "../images/search.svg";
import menuIcon from "../images/menu.svg";

import { useCart } from "../contexts/CartContext";
import { ProductContext } from '../contexts/ProductContext';

const Header = () => {
	const { cartItems } = useCart();
	const { setSearchQuery } = useContext(ProductContext);
	const navigate = useNavigate();
	const menuRef = useRef(null); // Δημιουργία ref για το μενού

	const totalItems = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
	const [searchQuery, setLocalSearchQuery] = useState('');
	const [isMenuOpen, setMenuOpen] = useState(false);

	const handleSearchChange = (event) => {
		setLocalSearchQuery(event.target.value);
	};

	const handleSearchSubmit = () => {
		setSearchQuery(searchQuery);
		setLocalSearchQuery('');
		navigate('/');
		closeMenu();
	};

	const handleLogoClick = () => {
		setSearchQuery('');
		navigate('/');
		closeMenu();
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			handleSearchSubmit();
		}
	};

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setMenuOpen(false);
	};

	const handleMenuItemClick = () => {
		closeMenu(); // Κλείνει το μενού όταν επιλέγεται μια επιλογή
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) {
				setMenuOpen(false); // Κλείνει το μενού όταν η οθόνη είναι μεγαλύτερη από 768px
			}
		};

		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				closeMenu(); // Κλείνει το μενού αν το κλικ έγινε εκτός του μενού
			}
		};

		window.addEventListener('resize', handleResize);
		document.addEventListener('mousedown', handleClickOutside);

		// Καθαρισμός των event listeners κατά την αποσύνδεση
		return () => {
			window.removeEventListener('resize', handleResize);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className="header">
			<div className="header-left">
				<img
					src={logo}
					className="logo"
					alt="Logo"
					onClick={handleLogoClick}
				/>
				<div className="burger-menu" onClick={toggleMenu}>
					<img src={menuIcon} alt="Search" className="menu-icon"/>
				</div>
				<div ref={menuRef} className={`burger-menu-content ${isMenuOpen ? 'active' : ''}`}>
					<div className="container">
						<div className="close-button-container">
							<p className="close-icon" onClick={closeMenu}>X</p>
						</div>
						<div className="searchbar">
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={handleSearchChange}
								onKeyDown={handleKeyDown}
								className="search-bar"
							/>
							<button onClick={handleSearchSubmit} className="search-button">
								<img src={searchIcon} alt="Search" className="search-icon"/>
							</button>
						</div>
						<Link to="/user" className="nav-link cart-link" onClick={handleMenuItemClick}>
							<img src={profileIcon} alt="User" className="profile-icon"/>
							<p>Ο Λογαριασμός σας</p>
						</Link>
						<Link to="/cart" className="nav-link cart-link" onClick={handleMenuItemClick}>
							<img src={cartIcon} alt="Cart" className="cart-icon"/>
							<span className="cart-count">{totalItems}</span>
							<p>Το Καλάθι σας</p>
						</Link>
					</div>
				</div>
			</div>
			<div className="header-center">
				<input
					type="text"
					placeholder="Search..."
					value={searchQuery}
					onChange={handleSearchChange}
					onKeyDown={handleKeyDown}
					className="search-bar"
				/>
				<button onClick={handleSearchSubmit} className="search-button">
					<img src={searchIcon} alt="Search" className="search-icon"/>
				</button>
			</div>
			<div className="header-right">
				<Link to="/user" className="nav-link cart-link">
					<img src={profileIcon} alt="User" className="profile-icon"/>
				</Link>
				<Link to="/cart" className="nav-link cart-link">
					<img src={cartIcon} alt="Cart" className="cart-icon"/>
					<span className="cart-count">{totalItems}</span>
				</Link>
			</div>
		</header>
	);
};

export default Header;

import React from 'react';
import '../Style/style.css'; // Φρόντισε να έχεις το αντίστοιχο CSS αρχείο
import { FaFacebook, FaYoutube,FaInstagram, FaTiktok } from 'react-icons/fa';
import {useLocation} from "react-router-dom"; // Εισαγωγή εικονιδίων για Facebook και YouTube
import MasterCardIcon from '../images/Cards/MastercardIcon.svg';
import PayPalIcon from '../images/Cards/PayPalIcon.svg';
import VisaIcon from '../images/Cards/VisaIcon.svg';
import KlarnaIcon from '../images/Cards/klarna.svg';
import IrisIcon from '../images/Cards/iris.svg';
import ApplePayIcon from '../images/Cards/applepay.svg';



const Footer = () => {
	const location = useLocation();

	// Λίστα με paths που θέλεις να μην εμφανίζεται το footer
	const hideFooterPaths = ['/login', '/register', '/user'];
	// Αν το path περιέχεται στη λίστα, δεν θα εμφανιστεί το footer
	if (hideFooterPaths.includes(location.pathname)) {
		return null; // Δεν επιστρέφει τίποτα, το footer θα κρυφτεί
	}

	return (
		<footer className="footer">
			<div className="footer-left">
				<h4>Need Help?</h4>
				<p>About Us</p>
				<p>Contact Us</p>
				<p>FAQs</p>
				<div className={"social-links"}>
					<FaYoutube/>
					<FaFacebook/>
					<FaInstagram/>
					<FaTiktok/>
				</div>


			</div>
			<div className="footer-center">
				<h4>Quick Links</h4>
				<p><a href="/">Home</a></p>
				<p><a href="/cart">Cart</a></p>
				<p><a href="/user">My Account</a></p>
			</div>

			<div className="footer-right">

				<h4>
					Payment Methods
				</h4>
				<div className="cards">
					<img src={MasterCardIcon} alt="MasterCard"/>
					<img src={PayPalIcon} alt="PayPal"/>
					<img src={VisaIcon} alt="Visa"/>
					<img src={KlarnaIcon} alt="Klarna"/>
					<img src={IrisIcon} alt="Iris"/>
					<img src={ApplePayIcon} alt="Apple Pay"/>
				</div>

				{/*<p>*/}
				{/*	Made with ❤️ by{' '}*/}
				{/*	<a href="https://tsioba.github.io/" target="_blank" rel="noopener noreferrer">*/}
				{/*		Tsioba*/}
				{/*	</a>*/}
				{/*</p>*/}
			</div>
		</footer>
	);
};

export default Footer;

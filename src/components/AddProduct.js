import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast

const AddProduct = ({ closeModal, fetchProducts }) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [model, setModel] = useState(null);
	const { token } = useAuth();

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Frontend validation for empty fields
		if (!name || !description || !price) {
			toast.error('Please fill in all required fields!');
			return;
		}

		// Product data
		const productData = {
			name,
			description,
			price,
			filename: model ? model.name : ''
		};

		try {
			// Headers for product creation
			const headers = {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			};

			// Create product
			await axios.post('http://localhost:8080/api/products', productData, { headers });

			// Handle 3D model file if exists
			if (model) {
				const formData = new FormData();
				formData.append('file', model);

				console.log('FormData contents:', formData.get('file'));

				// Upload 3D model
				await axios.post('http://localhost:8080/api/products/upload-3dmodel', formData, {
					headers: {
						...headers, // Include the Authorization header here
						'Content-Type': 'multipart/form-data'
					}
				});

				toast.success('Product added and 3D model uploaded successfully!');
			} else {
				toast.success('Product added successfully, without 3D model.');
			}

			// Close modal
			closeModal();

			// Clear form fields
			setName('');
			setDescription('');
			setPrice('');
			setModel(null);

			// Fetch updated product list
			fetchProducts();

		} catch (error) {
			let errorMessage = error.response?.data?.error || 'Error adding product!';

			// Check if the error message contains "Resource already exists"
			if (errorMessage.includes('Resource already exists:')) {
				errorMessage = errorMessage.replace('Resource already exists: ', '');
			}

			// Show error toast
			toast.error(errorMessage);
		}
	};

	return (
		<div>
			<h1>Add Product</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="name">Product Name:</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="description">Description:</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="price">Price:</label>
					<input
						type="number"
						id="price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						step="0.01"
						required
					/>
				</div>
				<div>
					<label htmlFor="model">3D Model File:</label>
					<input
						type="file"
						id="model"
						onChange={(e) => setModel(e.target.files[0])}
					/>
				</div>
				<button type="submit">Add Product</button>
			</form>
		</div>
	);
};

export default AddProduct;

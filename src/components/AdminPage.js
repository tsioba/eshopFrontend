import React, { useContext, useState } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import AddProduct from './AddProduct';
import axios from 'axios';
import binIcon from "../images/bin.svg";
import editIcon from "../images/edit.svg";
import ConfirmationModal from './ConfirmationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
	const { products, fetchProducts } = useContext(ProductContext);
	const { user, logout } = useAuth();
	const [editingProduct, setEditingProduct] = useState(null);
	const [editFormData, setEditFormData] = useState({
		name: '',
		price: '',
		description: ''
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState(null);

	const handleDeleteClick = (productId) => {
		setProductToDelete(productId);
		setIsConfirmationOpen(true);
	};

	const handleDelete = async () => {
		if (productToDelete) {
			try {
				await axios.delete(`http://localhost:8080/api/products/${productToDelete}`);
				toast.success('Product deleted successfully!');
				setProductToDelete(null);
				setIsConfirmationOpen(false);
				fetchProducts(); // Ανανεώστε τα προϊόντα

			} catch (error) {
				toast.error('There was an error deleting the product!');
			}
		}
	};

	const handleEditClick = (product) => {
		setEditingProduct(product);
		setEditFormData({
			name: product.name,
			price: product.price,
			description: product.description
		});
	};

	const handleEditChange = (event) => {
		const { name, value } = event.target;
		setEditFormData((prevData) => ({
			...prevData,
			[name]: value
		}));
	};

	const handleEditSubmit = async (productId) => {
		try {
			await axios.patch(`http://localhost:8080/api/products/${productId}`, editFormData);
			toast.success('Product updated successfully!');
			setEditingProduct(null);
			closeModal();
			fetchProducts(); // Ανανεώστε τα προϊόντα

		} catch (error) {
			toast.error('There was an error updating the product!');
		}
	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const closeConfirmation = () => {
		setIsConfirmationOpen(false);
	};

	return (
		<div className="admin-container">
			<h1>Admin Page - Manage Products</h1>
			<div className="user-dashboard">
				<div className="user-info">
					<h2>Πληροφορίες Διαχειριστή</h2>
					<p><strong>Username:</strong> {user?.username}</p>
					<p><strong>Ονοματεπώνυμο:</strong> {user?.fullname}</p>
					<p><strong>Email:</strong> {user?.email}</p>
					<div className="logout-button">
						<button onClick={logout}>Logout</button>
					</div>
				</div>

				<div className={"products"}>
					<h2>Προϊόντα</h2>
					<ul>
						{products.length > 0 ? (
							products.map((product) => (
								<li key={product.id}>
									{editingProduct && editingProduct.id === product.id ? (
										<div>
											<input
												type="text"
												name="name"
												value={editFormData.name}
												onChange={handleEditChange}
											/>
											<input
												type="number"
												name="price"
												value={editFormData.price}
												onChange={handleEditChange}
											/>
											<textarea
												name="description"
												value={editFormData.description}
												onChange={handleEditChange}
											/>
											<button onClick={() => handleEditSubmit(product.id)}>Save</button>
											<button onClick={() => setEditingProduct(null)}>Cancel</button>
										</div>
									) : (
										<div className={"product-details"}>
											{product.name} - €{product.price}
											<div>
												<button onClick={() => handleEditClick(product)}><img src={editIcon} alt="Edit" /></button>
												<button onClick={() => handleDeleteClick(product.id)}><img src={binIcon} alt="Delete" /></button>
											</div>
										</div>
									)}
								</li>
							))
						) : (
							<p>No products found</p>
						)}
					</ul>
					<div className="add-product-container">
						<button onClick={toggleModal}>Add Product</button>
					</div>

					{isModalOpen && (
						<div className="modal">
							<div className="modal-content">
								<span className="close-button" onClick={toggleModal}>&times;</span>
								<AddProduct closeModal={toggleModal} fetchProducts={fetchProducts} />
							</div>
						</div>
					)}

					{isConfirmationOpen && (
						<ConfirmationModal
							message="Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;"
							onConfirm={handleDelete}
							onCancel={closeConfirmation}
						/>
					)}
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default AdminPage;

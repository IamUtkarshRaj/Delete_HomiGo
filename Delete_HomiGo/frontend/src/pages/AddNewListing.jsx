import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import roomService from '../services/roomService';
import './AddNewListing.css';

const AddNewListing = () => {
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        price: '',
        availableRooms: 1,
        roomType: 'shared',
        amenities: [],
        preferences: {
            gender: 'any',
            smoking: false,
            pets: false,
            foodPreferences: 'any'
        }
    });
    
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    // Predefined options
    const amenitiesList = [
        'Wi-Fi', 'AC', 'Food', 'Laundry', 'TV', 'Gym', 'Study Hall', 
        'Parking', 'Security', 'Housekeeping', 'Power Backup', 'Water Heater'
    ];

    const roomTypes = [
        { value: 'single', label: 'Single Room' },
        { value: 'shared', label: 'Shared Room' },
        { value: 'apartment', label: 'Apartment' }
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle amenities selection
    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                showToast('Please select only image files', 'error');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast('Image size should be less than 5MB', 'error');
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setImages(prev => [...prev, ...validFiles].slice(0, 6)); // Max 6 images
        }
    };

    // Remove image
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Show toast message
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) newErrors.title = 'Property title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.availableRooms || formData.availableRooms <= 0) newErrors.availableRooms = 'Number of rooms must be greater than 0';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showToast('Please fix the errors before submitting', 'error');
            return;
        }

        setIsLoading(true);
        
        try {
            // Prepare data for API submission
            const submitData = {
                ...formData,
                images: images
            };
            
            // Create the listing using roomService
            const response = await roomService.createRoom(submitData);
            
            if (response.success) {
                showToast('Listing created successfully!', 'success');
                setTimeout(() => navigate('/owner-listings'), 2000);
            } else {
                showToast(response.message || 'Failed to create listing', 'error');
            }
            
        } catch (error) {
            console.error('Error creating listing:', error);
            showToast(error.message || 'Failed to create listing. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="add-listing-layout">
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
            
            <div className="add-listing-content" style={{ marginLeft: isSidebarCollapsed ? 80 : 256 }}>
                <div className="add-listing-container">
                    {/* Header */}
                    <div className="add-listing-header">
                        <div className="header-content">
                            <button className="back-btn" onClick={() => navigate('/owner-dashboard')}>
                                ← Back to Dashboard
                            </button>
                            <h1>Add New Listing</h1>
                            <p>Create a new property listing for students</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="add-listing-form" onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="form-section">
                            <div className="section-header">
                                <h2>Basic Information</h2>
                                <p>Provide essential details about your property</p>
                            </div>
                            
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label htmlFor="title">Property Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Elite Girls PG Near College"
                                        className={errors.title ? 'error' : ''}
                                    />
                                    {errors.title && <span className="error-text">{errors.title}</span>}
                                </div>
                                
                                <div className="form-group full-width">
                                    <label htmlFor="description">Description *</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe your property, its features, and what makes it special..."
                                        rows={4}
                                        className={errors.description ? 'error' : ''}
                                    />
                                    {errors.description && <span className="error-text">{errors.description}</span>}
                                </div>
                                
                                <div className="form-group full-width">
                                    <label htmlFor="address">Complete Address *</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Street, Area, City, State, PIN Code"
                                        className={errors.address ? 'error' : ''}
                                    />
                                    {errors.address && <span className="error-text">{errors.address}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="price">Monthly Rent (₹) *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="15000"
                                        min="0"
                                        className={errors.price ? 'error' : ''}
                                    />
                                    {errors.price && <span className="error-text">{errors.price}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="availableRooms">Available Rooms *</label>
                                    <input
                                        type="number"
                                        id="availableRooms"
                                        name="availableRooms"
                                        value={formData.availableRooms}
                                        onChange={handleInputChange}
                                        min="1"
                                        className={errors.availableRooms ? 'error' : ''}
                                    />
                                    {errors.availableRooms && <span className="error-text">{errors.availableRooms}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="roomType">Room Type *</label>
                                    <select
                                        id="roomType"
                                        name="roomType"
                                        value={formData.roomType}
                                        onChange={handleInputChange}
                                    >
                                        {roomTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="form-section">
                            <div className="section-header">
                                <h2>Amenities</h2>
                                <p>Select all amenities available at your property</p>
                            </div>
                            
                            <div className="amenities-grid">
                                {amenitiesList.map(amenity => (
                                    <div
                                        key={amenity}
                                        className={`amenity-item ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                                        onClick={() => handleAmenityToggle(amenity)}
                                    >
                                        <span className="amenity-icon">✓</span>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="form-section">
                            <div className="section-header">
                                <h2>Preferences</h2>
                                <p>Set your preferred tenant requirements</p>
                            </div>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="gender">Gender Preference</label>
                                    <select
                                        id="gender"
                                        name="preferences.gender"
                                        value={formData.preferences.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="any">Any</option>
                                        <option value="male">Male Only</option>
                                        <option value="female">Female Only</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="foodPreferences">Food Preference</label>
                                    <select
                                        id="foodPreferences"
                                        name="preferences.foodPreferences"
                                        value={formData.preferences.foodPreferences}
                                        onChange={handleInputChange}
                                    >
                                        <option value="any">Any</option>
                                        <option value="veg">Vegetarian Only</option>
                                        <option value="non-veg">Non-Vegetarian</option>
                                    </select>
                                </div>
                                
                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="preferences.smoking"
                                            checked={formData.preferences.smoking}
                                            onChange={handleInputChange}
                                        />
                                        <span>Smoking Allowed</span>
                                    </label>
                                </div>
                                
                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="preferences.pets"
                                            checked={formData.preferences.pets}
                                            onChange={handleInputChange}
                                        />
                                        <span>Pets Allowed</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="form-section">
                            <div className="section-header">
                                <h2>Property Images</h2>
                                <p>Upload clear photos of your property (Max 6 images, 5MB each)</p>
                            </div>
                            
                            <div className="image-upload-section">
                                <div className="image-upload-area">
                                    <input
                                        type="file"
                                        id="images"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="images" className="upload-label">
                                        <div className="upload-icon">📷</div>
                                        <p>Click to upload images</p>
                                        <span>or drag and drop</span>
                                    </label>
                                </div>
                                
                                {images.length > 0 && (
                                    <div className="uploaded-images">
                                        {images.map((image, index) => (
                                            <div key={index} className="image-preview">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Upload ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="add-listing-btn-secondary"
                                onClick={() => navigate('/owner-dashboard')}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="add-listing-btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Listing...' : 'Create Listing'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <Footer />
            </div>
            
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
        </div>
    );
};

export default AddNewListing;
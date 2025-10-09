const express = require('express');
const router = express.Router();
// Get all users
router.get('/', async (req, res) => {
    const User = require('../models/user.models');
    try {
        const users = await User.find({});
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});
const { 
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getProfile,
    updateProfile,
    uploadProfilePicture,
    getPreferences
} = require('../controller/user.controllers');
const { isLoggedIn } = require('../middlewares/isloggedin');

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', isLoggedIn, logoutUser);
router.get('/auth/me', isLoggedIn, getCurrentUser);

// User profile routes
router.get('/profile', isLoggedIn, getProfile);
router.put('/profile', isLoggedIn, updateProfile);
router.post('/upload-picture', isLoggedIn, uploadProfilePicture);
router.get('/preferences', isLoggedIn, getPreferences);

module.exports = router;

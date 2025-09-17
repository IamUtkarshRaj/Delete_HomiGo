const express = require('express');
const router = express.Router();
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

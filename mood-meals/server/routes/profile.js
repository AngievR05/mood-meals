const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// PROFILE
router.get('/', verifyToken, profileController.getProfile);
router.put('/', verifyToken, profileController.updateProfile);
router.put('/change-password', verifyToken, profileController.changePassword);

// STATS
router.get('/streak', verifyToken, profileController.getStreak);
router.get('/saved-meals', verifyToken, profileController.getSavedMeals);
router.get('/mood-entries', verifyToken, profileController.getMoodEntries);
router.get('/current-mood', verifyToken, profileController.getCurrentMood);
router.get('/grocery-count', verifyToken, profileController.getGroceryCount);
router.get('/meal-stats', verifyToken, profileController.getMealStats);
router.get('/preferences', verifyToken, profileController.getPreferences);
router.put('/preferences', verifyToken, profileController.updatePreferences);
router.get('/journal', verifyToken, profileController.getJournal);
router.post('/journal', verifyToken, profileController.addJournal);


module.exports = router;

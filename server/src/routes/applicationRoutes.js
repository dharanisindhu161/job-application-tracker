const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticateToken = require('../middleware/auth');

// All application routes require authentication
router.use(authenticateToken);

// Specific routes first
router.get('/stats', applicationController.getStats);

// Main CRUD routes
router.get('/', applicationController.getAllApplications);
router.post('/', applicationController.createApplication);

router.get('/:id', applicationController.getApplicationById);
router.put('/:id', applicationController.updateApplication);
router.patch('/:id/status', applicationController.updateStatus);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;

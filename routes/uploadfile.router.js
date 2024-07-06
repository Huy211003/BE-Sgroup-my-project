const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const uploadFileController = require('../controllers/uploadfile.controller');
const uploadFileService = require('../services/uploadfile.services');

router.post('/uploadfile', authenticateToken.authenticateToken, uploadFileService.single('file'), uploadFileController.uploadFile);

router.post('/uploadfiles', authenticateToken.authenticateToken, uploadFileService.array('files', 5), uploadFileController.uploadMultipleFiles);

module.exports = router;
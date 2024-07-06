const express = require('express');
const router = express.Router();
const uploadFileController = require('../controllers/uploadfile.controller');
const uploadFileService = require('../services/uploadfile.services');

router.post('/uploadfile', uploadFileService.single('file'), uploadFileController.uploadFile);

router.post('/uploadfiles', uploadFileService.array('files', 5), uploadFileController.uploadMultipleFiles);

module.exports = router;
const express = require('express');
const { upload } = require('../../../middlewares/multer-middleware');
const authMiddleware = require('../../../middlewares/auth-middleware');
const { createReportController } = require('../../../controllers/report-controller');

const reportRoute = express.Router();

// Route to create a new report
reportRoute.post("/create-report",authMiddleware,upload.single('reportImage'),createReportController);




module.exports = { reportRoute };
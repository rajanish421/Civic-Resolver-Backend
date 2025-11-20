const express = require('express');
const { upload } = require('../../../middlewares/multer-middleware');
const authMiddleware = require('../../../middlewares/auth-middleware');
const { createReportController, getReportController, getAllReportToAUserController, updateReportController, deleteReportController } = require('../../../controllers/report-controller');

const reportRoute = express.Router();

// Route to create a new report
reportRoute.post("/create-report",authMiddleware,upload.single('reportImage'),createReportController);


// get route

reportRoute.get("/get-report/:reportId",authMiddleware , getReportController);

// get all report by user id route

reportRoute.get("/get-all-report", authMiddleware , getAllReportToAUserController);

// update report route

reportRoute.put("/update-report/:reportId",authMiddleware,updateReportController);

// detele report

reportRoute.delete("/delete-report/:reportId",authMiddleware,deleteReportController);



module.exports = { reportRoute };
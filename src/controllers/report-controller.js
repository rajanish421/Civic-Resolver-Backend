const {uploadOnCloudinary} = require('../utils/cloudinary');
const fs = require('fs');
const Report = require('../models/report-model');

// createReportController handles report creation requests
const createReportController =async (req,res)=> {
    try {

        // console.log("Request Body:", req.body);

        // get data from request body
        const {category , description, latitude , longitude} = req.body;

        // validate required fields
        if(!category || !description || !latitude || !longitude){
            return res.status(400).json({
                message: 'Category, Description, Latitude and Longitude are required fields'
            });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const tempPath = req.file.path;

        console.log(tempPath);

    

        // Upload image to Cloudinary
        const uploadResult = await uploadOnCloudinary(tempPath);

        // console.log(uploadResult);

        if (!uploadResult) {
            return res.status(500).json({ message: "Image upload failed" });
        }

        const reportImage = uploadResult.secure_url;    

        // console.log(req);
        // create new report object
        const newReport = new Report({
            category,
            description,
            location: [longitude, latitude],
            image_url_initial: reportImage,
            citizen_id:req.user.id
        });

        // save report to database
        await newReport.save()



        // Delete temporary file
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }

        res.status(201).json({
            status: 'true',
            message: 'Report created successfully',
            data: newReport
        });  

    } catch (error) {

        // Delete temporary file
        // if (fs.existsSync(tempPath)) {
        //     fs.unlinkSync(tempPath);
        // }

        res.status(500).json({
            status: 'false',
            message: 'Server Error',
            error: error.message
            });
    }
};

// get report by id controller 
const getReportController = async(req,res)=>{
    try {
        // get report id from parameter

        const {reportId} = req.params;

        if(!reportId){
            res.status(400).json({
                message:"reportId is required"
            });
        }

        const report = await Report.findById(reportId);

        if(!report){
            res.status(404).json({
                message:"Report not found"
            });
        }

        res.status(200).json({
            status:true,
            message:"Report get successfully",
            report:report
        });


    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error from getting report",
            error:error
        });
    }
};

// get all report to a user

const getAllReportToAUserController = async(req,res)=>{
    try {
        // get userID from parameter

        // const {userId} = req.params;
        // console.log(userId);
        const userId = req.user.id;

        if(!userId){
           return res.status(400).json({
                message:"userId is required"
            });
        }

        const reports = await Report.find({"citizen_id":userId});

        if(!reports){
           return res.status(404).json({
                message:"Report not found"
            });
        }

        res.status(200).json({
            status:true,
            count:reports.length,
            report:reports
        });


    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error from getting report",
            error:error.message
        });
    }
};

// update report by reportID
const updateReportController = async (req, res) => {
    let tempPath;

    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({
                message: "reportId is required"
            });
        }

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        // Update fields
        const { category, description, latitude, longitude } = req.body;

        // Only update if provided
        if (category) report.category = category;
        if (description) report.description = description;
        if (latitude && longitude) {
            report.location = [longitude, latitude];
        }

        // Handle optional image update
        if (req.file) {
            tempPath = req.file.path;
            console.log("New temp file:", tempPath);

            const uploadResult = await uploadOnCloudinary(tempPath);

            if (!uploadResult) {
                return res.status(500).json({ message: "Image upload failed" });
            }

            // Save new image
            report.image_url_initial = uploadResult.secure_url;

            // Delete temp file
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }

        await report.save();

        return res.status(200).json({
            status: true,
            message: "Report updated successfully",
            data: report
        });

    } catch (error) {

        // if (tempPath && fs.existsSync(tempPath)) {
        //     fs.unlinkSync(tempPath);
        // }

        return res.status(500).json({
            status: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// delete report 

const deleteReportController = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({
                message: "reportId is required"
            });
        }

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        // OPTIONAL: delete image from Cloudinary (if needed)
        // const imageUrl = report.image_url_initial;
        // const publicId = imageUrl.split("/").pop().split(".")[0];
        // await cloudinary.uploader.destroy(publicId);

        await Report.findByIdAndDelete(reportId);

        return res.status(200).json({
            status: true,
            message: "Report deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error",
            error: error.message
        });
    }
};


    


module.exports = {createReportController,getReportController,deleteReportController,updateReportController ,getAllReportToAUserController };


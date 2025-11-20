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

module.exports = {createReportController};


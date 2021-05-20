const express = require("express");
const doctor = require("../controllers/doctorControllers");
const router = express.Router();


router.get("/getDoctors",doctor.getDoctors);

router.post("/addAppointment",doctor.addAppointment);

router.get("/getAppointment",doctor.getAppointments);

router.post("/uploadFile", doctor.uploadFile);

router.post("/updateRating",doctor.updateRating);

module.exports = router;
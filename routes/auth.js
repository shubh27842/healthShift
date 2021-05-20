const express = require("express");
const doctor = require("../controllers/doctorControllers");
const router = express.Router();


router.post("/register",doctor.register);
 
router.post("/login",doctor.login);

router.get("/getById",doctor.getById);




module.exports = router;
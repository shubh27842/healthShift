const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.register = async(req,res,next) => {

    console.log(req.body);
    let payload = req.body;
    let errors = {error: ""}
	if(payload.typeOfUser === "doctor"){
		Doctor.findOne({ email: payload.email })
		.then(doc => {
			if (doc) {
                errors.error= "Email already exists"
				return res.status(400).send(errors);
			} else {
				const newDoctor = new Doctor({
					firstName: payload.name,
					lastName: payload.lastName,
					email: payload.email,
					password: payload.password,
					speciality: payload.speciality,
					typeOfUser: payload.typeOfUser,
                    phonenumber: payload.phonenumber,
                    address: payload.address,
				});
				bcrypt.genSalt(10, (err, salt) => {
					if (err) throw err;
					bcrypt.hash(newDoctor.password, salt, (err, hash) => {
						if (err) throw err;
						newDoctor.password = hash;
						newDoctor
							.save()
							.then(doctor => res.json(doctor))
							.catch(err => console.log(err));
					});
				});
			}
		})
		.catch(err => console.log(err));
	}else{
		Patient.findOne({ email: payload.email })
		.then(doc => {
			if (doc) {
                errors.error= "Email already exists"
				return res.status(400).send(errors);
			} else {
				const newPatient = new Patient({
					firstName: payload.name,
					lastName: payload.lastName,
					email: payload.email,
					password: payload.password,
					typeOfUser: payload.typeOfUser,
                    phonenumber: payload.phonenumber
				});
				bcrypt.genSalt(10, (err, salt) => {
					if (err) throw err;
					bcrypt.hash(newPatient.password, salt, (err, hash) => {
						if (err) throw err;
						newPatient.password = hash;
						newPatient
							.save()
							.then(doctor => res.json(doctor))
							.catch(err => console.log(err));
					});
				});
			}
		})
		.catch(err => console.log(err));
	}
    
}

exports.login = async(req, res, next) => {
	const { email, password } = req.body;
	let errors = {password: "",email: ""}
	Patient.findOne({
		email
	})
		.then(patient => {
			if (patient) {
				bcrypt.compare(password, patient.password).then(isMatch => {
					if (isMatch) {
						const payload = {
							id: patient.id,
							firstName: patient.firstName,
							lastName: patient.lastName,
							typeOfUser: "Patient"
						}; 
						jwt.sign(payload, process.env.SECRET, (err, token) => {
							if (err) console.log(err);
							res.json({
								success: true,
								user: patient,
								token:  token
							});
						});
					} else {
						console.log(`Password incorrect`);
						errors.password = "Password incorrect";
						return res.status(404).json(errors);
					}
				});
			} else {
				Doctor.findOne({
					email
				}).then(doctor => {
					if (!doctor) {
						errors.email = "User not found";
						return res.status(404).json(errors);
					}
					if (doctor) {
						bcrypt
							.compare(password, doctor.password)
							.then(isMatch => {
								if (isMatch) {
									const payload = {
										id: doctor.id,
										firstName: doctor.firstName,
										lastName: doctor.lastName,
										typeOfUser: "Doctor"
									}; 
									jwt.sign(
										payload,
										process.env.SECRET,
										(err, token) => {
											if (err) console.log(err);
											res.json({
												success: true,
												user: doctor,
												token: token
											});
										}
									);
									console.log(`User matched!`);
								} else {
									console.log("Password incorrect");
									errors.password = "Password incorrect";
									return res.status(404).json(errors);
								}
							});
					} else {
						errors.email = "User not found";
						return res.status(404).json(errors);
					}
				});
			}
		})
		.catch(err => console.log(err));
};

exports.getUserById = async(req,res,next) => {
	let userId = req.query;
	Doctor.findById({_id: mongoose.Types.ObjectId(userId)})
			.then(doc => {
				if (doc) {
					console.log("doc " + doc);
					res.send(doc);
				} else {
					Patient.findById({_id: mongoose.Types.ObjectId(userId)}).then(
						patient => {
							if (patient) {
								console.log("patient " + patient);
								res.send(patient);
							} else res.status(400).send();
						}
					);
				}
			})
			.catch(err => console.log(err));
	};

exports.getDoctors = async(req,res,next) => {
	let payload = req.query;
	let findCriteria = {
		
	}
	payload.name? findCriteria.firstName = payload.name : "" 
	//payload.pincode? findCriteria.address = payload.pincode : "" 
	payload.speciality? findCriteria.speciality = payload.speciality : "" 
	let doctors = await Doctor.find(findCriteria).exec();
	if(doctors){
		//console.log(doctors);
		res.json(doctors);
	}else{
		res.status(400).send("No doctor found");
	}
};

exports.addAppointment = async(req, res,next) => {
	const { doctorID,patientId, name,phone,day} = req.body;
	let app = {
		patientId: patientId,
		pName: name,
		pPhone: phone,
		day: day
	}
	//console.log(req.body);
	Doctor.findById(doctorID)
		.then(doc => {
			if (doc) 
				doc.appointments.push(app);
				doc.save().then(doc=> res.json(doc));
				
			/*	let tempApps = doc.appointments;
				tempApps[day].push(appointment);
				doc.appointments = null;
				console.log(tempApps)
				doc.appointments = tempApps;
				
				doc.save();*/

				/*Patient.findById(patientID).then(patient => {
					if (patient) {

						patient.appointments.push(doctorID);
						patient.save().then(doc=> res.json(doc));
						{
							/*
							appointment.name = `Dr. ${doc.firstName}  ${
							doc.settings.cabinet
								? `cab. #${doc.settings.cabinet}`
								: ""
						}`;
						let tempApps = patient.appointments;
						tempApps[day].push(appointment);
						patient.appointments = null;
						patient.appointments = tempApps;
						patient.save();
							
						}	
						
					}
				});
			}*/
		})
		.catch(err => console.log(err));
};

exports.getById = async(req, res,next) => {
	console.log(req.query);
	(await Doctor.findById(req.query.id)).populate("patients")
		.then(doc => {
			if (doc) {
				console.log("doc " + doc);
				res.send(doc);
			} else {
				Patient.findById(req.query.id).populate("doctors").then(
					patient => {
						if (patient) {
							console.log("patient " + patient);
							res.send(patient);
						} else res.status(400).send();
					}
				);
			}
		})
		.catch(err => console.log(err));
}

exports.getAppointments = async(req, res) => {
	console.log(req.query)
	Doctor.findById(req.query.id).populate("appointments").then(doc => {
		if (doc) {
			console.log(doc)
			res.send(doc.appointments);
		} else res.send("Doctor not found");
	});
}


exports.uploadFile = async(req, res, next) => {
    try {
        let imgUrl = `${req.protocol}://${req.get("host")}/${req.file.destination + req.file.filename}`;

		console.log(req);

        let responseObj = {
            fileSavedUrl: imgUrl,
            destination: req.file.destination,
            fileName: req.file.filename
        }
        res.send(responseObj);

    } catch (err) {
        console.log(err);

    }
}



exports.updateRating = async(req, res, next) => {
    try {
        let payload = req.body
        let patientId = payload.patientId;
        let ratingUserGiven = payload.rating;
        let findCriteria = {
            
        }
		console.log
        payload.doctorId ? findCriteria._id = mongoose.Types.ObjectId(payload.doctorId) : null

        if (patientId && findCriteria._id) {
            let doc = await Doctor.find(findCriteria).exec();
            if (doc && Array.isArray(doc) && doc.length) {
                let rating = doc[0].rating;
                let existingRatingObject = rating.find(
                    (ele) => ele.userId.toString() === patientId.toString()
                );
                if (existingRatingObject === undefined) {
                    let updateCri = {
                        $push: {
                            rating: {
                                rating: ratingUserGiven,
                                userId: patientId,
                            }
                        },
                    }
                    let ratingAdded = await Doctor.findByIdAndUpdate(findCriteria, updateCri, { new: true }).exec();
                    let updateCriNew = [{
                        $set: {
                            average_rating: {
                                $avg: "$rating.rating"
                            }
                        }
                    }];
                    await Doctor.updateOne(findCriteria, updateCriNew).exec()
                  res.send(ratingAdded)
                } else {
                    let updateCri = {
                        $set: {
                            "rating.$.rating": ratingUserGiven
                        }
                    }

                    let updateCriNew = [{
                        $set: {
                            average_rating: {
                                $avg: "$rating.rating"
                            }
                        }
                    }];
                    let findCri = findCriteria
                    findCriteria = {
                        ...findCriteria,
                        "rating.userId": patientId
                    };
                    const ratingUpdated = await Doctor.updateOne(findCriteria, updateCri, { new: true }).exec();
                    await Doctor.update(findCri, updateCriNew).exec()
					res.send(ratingUpdated)
                }
            } else {
                throw new Error("doctor id is wrong")
            }

        } else {
            throw new Error("Proper Details Not Found")
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);

    }
}



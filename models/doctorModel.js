const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true
        },
        phonenumber: {
            type: String,
        },
        speciality: {
            type: String,
            require: true
        },
        imgUrl: {
            type: String
        },
        address: [{
            houseDetails: {
                type: String,
            },
            city: {
                type: String
            },
            pincode: {
                type: String,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
            }
        }],
        password: {
            type: String,
            required: true
        },
        typeOfUser: {
            type: String
        },
        tokens : {
            type: [String]
        },
        patients : [{
            patient : {
                type: Schema.Types.ObjectId,
                ref: "patients"
            }
        }],
	    created: {
        	type: Date,
        	default: Date.now
        },
        appointments: [{
            patient : {
                type: Schema.Types.ObjectId,
                ref: "patients"
            },
            pName: {
                type: String
            },
            pPhone: {
                type: Number
            },
            day: {
                type: String
            }
        }],
        rating: {
            type: [{
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                },
                rating: {
                    type: Number,
                },
            }],
            default: [],
        },
        stars: {
            type: [String],
            default: ["0", "0", "0", "0", "0"]
        }
});

module.exports = Doctor = mongoose.model("Doctor", DoctorSchema);
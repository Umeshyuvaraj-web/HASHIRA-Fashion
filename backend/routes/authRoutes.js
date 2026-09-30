const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");

const router = express.Router();


// =====================================================
// CUSTOMER REGISTER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Name, email and password are required."

            });

        }


        const cleanName =
            name.trim();


        const cleanEmail =
            email
                .toLowerCase()
                .trim();


        if (
            cleanName.length < 2
        ) {

            return res.status(400).json({

                message:
                    "Please enter a valid name."

            });

        }


        if (
            password.length < 6
        ) {

            return res.status(400).json({

                message:
                    "Password must contain at least 6 characters."

            });

        }


        // ---------------------------------------------
        // CHECK IF CUSTOMER ALREADY EXISTS
        // ---------------------------------------------

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });


        if (existingUser) {

            return res.status(409).json({

                message:
                    "An account with this email already exists."

            });

        }


        // ---------------------------------------------
        // HASH PASSWORD
        // ---------------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ---------------------------------------------
        // CREATE USER
        // ---------------------------------------------

        const user =
            await User.create({

                name:
                    cleanName,

                email:
                    cleanEmail,

                password:
                    hashedPassword,

                role:
                    "user"

            });


        // ---------------------------------------------
        // CREATE JWT
        // ---------------------------------------------

        const token =
            jwt.sign(

                {
                    id:
                        user._id,

                    role:
                        user.role

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }

            );


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(201).json({

            message:
                "Account created successfully.",

            token:
                token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role

            }

        });

    }

    catch (error) {

        console.error(
            "Customer registration error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error during registration."

        });

    }

});


// =====================================================
// CUSTOMER LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Email and password are required."

            });

        }


        const cleanEmail =
            email
                .toLowerCase()
                .trim();


        // ---------------------------------------------
        // FIND USER
        // ---------------------------------------------

        const user =
            await User.findOne({
                email:
                    cleanEmail
            });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        // ---------------------------------------------
        // CHECK PASSWORD
        // ---------------------------------------------

        const passwordMatch =
            await bcrypt.compare(

                password,

                user.password

            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        // ---------------------------------------------
        // CREATE TOKEN
        // ---------------------------------------------

        const token =
            jwt.sign(

                {
                    id:
                        user._id,

                    role:
                        user.role

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }

            );


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(200).json({

            message:
                "Login successful.",

            token:
                token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role

            }

        });

    }

    catch (error) {

        console.error(
            "Customer login error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error during login."

        });

    }

});


// =====================================================
// ADMIN LOGIN
// POST /api/auth/admin-login
// =====================================================

router.post("/admin-login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        console.log(
            "Admin login request received"
        );


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Email and password are required."

            });

        }


        const cleanEmail =
            email
                .toLowerCase()
                .trim();


        // ---------------------------------------------
        // FIND ADMIN
        // ---------------------------------------------

        const admin =
            await Admin.findOne({

                email:
                    cleanEmail

            });


        if (!admin) {

            return res.status(401).json({

                message:
                    "Invalid admin credentials."

            });

        }


        // ---------------------------------------------
        // CHECK PASSWORD
        // ---------------------------------------------

        const passwordMatch =
            await bcrypt.compare(

                password,

                admin.password

            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid admin credentials."

            });

        }


        // ---------------------------------------------
        // CREATE ADMIN JWT
        // ---------------------------------------------

        const token =
            jwt.sign(

                {
                    id:
                        admin._id,

                    role:
                        admin.role

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }

            );


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(200).json({

            message:
                "Admin login successful.",

            token:
                token,

            admin: {

                id:
                    admin._id,

                name:
                    admin.name,

                email:
                    admin.email,

                role:
                    admin.role

            }

        });

    }

    catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error."

        });

    }

});


// =====================================================
// EXPORT
// =====================================================

module.exports =
    router;
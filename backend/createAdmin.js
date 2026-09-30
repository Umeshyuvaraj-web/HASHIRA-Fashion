require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");


async function createAdmin() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected");


        const existingAdmin =
            await Admin.findOne({
                email: "admin@hashira.com"
            });


        if (existingAdmin) {

            console.log(
                "Admin already exists."
            );

            process.exit(0);
        }


        const hashedPassword =
            await bcrypt.hash(
                "Hashira@123",
                12
            );


        const admin =
            new Admin({

                name: "HASHIRA Admin",

                email: "admin@hashira.com",

                password: hashedPassword,

                role: "admin"

            });


        await admin.save();


        console.log(
            "================================"
        );

        console.log(
            "HASHIRA ADMIN CREATED"
        );

        console.log(
            "Email: admin@hashira.com"
        );

        console.log(
            "Password: Hashira@123"
        );

        console.log(
            "================================"
        );


        process.exit(0);

    }

    catch (error) {

        console.error(
            "Error creating admin:",
            error
        );

        process.exit(1);

    }

}


createAdmin();
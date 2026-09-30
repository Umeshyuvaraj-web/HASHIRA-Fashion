/* =====================================================
   HASHIRA STORE BACKEND
===================================================== */

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


/* =====================================================
   ROUTES
===================================================== */

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");


/* =====================================================
   APP
===================================================== */

const app = express();


/* =====================================================
   CORS
===================================================== */

app.use(
    cors({
        origin: [
            "http://127.0.0.1:5500",
            "http://localhost:5500"
        ],

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


/* =====================================================
   BODY PARSER
===================================================== */

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
    "/",
    (req, res) => {

        res.status(200).json({
            message: "HASHIRA STORE BACKEND",
            status: "running"
        });

    }
);


app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({
            status: "OK",
            message: "HASHIRA backend is running"
        });

    }
);


/* =====================================================
   API ROUTES
===================================================== */


/* -----------------------------------------------------
   AUTHENTICATION
----------------------------------------------------- */

app.use(
    "/api/auth",
    authRoutes
);


/* -----------------------------------------------------
   PRODUCTS
----------------------------------------------------- */

app.use(
    "/api/products",
    productRoutes
);


/* -----------------------------------------------------
   ORDERS
----------------------------------------------------- */

app.use(
    "/api/orders",
    orderRoutes
);


/* =====================================================
   404 HANDLER
===================================================== */

app.use(
    (req, res) => {

        res.status(404).json({

            message: "API route not found",

            path: req.originalUrl

        });

    }
);


/* =====================================================
   ERROR HANDLER
===================================================== */

app.use(
    (error, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            error
        );

        res.status(
            error.status || 500
        ).json({

            message:
                error.message ||
                "Internal server error."

        });

    }
);


/* =====================================================
   MONGODB CONNECTION
===================================================== */

const PORT =
    process.env.PORT || 5000;


const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;


if (!MONGO_URI) {

    console.error(
        "ERROR: MONGO_URI is missing from .env"
    );

    process.exit(1);
}


/* =====================================================
   CONNECT TO MONGODB
===================================================== */

mongoose
    .connect(MONGO_URI)

    .then(() => {

        console.log(
            "========================================"
        );

        console.log(
            "      HASHIRA STORE BACKEND"
        );

        console.log(
            "========================================"
        );

        console.log(
            "MongoDB connected successfully."
        );


        app.listen(
            PORT,
            "0.0.0.0",

            () => {

                console.log(
                    "========================================"
                );

                console.log(
                    `HASHIRA server running on port ${PORT}`
                );

                console.log(
                    `http://localhost:${PORT}`
                );

                console.log(
                    `http://127.0.0.1:${PORT}`
                );

                console.log(
                    "========================================"
                );

            }
        );

    })

    .catch(error => {

        console.error(
            "MongoDB connection failed:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    });
const mongoose = require("mongoose");


/* =====================================================
   HASHIRA PRODUCT SCHEMA
===================================================== */

const productSchema = new mongoose.Schema(
    {

        /* =================================================
           PRODUCT NAME
        ================================================= */

        name: {

            type: String,

            required: [
                true,
                "Product name is required."
            ],

            trim: true,

            minlength: [
                2,
                "Product name must contain at least 2 characters."
            ]

        },


        /* =================================================
           CATEGORY
        ================================================= */

        category: {

            type: String,

            required: [
                true,
                "Product category is required."
            ],

            enum: {

                values: [
                    "men",
                    "women"
                ],

                message:
                    "Category must be men or women."

            },

            lowercase: true,

            trim: true

        },


        /* =================================================
           PRODUCT TYPE
        ================================================= */

        type: {

            type: String,

            default: "Clothing",

            trim: true

        },


        /* =================================================
           PRICE
        ================================================= */

        price: {

            type: Number,

            required: [
                true,
                "Product price is required."
            ],

            min: [
                0,
                "Price cannot be negative."
            ]

        },


        /* =================================================
           STOCK
        ================================================= */

        stock: {

            type: Number,

            default: 0,

            min: [
                0,
                "Stock cannot be negative."
            ]

        },


        /* =================================================
           SIZES
        ================================================= */

        sizes: {

            type: [
                String
            ],

            default: []

        },


        /* =================================================
           DESCRIPTION
        ================================================= */

        description: {

            type: String,

            default: "",

            trim: true

        },


        /* =================================================
           PRODUCT IMAGE
        ================================================= */

        image: {

            type: String,

            default: "",

            trim: true

        },


        /* =================================================
           NEW PRODUCT
        ================================================= */

        isNew: {

            type: Boolean,

            default: false

        },


        /* =================================================
           FEATURED PRODUCT
        ================================================= */

        featured: {

            type: Boolean,

            default: false

        },


        /* =================================================
           SALE PRODUCT
        ================================================= */

        sale: {

            type: Boolean,

            default: false

        }

    },


    /* =====================================================
       TIMESTAMPS
    ===================================================== */

    {

        timestamps: true

    }

);


/* =====================================================
   EXPORT MODEL
===================================================== */

module.exports =
    mongoose.model(
        "Product",
        productSchema
    );
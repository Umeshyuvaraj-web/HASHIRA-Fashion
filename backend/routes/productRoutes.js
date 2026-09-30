const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


/* =====================================================
   GET ALL PRODUCTS
   PUBLIC
   GET /api/products
===================================================== */

router.get("/", async (req, res) => {

    try {

        const products =
            await Product.find()
                .sort({
                    createdAt: -1
                });

        return res.status(200).json(
            products
        );

    }

    catch (error) {

        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to fetch products.",

            error:
                error.message

        });

    }

});


/* =====================================================
   GET SINGLE PRODUCT
   PUBLIC
   GET /api/products/:id
===================================================== */

router.get("/:id", async (req, res) => {

    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid product ID."

            });

        }


        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                message:
                    "Product not found."

            });

        }


        return res.status(200).json(
            product
        );

    }

    catch (error) {

        console.error(
            "GET SINGLE PRODUCT ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to fetch product.",

            error:
                error.message

        });

    }

});


/* =====================================================
   CREATE PRODUCT
   ADMIN ONLY
   POST /api/products
===================================================== */

router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            console.log(
                "\n=========================================="
            );

            console.log(
                "CREATE PRODUCT REQUEST"
            );

            console.log(
                "ADMIN:",
                req.user
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );

            console.log(
                "=========================================="
            );


            const {
                name,
                category,
                type,
                price,
                stock,
                sizes,
                description,
                image,
                isNew,
                featured,
                sale
            } = req.body;


            /* =========================================
               REQUIRED FIELDS
            ========================================= */

            if (!name) {

                return res.status(400).json({

                    message:
                        "Product name is required."

                });

            }


            if (!category) {

                return res.status(400).json({

                    message:
                        "Product category is required."

                });

            }


            if (
                price === undefined ||
                price === ""
            ) {

                return res.status(400).json({

                    message:
                        "Product price is required."

                });

            }


            /* =========================================
               CATEGORY
            ========================================= */

            const cleanCategory =
                String(category)
                    .trim()
                    .toLowerCase();


            if (
                cleanCategory !== "men" &&
                cleanCategory !== "women"
            ) {

                return res.status(400).json({

                    message:
                        "Category must be men or women.",

                    receivedCategory:
                        cleanCategory

                });

            }


            /* =========================================
               PRICE
            ========================================= */

            const cleanPrice =
                Number(price);


            if (
                Number.isNaN(
                    cleanPrice
                ) ||
                cleanPrice < 0
            ) {

                return res.status(400).json({

                    message:
                        "Please enter a valid price.",

                    receivedPrice:
                        price

                });

            }


            /* =========================================
               STOCK
            ========================================= */

            const cleanStock =
                stock === undefined ||
                stock === ""
                    ? 0
                    : Number(stock);


            if (
                Number.isNaN(
                    cleanStock
                ) ||
                cleanStock < 0
            ) {

                return res.status(400).json({

                    message:
                        "Please enter valid stock.",

                    receivedStock:
                        stock

                });

            }


            /* =========================================
               SIZES
            ========================================= */

            let cleanSizes = [];


            if (
                Array.isArray(sizes)
            ) {

                cleanSizes =
                    sizes
                        .map(
                            size =>
                                String(size)
                                    .trim()
                        )
                        .filter(
                            size =>
                                size.length > 0
                        );

            }


            /* =========================================
               TYPE
            ========================================= */

            const cleanType =
                type
                    ? String(type)
                        .trim()
                    : "Clothing";


            /* =========================================
               DESCRIPTION
            ========================================= */

            const cleanDescription =
                description
                    ? String(description)
                        .trim()
                    : "";


            /* =========================================
               IMAGE
            ========================================= */

            const cleanImage =
                image
                    ? String(image)
                        .trim()
                    : "";


            /* =========================================
               BOOLEAN VALUES
            ========================================= */

            const cleanIsNew =
                Boolean(isNew);


            const cleanFeatured =
                Boolean(featured);


            const cleanSale =
                Boolean(sale);


            /* =========================================
               PRODUCT DATA
            ========================================= */

            const productData = {

                name:
                    String(name)
                        .trim(),

                category:
                    cleanCategory,

                type:
                    cleanType,

                price:
                    cleanPrice,

                stock:
                    cleanStock,

                sizes:
                    cleanSizes,

                description:
                    cleanDescription,

                image:
                    cleanImage,

                isNew:
                    cleanIsNew,

                featured:
                    cleanFeatured,

                sale:
                    cleanSale

            };


            console.log(
                "PRODUCT DATA:",
                productData
            );


            /* =========================================
               CREATE PRODUCT
            ========================================= */

            const product =
                await Product.create(
                    productData
                );


            console.log(
                "=========================================="
            );

            console.log(
                "PRODUCT CREATED SUCCESSFULLY"
            );

            console.log(
                "PRODUCT ID:",
                product._id
            );

            console.log(
                "PRODUCT NAME:",
                product.name
            );

            console.log(
                "==========================================\n"
            );


            return res.status(201).json({

                success:
                    true,

                message:
                    "Product created successfully.",

                product:
                    product

            });

        }

        catch (error) {

            console.error(
                "\n=========================================="
            );

            console.error(
                "CREATE PRODUCT ERROR"
            );

            console.error(
                "ERROR NAME:",
                error.name
            );

            console.error(
                "ERROR MESSAGE:",
                error.message
            );

            console.error(
                "FULL ERROR:",
                error
            );


            if (
                error.errors
            ) {

                console.error(
                    "VALIDATION ERRORS:"
                );


                Object.keys(
                    error.errors
                ).forEach(
                    field => {

                        console.error(
                            field,
                            "=>",
                            error.errors[field].message
                        );

                    }
                );

            }


            console.error(
                "==========================================\n"
            );


            return res.status(500).json({

                success:
                    false,

                message:
                    error.message ||
                    "Failed to create product.",

                error:
                    error.name ||
                    "UnknownError",

                details:
                    error.errors
                        ? Object.keys(
                            error.errors
                        ).map(
                            field => ({

                                field:
                                    field,

                                message:
                                    error.errors[field]
                                        .message

                            })
                        )
                        : null

            });

        }

    }
);


/* =====================================================
   UPDATE PRODUCT
   ADMIN ONLY
   PUT /api/products/:id
===================================================== */

router.put(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid product ID."

                });

            }


            const existingProduct =
                await Product.findById(
                    req.params.id
                );


            if (!existingProduct) {

                return res.status(404).json({

                    message:
                        "Product not found."

                });

            }


            const updateData = {};


            /* NAME */

            if (
                req.body.name !== undefined
            ) {

                updateData.name =
                    String(
                        req.body.name
                    ).trim();

            }


            /* CATEGORY */

            if (
                req.body.category !== undefined
            ) {

                const category =
                    String(
                        req.body.category
                    )
                        .trim()
                        .toLowerCase();


                if (
                    category !== "men" &&
                    category !== "women"
                ) {

                    return res.status(400).json({

                        message:
                            "Category must be men or women."

                    });

                }


                updateData.category =
                    category;

            }


            /* TYPE */

            if (
                req.body.type !== undefined
            ) {

                updateData.type =
                    String(
                        req.body.type
                    ).trim();

            }


            /* PRICE */

            if (
                req.body.price !== undefined
            ) {

                const price =
                    Number(
                        req.body.price
                    );


                if (
                    Number.isNaN(price) ||
                    price < 0
                ) {

                    return res.status(400).json({

                        message:
                            "Please enter a valid price."

                    });

                }


                updateData.price =
                    price;

            }


            /* STOCK */

            if (
                req.body.stock !== undefined
            ) {

                const stock =
                    Number(
                        req.body.stock
                    );


                if (
                    Number.isNaN(stock) ||
                    stock < 0
                ) {

                    return res.status(400).json({

                        message:
                            "Please enter valid stock."

                    });

                }


                updateData.stock =
                    stock;

            }


            /* SIZES */

            if (
                req.body.sizes !== undefined
            ) {

                if (
                    !Array.isArray(
                        req.body.sizes
                    )
                ) {

                    return res.status(400).json({

                        message:
                            "Sizes must be an array."

                    });

                }


                updateData.sizes =
                    req.body.sizes
                        .map(
                            size =>
                                String(size)
                                    .trim()
                        )
                        .filter(
                            size =>
                                size.length > 0
                        );

            }


            /* DESCRIPTION */

            if (
                req.body.description !== undefined
            ) {

                updateData.description =
                    String(
                        req.body.description
                    ).trim();

            }


            /* IMAGE */

            if (
                req.body.image !== undefined
            ) {

                updateData.image =
                    String(
                        req.body.image
                    ).trim();

            }


            /* IS NEW */

            if (
                req.body.isNew !== undefined
            ) {

                updateData.isNew =
                    Boolean(
                        req.body.isNew
                    );

            }


            /* FEATURED */

            if (
                req.body.featured !== undefined
            ) {

                updateData.featured =
                    Boolean(
                        req.body.featured
                    );

            }


            /* SALE */

            if (
                req.body.sale !== undefined
            ) {

                updateData.sale =
                    Boolean(
                        req.body.sale
                    );

            }


            /* UPDATE */

            const product =
                await Product.findByIdAndUpdate(
                    req.params.id,
                    updateData,
                    {
                        new: true,
                        runValidators: true
                    }
                );


            if (!product) {

                return res.status(404).json({

                    message:
                        "Product not found."

                });

            }


            console.log(
                "PRODUCT UPDATED:",
                product.name
            );


            return res.status(200).json({

                success:
                    true,

                message:
                    "Product updated successfully.",

                product:
                    product

            });

        }

        catch (error) {

            console.error(
                "UPDATE PRODUCT ERROR:",
                error
            );


            return res.status(500).json({

                success:
                    false,

                message:
                    error.message ||
                    "Failed to update product.",

                error:
                    error.name ||
                    "UnknownError"

            });

        }

    }
);


/* =====================================================
   DELETE PRODUCT
   ADMIN ONLY
   DELETE /api/products/:id
===================================================== */

router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid product ID."

                });

            }


            const product =
                await Product.findById(
                    req.params.id
                );


            if (!product) {

                return res.status(404).json({

                    message:
                        "Product not found."

                });

            }


            await Product.findByIdAndDelete(
                req.params.id
            );


            console.log(
                "PRODUCT DELETED:",
                product.name
            );


            return res.status(200).json({

                success:
                    true,

                message:
                    "Product deleted successfully."

            });

        }

        catch (error) {

            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );


            return res.status(500).json({

                success:
                    false,

                message:
                    error.message ||
                    "Failed to delete product."

            });

        }

    }
);


/* =====================================================
   EXPORT
===================================================== */

module.exports =
    router;
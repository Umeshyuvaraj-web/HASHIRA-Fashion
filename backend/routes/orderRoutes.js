const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const router = express.Router();


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error("AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });

    }
}


// =====================================================
// GET ALL ORDERS
// =====================================================

router.get("/", authenticate, async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user.id || req.user._id || req.user.userId
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("GET ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders."
        });

    }

});


// =====================================================
// CREATE ORDER
// =====================================================

router.post("/", authenticate, async (req, res) => {

    try {

        console.log("========================================");
        console.log("CREATE ORDER REQUEST");
        console.log("BODY:", JSON.stringify(req.body, null, 2));
        console.log("========================================");


        const {
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shipping,
            total
        } = req.body;


        // =================================================
        // USER ID
        // =================================================

        const userId =
            req.user.id ||
            req.user._id ||
            req.user.userId;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "User authentication information is missing."
            });

        }


        // =================================================
        // ITEMS VALIDATION
        // =================================================

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Your cart is empty."
            });

        }


        // =================================================
        // SHIPPING ADDRESS VALIDATION
        // =================================================

        if (!shippingAddress) {

            return res.status(400).json({
                success: false,
                message: "Shipping address is required."
            });

        }


        const requiredAddressFields = [
            "name",
            "email",
            "address",
            "city",
            "state",
            "pincode",
            "phone"
        ];


        for (const field of requiredAddressFields) {

            if (
                !shippingAddress[field] ||
                String(shippingAddress[field]).trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: `${field} is required.`
                });

            }

        }


        // =================================================
        // PAYMENT METHOD
        // =================================================

        let finalPaymentMethod = "COD";


        /*
         Your checkout page uses:

         cod
         upi
         card

         Backend Order schema uses:

         COD
         ONLINE
        */

        const selectedPaymentMethod =
            String(paymentMethod || "cod")
                .trim()
                .toLowerCase();


        if (selectedPaymentMethod === "cod") {

            finalPaymentMethod = "COD";

        } else if (
            selectedPaymentMethod === "upi" ||
            selectedPaymentMethod === "card"
        ) {

            // Demo UPI/Card payment
            finalPaymentMethod = "ONLINE";

        } else {

            return res.status(400).json({
                success: false,
                message: "Invalid payment method."
            });

        }


        // =================================================
        // CHECK USER
        // =================================================

        const user = await User.findById(userId);


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User account not found."
            });

        }


        // =================================================
        // PREPARE ORDER ITEMS
        // =================================================

        const orderItems = [];


        for (const item of items) {

            /*
             The frontend may send either:

             item.id

             OR

             item.product

             OR

             item.productId
            */

            const productId =
                item.product ||
                item.productId ||
                item.id;


            // ---------------------------------------------
            // CHECK PRODUCT ID
            // ---------------------------------------------

            if (
                !productId ||
                !mongoose.Types.ObjectId.isValid(productId)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Invalid product ID for "${item.name || "product"}".`
                });

            }


            // ---------------------------------------------
            // FIND PRODUCT
            // ---------------------------------------------

            const product =
                await Product.findById(productId);


            if (!product) {

                return res.status(404).json({
                    success: false,
                    message:
                        `Product "${item.name || ""}" was not found.`
                });

            }


            // ---------------------------------------------
            // QUANTITY
            // ---------------------------------------------

            const quantity =
                Number(item.quantity) || 1;


            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Invalid quantity for "${product.name}".`
                });

            }


            // ---------------------------------------------
            // STOCK CHECK
            // ---------------------------------------------

            if (
                typeof product.stock === "number" &&
                product.stock < quantity
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Only ${product.stock} item(s) of "${product.name}" are available.`
                });

            }


            // ---------------------------------------------
            // SIZE
            // ---------------------------------------------

            const selectedSize =
                item.size ||
                "";


            // ---------------------------------------------
            // CREATE ORDER ITEM
            // ---------------------------------------------

            orderItems.push({

                product: product._id,

                name:
                    item.name ||
                    product.name,

                image:
                    item.image ||
                    product.image ||
                    "",

                price:
                    Number(item.price) ||
                    Number(product.price) ||
                    0,

                quantity,

                size:
                    String(selectedSize)

            });

        }


        // =================================================
        // CALCULATE TOTALS
        // =================================================

        const calculatedSubtotal =
            orderItems.reduce(
                (sum, item) =>
                    sum +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    ),
                0
            );


        /*
         We use the frontend shipping amount when supplied,
         otherwise calculate it here.

         Free shipping over ₹1,999.
        */

        const calculatedShipping =
            Number.isFinite(Number(shipping))
                ? Number(shipping)
                : (
                    calculatedSubtotal >= 1999
                        ? 0
                        : 99
                );


        const calculatedTotal =
            calculatedSubtotal +
            calculatedShipping;


        // =================================================
        // ORDER NUMBER
        // =================================================

        const orderNumber =
            "HASHIRA-" +
            Date.now().toString().slice(-8) +
            "-" +
            Math.floor(
                1000 + Math.random() * 9000
            );


        // =================================================
        // PAYMENT STATUS
        // =================================================

        /*
         COD:
         payment is pending.

         UPI/Card:
         This is a DEMO payment, so we mark it as PAID
         after successful demo checkout.
        */

        const paymentStatus =
            finalPaymentMethod === "ONLINE"
                ? "PAID"
                : "PENDING";


        // =================================================
        // CREATE ORDER
        // =================================================

        const order =
            await Order.create({

                orderNumber,

                user: user._id,

                items: orderItems,

                shippingAddress: {

                    name:
                        String(
                            shippingAddress.name
                        ).trim(),

                    email:
                        String(
                            shippingAddress.email
                        ).trim()
                        .toLowerCase(),

                    address:
                        String(
                            shippingAddress.address
                        ).trim(),

                    city:
                        String(
                            shippingAddress.city
                        ).trim(),

                    state:
                        String(
                            shippingAddress.state
                        ).trim(),

                    pincode:
                        String(
                            shippingAddress.pincode
                        ).trim(),

                    phone:
                        String(
                            shippingAddress.phone
                        ).trim()

                },

                paymentMethod:
                    finalPaymentMethod,

                paymentStatus,

                subtotal:
                    calculatedSubtotal,

                shipping:
                    calculatedShipping,

                total:
                    calculatedTotal,

                status:
                    "PLACED"

            });


        // =================================================
        // UPDATE PRODUCT STOCK
        // =================================================

        for (const item of orderItems) {

            const product =
                await Product.findById(
                    item.product
                );


            if (
                product &&
                typeof product.stock === "number"
            ) {

                product.stock =
                    Math.max(
                        0,
                        product.stock -
                        item.quantity
                    );

                await product.save();

            }

        }


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        console.log(
            "ORDER CREATED:",
            order.orderNumber
        );


        return res.status(201).json({

            success: true,

            message:
                "Order placed successfully.",

            order: {

                _id:
                    order._id,

                orderNumber:
                    order.orderNumber,

                paymentMethod:
                    order.paymentMethod,

                paymentStatus:
                    order.paymentStatus,

                subtotal:
                    order.subtotal,

                shipping:
                    order.shipping,

                total:
                    order.total,

                status:
                    order.status,

                items:
                    order.items,

                shippingAddress:
                    order.shippingAddress,

                createdAt:
                    order.createdAt

            }

        });


    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "CREATE ORDER ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "========================================"
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Something went wrong while placing your order."

        });

    }

});


// =====================================================
// GET SINGLE ORDER
// =====================================================

router.get("/:id", authenticate, async (req, res) => {

    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID."
            });

        }


        const userId =
            req.user.id ||
            req.user._id ||
            req.user.userId;


        const order =
            await Order.findOne({
                _id: req.params.id,
                user: userId
            })
            .populate("items.product");


        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found."
            });

        }


        return res.status(200).json({
            success: true,
            order
        });


    } catch (error) {

        console.error(
            "GET SINGLE ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch order."
        });

    }

});


// =====================================================
// CANCEL ORDER
// =====================================================

router.put("/:id/cancel", authenticate, async (req, res) => {

    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID."
            });

        }


        const userId =
            req.user.id ||
            req.user._id ||
            req.user.userId;


        const order =
            await Order.findOne({
                _id: req.params.id,
                user: userId
            });


        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found."
            });

        }


        if (
            [
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ].includes(order.status)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Order cannot be cancelled because it is ${order.status}.`
            });

        }


        order.status = "CANCELLED";


        await order.save();


        return res.status(200).json({

            success: true,

            message:
                "Order cancelled successfully.",

            order

        });


    } catch (error) {

        console.error(
            "CANCEL ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to cancel order."
        });

    }

});


// =====================================================
// EXPORT
// =====================================================

module.exports = router;
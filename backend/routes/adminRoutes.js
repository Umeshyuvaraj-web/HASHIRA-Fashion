/* =====================================================
   HASHIRA STORE
   ADMIN ROUTES
===================================================== */

const express = require("express");

const bcrypt =
    require("bcryptjs");

const mongoose =
    require("mongoose");

const Admin =
    require("../models/Admin");

const User =
    require("../models/User");

const Product =
    require("../models/Product");

const Order =
    require("../models/Order");

const {
    protect,
    adminOnly
} =
    require("../middleware/authMiddleware");


const router =
    express.Router();


// =====================================================
// ADMIN PROFILE
// GET /api/admin/profile
// =====================================================

router.get(
    "/profile",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const admin =
                await Admin.findById(
                    req.user.id
                )
                .select("-password");


            if (!admin) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Admin account not found."

                });

            }


            res.status(200).json({

                success: true,

                admin: {

                    id:
                        admin._id,

                    name:
                        admin.name,

                    email:
                        admin.email,

                    role:
                        admin.role,

                    createdAt:
                        admin.createdAt

                }

            });

        }

        catch (error) {

            console.error(
                "Admin profile error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to load admin profile."

            });

        }

    }
);


// =====================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =====================================================

router.get(
    "/dashboard",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const [

                totalProducts,

                totalUsers,

                totalOrders,

                orders

            ] =
                await Promise.all([

                    Product.countDocuments(),

                    User.countDocuments({
                        role:
                            "user"
                    }),

                    Order.countDocuments(),

                    Order.find()
                        .select(
                            "status total"
                        )

                ]);


            let totalRevenue =
                0;


            orders.forEach(
                order => {

                    const status =
                        String(
                            order.status ||
                            ""
                        ).toUpperCase();


                    if (
                        status !==
                        "CANCELLED"
                    ) {

                        totalRevenue +=
                            Number(
                                order.total ||
                                0
                            );

                    }

                }
            );


            const orderStatus = {

                placed:
                    0,

                processing:
                    0,

                shipped:
                    0,

                delivered:
                    0,

                cancelled:
                    0

            };


            orders.forEach(
                order => {

                    const status =
                        String(
                            order.status ||
                            "PLACED"
                        ).toLowerCase();


                    if (
                        Object.prototype
                            .hasOwnProperty
                            .call(
                                orderStatus,
                                status
                            )
                    ) {

                        orderStatus[
                            status
                        ]++;

                    }

                }
            );


            res.status(200).json({

                success: true,

                statistics: {

                    totalProducts:
                        totalProducts,

                    totalUsers:
                        totalUsers,

                    totalOrders:
                        totalOrders,

                    totalRevenue:
                        totalRevenue,

                    orderStatus:
                        orderStatus

                }

            });

        }

        catch (error) {

            console.error(
                "Dashboard error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to load dashboard."

            });

        }

    }
);


// =====================================================
// GET ALL CUSTOMERS
// GET /api/admin/customers
// =====================================================

router.get(
    "/customers",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const users =
                await User.find({

                    role:
                        "user"

                })
                .select("-password")
                .sort({

                    createdAt:
                        -1

                });


            const customers =
                await Promise.all(

                    users.map(
                        async user => {

                            const orders =
                                await Order.find({

                                    user:
                                        user._id

                                });


                            const totalSpent =
                                orders.reduce(

                                    (
                                        total,
                                        order
                                    ) => {

                                        const status =
                                            String(
                                                order.status ||
                                                ""
                                            ).toUpperCase();


                                        if (
                                            status ===
                                            "CANCELLED"
                                        ) {

                                            return total;

                                        }


                                        return (

                                            total +
                                            Number(
                                                order.total ||
                                                0
                                            )

                                        );

                                    },

                                    0

                                );


                            return {

                                id:
                                    user._id,

                                name:
                                    user.name,

                                email:
                                    user.email,

                                role:
                                    user.role,

                                createdAt:
                                    user.createdAt,

                                orderCount:
                                    orders.length,

                                totalSpent:
                                    totalSpent

                            };

                        }

                    )

                );


            res.status(200).json({

                success: true,

                count:
                    customers.length,

                customers:
                    customers

            });

        }

        catch (error) {

            console.error(
                "Customers error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch customers."

            });

        }

    }
);


// =====================================================
// GET SINGLE CUSTOMER
// GET /api/admin/customers/:id
// =====================================================

router.get(
    "/customers/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                id
            } =
                req.params;


            if (
                !mongoose.Types.ObjectId.isValid(
                    id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid customer ID."

                });

            }


            const user =
                await User.findById(
                    id
                )
                .select("-password");


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Customer not found."

                });

            }


            const orders =
                await Order.find({

                    user:
                        user._id

                })
                .sort({

                    createdAt:
                        -1

                });


            const totalSpent =
                orders.reduce(

                    (
                        total,
                        order
                    ) => {

                        const status =
                            String(
                                order.status ||
                                ""
                            ).toUpperCase();


                        if (
                            status ===
                            "CANCELLED"
                        ) {

                            return total;

                        }


                        return (

                            total +
                            Number(
                                order.total ||
                                0
                            )

                        );

                    },

                    0

                );


            res.status(200).json({

                success: true,

                customer: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role,

                    createdAt:
                        user.createdAt

                },

                statistics: {

                    totalOrders:
                        orders.length,

                    totalSpent:
                        totalSpent

                },

                orders:
                    orders

            });

        }

        catch (error) {

            console.error(
                "Customer details error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch customer."

            });

        }

    }
);


// =====================================================
// CUSTOMER COUNT
// GET /api/admin/customers/count
// =====================================================

router.get(
    "/customers/count",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const count =
                await User.countDocuments({

                    role:
                        "user"

                });


            res.status(200).json({

                success: true,

                count:
                    count

            });

        }

        catch (error) {

            console.error(
                "Customer count error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to get customer count."

            });

        }

    }
);


// =====================================================
// GET ADMIN PRODUCTS
// GET /api/admin/products
// =====================================================

router.get(
    "/products",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const products =
                await Product.find()
                    .sort({

                        createdAt:
                            -1

                    });


            res.status(200).json({

                success: true,

                count:
                    products.length,

                products:
                    products

            });

        }

        catch (error) {

            console.error(
                "Admin products error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch products."

            });

        }

    }
);


// =====================================================
// LOW STOCK PRODUCTS
// GET /api/admin/products/low-stock
// =====================================================

router.get(
    "/products/low-stock",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const limit =
                Number(
                    req.query.limit
                ) || 5;


            const products =
                await Product.find({

                    stock: {
                        $lte:
                            limit
                    }

                })
                .sort({

                    stock:
                        1

                });


            res.status(200).json({

                success: true,

                count:
                    products.length,

                products:
                    products

            });

        }

        catch (error) {

            console.error(
                "Low stock error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch low-stock products."

            });

        }

    }
);


// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

router.get(
    "/orders",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const orders =
                await Order.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .sort({

                        createdAt:
                            -1

                    });


            res.status(200).json({

                success: true,

                count:
                    orders.length,

                orders:
                    orders

            });

        }

        catch (error) {

            console.error(
                "Admin orders error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch orders."

            });

        }

    }
);


// =====================================================
// GET SINGLE ORDER
// GET /api/admin/orders/:id
// =====================================================

router.get(
    "/orders/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                id
            } =
                req.params;


            if (
                !mongoose.Types.ObjectId.isValid(
                    id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID."

                });

            }


            const order =
                await Order.findById(
                    id
                )
                .populate(
                    "user",
                    "name email"
                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            res.status(200).json({

                success: true,

                order:
                    order

            });

        }

        catch (error) {

            console.error(
                "Order details error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch order."

            });

        }

    }
);


// =====================================================
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id/status
// =====================================================

router.put(
    "/orders/:id/status",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                id
            } =
                req.params;


            const {
                status
            } =
                req.body;


            if (
                !mongoose.Types.ObjectId.isValid(
                    id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID."

                });

            }


            const allowedStatuses = [

                "PLACED",

                "PROCESSING",

                "SHIPPED",

                "DELIVERED",

                "CANCELLED"

            ];


            const normalizedStatus =
                String(
                    status ||
                    ""
                ).toUpperCase();


            if (
                !allowedStatuses.includes(
                    normalizedStatus
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order status.",

                    allowedStatuses:
                        allowedStatuses

                });

            }


            const order =
                await Order.findByIdAndUpdate(

                    id,

                    {

                        status:
                            normalizedStatus

                    },

                    {

                        new:
                            true,

                        runValidators:
                            true

                    }

                )
                .populate(
                    "user",
                    "name email"
                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Order status updated successfully.",

                order:
                    order

            });

        }

        catch (error) {

            console.error(
                "Update order status error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to update order status."

            });

        }

    }
);


// =====================================================
// CHANGE ADMIN PASSWORD
// PUT /api/admin/change-password
// =====================================================

router.put(
    "/change-password",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                currentPassword,
                newPassword
            } =
                req.body;


            if (
                !currentPassword ||
                !newPassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Current and new passwords are required."

                });

            }


            if (
                newPassword.length <
                6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New password must contain at least 6 characters."

                });

            }


            const admin =
                await Admin.findById(
                    req.user.id
                );


            if (!admin) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Admin account not found."

                });

            }


            const passwordMatch =
                await bcrypt.compare(

                    currentPassword,

                    admin.password

                );


            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Current password is incorrect."

                });

            }


            admin.password =
                await bcrypt.hash(
                    newPassword,
                    12
                );


            await admin.save();


            res.status(200).json({

                success: true,

                message:
                    "Admin password changed successfully."

            });

        }

        catch (error) {

            console.error(
                "Change password error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to change admin password."

            });

        }

    }
);


// =====================================================
// ADMIN SUMMARY
// GET /api/admin/summary
// =====================================================

router.get(
    "/summary",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const [

                productCount,

                userCount,

                orders

            ] =
                await Promise.all([

                    Product.countDocuments(),

                    User.countDocuments({
                        role:
                            "user"
                    }),

                    Order.find()
                        .select(
                            "status total"
                        )

                ]);


            let revenue =
                0;


            const statuses = {

                placed:
                    0,

                processing:
                    0,

                shipped:
                    0,

                delivered:
                    0,

                cancelled:
                    0

            };


            orders.forEach(
                order => {

                    const status =
                        String(
                            order.status ||
                            "PLACED"
                        ).toLowerCase();


                    if (
                        status !==
                        "cancelled"
                    ) {

                        revenue +=
                            Number(
                                order.total ||
                                0
                            );

                    }


                    if (
                        Object.prototype
                            .hasOwnProperty
                            .call(
                                statuses,
                                status
                            )
                    ) {

                        statuses[
                            status
                        ]++;

                    }

                }
            );


            res.status(200).json({

                success: true,

                data: {

                    products:
                        productCount,

                    customers:
                        userCount,

                    orders:
                        orders.length,

                    revenue:
                        revenue,

                    statuses:
                        statuses

                }

            });

        }

        catch (error) {

            console.error(
                "Admin summary error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to generate admin summary."

            });

        }

    }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports =
    router;
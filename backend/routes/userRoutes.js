const express = require("express");

const mongoose =
    require("mongoose");

const User =
    require("../models/User");

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
// ADMIN — GET ALL USERS
// GET /api/users/admin/all
// =====================================================

router.get(
    "/admin/all",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const users =
                await User.find()
                    .select(
                        "-password"
                    )
                    .sort({
                        createdAt: -1
                    });


            /*
             * Add order statistics
             * for every customer.
             */

            const usersWithStats =
                await Promise.all(

                    users.map(
                        async user => {

                            const orders =
                                await Order.find({

                                    user:
                                        user._id

                                });


                            const validOrders =
                                orders.filter(
                                    order =>
                                        order.status !==
                                        "CANCELLED"
                                );


                            const totalSpent =
                                validOrders.reduce(

                                    (
                                        total,
                                        order
                                    ) => {

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


            return res.status(200).json({

                users:
                    usersWithStats,

                count:
                    usersWithStats.length

            });

        }

        catch (error) {

            console.error(
                "Get users error:",
                error
            );


            return res.status(500).json({

                message:
                    "Failed to fetch customers."

            });

        }

    }
);


// =====================================================
// ADMIN — GET SINGLE USER
// GET /api/users/admin/:id
// =====================================================

router.get(
    "/admin/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            if (
                !mongoose.Types.ObjectId.isValid(
                    id
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid customer ID."

                });

            }


            const user =
                await User.findById(
                    id
                )
                .select(
                    "-password"
                );


            if (!user) {

                return res.status(404).json({

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
                    createdAt: -1
                });


            const activeOrders =
                orders.filter(
                    order =>
                        order.status !==
                        "CANCELLED"
                );


            const totalSpent =
                activeOrders.reduce(

                    (
                        total,
                        order
                    ) => {

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


            return res.status(200).json({

                user: {

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

                    orderCount:
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
                "Get customer error:",
                error
            );


            return res.status(500).json({

                message:
                    "Failed to fetch customer."

            });

        }

    }
);


// =====================================================
// ADMIN — CUSTOMER COUNT
// GET /api/users/admin/count
// =====================================================

router.get(
    "/admin/count",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const count =
                await User.countDocuments({

                    role:
                        "user"

                });


            return res.status(200).json({

                count:
                    count

            });

        }

        catch (error) {

            console.error(
                "Customer count error:",
                error
            );


            return res.status(500).json({

                message:
                    "Failed to count customers."

            });

        }

    }
);


module.exports =
    router;
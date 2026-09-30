const mongoose = require("mongoose");


// =====================================================
// ORDER ITEM SCHEMA
// =====================================================

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        size: {
            type: String,
            default: "",
            trim: true
        }
    }
);


// =====================================================
// SHIPPING ADDRESS
// =====================================================

const shippingAddressSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        pincode: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        _id: false
    }
);


// =====================================================
// ORDER SCHEMA
// =====================================================

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true,

            validate: {
                validator: function (items) {
                    return Array.isArray(items) && items.length > 0;
                },

                message: "Order must contain at least one item."
            }
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true
        },

        paymentMethod: {
            type: String,

            enum: [
                "COD",
                "ONLINE"
            ],

            default: "COD"
        },

        paymentStatus: {
            type: String,

            enum: [
                "PENDING",
                "PAID",
                "FAILED"
            ],

            default: "PENDING"
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        shipping: {
            type: Number,
            required: true,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,

            enum: [
                "PLACED",
                "CONFIRMED",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ],

            default: "PLACED"
        }
    },

    {
        timestamps: true
    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
    "Order",
    orderSchema
);
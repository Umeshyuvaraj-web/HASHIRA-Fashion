const nodemailer = require("nodemailer");


// =====================================================
// HASHIRA EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


// =====================================================
// SEND ORDER CONFIRMATION EMAIL
// =====================================================

async function sendOrderConfirmationEmail(order) {

    const customerEmail =
        order.shippingAddress.email;

    const customerName =
        order.shippingAddress.name;

    const orderNumber =
        order.orderNumber;


    // -------------------------------------------------
    // CREATE ITEMS HTML
    // -------------------------------------------------

    const itemsHTML =
        order.items
            .map(item => {

                const itemTotal =
                    item.price * item.quantity;

                return `
                    <tr>

                        <td
                            style="
                                padding: 12px;
                                border-bottom: 1px solid #eeeeee;
                            "
                        >
                            ${item.name}
                        </td>

                        <td
                            style="
                                padding: 12px;
                                border-bottom: 1px solid #eeeeee;
                            "
                        >
                            ${item.size || "-"}
                        </td>

                        <td
                            style="
                                padding: 12px;
                                border-bottom: 1px solid #eeeeee;
                            "
                        >
                            ${item.quantity}
                        </td>

                        <td
                            style="
                                padding: 12px;
                                border-bottom: 1px solid #eeeeee;
                            "
                        >
                            ₹${itemTotal}
                        </td>

                    </tr>
                `;

            })
            .join("");


    // -------------------------------------------------
    // PAYMENT DISPLAY
    // -------------------------------------------------

    const paymentMethod =
        order.paymentMethod === "COD"
            ? "Cash on Delivery"
            : "Online Payment";


    // -------------------------------------------------
    // EMAIL
    // -------------------------------------------------

    const mailOptions = {

        from: `"HASHIRA" <${process.env.EMAIL_USER}>`,

        to: customerEmail,

        subject:
            `HASHIRA Order Confirmed — ${orderNumber}`,

        html: `

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">

                <title>HASHIRA Order Confirmation</title>

            </head>


            <body
                style="
                    margin: 0;
                    padding: 0;
                    background: #f7f7f5;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #111111;
                "
            >

                <div
                    style="
                        max-width: 680px;
                        margin: 40px auto;
                        background: #ffffff;
                        padding: 40px;
                    "
                >

                    <!-- LOGO -->

                    <div
                        style="
                            text-align: center;
                            padding-bottom: 30px;
                            border-bottom: 1px solid #dddddd;
                        "
                    >

                        <h1
                            style="
                                margin: 0;
                                font-family: Georgia, serif;
                                font-size: 32px;
                                letter-spacing: 6px;
                                font-weight: normal;
                            "
                        >
                            HASHIRA
                        </h1>

                    </div>


                    <!-- GREETING -->

                    <div
                        style="
                            padding: 35px 0;
                        "
                    >

                        <p
                            style="
                                margin: 0 0 10px;
                                font-size: 12px;
                                letter-spacing: 3px;
                                color: #777777;
                            "
                        >
                            ORDER CONFIRMATION
                        </p>


                        <h2
                            style="
                                margin: 0 0 18px;
                                font-family: Georgia, serif;
                                font-size: 30px;
                                font-weight: normal;
                            "
                        >
                            Thank you, ${customerName}.
                        </h2>


                        <p
                            style="
                                font-size: 15px;
                                line-height: 1.7;
                                color: #555555;
                            "
                        >
                            Your HASHIRA order has been successfully
                            placed. We are preparing your order with care.
                        </p>

                    </div>


                    <!-- ORDER NUMBER -->

                    <div
                        style="
                            background: #f7f7f5;
                            padding: 20px;
                            margin-bottom: 30px;
                        "
                    >

                        <p
                            style="
                                margin: 0 0 6px;
                                font-size: 11px;
                                letter-spacing: 2px;
                                color: #777777;
                            "
                        >
                            ORDER NUMBER
                        </p>


                        <strong
                            style="
                                font-size: 18px;
                                letter-spacing: 1px;
                            "
                        >
                            ${orderNumber}
                        </strong>

                    </div>


                    <!-- ITEMS -->

                    <h3
                        style="
                            font-family: Georgia, serif;
                            font-size: 22px;
                            font-weight: normal;
                            margin-bottom: 15px;
                        "
                    >
                        Your order
                    </h3>


                    <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        style="
                            border-collapse: collapse;
                            font-size: 14px;
                        "
                    >

                        <thead>

                            <tr
                                style="
                                    background: #f7f7f5;
                                "
                            >

                                <th
                                    align="left"
                                    style="
                                        padding: 12px;
                                    "
                                >
                                    Product
                                </th>

                                <th
                                    align="left"
                                    style="
                                        padding: 12px;
                                    "
                                >
                                    Size
                                </th>

                                <th
                                    align="left"
                                    style="
                                        padding: 12px;
                                    "
                                >
                                    Qty
                                </th>

                                <th
                                    align="left"
                                    style="
                                        padding: 12px;
                                    "
                                >
                                    Price
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${itemsHTML}

                        </tbody>

                    </table>


                    <!-- SUMMARY -->

                    <div
                        style="
                            margin-top: 30px;
                            border-top: 1px solid #dddddd;
                        "
                    >

                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                padding: 14px 0;
                                border-bottom: 1px solid #eeeeee;
                            "
                        >

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹${order.subtotal}
                            </strong>

                        </div>


                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                padding: 14px 0;
                                border-bottom: 1px solid #eeeeee;
                            "
                        >

                            <span>
                                Shipping
                            </span>

                            <strong>
                                ₹${order.shipping}
                            </strong>

                        </div>


                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                padding: 20px 0;
                            "
                        >

                            <strong>
                                TOTAL
                            </strong>

                            <strong
                                style="
                                    font-size: 20px;
                                "
                            >
                                ₹${order.total}
                            </strong>

                        </div>

                    </div>


                    <!-- PAYMENT -->

                    <div
                        style="
                            margin-top: 20px;
                            padding: 20px;
                            background: #f7f7f5;
                        "
                    >

                        <p
                            style="
                                margin: 0 0 8px;
                                font-size: 11px;
                                letter-spacing: 2px;
                                color: #777777;
                            "
                        >
                            PAYMENT METHOD
                        </p>

                        <strong>
                            ${paymentMethod}
                        </strong>

                    </div>


                    <!-- SHIPPING ADDRESS -->

                    <div
                        style="
                            margin-top: 30px;
                        "
                    >

                        <h3
                            style="
                                font-family: Georgia, serif;
                                font-size: 22px;
                                font-weight: normal;
                            "
                        >
                            Delivery address
                        </h3>


                        <p
                            style="
                                font-size: 14px;
                                line-height: 1.7;
                                color: #555555;
                            "
                        >

                            ${order.shippingAddress.name}<br>

                            ${order.shippingAddress.address}<br>

                            ${order.shippingAddress.city},
                            ${order.shippingAddress.state}
                            - ${order.shippingAddress.pincode}<br>

                            Phone:
                            ${order.shippingAddress.phone}

                        </p>

                    </div>


                    <!-- FOOTER -->

                    <div
                        style="
                            margin-top: 40px;
                            padding-top: 25px;
                            border-top: 1px solid #dddddd;
                            text-align: center;
                        "
                    >

                        <p
                            style="
                                margin: 0;
                                font-size: 12px;
                                color: #777777;
                                line-height: 1.6;
                            "
                        >
                            Thank you for choosing HASHIRA.
                            <br>
                            We hope you love your order.
                        </p>


                        <p
                            style="
                                margin-top: 20px;
                                font-size: 11px;
                                color: #aaaaaa;
                            "
                        >
                            This is an automated email from HASHIRA.
                            Please do not reply directly to this email.
                        </p>

                    </div>

                </div>

            </body>

            </html>

        `
    };


    // -------------------------------------------------
    // SEND
    // -------------------------------------------------

    return await transporter.sendMail(
        mailOptions
    );
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    sendOrderConfirmationEmail
};
/* =========================================================
   HASHIRA - CHECKOUT.JS
   Works with the checkout.html you provided
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("HASHIRA checkout.js loaded");


    /* =====================================================
       1. HELPER FUNCTIONS
       ===================================================== */

    function getElement(...selectors) {
        for (const selector of selectors) {
            const element = document.querySelector(selector);

            if (element) {
                return element;
            }
        }

        return null;
    }


    function getValue(...selectors) {
        const element = getElement(...selectors);

        if (!element) {
            return "";
        }

        return element.value.trim();
    }


    function setText(...args) {
        const value = args.pop();
        const selectors = args;

        const element = getElement(...selectors);

        if (element) {
            element.textContent = value;
        }
    }


    function formatPrice(amount) {
        return "₹" + Number(amount || 0).toLocaleString("en-IN");
    }


    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       2. CART STORAGE KEYS
       ===================================================== */

    const possibleCartKeys = [
        "cart",
        "cartItems",
        "hashiraCart",
        "HASHIRA_cart",
        "shoppingCart",
        "bag"
    ];


    /* =====================================================
       3. GET CART
       ===================================================== */

    function getCart() {

        for (const key of possibleCartKeys) {

            try {

                const savedCart = localStorage.getItem(key);

                if (!savedCart) {
                    continue;
                }

                const parsedCart = JSON.parse(savedCart);

                if (
                    Array.isArray(parsedCart) &&
                    parsedCart.length > 0
                ) {

                    console.log(
                        "Cart found using localStorage key:",
                        key
                    );

                    return parsedCart;
                }

            } catch (error) {

                console.warn(
                    "Could not read cart:",
                    key,
                    error
                );

            }
        }

        return [];
    }


    let cart = getCart();


    /* =====================================================
       4. NORMALIZE CART ITEMS
       Supports different product object structures.
       ===================================================== */

    function normalizeItem(item) {

        item = item || {};

        const name =
            item.name ||
            item.title ||
            item.productName ||
            item.product_name ||
            "HASHIRA Product";


        const price = Number(
            item.price ??
            item.salePrice ??
            item.productPrice ??
            item.amount ??
            0
        );


        const quantity = Number(
            item.quantity ??
            item.qty ??
            item.count ??
            1
        );


        const image =
            item.image ||
            item.imageUrl ||
            item.img ||
            item.photo ||
            item.productImage ||
            item.imageURL ||
            "";


        return {
            id:
                item.id ||
                item.productId ||
                item.productID ||
                Date.now(),

            name: name,

            price: price,

            quantity:
                quantity > 0
                    ? quantity
                    : 1,

            image: image
        };
    }


    cart = cart.map(normalizeItem);


    console.log("HASHIRA cart:", cart);


    /* =====================================================
       5. CALCULATE TOTALS
       Free shipping above ₹1,999
       Otherwise ₹99
       ===================================================== */

    function calculateTotals() {

        let subtotal = 0;
        let items = 0;


        cart.forEach(function (item) {

            subtotal +=
                Number(item.price || 0) *
                Number(item.quantity || 1);

            items += Number(
                item.quantity || 1
            );

        });


        let shipping = 0;


        if (subtotal === 0) {

            shipping = 0;

        } else if (subtotal >= 1999) {

            shipping = 0;

        } else {

            shipping = 99;

        }


        const total =
            subtotal + shipping;


        return {
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            items: items
        };
    }


    let totals = calculateTotals();


    /* =====================================================
       6. RENDER ORDER SUMMARY
       ===================================================== */

    function renderOrderSummary() {

        totals = calculateTotals();


        /* ---------------------------------------------
           Item count
           --------------------------------------------- */

        setText(
            "#checkoutItemCount",
            "#itemCount",
            "#summaryItemCount",
            ".checkout-item-count",
            totals.items
        );


        /* ---------------------------------------------
           Subtotal
           --------------------------------------------- */

        setText(
            "#checkoutSubtotal",
            "#subtotal",
            "#summarySubtotal",
            ".checkout-subtotal",
            formatPrice(totals.subtotal)
        );


        /* ---------------------------------------------
           Shipping
           --------------------------------------------- */

        setText(
            "#checkoutShipping",
            "#shipping",
            "#summaryShipping",
            ".checkout-shipping",
            formatPrice(totals.shipping)
        );


        /* ---------------------------------------------
           Total
           --------------------------------------------- */

        setText(
            "#checkoutTotal",
            "#total",
            "#summaryTotal",
            ".checkout-total",
            formatPrice(totals.total)
        );


        /* ---------------------------------------------
           Product items
           --------------------------------------------- */

        const container = getElement(
            "#checkoutItems",
            "#orderItems",
            "#cartItems",
            ".checkout-items",
            ".order-items"
        );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (cart.length === 0) {

            container.innerHTML = `
                <div class="empty-checkout">
                    Your bag is empty.
                </div>
            `;

            return;
        }


        cart.forEach(function (item) {

            const row =
                document.createElement("div");


            /*
             * Keep compatibility with your existing CSS.
             */

            row.className =
                "checkout-item";


            row.innerHTML = `

                <img
                    class="checkout-item-image"
                    src="${escapeHtml(item.image)}"
                    alt="${escapeHtml(item.name)}"
                    onerror="this.style.display='none';"
                >

                <div class="checkout-item-info">

                    <h3>
                        ${escapeHtml(item.name)}
                    </h3>

                    <p>
                        Size:
                        ${escapeHtml(
                            item.size ||
                            item.selectedSize ||
                            item.variant ||
                            "M"
                        )}
                    </p>

                    <p>
                        Qty:
                        ${Number(item.quantity || 1)}
                    </p>

                    <p>
                        ${formatPrice(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                        )}
                    </p>

                </div>
            `;


            container.appendChild(row);

        });

    }


    renderOrderSummary();


    /* =====================================================
       7. FORM ELEMENTS
       ===================================================== */

    const checkoutForm =
        getElement(
            "#checkoutForm",
            "form"
        );


    const placeOrderButton =
        getElement(
            "#placeOrderButton",
            "#placeOrder",
            "#checkoutPlaceOrder",
            ".place-order-button",
            "button[type='submit']",
            "button"
        );


    /* =====================================================
       8. PAYMENT METHOD
       ===================================================== */

    function getPaymentMethod() {

        const checked =
            document.querySelector(
                "input[name='paymentMethod']:checked"
            );


        if (checked) {

            return String(
                checked.value || ""
            ).toLowerCase();

        }


        const payment =
            document.querySelector(
                "input[name='payment']:checked"
            );


        if (payment) {

            return String(
                payment.value || ""
            ).toLowerCase();

        }


        return "";
    }


    function getPaymentName(method) {

        method =
            String(method || "")
                .toLowerCase();


        if (
            method.includes("upi") ||
            method.includes("online")
        ) {

            return "UPI";
        }


        if (
            method.includes("card") ||
            method.includes("credit") ||
            method.includes("debit")
        ) {

            return "Credit / Debit Card";
        }


        return "Cash on Delivery";
    }


    /* =====================================================
       9. PAYMENT METHOD UI
       ===================================================== */

    function updatePaymentUI() {

        const method =
            getPaymentMethod();


        const upiBox =
            getElement(
                "#upiPaymentBox",
                ".upi-payment-box"
            );


        const cardBox =
            getElement(
                "#cardPaymentBox",
                ".card-payment-box"
            );


        if (upiBox) {

            upiBox.style.display =
                method.includes("upi")
                    ? "block"
                    : "none";

        }


        if (cardBox) {

            cardBox.style.display =
                (
                    method.includes("card") ||
                    method.includes("credit") ||
                    method.includes("debit")
                )
                    ? "block"
                    : "none";

        }

    }


    function setupPaymentMethods() {

        const radios =
            document.querySelectorAll(
                "input[name='paymentMethod'], input[name='payment']"
            );


        radios.forEach(function (radio) {

            radio.addEventListener(
                "change",
                function () {

                    console.log(
                        "Payment selected:",
                        getPaymentMethod()
                    );

                    updatePaymentUI();

                }
            );

        });

    }


    setupPaymentMethods();
    updatePaymentUI();


    /* =====================================================
       10. CHECKOUT MESSAGE
       ===================================================== */

    function showMessage(
        message,
        type
    ) {

        const messageBox =
            getElement(
                "#checkoutMessage",
                "#checkoutError",
                "#paymentError",
                ".checkout-message",
                ".checkout-error"
            );


        if (!messageBox) {

            console.warn(message);

            return;

        }


        messageBox.textContent =
            message;


        messageBox.className =
            "checkout-message " +
            (type || "error");


        messageBox.style.display =
            "block";


        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    function showError(message) {
        showMessage(message, "error");
    }


    function showSuccess(message) {
        showMessage(message, "success");
    }


    function clearMessage() {

        const messageBox =
            getElement(
                "#checkoutMessage",
                "#checkoutError",
                "#paymentError",
                ".checkout-message",
                ".checkout-error"
            );


        if (messageBox) {

            messageBox.textContent = "";

            messageBox.style.display =
                "none";

            messageBox.className =
                "checkout-message";

        }

    }


    /* =====================================================
       11. GET CUSTOMER DETAILS
       ===================================================== */

    function getCustomerDetails() {

        return {

            fullName:
                getValue(
                    "#fullName",
                    "#checkoutFullName",
                    "#customerName",
                    "input[name='fullName']",
                    "input[name='name']"
                ),


            email:
                getValue(
                    "#email",
                    "#checkoutEmail",
                    "#customerEmail",
                    "input[name='email']"
                ),


            phone:
                getValue(
                    "#phone",
                    "#checkoutPhone",
                    "#customerPhone",
                    "input[name='phone']",
                    "input[name='mobile']"
                ),


            address:
                getValue(
                    "#address",
                    "#checkoutAddress",
                    "#shippingAddress",
                    "textarea[name='address']",
                    "textarea[name='shippingAddress']"
                ),


            city:
                getValue(
                    "#city",
                    "#checkoutCity",
                    "input[name='city']"
                ),


            state:
                getValue(
                    "#state",
                    "#checkoutState",
                    "input[name='state']"
                ),


            pincode:
                getValue(
                    "#pincode",
                    "#pinCode",
                    "#checkoutPincode",
                    "input[name='pincode']",
                    "input[name='pinCode']"
                )

        };
    }


    /* =====================================================
       12. CUSTOMER VALIDATION
       ===================================================== */

    function validateCustomer(customer) {

        if (!customer.fullName) {

            showError(
                "Please enter your full name."
            );

            return false;
        }


        if (!customer.email) {

            showError(
                "Please enter your email address."
            );

            return false;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                customer.email
            )
        ) {

            showError(
                "Please enter a valid email address."
            );

            return false;
        }


        if (!customer.phone) {

            showError(
                "Please enter your phone number."
            );

            return false;
        }


        const phone =
            customer.phone.replace(
                /\D/g,
                ""
            );


        if (phone.length !== 10) {

            showError(
                "Please enter a valid 10 digit mobile number."
            );

            return false;
        }


        if (!customer.address) {

            showError(
                "Please enter your shipping address."
            );

            return false;
        }


        if (!customer.city) {

            showError(
                "Please enter your city."
            );

            return false;
        }


        if (!customer.state) {

            showError(
                "Please enter your state."
            );

            return false;
        }


        if (!customer.pincode) {

            showError(
                "Please enter your pincode."
            );

            return false;
        }


        if (
            !/^\d{6}$/.test(
                customer.pincode
            )
        ) {

            showError(
                "Please enter a valid 6 digit pincode."
            );

            return false;
        }


        return true;
    }


    /* =====================================================
       13. PAYMENT VALIDATION
       ===================================================== */

    function validatePayment() {

        const method =
            getPaymentMethod();


        if (!method) {

            showError(
                "Please select a payment method."
            );

            return false;
        }


        /*
         * COD
         */

        if (
            method === "cod" ||
            method.includes("cash") ||
            method.includes("delivery")
        ) {

            return true;
        }


        /*
         * UPI
         */

        if (
            method === "upi" ||
            method.includes("upi")
        ) {

            return true;
        }


        /*
         * CARD
         */

        if (
            method === "card" ||
            method.includes("card") ||
            method.includes("credit") ||
            method.includes("debit")
        ) {

            return true;
        }


        /*
         * Demo payment:
         * accept selected method.
         */

        return true;
    }


    /* =====================================================
       14. CREATE ORDER ID
       ===================================================== */

    function createOrderId() {

        const now =
            new Date();


        const date =
            now.getFullYear() +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            String(
                now.getDate()
            ).padStart(2, "0");


        const random =
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        return (
            "HASHIRA-" +
            date +
            "-" +
            random
        );
    }


    /* =====================================================
       15. SAVE ORDER
       ===================================================== */

    function saveOrder(
        customer,
        paymentMethod
    ) {

        const method =
            String(
                paymentMethod || "cod"
            ).toLowerCase();


        const order = {

            orderId:
                createOrderId(),


            customer: {

                fullName:
                    customer.fullName,

                email:
                    customer.email,

                phone:
                    customer.phone,

                address:
                    customer.address,

                city:
                    customer.city,

                state:
                    customer.state,

                pincode:
                    customer.pincode

            },


            items:
                cart.map(function (item) {

                    return {

                        id:
                            item.id,

                        name:
                            item.name,

                        price:
                            Number(
                                item.price || 0
                            ),

                        quantity:
                            Number(
                                item.quantity || 1
                            ),

                        image:
                            item.image || "",

                        size:
                            item.size ||
                            item.selectedSize ||
                            item.variant ||
                            "M"

                    };

                }),


            subtotal:
                Number(
                    totals.subtotal || 0
                ),


            shipping:
                Number(
                    totals.shipping || 0
                ),


            total:
                Number(
                    totals.total || 0
                ),


            paymentMethod:
                getPaymentName(method),


            paymentStatus:
                (
                    method === "cod" ||
                    method.includes("cash") ||
                    method.includes("delivery")
                )
                    ? "Pending - Cash on Delivery"
                    : "Demo Payment Successful",


            orderStatus:
                "Order Placed",


            createdAt:
                new Date().toISOString()

        };


        /*
         * Save latest order.
         */

        try {

            localStorage.setItem(
                "hashiraLastOrder",
                JSON.stringify(order)
            );

        } catch (error) {

            console.error(
                "Could not save latest order:",
                error
            );

            throw error;

        }


        /*
         * Get previous orders.
         */

        let orders = [];


        try {

            const oldOrders =
                localStorage.getItem(
                    "hashiraOrders"
                );


            if (oldOrders) {

                const parsed =
                    JSON.parse(oldOrders);


                if (
                    Array.isArray(parsed)
                ) {

                    orders = parsed;

                }

            }

        } catch (error) {

            console.warn(
                "Could not read previous orders. Starting new order list."
            );

            orders = [];

        }


        /*
         * Add current order.
         */

        orders.push(order);


        /*
         * Save order list.
         */

        try {

            localStorage.setItem(
                "hashiraOrders",
                JSON.stringify(orders)
            );

        } catch (error) {

            console.error(
                "Could not save order list:",
                error
            );

            /*
             * Do NOT stop the checkout if
             * hashiraLastOrder was already saved.
             */

        }


        /*
         * Separate order ID for success page.
         */

        try {

            localStorage.setItem(
                "hashiraOrderId",
                order.orderId
            );

        } catch (error) {

            console.warn(
                "Could not save order ID:",
                error
            );

        }


        console.log(
            "HASHIRA order saved:",
            order
        );


        return order;
    }


    /* =====================================================
       16. CLEAR CART
       ===================================================== */

    function clearCart() {

        possibleCartKeys.forEach(
            function (key) {

                try {

                    localStorage.removeItem(
                        key
                    );

                } catch (error) {

                    console.warn(
                        "Could not remove:",
                        key
                    );

                }

            }
        );


        possibleCartKeys.forEach(
            function (key) {

                try {

                    sessionStorage.removeItem(
                        key
                    );

                } catch (error) {

                    console.warn(
                        "Could not remove session cart:",
                        key
                    );

                }

            }
        );


        console.log(
            "HASHIRA cart cleared."
        );
    }


    /* =====================================================
       17. REDIRECT TO SUCCESS PAGE
       ===================================================== */

    function redirectToSuccess(order) {

        /*
         * Save order ID again before redirect.
         */

        try {

            localStorage.setItem(
                "hashiraOrderId",
                order.orderId
            );

        } catch (error) {

            console.warn(
                "Could not save order ID:",
                error
            );

        }


        /*
         * Your success page.
         */

        window.location.href =
            "order-success.html";
    }


    /* =====================================================
       18. PLACE ORDER
       ===================================================== */

    async function placeOrder() {

        clearMessage();


        console.log(
            "HASHIRA PLACE ORDER clicked"
        );


        /*
         * Reload cart from localStorage.
         */

        cart =
            getCart()
                .map(normalizeItem);


        totals =
            calculateTotals();


        /*
         * Check cart.
         */

        if (cart.length === 0) {

            showError(
                "Your bag is empty. Please add a product before placing an order."
            );

            return;
        }


        /*
         * Refresh summary.
         */

        renderOrderSummary();


        /*
         * Customer information.
         */

        const customer =
            getCustomerDetails();


        /*
         * Validate customer.
         */

        if (
            !validateCustomer(
                customer
            )
        ) {

            return;
        }


        /*
         * Payment method.
         */

        const paymentMethod =
            getPaymentMethod();


        /*
         * Validate payment.
         */

        if (
            !validatePayment()
        ) {

            return;
        }


        /*
         * Disable button.
         */

        if (placeOrderButton) {

            placeOrderButton.disabled =
                true;


            placeOrderButton.dataset.originalText =
                placeOrderButton.textContent;


            placeOrderButton.textContent =
                "PLACING ORDER...";

        }


        try {

            /*
             * Demo payment delay.
             * No real payment is taken.
             */

            await new Promise(
                function (resolve) {

                    setTimeout(
                        resolve,
                        400
                    );

                }
            );


            /*
             * Save order.
             */

            const order =
                saveOrder(
                    customer,
                    paymentMethod
                );


            /*
             * Clear cart.
             */

            clearCart();


            /*
             * Redirect.
             */

            redirectToSuccess(
                order
            );

        } catch (error) {

            console.error(
                "HASHIRA ORDER ERROR:",
                error
            );


            /*
             * IMPORTANT:
             * Show the actual error in console,
             * but keep your clean checkout message.
             */

            showError(
                "Something went wrong while placing your order. Please try again."
            );


            if (placeOrderButton) {

                placeOrderButton.disabled =
                    false;


                placeOrderButton.textContent =
                    placeOrderButton.dataset.originalText ||
                    "PLACE ORDER →";

            }

        }

    }


    /* =====================================================
       19. FORM SUBMIT
       ===================================================== */

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                placeOrder();

            }
        );

    }


    /* =====================================================
       20. PLACE ORDER BUTTON
       ===================================================== */

    if (placeOrderButton) {

        placeOrderButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                placeOrder();

            }
        );

    } else {

        console.error(
            "HASHIRA: Place Order button was not found."
        );

    }


    /* =====================================================
       21. PHONE INPUT
       ===================================================== */

    const phoneInput =
        getElement(
            "#phone",
            "#checkoutPhone",
            "#customerPhone",
            "input[name='phone']",
            "input[name='mobile']"
        );


    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
                            0,
                            10
                        );

            }
        );

    }


    /* =====================================================
       22. PINCODE INPUT
       ===================================================== */

    const pincodeInput =
        getElement(
            "#pincode",
            "#pinCode",
            "#checkoutPincode",
            "input[name='pincode']",
            "input[name='pinCode']"
        );


    if (pincodeInput) {

        pincodeInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
                            0,
                            6
                        );

            }
        );

    }


    /* =====================================================
       23. INITIAL DISPLAY
       ===================================================== */

    renderOrderSummary();

    updatePaymentUI();


    /* =====================================================
       24. DEBUG
       ===================================================== */

    console.log(
        "--------------------------------"
    );

    console.log(
        "HASHIRA CHECKOUT READY"
    );

    console.log(
        "Cart items:",
        cart.length
    );

    console.log(
        "Subtotal:",
        totals.subtotal
    );

    console.log(
        "Shipping:",
        totals.shipping
    );

    console.log(
        "Total:",
        totals.total
    );

    console.log(
        "Payment:",
        getPaymentMethod()
    );

    console.log(
        "Place order button:",
        placeOrderButton
    );

    console.log(
        "--------------------------------"
    );

});
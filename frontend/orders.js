/* =====================================================
   HASHIRA MY ORDERS
   PHASE 24
===================================================== */


const API_URL =
    "http://localhost:5000/api";


let orders = [];


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeOrders();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

function initializeOrders() {

    const token =
        getUserToken();


    if (!token) {

        window.location.href =
            "login.html?redirect=orders.html";

        return;

    }


    loadOrders();

}


/* =====================================================
   TOKEN
===================================================== */

function getUserToken() {

    return (

        localStorage.getItem(
            "hashiraUserToken"
        )

        ||

        sessionStorage.getItem(
            "hashiraUserToken"
        )

    );

}


/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (container) {

        container.innerHTML = `

            <div class="orders-loading">

                LOADING ORDERS...

            </div>

        `;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/orders/my-orders`,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${getUserToken()}`

                    }

                }
            );


        if (
            response.status ===
            401
        ) {

            clearUserSession();

            window.location.href =
                "login.html?redirect=orders.html";

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            throw new Error(

                data.message
                    ||
                "Failed to load orders."

            );

        }


        /*
         * Support either:
         *
         * [...]
         *
         * or
         *
         * { orders: [...] }
         */

        orders =
            Array.isArray(
                data
            )
                ? data
                : (
                    Array.isArray(
                        data.orders
                    )
                        ? data.orders
                        : []
                );


        renderOrders();


        checkOrderSuccess();

    }

    catch (error) {

        console.error(
            "Load orders error:",
            error
        );


        if (container) {

            container.innerHTML = `

                <div class="empty-orders">

                    <h2>
                        UNABLE TO LOAD ORDERS
                    </h2>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>

            `;

        }

    }

}


/* =====================================================
   RENDER ORDERS
===================================================== */

function renderOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (!container) {

        return;

    }


    if (
        orders.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-orders">

                <h2>
                    NO ORDERS YET
                </h2>

                <p>
                    Your HASHIRA orders will appear here.
                </p>

                <a
                    href="index.html"
                    class="shop-button"
                >
                    START SHOPPING
                </a>

            </div>

        `;

        return;

    }


    container.innerHTML =
        orders
            .map(
                order =>
                    createOrderCard(
                        order
                    )
            )
            .join("");


    setupOrderActions();

}


/* =====================================================
   CREATE ORDER CARD
===================================================== */

function createOrderCard(
    order
) {

    const orderId =
        order._id
            ||
        order.id
            ||
        "";


    const orderNumber =
        order.orderNumber
            ||
        `#${String(
            orderId
        ).slice(-8).toUpperCase()}`;


    const status =
        order.status
            ||
        "PLACED";


    const date =
        formatDate(
            order.createdAt
                ||
            order.date
        );


    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    const total =
        Number(
            order.total
                ??
            calculateOrderTotal(
                items
            )
        );


    const shippingAddress =
        order.shippingAddress
            ||
        {};


    const canCancel =
        isOrderCancellable(
            status
        );


    return `

        <article
            class="order-card"
            data-order-id="${escapeHTML(
                orderId
            )}"
        >


            <!-- HEADER -->

            <header
                class="order-card-header"
            >

                <div>

                    <div
                        class="order-number"
                    >
                        ${escapeHTML(
                            orderNumber
                        )}
                    </div>

                    <div
                        class="order-date"
                    >
                        ${escapeHTML(
                            date
                        )}
                    </div>

                </div>


                <span
                    class="order-status"
                >
                    ${escapeHTML(
                        formatStatus(
                            status
                        )
                    )}
                </span>

            </header>



            <!-- BODY -->

            <div
                class="order-body"
            >

                <div
                    class="order-products"
                >

                    ${
                        items.length > 0

                            ? items
                                .map(
                                    item =>
                                        createOrderItem(
                                            item
                                        )
                                )
                                .join("")

                            : `

                                <p
                                    style="
                                        color:#888;
                                        font-size:11px;
                                    "
                                >
                                    Order item information unavailable.
                                </p>

                            `
                    }

                </div>



                <!-- ADDRESS -->

                ${
                    shippingAddress &&
                    (
                        shippingAddress.address
                        ||
                        shippingAddress.city
                        ||
                        shippingAddress.state
                    )

                        ? `

                            <div
                                class="order-address"
                            >

                                <h3>
                                    SHIPPING ADDRESS
                                </h3>


                                <p>

                                    ${escapeHTML(
                                        shippingAddress.name
                                            ||
                                        ""
                                    )}

                                    <br>

                                    ${escapeHTML(
                                        shippingAddress.address
                                            ||
                                        ""
                                    )}

                                    <br>

                                    ${escapeHTML(
                                        shippingAddress.city
                                            ||
                                        ""
                                    )}

                                    ${
                                        shippingAddress.state
                                            ? `,
                                                ${escapeHTML(
                                                    shippingAddress.state
                                                )}`
                                            : ""
                                    }

                                    ${
                                        shippingAddress.pincode
                                            ? `
                                                -
                                                ${escapeHTML(
                                                    shippingAddress.pincode
                                                )}
                                            `
                                            : ""
                                    }

                                </p>

                            </div>

                        `

                        : ""

                }

            </div>



            <!-- FOOTER -->

            <footer
                class="order-footer"
            >

                <div>

                    <div
                        class="order-total-label"
                    >
                        ORDER TOTAL
                    </div>

                    <div
                        class="order-total"
                    >
                        ${formatPrice(
                            total
                        )}
                    </div>

                </div>


                <div
                    class="order-actions"
                >

                    ${
                        canCancel

                            ? `

                                <button
                                    type="button"
                                    class="
                                        order-button
                                        cancel
                                    "
                                    data-action="cancel"
                                    data-id="${escapeHTML(
                                        orderId
                                    )}"
                                >
                                    CANCEL ORDER
                                </button>

                            `

                            : ""

                    }

                </div>

            </footer>

        </article>

    `;

}


/* =====================================================
   ORDER ITEM
===================================================== */

function createOrderItem(
    item
) {

    const product =
        item.product
            &&
        typeof item.product ===
            "object"

            ? item.product
            : null;


    const name =
        product?.name
            ||
        item.name
            ||
        "Product";


    const image =
        product?.image
            ||
        item.image
            ||
        "https://via.placeholder.com/100x120?text=HASHIRA";


    const quantity =
        Number(
            item.quantity
                ||
            1
        );


    const price =
        Number(
            item.price
                ??
            product?.price
                ??
            0
        );


    const size =
        item.size
            ||
        "";


    return `

        <div
            class="order-product"
        >

            <img
                src="${escapeHTML(
                    image
                )}"
                alt="${escapeHTML(
                    name
                )}"
                class="order-product-image"
                onerror="
                    this.src='https://via.placeholder.com/100x120?text=HASHIRA'
                "
            >


            <div
                class="order-product-info"
            >

                <strong>
                    ${escapeHTML(
                        name
                    )}
                </strong>


                ${
                    size
                        ? `

                            <span>
                                SIZE:
                                ${escapeHTML(
                                    size
                                )}
                            </span>

                        `
                        : ""
                }


                <span>
                    QUANTITY:
                    ${quantity}
                </span>


                <span
                    class="order-product-price"
                >
                    ${formatPrice(
                        price *
                        quantity
                    )}
                </span>

            </div>

        </div>

    `;

}


/* =====================================================
   ORDER ACTIONS
===================================================== */

function setupOrderActions() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (!container) {

        return;

    }


    container.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {

                return;

            }


            const action =
                button.dataset.action;


            const id =
                button.dataset.id;


            if (
                action ===
                "cancel"
            ) {

                cancelOrder(
                    id
                );

            }

        }
    );

}


/* =====================================================
   CANCEL ORDER
===================================================== */

async function cancelOrder(
    orderId
) {

    if (!orderId) {

        return;

    }


    const confirmed =
        window.confirm(

            "Are you sure you want to cancel this order?"

        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(

                `${API_URL}/orders/${encodeURIComponent(
                    orderId
                )}/cancel`,

                {

                    method:
                        "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${getUserToken()}`

                    }

                }

            );


        if (
            response.status ===
            401
        ) {

            clearUserSession();

            window.location.href =
                "login.html?redirect=orders.html";

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            throw new Error(

                data.message
                    ||
                "Unable to cancel order."

            );

        }


        showNotification(
            "Order cancelled successfully."
        );


        await loadOrders();

    }

    catch (error) {

        console.error(
            "Cancel order error:",
            error
        );


        showNotification(
            error.message
        );

    }

}


/* =====================================================
   ORDER STATUS
===================================================== */

function isOrderCancellable(
    status
) {

    const normalized =
        String(
            status ||
            ""
        )
            .toLowerCase();


    return ![
        "cancelled",
        "canceled",
        "shipped",
        "delivered",
        "completed"
    ].includes(
        normalized
    );

}


/* =====================================================
   FORMAT STATUS
===================================================== */

function formatStatus(
    status
) {

    return String(
        status ||
        "PLACED"
    )
        .replace(
            /[_-]/g,
            " "
        )
        .toUpperCase();

}


/* =====================================================
   CALCULATE TOTAL
===================================================== */

function calculateOrderTotal(
    items
) {

    return items.reduce(

        (
            total,
            item
        ) => {

            const price =
                Number(
                    item.price
                        ??
                    item.product?.price
                        ??
                    0
                );


            const quantity =
                Number(
                    item.quantity
                        ||
                    1
                );


            return total +
                (
                    price *
                    quantity
                );

        },

        0

    );

}


/* =====================================================
   DATE
===================================================== */

function formatDate(
    value
) {

    if (!value) {

        return "Order date unavailable";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Order date unavailable";

    }


    return date.toLocaleDateString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );

}


/* =====================================================
   PRICE
===================================================== */

function formatPrice(
    value
) {

    return new Intl.NumberFormat(
        "en-IN",
        {

            style:
                "currency",

            currency:
                "INR",

            maximumFractionDigits:
                0

        }
    ).format(
        Number(
            value ||
            0
        )
    );

}


/* =====================================================
   SUCCESS MESSAGE
===================================================== */

function checkOrderSuccess() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    if (
        params.get(
            "success"
        ) ===
        "true"
    ) {

        const message =
            document.getElementById(
                "orderMessage"
            );


        if (message) {

            message.textContent =
                "Your order has been placed successfully.";

            message.classList.add(
                "show"
            );

        }

    }

}


/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification(
    message
) {

    const element =
        document.getElementById(
            "orderNotification"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    setTimeout(
        () => {

            element.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =====================================================
   CLEAR SESSION
===================================================== */

function clearUserSession() {

    localStorage.removeItem(
        "hashiraUserToken"
    );

    localStorage.removeItem(
        "hashiraUser"
    );

    sessionStorage.removeItem(
        "hashiraUserToken"
    );

    sessionStorage.removeItem(
        "hashiraUser"
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   GLOBAL
===================================================== */

window.loadOrders =
    loadOrders;

window.cancelOrder =
    cancelOrder;
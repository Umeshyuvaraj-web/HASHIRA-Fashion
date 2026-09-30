/* =====================================================
   HASHIRA ADMIN ORDER MANAGEMENT
   PHASE 26
===================================================== */


const API_URL =
    "http://localhost:5000/api";


let allOrders = [];

let currentFilter = "ALL";


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAdminOrders();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

function initializeAdminOrders() {

    const token =
        getAdminToken();


    if (!token) {

        window.location.href =
            "admin-login.html";

        return;

    }


    loadAdminInformation();

    setupEvents();

    loadOrders();

}


/* =====================================================
   ADMIN TOKEN
===================================================== */

function getAdminToken() {

    return (

        localStorage.getItem(
            "hashiraAdminToken"
        )

        ||

        sessionStorage.getItem(
            "hashiraAdminToken"
        )

        ||

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
   ADMIN DATA
===================================================== */

function loadAdminInformation() {

    const data =

        localStorage.getItem(
            "hashiraAdmin"
        )

        ||

        sessionStorage.getItem(
            "hashiraAdmin"
        );


    if (!data) {

        return;

    }


    try {

        const admin =
            JSON.parse(
                data
            );


        const element =
            document.getElementById(
                "adminName"
            );


        if (element) {

            element.textContent =
                admin.name ||
                "ADMIN";

        }

    }

    catch {

        console.log(
            "Unable to load admin information."
        );

    }

}


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {

    const filter =
        document.getElementById(
            "statusFilter"
        );


    const refresh =
        document.getElementById(
            "refreshOrders"
        );


    const logout =
        document.getElementById(
            "logoutButton"
        );


    if (filter) {

        filter.addEventListener(
            "change",
            () => {

                currentFilter =
                    filter.value;

                renderOrders();

            }
        );

    }


    if (refresh) {

        refresh.addEventListener(
            "click",
            loadOrders
        );

    }


    if (logout) {

        logout.addEventListener(
            "click",
            logoutAdmin
        );

    }


    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (container) {

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


                if (
                    button.dataset.action ===
                    "update-status"
                ) {

                    const orderId =
                        button.dataset.id;


                    updateOrderStatus(
                        orderId
                    );

                }

            }
        );

    }

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

            <div class="loading">

                LOADING ORDERS...

            </div>

        `;

    }


    try {

        const response =
            await fetch(

                `${API_URL}/orders/admin/all`,

                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${getAdminToken()}`

                    }

                }

            );


        if (
            response.status ===
            401
        ) {

            logoutAdmin();

            return;

        }


        if (
            response.status ===
            403
        ) {

            showNotification(
                "Admin access required."
            );

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


        allOrders =
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


        updateStatistics();

        renderOrders();

    }

    catch (error) {

        console.error(
            "Admin orders error:",
            error
        );


        if (container) {

            container.innerHTML = `

                <div class="empty-orders">

                    UNABLE TO LOAD ORDERS

                    <br><br>

                    ${escapeHTML(
                        error.message
                    )}

                </div>

            `;

        }

    }

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    setText(
        "totalOrders",
        allOrders.length
    );


    setText(
        "placedOrders",
        countStatus(
            "PLACED"
        )
    );


    setText(
        "processingOrders",
        countStatus(
            "PROCESSING"
        )
    );


    setText(
        "shippedOrders",
        countStatus(
            "SHIPPED"
        )
    );


    setText(
        "deliveredOrders",
        countStatus(
            "DELIVERED"
        )
    );

}


/* =====================================================
   COUNT STATUS
===================================================== */

function countStatus(
    status
) {

    return allOrders.filter(
        order =>
            String(
                order.status ||
                ""
            ).toUpperCase() ===
            status
    ).length;

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


    const filteredOrders =

        currentFilter ===
        "ALL"

            ? allOrders

            : allOrders.filter(
                order =>
                    String(
                        order.status ||
                        ""
                    ).toUpperCase() ===
                    currentFilter
            );


    if (
        filteredOrders.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty-orders">

                NO ORDERS FOUND

            </div>

        `;

        return;

    }


    container.innerHTML =
        filteredOrders
            .map(
                createOrderCard
            )
            .join("");

}


/* =====================================================
   CREATE ORDER CARD
===================================================== */

function createOrderCard(
    order
) {

    const orderId =
        order._id ||
        order.id ||
        "";


    const orderNumber =
        order.orderNumber ||
        `HS-${String(
            orderId
        ).slice(-8).toUpperCase()}`;


    const status =
        String(
            order.status ||
            "PLACED"
        ).toUpperCase();


    const date =
        formatDate(
            order.createdAt
        );


    const customer =
        order.user || {};


    const address =
        order.shippingAddress ||
        {};


    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    const subtotal =
        Number(
            order.subtotal ||
            0
        );


    const shipping =
        Number(
            order.shipping ||
            0
        );


    const total =
        Number(
            order.total ||
            subtotal +
            shipping
        );


    return `

        <article
            class="order-card"
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
                    class="status-badge"
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
                class="order-card-body"
            >


                <div>


                    <!-- CUSTOMER -->

                    <div
                        class="customer-section"
                    >

                        <h3>
                            CUSTOMER
                        </h3>


                        <p>

                            <strong>
                                ${escapeHTML(
                                    customer.name ||
                                    address.name ||
                                    "Customer"
                                )}
                            </strong>

                            <br>

                            ${escapeHTML(
                                customer.email ||
                                address.email ||
                                ""
                            )}

                        </p>

                    </div>



                    <!-- ITEMS -->

                    <div
                        class="items-section"
                    >

                        <h3>
                            ORDER ITEMS
                        </h3>


                        ${
                            items.length

                                ? items
                                    .map(
                                        createOrderItem
                                    )
                                    .join("")

                                : `

                                    <p>
                                        No item information.
                                    </p>

                                `
                        }

                    </div>

                </div>



                <!-- SUMMARY -->

                <div
                    class="order-summary"
                >


                    <div
                        class="address-section"
                    >

                        <h3>
                            SHIPPING ADDRESS
                        </h3>


                        <p>

                            ${escapeHTML(
                                address.name ||
                                ""
                            )}

                            <br>

                            ${escapeHTML(
                                address.address ||
                                ""
                            )}

                            <br>

                            ${escapeHTML(
                                address.city ||
                                ""
                            )}

                            ${
                                address.state
                                    ? `,
                                        ${escapeHTML(
                                            address.state
                                        )}`
                                    : ""
                            }

                            ${
                                address.pincode
                                    ? `
                                        -
                                        ${escapeHTML(
                                            address.pincode
                                        )}
                                    `
                                    : ""
                            }

                            <br>

                            Phone:
                            ${escapeHTML(
                                address.phone ||
                                ""
                            )}

                        </p>

                    </div>


                    <br>


                    <div
                        class="summary-row"
                    >

                        <span>
                            SUBTOTAL
                        </span>

                        <span>
                            ${formatPrice(
                                subtotal
                            )}
                        </span>

                    </div>


                    <div
                        class="summary-row"
                    >

                        <span>
                            SHIPPING
                        </span>

                        <span>
                            ${
                                shipping === 0
                                    ? "FREE"
                                    : formatPrice(
                                        shipping
                                    )
                            }
                        </span>

                    </div>


                    <div
                        class="summary-row"
                    >

                        <span>
                            PAYMENT
                        </span>

                        <span>
                            ${escapeHTML(
                                order.paymentMethod ||
                                "COD"
                            )}
                        </span>

                    </div>


                    <div
                        class="
                            summary-row
                            summary-total
                        "
                    >

                        <span>
                            TOTAL
                        </span>

                        <span>
                            ${formatPrice(
                                total
                            )}
                        </span>

                    </div>

                </div>

            </div>



            <!-- FOOTER -->

            <footer
                class="order-card-footer"
            >

                <div
                    class="status-control"
                >

                    <label>
                        CHANGE STATUS
                    </label>


                    <select
                        data-status-id="${escapeHTML(
                            orderId
                        )}"
                    >

                        ${createStatusOptions(
                            status
                        )}

                    </select>


                    <button
                        type="button"
                        class="save-status-button"
                        data-action="update-status"
                        data-id="${escapeHTML(
                            orderId
                        )}"
                    >
                        UPDATE
                    </button>

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
        item.product &&
        typeof item.product ===
            "object"

            ? item.product
            : null;


    const name =
        product?.name ||
        item.name ||
        "Product";


    const image =
        product?.image ||
        item.image ||
        "https://via.placeholder.com/100x120?text=HASHIRA";


    const quantity =
        Number(
            item.quantity ||
            1
        );


    const price =
        Number(
            item.price ??
            product?.price ??
            0
        );


    return `

        <div
            class="admin-order-item"
        >

            <img
                src="${escapeHTML(
                    image
                )}"
                alt="${escapeHTML(
                    name
                )}"
            >


            <div
                class="item-info"
            >

                <strong>
                    ${escapeHTML(
                        name
                    )}
                </strong>


                ${
                    item.size

                        ? `

                            <span>
                                Size:
                                ${escapeHTML(
                                    item.size
                                )}
                            </span>

                        `

                        : ""
                }


                <span>
                    Quantity:
                    ${quantity}
                </span>


                <span>
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
   STATUS OPTIONS
===================================================== */

function createStatusOptions(
    currentStatus
) {

    const statuses = [

        "PLACED",

        "CONFIRMED",

        "PROCESSING",

        "SHIPPED",

        "DELIVERED",

        "CANCELLED"

    ];


    return statuses
        .map(
            status => `

                <option
                    value="${status}"
                    ${
                        status ===
                        currentStatus
                            ? "selected"
                            : ""
                    }
                >

                    ${formatStatus(
                        status
                    )}

                </option>

            `
        )
        .join("");

}


/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

async function updateOrderStatus(
    orderId
) {

    const select =
        document.querySelector(
            `select[data-status-id="${CSS.escape(
                orderId
            )}"]`
        );


    if (!select) {

        return;

    }


    const status =
        select.value;


    try {

        const response =
            await fetch(

                `${API_URL}/orders/admin/${encodeURIComponent(
                    orderId
                )}/status`,

                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${getAdminToken()}`

                    },

                    body:
                        JSON.stringify({

                            status:
                                status

                        })

                }

            );


        if (
            response.status ===
            401
        ) {

            logoutAdmin();

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
                "Failed to update order."

            );

        }


        showNotification(
            "Order status updated successfully."
        );


        await loadOrders();

    }

    catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        showNotification(
            error.message
        );

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutAdmin() {

    localStorage.removeItem(
        "hashiraAdminToken"
    );

    localStorage.removeItem(
        "hashiraAdmin"
    );

    sessionStorage.removeItem(
        "hashiraAdminToken"
    );

    sessionStorage.removeItem(
        "hashiraAdmin"
    );


    window.location.href =
        "admin-login.html";

}


/* =====================================================
   DATE
===================================================== */

function formatDate(
    value
) {

    if (!value) {

        return "Unknown date";

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

        return "Unknown date";

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
   STATUS
===================================================== */

function formatStatus(
    value
) {

    return String(
        value ||
        ""
    )
        .replace(
            /[_-]/g,
            " "
        )
        .toUpperCase();

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
   SET TEXT
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

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
            "adminNotification"
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
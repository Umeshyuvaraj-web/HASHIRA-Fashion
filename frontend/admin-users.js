/* =====================================================
   HASHIRA CUSTOMER MANAGEMENT
   PHASE 28
===================================================== */

const API_URL =
    "http://localhost:5000/api";


let customers = [];


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCustomers();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

function initializeCustomers() {

    if (
        !getAdminToken()
    ) {

        window.location.href =
            "admin-login.html";

        return;

    }


    loadAdminName();

    setupEvents();

    loadCustomers();

}


/* =====================================================
   TOKEN
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
   ADMIN NAME
===================================================== */

function loadAdminName() {

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


        setText(
            "adminName",
            admin.name ||
            "ADMIN"
        );

    }

    catch {

        return;

    }

}


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {

    const search =
        document.getElementById(
            "searchCustomer"
        );


    const refresh =
        document.getElementById(
            "refreshCustomers"
        );


    const logout =
        document.getElementById(
            "logoutButton"
        );


    if (search) {

        search.addEventListener(
            "input",
            renderCustomers
        );

    }


    if (refresh) {

        refresh.addEventListener(
            "click",
            loadCustomers
        );

    }


    if (logout) {

        logout.addEventListener(
            "click",
            logoutAdmin
        );

    }

}


/* =====================================================
   LOAD CUSTOMERS
===================================================== */

async function loadCustomers() {

    const container =
        document.getElementById(
            "customersContainer"
        );


    if (container) {

        container.innerHTML = `

            <div class="loading">

                LOADING CUSTOMERS...

            </div>

        `;

    }


    try {

        const response =
            await fetch(

                `${API_URL}/users/admin/all`,

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


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            throw new Error(

                data.message ||
                "Failed to load customers."

            );

        }


        customers =
            Array.isArray(
                data.users
            )
                ? data.users
                : [];


        updateStatistics();

        renderCustomers();

    }

    catch (error) {

        console.error(
            error
        );


        if (container) {

            container.innerHTML = `

                <div class="empty">

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
        "totalCustomers",
        customers.length
    );


    const activeCustomers =
        customers.filter(
            customer =>
                customer.role ===
                "user"
        ).length;


    setText(
        "activeCustomers",
        activeCustomers
    );


    const totalOrders =
        customers.reduce(

            (
                total,
                customer
            ) => {

                return (

                    total +
                    Number(
                        customer.orderCount ||
                        0
                    )

                );

            },

            0

        );


    setText(
        "totalCustomerOrders",
        totalOrders
    );


    const totalSpending =
        customers.reduce(

            (
                total,
                customer
            ) => {

                return (

                    total +
                    Number(
                        customer.totalSpent ||
                        0
                    )

                );

            },

            0

        );


    setText(
        "customerRevenue",
        formatPrice(
            totalSpending
        )
    );

}


/* =====================================================
   RENDER CUSTOMERS
===================================================== */

function renderCustomers() {

    const container =
        document.getElementById(
            "customersContainer"
        );


    if (!container) {

        return;

    }


    const search =
        document.getElementById(
            "searchCustomer"
        );


    const searchValue =
        search
            ? search.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        customers.filter(
            customer => {

                const name =
                    String(
                        customer.name ||
                        ""
                    ).toLowerCase();


                const email =
                    String(
                        customer.email ||
                        ""
                    ).toLowerCase();


                return (

                    name.includes(
                        searchValue
                    )

                    ||

                    email.includes(
                        searchValue
                    )

                );

            }
        );


    if (
        filtered.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty">

                NO CUSTOMERS FOUND

            </div>

        `;

        return;

    }


    container.innerHTML =
        filtered
            .map(
                createCustomerCard
            )
            .join("");

}


/* =====================================================
   CUSTOMER CARD
===================================================== */

function createCustomerCard(
    customer
) {

    const name =
        customer.name ||
        "Customer";


    const email =
        customer.email ||
        "";


    const initial =
        name
            .charAt(0)
            .toUpperCase();


    return `

        <article
            class="customer-card"
        >


            <div
                class="customer-info"
            >

                <div
                    class="customer-avatar"
                >

                    ${escapeHTML(
                        initial
                    )}

                </div>


                <div>

                    <strong>

                        ${escapeHTML(
                            name
                        )}

                    </strong>


                    <span>

                        ${escapeHTML(
                            email
                        )}

                    </span>

                </div>

            </div>



            <div
                class="customer-data"
            >

                <span>
                    ORDERS
                </span>

                <strong>

                    ${Number(
                        customer.orderCount ||
                        0
                    )}

                </strong>

            </div>



            <div
                class="customer-data"
            >

                <span>
                    SPENDING
                </span>

                <strong>

                    ${formatPrice(
                        customer.totalSpent ||
                        0
                    )}

                </strong>

            </div>



            <div
                class="customer-data"
            >

                <span>
                    JOINED
                </span>

                <strong>

                    ${formatDate(
                        customer.createdAt
                    )}

                </strong>

            </div>



            <div>

                <span
                    class="customer-role"
                >

                    ${escapeHTML(
                        customer.role ||
                        "user"
                    ).toUpperCase()}

                </span>

            </div>

        </article>

    `;

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

        return "—";

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

        return "—";

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
            "notification"
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
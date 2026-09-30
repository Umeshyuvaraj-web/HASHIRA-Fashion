/* =====================================================
   HASHIRA STORE AUTHENTICATION
   PHASE 14 - CUSTOMER SESSION MANAGEMENT
===================================================== */


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAccount();

    }
);


/* =====================================================
   INITIALIZE ACCOUNT
===================================================== */

function initializeAccount() {

    const accountArea =
        document.getElementById(
            "accountArea"
        );


    if (!accountArea) {

        return;

    }


    const user =
        getCurrentUser();


    const token =
        getUserToken();


    /*
     * Only consider the customer logged in
     * when BOTH user data and a token exist.
     */

    if (
        user &&
        token
    ) {

        showLoggedInUser(
            accountArea,
            user
        );

    }

    else {

        /*
         * Remove incomplete/invalid
         * customer session data.
         */

        if (
            !token
        ) {

            clearCustomerData();

        }


        showLogin(
            accountArea
        );

    }

}


/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentUser() {

    let user = null;


    const localUser =
        localStorage.getItem(
            "hashiraUser"
        );


    const sessionUser =
        sessionStorage.getItem(
            "hashiraUser"
        );


    try {

        /*
         * Remember Me session
         */

        if (
            localUser
        ) {

            user =
                JSON.parse(
                    localUser
                );

        }

        /*
         * Session-only login
         */

        else if (
            sessionUser
        ) {

            user =
                JSON.parse(
                    sessionUser
                );

        }

    }

    catch (error) {

        console.error(
            "HASHIRA user data error:",
            error
        );


        clearCustomerData();

    }


    return user;

}


/* =====================================================
   GET USER TOKEN
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
   SHOW LOGIN
===================================================== */

function showLogin(
    container
) {

    if (
        !container
    ) {

        return;

    }


    container.innerHTML = `

        <a
            href="login.html"
            id="loginLink"
            class="nav-login"
        >
            LOGIN
        </a>

    `;

}


/* =====================================================
   SHOW LOGGED-IN CUSTOMER
===================================================== */

function showLoggedInUser(
    container,
    user
) {

    if (
        !container
    ) {

        return;

    }


    const name =
        user.name ||
        "Customer";


    const email =
        user.email ||
        "";


    const initial =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "C";


    container.innerHTML = `

        <div
            class="user-account"
            id="userAccount"
            tabindex="0"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
        >

            <div class="user-avatar">

                ${escapeHTML(
                    initial
                )}

            </div>


            <span class="user-name">

                ${escapeHTML(
                    name
                )}

            </span>


            <span class="account-arrow">
                ▾
            </span>

        </div>


        <div
            class="account-dropdown"
            id="accountDropdown"
        >

            <div class="account-user-info">

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


            <div class="account-divider"></div>


            <button
                type="button"
                onclick="openOrders()"
            >

                MY ORDERS

            </button>


            <button
                type="button"
                onclick="openProfile()"
            >

                MY PROFILE

            </button>


            <div class="account-divider"></div>


            <button
                type="button"
                class="logout-btn"
                onclick="logoutUser()"
            >

                SIGN OUT

            </button>

        </div>

    `;


    setupAccountDropdown();

}


/* =====================================================
   ACCOUNT DROPDOWN
===================================================== */

function setupAccountDropdown() {

    const userAccount =
        document.getElementById(
            "userAccount"
        );


    const dropdown =
        document.getElementById(
            "accountDropdown"
        );


    if (
        !userAccount ||
        !dropdown
    ) {

        return;

    }


    /*
     * Prevent duplicate document
     * click listeners.
     */

    if (
        window.hashiraAccountClickHandler
    ) {

        document.removeEventListener(
            "click",
            window.hashiraAccountClickHandler
        );

    }


    const toggleDropdown =
        (event) => {

            event.stopPropagation();


            const isActive =
                dropdown.classList.toggle(
                    "active"
                );


            userAccount.setAttribute(
                "aria-expanded",
                String(
                    isActive
                )
            );

        };


    userAccount.addEventListener(
        "click",
        toggleDropdown
    );


    userAccount.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleDropdown(
                    event
                );

            }

        }
    );


    const closeDropdown =
        () => {

            dropdown.classList.remove(
                "active"
            );


            userAccount.setAttribute(
                "aria-expanded",
                "false"
            );

        };


    window.hashiraAccountClickHandler =
        (event) => {

            if (
                !userAccount.contains(
                    event.target
                ) &&

                !dropdown.contains(
                    event.target
                )
            ) {

                closeDropdown();

            }

        };


    document.addEventListener(
        "click",
        window.hashiraAccountClickHandler
    );

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    /*
     * Remove customer authentication.
     *
     * Cart and wishlist are intentionally
     * NOT removed.
     */

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


    /*
     * Close account dropdown.
     */

    const dropdown =
        document.getElementById(
            "accountDropdown"
        );


    if (
        dropdown
    ) {

        dropdown.classList.remove(
            "active"
        );

    }


    /*
     * Refresh the store so the
     * LOGIN button appears again.
     */

    window.location.reload();

}


/* =====================================================
   CLEAR CUSTOMER DATA
===================================================== */

function clearCustomerData() {

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
   CHECK LOGIN STATUS
===================================================== */

function isUserLoggedIn() {

    const token =
        getUserToken();


    const user =
        getCurrentUser();


    return Boolean(
        token &&
        user
    );

}


/* =====================================================
   REQUIRE LOGIN
===================================================== */

function requireLogin(
    callback
) {

    if (
        isUserLoggedIn()
    ) {

        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

        return true;

    }


    window.location.href =
        "login.html";


    return false;

}


/* =====================================================
   MY ORDERS
===================================================== */

function openOrders() {

    if (
        !isUserLoggedIn()
    ) {

        window.location.href =
            "login.html";

        return;

    }


    /*
     * Orders page will be implemented
     * in a future phase.
     */

    alert(
        "My Orders will be available in the next phase."
    );

}


/* =====================================================
   MY PROFILE
===================================================== */

function openProfile() {

    if (
        !isUserLoggedIn()
    ) {

        window.location.href =
            "login.html";

        return;

    }


    /*
     * Profile page will be implemented
     * in a future phase.
     */

    alert(
        "My Profile will be available in the next phase."
    );

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

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
   GLOBAL FUNCTIONS
===================================================== */

window.logoutUser =
    logoutUser;


window.openOrders =
    openOrders;


window.openProfile =
    openProfile;


window.getCurrentUser =
    getCurrentUser;


window.getUserToken =
    getUserToken;


window.isUserLoggedIn =
    isUserLoggedIn;


window.requireLogin =
    requireLogin;
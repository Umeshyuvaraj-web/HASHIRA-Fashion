/* =====================================================
   HASHIRA CUSTOMER LOGIN
   CUSTOMER AUTHENTICATION
===================================================== */

const API_URL = "http://localhost:5000/api";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const togglePasswordButton =
    document.getElementById("togglePassword");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const guestButton =
    document.getElementById("guestButton");

const forgotPassword =
    document.getElementById("forgotPassword");

const rememberMe =
    document.getElementById("rememberMe");


/* =====================================================
   PASSWORD VISIBILITY
===================================================== */

if (togglePasswordButton) {

    togglePasswordButton.addEventListener(
        "click",
        () => {

            if (!passwordInput) {
                return;
            }


            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePasswordButton.textContent =
                    "HIDE";

                togglePasswordButton.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }

            else {

                passwordInput.type =
                    "password";

                togglePasswordButton.textContent =
                    "SHOW";

                togglePasswordButton.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =====================================================
   CUSTOMER LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =============================================
               GET VALUES
            ============================================= */

            const email =
                emailInput
                    ? emailInput.value
                        .trim()
                        .toLowerCase()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            /* =============================================
               VALIDATION
            ============================================= */

            if (!email) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );


                if (emailInput) {
                    emailInput.focus();
                }


                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );


                if (emailInput) {
                    emailInput.focus();
                }


                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );


                if (passwordInput) {
                    passwordInput.focus();
                }


                return;

            }


            /* =============================================
               LOADING
            ============================================= */

            setLoading(true);

            clearMessage();


            try {

                /* =========================================
                   LOGIN API
                ========================================= */

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email:
                                        email,

                                    password:
                                        password

                                })

                        }
                    );


                /* =========================================
                   RESPONSE
                ========================================= */

                let data = {};


                try {

                    data =
                        await response.json();

                }

                catch {

                    data = {};

                }


                /* =========================================
                   SERVER ERROR
                ========================================= */

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Invalid email or password."
                    );

                }


                /* =========================================
                   TOKEN CHECK
                ========================================= */

                if (!data.token) {

                    throw new Error(
                        "Login succeeded but no authentication token was received."
                    );

                }


                /* =========================================
                   USER CHECK
                ========================================= */

                if (
                    data.user &&
                    data.user.role &&
                    data.user.role !== "user"
                ) {

                    throw new Error(
                        "This account is not a customer account."
                    );

                }


                /* =========================================
                   CLEAR OLD SESSION
                ========================================= */

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


                /* =========================================
                   REMEMBER ME
                ========================================= */

                const shouldRemember =
                    rememberMe
                        ? rememberMe.checked
                        : false;


                if (shouldRemember) {

                    localStorage.setItem(
                        "hashiraUserToken",
                        data.token
                    );

                }

                else {

                    sessionStorage.setItem(
                        "hashiraUserToken",
                        data.token
                    );

                }


                /* =========================================
                   SAVE USER INFORMATION
                ========================================= */

                if (data.user) {

                    const userData =
                        JSON.stringify(
                            data.user
                        );


                    if (shouldRemember) {

                        localStorage.setItem(
                            "hashiraUser",
                            userData
                        );

                    }

                    else {

                        sessionStorage.setItem(
                            "hashiraUser",
                            userData
                        );

                    }

                }


                /* =========================================
                   SUCCESS
                ========================================= */

                showMessage(
                    "Welcome back to HASHIRA. Redirecting...",
                    "success"
                );


                /* =========================================
                   REDIRECT
                ========================================= */

                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    700
                );

            }

            catch (error) {

                console.error(
                    "HASHIRA Login Error:",
                    error
                );


                /* =========================================
                   CONNECTION ERROR
                ========================================= */

                if (
                    error instanceof
                    TypeError
                ) {

                    showMessage(
                        "Unable to connect to HASHIRA. Please make sure the backend is running.",
                        "error"
                    );

                }

                else {

                    showMessage(
                        error.message ||
                        "Login failed.",
                        "error"
                    );

                }

            }

            finally {

                setLoading(false);

            }

        }
    );

}


/* =====================================================
   LOADING STATE
===================================================== */

function setLoading(
    loading
) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        loading;


    if (loading) {

        loginButton.innerHTML = `

            <span>
                SIGNING IN...
            </span>

            <span class="button-spinner"></span>

        `;

    }

    else {

        loginButton.innerHTML = `

            <span>
                SIGN IN
            </span>

            <span class="button-arrow">
                →
            </span>

        `;

    }

}


/* =====================================================
   SHOW MESSAGE
===================================================== */

function showMessage(
    message,
    type
) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        "login-message";


    if (type) {

        loginMessage.classList.add(
            type
        );

    }

}


/* =====================================================
   CLEAR MESSAGE
===================================================== */

function clearMessage() {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =====================================================
   GUEST ACCESS
===================================================== */

if (guestButton) {

    guestButton.addEventListener(
        "click",
        () => {

            /*
             * Guest users can browse the store
             * without creating an account.
             */

            window.location.href =
                "index.html";

        }
    );

}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            const email =
                emailInput
                    ? emailInput.value
                        .trim()
                        .toLowerCase()
                    : "";


            if (!email) {

                showMessage(
                    "Enter your email first to reset your password.",
                    "error"
                );


                if (emailInput) {

                    emailInput.focus();

                }


                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );


                if (emailInput) {

                    emailInput.focus();

                }


                return;

            }


            /*
             * Password reset backend is not
             * implemented yet.
             */

            showMessage(
                "Password reset will be available soon.",
                "success"
            );

        }
    );

}


/* =====================================================
   EXISTING SESSION CHECK
===================================================== */

function checkExistingLogin() {

    const localToken =
        localStorage.getItem(
            "hashiraUserToken"
        );


    const sessionToken =
        sessionStorage.getItem(
            "hashiraUserToken"
        );


    if (
        localToken ||
        sessionToken
    ) {

        console.log(
            "HASHIRA customer session detected."
        );

    }

}


/* =====================================================
   INITIALIZE
===================================================== */

checkExistingLogin();
/* =====================================================
   HASHIRA ADMIN LOGIN
===================================================== */

const API_URL =
    "http://localhost:5000/api";


/* =====================================================
   ELEMENTS
===================================================== */

const loginForm =
    document.getElementById(
        "adminLoginForm"
    );


const emailInput =
    document.getElementById(
        "adminEmail"
    );


const passwordInput =
    document.getElementById(
        "adminPassword"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const loginButton =
    document.getElementById(
        "adminLoginButton"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "HIDE";

            }

            else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "SHOW";

            }

        }
    );

}


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (!email) {

                showMessage(
                    "Please enter your admin email.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            setLoading(true);


            try {

                /* -------------------------------------
                   SEND REQUEST
                ------------------------------------- */

                const response =
                    await fetch(
                        `${API_URL}/auth/admin-login`,
                        {

                            method:
                                "POST",

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


                let data = {};


                try {

                    data =
                        await response.json();

                }

                catch {

                    data = {};

                }


                /* -------------------------------------
                   ERROR
                ------------------------------------- */

                if (!response.ok) {

                    throw new Error(

                        data.message ||
                        "Invalid admin credentials."

                    );

                }


                /* -------------------------------------
                   TOKEN
                ------------------------------------- */

                if (!data.token) {

                    throw new Error(
                        "Authentication token was not received."
                    );

                }


                localStorage.setItem(
                    "hashiraAdminToken",
                    data.token
                );


                /* -------------------------------------
                   ADMIN DATA
                ------------------------------------- */

                if (data.admin) {

                    localStorage.setItem(
                        "hashiraAdmin",
                        JSON.stringify(
                            data.admin
                        )
                    );

                }


                /* -------------------------------------
                   SUCCESS
                ------------------------------------- */

                showMessage(
                    "Access granted. Opening dashboard...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "admin.html";

                    },
                    700
                );

            }

            catch (error) {

                console.error(
                    "HASHIRA Admin Login Error:",
                    error
                );


                if (
                    error instanceof
                    TypeError
                ) {

                    showMessage(
                        "Cannot connect to HASHIRA server. Make sure the backend is running.",
                        "error"
                    );

                }

                else {

                    showMessage(
                        error.message ||
                        "Admin login failed.",
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
   LOADING
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
                AUTHENTICATING...
            </span>

            <span>
                •••
            </span>

        `;

    }

    else {

        loginButton.innerHTML = `

            <span>
                SIGN IN
            </span>

            <span class="arrow">
                →
            </span>

        `;

    }

}


/* =====================================================
   MESSAGE
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


    loginMessage.classList.add(
        type
    );

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
   PREVENT ADMIN CACHE ISSUE
===================================================== */

window.addEventListener(
    "pageshow",
    () => {

        const token =
            localStorage.getItem(
                "hashiraAdminToken"
            );


        if (token) {

            /*
               Keep login page accessible,
               but the dashboard itself remains
               protected by the token.
            */

            console.log(
                "HASHIRA admin session detected."
            );

        }

    }
);
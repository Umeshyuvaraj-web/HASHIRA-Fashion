/* =====================================================
   HASHIRA CUSTOMER REGISTRATION
===================================================== */

const API_URL =
    "http://localhost:5000/api";


/* =====================================================
   ELEMENTS
===================================================== */

const registerForm =
    document.getElementById(
        "registerForm"
    );


const nameInput =
    document.getElementById(
        "name"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );


const termsInput =
    document.getElementById(
        "terms"
    );


const registerButton =
    document.getElementById(
        "registerButton"
    );


const registerMessage =
    document.getElementById(
        "registerMessage"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
    );


const strengthBar =
    document.getElementById(
        "strengthBar"
    );


const passwordHint =
    document.getElementById(
        "passwordHint"
    );


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            toggleInputVisibility(
                passwordInput,
                togglePassword
            );

        }
    );

}


if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        () => {

            toggleInputVisibility(
                confirmPasswordInput,
                toggleConfirmPassword
            );

        }
    );

}


/* =====================================================
   TOGGLE PASSWORD HELPER
===================================================== */

function toggleInputVisibility(
    input,
    button
) {

    if (
        input.type ===
        "password"
    ) {

        input.type =
            "text";

        button.textContent =
            "HIDE";

    }

    else {

        input.type =
            "password";

        button.textContent =
            "SHOW";

    }

}


/* =====================================================
   PASSWORD STRENGTH
===================================================== */

if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        () => {

            updatePasswordStrength(
                passwordInput.value
            );

        }
    );

}


function updatePasswordStrength(
    password
) {

    if (!strengthBar) {

        return;

    }


    let strength = 0;


    if (
        password.length >= 6
    ) {

        strength += 25;

    }


    if (
        password.length >= 8
    ) {

        strength += 25;

    }


    if (
        /[A-Z]/.test(password)
    ) {

        strength += 15;

    }


    if (
        /[0-9]/.test(password)
    ) {

        strength += 15;

    }


    if (
        /[^A-Za-z0-9]/.test(password)
    ) {

        strength += 20;

    }


    strength =
        Math.min(
            strength,
            100
        );


    strengthBar.style.width =
        `${strength}%`;


    if (!password) {

        passwordHint.textContent =
            "Use at least 6 characters.";

    }

    else if (
        strength < 50
    ) {

        passwordHint.textContent =
            "Password is weak.";

    }

    else if (
        strength < 75
    ) {

        passwordHint.textContent =
            "Password is getting stronger.";

    }

    else {

        passwordHint.textContent =
            "Strong password.";

    }

}


/* =====================================================
   REGISTRATION
===================================================== */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                nameInput.value.trim();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            const confirmPassword =
                confirmPasswordInput.value;


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (
                name.length < 2
            ) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                nameInput.focus();

                return;

            }


            if (
                !isValidEmail(email)
            ) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (
                password.length < 6
            ) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                confirmPasswordInput.focus();

                return;

            }


            if (
                !termsInput.checked
            ) {

                showMessage(
                    "Please accept the terms and privacy policy.",
                    "error"
                );

                return;

            }


            /* -----------------------------------------
               LOADING
            ----------------------------------------- */

            setLoading(true);


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    name:
                                        name,

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


                if (!response.ok) {

                    throw new Error(

                        data.message ||
                        "Registration failed."

                    );

                }


                /* -------------------------------------
                   SAVE TOKEN IF BACKEND RETURNS ONE
                ------------------------------------- */

                if (data.token) {

                    localStorage.setItem(
                        "hashiraUserToken",
                        data.token
                    );

                }


                if (data.user) {

                    localStorage.setItem(
                        "hashiraUser",
                        JSON.stringify(
                            data.user
                        )
                    );

                }


                /* -------------------------------------
                   SUCCESS
                ------------------------------------- */

                showMessage(
                    "Account created successfully. Welcome to HASHIRA.",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    900
                );

            }

            catch (error) {

                console.error(
                    "HASHIRA Registration Error:",
                    error
                );


                if (
                    error instanceof
                    TypeError
                ) {

                    showMessage(
                        "Unable to connect to HASHIRA server. Please start the backend.",
                        "error"
                    );

                }

                else {

                    showMessage(
                        error.message ||
                        "Registration failed.",
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

    if (!registerButton) {

        return;

    }


    registerButton.disabled =
        loading;


    if (loading) {

        registerButton.innerHTML = `

            <span>
                CREATING ACCOUNT...
            </span>

            <span>
                •••
            </span>

        `;

    }

    else {

        registerButton.innerHTML = `

            <span>
                CREATE ACCOUNT
            </span>

            <span class="button-arrow">
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

    if (!registerMessage) {

        return;

    }


    registerMessage.textContent =
        message;


    registerMessage.className =
        "register-message";


    registerMessage.classList.add(
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
/* =====================================================
   HASHIRA CART
   PHASE 23
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderCart();

    }
);


/* =====================================================
   GET CART
===================================================== */

function getCart() {

    try {

        const data =
            localStorage.getItem(
                "hashiraCart"
            );


        if (!data) {

            return [];

        }


        const cart =
            JSON.parse(data);


        return Array.isArray(cart)
            ? cart
            : [];

    }

    catch {

        localStorage.removeItem(
            "hashiraCart"
        );

        return [];

    }

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "hashiraCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const container =
        document.getElementById(
            "cartContainer"
        );


    if (!container) {

        return;

    }


    const cart =
        getCart();


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    YOUR CART IS EMPTY
                </h2>

                <p>
                    Discover something you love from the HASHIRA collection.
                </p>

                <a
                    href="index.html"
                    class="shop-button"
                >
                    CONTINUE SHOPPING
                </a>

            </div>

        `;

        return;

    }


    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

    });


    const shipping =
        subtotal >= 2000
            ? 0
            : 100;


    const total =
        subtotal +
        shipping;


    container.innerHTML = `

        <section class="cart-items">

            ${cart
                .map(
                    (item, index) =>
                        createCartItem(
                            item,
                            index
                        )
                )
                .join("")}

        </section>


        <aside class="cart-summary">

            <h2>
                ORDER SUMMARY
            </h2>


            <div class="summary-row">

                <span>
                    SUBTOTAL
                </span>

                <span>
                    ${formatPrice(subtotal)}
                </span>

            </div>


            <div class="summary-row">

                <span>
                    SHIPPING
                </span>

                <span>
                    ${
                        shipping === 0
                            ? "FREE"
                            : formatPrice(shipping)
                    }
                </span>

            </div>


            <div
                class="summary-row summary-total"
            >

                <span>
                    TOTAL
                </span>

                <span>
                    ${formatPrice(total)}
                </span>

            </div>


            <button
                type="button"
                class="checkout-button"
                id="checkoutButton"
            >
                PROCEED TO CHECKOUT
            </button>

        </aside>

    `;


    setupCartEvents();

}


/* =====================================================
   CREATE CART ITEM
===================================================== */

function createCartItem(
    item,
    index
) {

    const quantity =
        Number(
            item.quantity || 1
        );


    return `

        <article
            class="cart-item"
        >

            <img
                src="${escapeHTML(
                    item.image ||
                    "https://via.placeholder.com/300x400?text=HASHIRA"
                )}"
                alt="${escapeHTML(
                    item.name
                )}"
                class="cart-item-image"
                onerror="
                    this.src='https://via.placeholder.com/300x400?text=HASHIRA'
                "
            >


            <div
                class="cart-item-info"
            >

                <p
                    class="cart-item-category"
                >
                    HASHIRA COLLECTION
                </p>


                <h2
                    class="cart-item-name"
                >
                    ${escapeHTML(
                        item.name ||
                        "Product"
                    )}
                </h2>


                ${
                    item.size
                        ? `
                            <p
                                class="cart-item-size"
                            >
                                SIZE:
                                ${escapeHTML(
                                    item.size
                                )}
                            </p>
                        `
                        : ""
                }


                <p
                    class="cart-item-price"
                >
                    ${formatPrice(
                        item.price
                    )}
                </p>

            </div>


            <div
                class="cart-item-actions"
            >

                <div
                    class="quantity-control"
                >

                    <button
                        type="button"
                        data-action="decrease"
                        data-index="${index}"
                    >
                        −
                    </button>


                    <span>
                        ${quantity}
                    </span>


                    <button
                        type="button"
                        data-action="increase"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="remove-button"
                    data-action="remove"
                    data-index="${index}"
                >
                    REMOVE
                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   EVENTS
===================================================== */

function setupCartEvents() {

    const container =
        document.getElementById(
            "cartContainer"
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


            if (button) {

                const action =
                    button.dataset.action;


                const index =
                    Number(
                        button.dataset.index
                    );


                handleCartAction(
                    action,
                    index
                );


                return;

            }


            if (
                event.target.id ===
                "checkoutButton"
            ) {

                goToCheckout();

            }

        }
    );

}


/* =====================================================
   CART ACTION
===================================================== */

function handleCartAction(
    action,
    index
) {

    const cart =
        getCart();


    if (
        !cart[index]
    ) {

        return;

    }


    if (
        action ===
        "increase"
    ) {

        cart[index].quantity =
            Number(
                cart[index].quantity || 0
            ) + 1;

    }


    else if (
        action ===
        "decrease"
    ) {

        cart[index].quantity =
            Number(
                cart[index].quantity || 0
            ) - 1;


        if (
            cart[index].quantity <= 0
        ) {

            cart.splice(
                index,
                1
            );

        }

    }


    else if (
        action ===
        "remove"
    ) {

        cart.splice(
            index,
            1
        );

        showNotification(
            "Product removed from cart."
        );

    }


    saveCart(
        cart
    );


    renderCart();

}


/* =====================================================
   CHECKOUT
===================================================== */

function goToCheckout() {

    const cart =
        getCart();


    if (
        cart.length === 0
    ) {

        showNotification(
            "Your cart is empty."
        );

        return;

    }


    const token =
        getUserToken();


    if (!token) {

        showNotification(
            "Please login before checkout."
        );


        setTimeout(
            () => {

                window.location.href =
                    "login.html?redirect=checkout.html";

            },
            800
        );


        return;

    }


    window.location.href =
        "checkout.html";

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
            value || 0
        )
    );

}


/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification(
    message
) {

    const element =
        document.getElementById(
            "cartNotification"
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
        2500
    );

}


/* =====================================================
   ESCAPE
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
/* =====================================================
   HASHIRA PRODUCT DETAILS
   PHASE 22
===================================================== */


const API_URL =
    "http://localhost:5000/api";


let currentProduct = null;

let selectedSize = null;

let selectedQuantity = 1;


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeProductPage();

    }
);


/* =====================================================
   INITIALIZE PRODUCT PAGE
===================================================== */

function initializeProductPage() {

    updateCartCount();

    loadProduct();

}


/* =====================================================
   GET PRODUCT ID
===================================================== */

function getProductId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get(
        "id"
    );

}


/* =====================================================
   LOAD PRODUCT
===================================================== */

async function loadProduct() {

    const productId =
        getProductId();


    if (
        !productId
    ) {

        showProductError(
            "No product was selected."
        );

        return;

    }


    try {

        const response =
            await fetch(

                `${API_URL}/products/${encodeURIComponent(
                    productId
                )}`

            );


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            throw new Error(

                data.message
                    ||
                "Product not found."

            );

        }


        currentProduct =
            data;


        renderProduct(
            currentProduct
        );

    }

    catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        showProductError(
            error.message
        );

    }

}


/* =====================================================
   RENDER PRODUCT
===================================================== */

function renderProduct(
    product
) {

    const container =
        document.getElementById(
            "productContainer"
        );


    if (
        !container
    ) {

        return;

    }


    const stock =
        Number(
            product.stock || 0
        );


    const sizes =
        Array.isArray(
            product.sizes
        )
            ? product.sizes
            : [];


    const image =
        product.image ||
        "";


    let stockClass =
        "";


    let stockText =
        "";


    if (
        stock === 0
    ) {

        stockClass =
            "out";

        stockText =
            "OUT OF STOCK";

    }

    else if (
        stock <= 5
    ) {

        stockClass =
            "low";

        stockText =
            `ONLY ${stock} LEFT`;

    }

    else {

        stockText =
            "IN STOCK";

    }


    container.innerHTML = `

        <div class="product-layout">


            <!-- =================================
                 IMAGE
            ================================== -->

            <section
                class="product-gallery"
            >

                ${
                    image

                        ? `

                            <img
                                src="${escapeHTML(
                                    image
                                )}"
                                alt="${escapeHTML(
                                    product.name
                                        ||
                                    "HASHIRA Product"
                                )}"
                                class="product-main-image"
                                onerror="
                                    handleProductImageError(this)
                                "
                            >

                        `

                        : `

                            <div class="image-placeholder">

                                HASHIRA

                            </div>

                        `
                }

            </section>



            <!-- =================================
                 INFORMATION
            ================================== -->

            <section
                class="product-info"
            >


                <p
                    class="product-category"
                >

                    ${escapeHTML(
                        product.category
                            ||
                        "COLLECTION"
                    )}

                </p>


                <h1
                    class="product-title"
                >

                    ${escapeHTML(
                        product.name
                            ||
                        "HASHIRA PRODUCT"
                    )}

                </h1>


                <div
                    class="product-price"
                >

                    ${formatPrice(
                        product.price
                    )}

                </div>


                <p
                    class="product-description"
                >

                    ${escapeHTML(
                        product.description
                            ||
                        "Premium HASHIRA product designed with attention to detail and everyday comfort."
                    )}

                </p>



                <!-- STOCK -->

                <div
                    class="stock-information"
                >

                    <div
                        class="stock-label"
                    >

                        <span
                            class="
                                stock-dot
                                ${stockClass}
                            "
                        ></span>

                        <span
                            class="stock-text"
                        >

                            ${escapeHTML(
                                stockText
                            )}

                        </span>

                    </div>

                </div>



                <!-- SIZE -->

                ${
                    sizes.length > 0

                        ? `

                            <div
                                class="option-section"
                            >

                                <div
                                    class="option-heading"
                                >

                                    <span>
                                        SELECT SIZE
                                    </span>

                                </div>


                                <div
                                    id="sizeButtons"
                                    class="size-buttons"
                                >

                                    ${sizes
                                        .map(
                                            size => `

                                                <button
                                                    type="button"
                                                    class="size-button"
                                                    data-size="${escapeHTML(
                                                        size
                                                    )}"
                                                >

                                                    ${escapeHTML(
                                                        size
                                                    )}

                                                </button>

                                            `
                                        )
                                        .join("")}

                                </div>

                            </div>

                        `

                        : ""

                }



                <!-- QUANTITY -->

                <div
                    class="quantity-section"
                >

                    <span
                        class="quantity-heading"
                    >
                        QUANTITY
                    </span>


                    <div
                        class="quantity-control"
                    >

                        <button
                            type="button"
                            id="decreaseQuantity"
                        >
                            −
                        </button>


                        <span
                            id="quantityValue"
                            class="quantity-value"
                        >
                            1
                        </span>


                        <button
                            type="button"
                            id="increaseQuantity"
                        >
                            +
                        </button>

                    </div>

                </div>



                <!-- ACTIONS -->

                <div
                    class="product-actions"
                >

                    <button
                        type="button"
                        id="addToCartButton"
                        class="add-cart-button"
                        ${stock === 0 ? "disabled" : ""}
                    >

                        ADD TO CART

                    </button>


                    <button
                        type="button"
                        id="buyNowButton"
                        class="buy-now-button"
                        ${stock === 0 ? "disabled" : ""}
                    >

                        BUY NOW

                    </button>

                </div>



                <!-- META -->

                <div
                    class="product-meta"
                >

                    <div
                        class="meta-row"
                    >

                        <span>
                            CATEGORY
                        </span>

                        <span>
                            ${escapeHTML(
                                product.category
                                    ||
                                "N/A"
                            )}
                        </span>

                    </div>


                    <div
                        class="meta-row"
                    >

                        <span>
                            AVAILABILITY
                        </span>

                        <span>
                            ${
                                stock > 0
                                    ? "AVAILABLE"
                                    : "SOLD OUT"
                            }
                        </span>

                    </div>


                    <div
                        class="meta-row"
                    >

                        <span>
                            PRODUCT ID
                        </span>

                        <span>
                            ${escapeHTML(
                                String(
                                    product._id
                                        ||
                                    ""
                                ).slice(-8)
                            )}
                        </span>

                    </div>

                </div>

            </section>

        </div>

    `;


    setupProductControls();

}


/* =====================================================
   PRODUCT CONTROLS
===================================================== */

function setupProductControls() {

    const decrease =
        document.getElementById(
            "decreaseQuantity"
        );


    const increase =
        document.getElementById(
            "increaseQuantity"
        );


    const addCart =
        document.getElementById(
            "addToCartButton"
        );


    const buyNow =
        document.getElementById(
            "buyNowButton"
        );


    if (
        decrease
    ) {

        decrease.addEventListener(
            "click",
            decreaseQuantity
        );

    }


    if (
        increase
    ) {

        increase.addEventListener(
            "click",
            increaseQuantity
        );

    }


    if (
        addCart
    ) {

        addCart.addEventListener(
            "click",
            addToCart
        );

    }


    if (
        buyNow
    ) {

        buyNow.addEventListener(
            "click",
            buyNowProduct
        );

    }


    const sizeButtons =
        document.querySelectorAll(
            ".size-button"
        );


    sizeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectSize(
                        button
                    );

                }
            );

        }
    );

}


/* =====================================================
   SELECT SIZE
===================================================== */

function selectSize(
    button
) {

    document
        .querySelectorAll(
            ".size-button"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "selected"
                )
        );


    button.classList.add(
        "selected"
    );


    selectedSize =
        button.dataset.size;

}


/* =====================================================
   DECREASE QUANTITY
===================================================== */

function decreaseQuantity() {

    if (
        selectedQuantity <= 1
    ) {

        return;

    }


    selectedQuantity--;


    updateQuantityDisplay();

}


/* =====================================================
   INCREASE QUANTITY
===================================================== */

function increaseQuantity() {

    const stock =
        Number(
            currentProduct?.stock ||
            0
        );


    if (
        selectedQuantity >=
        stock
    ) {

        showNotification(
            `Only ${stock} item${
                stock === 1
                    ? ""
                    : "s"
            } available.`
        );

        return;

    }


    selectedQuantity++;


    updateQuantityDisplay();

}


/* =====================================================
   UPDATE QUANTITY DISPLAY
===================================================== */

function updateQuantityDisplay() {

    const element =
        document.getElementById(
            "quantityValue"
        );


    if (
        element
    ) {

        element.textContent =
            selectedQuantity;

    }

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart() {

    if (
        !currentProduct
    ) {

        return;

    }


    if (
        Number(
            currentProduct.stock ||
            0
        ) <= 0
    ) {

        showNotification(
            "This product is out of stock."
        );

        return;

    }


    if (
        Array.isArray(
            currentProduct.sizes
        )
        &&
        currentProduct.sizes.length > 0
        &&
        !selectedSize
    ) {

        showNotification(
            "Please select a size."
        );

        return;

    }


    const cart =
        getCart();


    const productId =
        String(
            currentProduct._id
        );


    const existingIndex =
        cart.findIndex(
            item =>
                String(
                    item.productId
                ) ===
                productId
                &&
                String(
                    item.size || ""
                ) ===
                String(
                    selectedSize || ""
                )
        );


    if (
        existingIndex >= 0
    ) {

        const newQuantity =
            Number(
                cart[
                    existingIndex
                ].quantity
            ) +
            selectedQuantity;


        if (
            newQuantity >
            Number(
                currentProduct.stock
            )
        ) {

            showNotification(
                "You cannot add more than the available stock."
            );

            return;

        }


        cart[
            existingIndex
        ].quantity =
            newQuantity;

    }

    else {

        cart.push({

            productId:
                productId,

            name:
                currentProduct.name,

            price:
                Number(
                    currentProduct.price ||
                    0
                ),

            image:
                currentProduct.image ||
                "",

            size:
                selectedSize,

            quantity:
                selectedQuantity

        });

    }


    saveCart(
        cart
    );


    updateCartCount();


    showNotification(
        "Product added to cart."
    );

}


/* =====================================================
   BUY NOW
===================================================== */

function buyNowProduct() {

    if (
        !currentProduct
    ) {

        return;

    }


    if (
        Number(
            currentProduct.stock ||
            0
        ) <= 0
    ) {

        showNotification(
            "This product is out of stock."
        );

        return;

    }


    if (
        Array.isArray(
            currentProduct.sizes
        )
        &&
        currentProduct.sizes.length > 0
        &&
        !selectedSize
    ) {

        showNotification(
            "Please select a size."
        );

        return;

    }


    addToCart();


    /*
     * Go directly to checkout.
     */

    setTimeout(
        () => {

            window.location.href =
                "checkout.html";

        },
        300
    );

}


/* =====================================================
   GET CART
===================================================== */

function getCart() {

    const cartData =
        localStorage.getItem(
            "hashiraCart"
        );


    if (
        !cartData
    ) {

        return [];

    }


    try {

        const cart =
            JSON.parse(
                cartData
            );


        return Array.isArray(
            cart
        )
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

function saveCart(
    cart
) {

    localStorage.setItem(
        "hashiraCart",
        JSON.stringify(
            cart
        )
    );

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const element =
        document.getElementById(
            "cartCount"
        );


    if (
        !element
    ) {

        return;

    }


    const cart =
        getCart();


    const count =
        cart.reduce(

            (
                total,
                item
            ) =>
                total +
                Number(
                    item.quantity ||
                    0
                ),

            0

        );


    element.textContent =
        count;

}


/* =====================================================
   PRODUCT IMAGE ERROR
===================================================== */

function handleProductImageError(
    image
) {

    image.style.display =
        "none";


    const parent =
        image.parentElement;


    if (
        parent
    ) {

        parent.innerHTML = `

            <div class="image-placeholder">

                HASHIRA

            </div>

        `;

    }

}


/* =====================================================
   PRODUCT ERROR
===================================================== */

function showProductError(
    message
) {

    const container =
        document.getElementById(
            "productContainer"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML = `

        <div class="product-error">

            <h2>
                PRODUCT NOT FOUND
            </h2>

            <p>
                ${escapeHTML(
                    message ||
                    "We could not find this product."
                )}
            </p>

            <a
                href="index.html"
                class="back-shop-button"
            >
                BACK TO SHOP
            </a>

        </div>

    `;

}


/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification(
    message
) {

    const notification =
        document.getElementById(
            "productNotification"
        );


    if (
        !notification
    ) {

        return;

    }


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =====================================================
   FORMAT PRICE
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

window.loadProduct =
    loadProduct;

window.addToCart =
    addToCart;

window.buyNowProduct =
    buyNowProduct;
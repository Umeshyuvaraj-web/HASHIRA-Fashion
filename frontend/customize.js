/* =====================================================
   HASHIRA CUSTOMIZATION
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCustomizer();

    }
);


/* =====================================================
   STATE
===================================================== */

const customization = {

    product: "tshirt",

    color: "#111111",

    colorName: "Black",

    size: "M",

    text: "",

    position: "center",

    quantity: 1

};


/* =====================================================
   PRODUCT DATA
===================================================== */

const products = {

    tshirt: {

        name:
            "Premium T-Shirt",

        price:
            599

    },

    hoodie: {

        name:
            "Signature Hoodie",

        price:
            999

    },

    shirt: {

        name:
            "Classic Shirt",

        price:
            799

    }

};


/* =====================================================
   INITIALIZE
===================================================== */

function initializeCustomizer() {

    setupProduct();

    setupColors();

    setupSizes();

    setupText();

    setupPosition();

    setupQuantity();

    setupAddToCart();

    updatePreview();

    updatePrice();

}


/* =====================================================
   PRODUCT
===================================================== */

function setupProduct() {

    const select =
        document.getElementById(
            "productSelect"
        );


    if (!select) {

        return;

    }


    select.addEventListener(
        "change",
        () => {

            customization.product =
                select.value;


            updatePreview();

            updatePrice();

        }
    );

}


/* =====================================================
   COLORS
===================================================== */

function setupColors() {

    document
        .querySelectorAll(
            ".color-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".color-option"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    customization.color =
                        button.dataset.color;


                    customization.colorName =
                        button.dataset.name ||
                        "Custom";


                    const selectedColor =
                        document.getElementById(
                            "selectedColor"
                        );


                    if (selectedColor) {

                        selectedColor.textContent =
                            customization.colorName;

                    }


                    updatePreview();

                }
            );

        });

}


/* =====================================================
   SIZES
===================================================== */

function setupSizes() {

    document
        .querySelectorAll(
            ".size-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".size-option"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    customization.size =
                        button.dataset.size;

                }
            );

        });

}


/* =====================================================
   TEXT
===================================================== */

function setupText() {

    const input =
        document.getElementById(
            "customText"
        );


    const preview =
        document.getElementById(
            "textPreview"
        );


    const count =
        document.getElementById(
            "characterCount"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        () => {

            customization.text =
                input.value.trim();


            if (preview) {

                preview.textContent =
                    customization.text ||
                    "HASHIRA";

            }


            if (count) {

                count.textContent =
                    input.value.length;

            }

        }
    );

}


/* =====================================================
   POSITION
===================================================== */

function setupPosition() {

    document
        .querySelectorAll(
            ".position-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".position-option"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    customization.position =
                        button.dataset.position;


                    updatePreview();

                }
            );

        });

}


/* =====================================================
   QUANTITY
===================================================== */

function setupQuantity() {

    const decrease =
        document.getElementById(
            "decreaseQuantity"
        );


    const increase =
        document.getElementById(
            "increaseQuantity"
        );


    const quantity =
        document.getElementById(
            "quantity"
        );


    if (decrease) {

        decrease.addEventListener(
            "click",
            () => {

                if (
                    customization.quantity > 1
                ) {

                    customization.quantity--;

                }


                if (quantity) {

                    quantity.textContent =
                        customization.quantity;

                }


                updatePrice();

            }
        );

    }


    if (increase) {

        increase.addEventListener(
            "click",
            () => {

                if (
                    customization.quantity < 10
                ) {

                    customization.quantity++;

                }


                if (quantity) {

                    quantity.textContent =
                        customization.quantity;

                }


                updatePrice();

            }
        );

    }

}


/* =====================================================
   UPDATE PREVIEW
===================================================== */

function updatePreview() {

    const previewCard =
        document.getElementById(
            "previewCard"
        );


    const previewImage =
        document.getElementById(
            "productPreview"
        );


    const textPreview =
        document.getElementById(
            "textPreview"
        );


    if (!previewCard) {

        return;

    }


    /*
     * Change preview background
     */

    previewCard.style.background =
        customization.color;


    /*
     * Keep text visible.
     */

    if (textPreview) {

        textPreview.classList.remove(
            "position-top",
            "position-bottom"
        );


        if (
            customization.position ===
            "top"
        ) {

            textPreview.classList.add(
                "position-top"
            );

        }


        if (
            customization.position ===
            "bottom"
        ) {

            textPreview.classList.add(
                "position-bottom"
            );

        }


        /*
         * Dark background = white text
         */

        if (
            isLightColor(
                customization.color
            )
        ) {

            textPreview.style.color =
                "#111";

        }

        else {

            textPreview.style.color =
                "#fff";

        }

    }


    /*
     * Try to use product images
     * if they exist.
     */

    if (previewImage) {

        const imageMap = {

            tshirt:
                "assets/images/tshirt.png",

            hoodie:
                "assets/images/hoodie.png",

            shirt:
                "assets/images/shirt.png"

        };


        const image =
            imageMap[
                customization.product
            ];


        previewImage.src =
            image;


        previewImage.onerror =
            () => {

                /*
                 * If product image doesn't exist,
                 * use HASHIRA logo.
                 */

                previewImage.src =
                    "assets/images/hashira-logo.jpeg";

            };

    }

}


/* =====================================================
   LIGHT COLOR CHECK
===================================================== */

function isLightColor(hex) {

    const clean =
        hex.replace(
            "#",
            ""
        );


    const r =
        parseInt(
            clean.substring(0, 2),
            16
        );


    const g =
        parseInt(
            clean.substring(2, 4),
            16
        );


    const b =
        parseInt(
            clean.substring(4, 6),
            16
        );


    const brightness =
        (
            r * 299 +
            g * 587 +
            b * 114
        ) / 1000;


    return brightness > 160;

}


/* =====================================================
   PRICE
===================================================== */

function updatePrice() {

    const product =
        products[
            customization.product
        ];


    if (!product) {

        return;

    }


    const productPrice =
        product.price;


    /*
     * Customization fee
     */

    const customizationFee =
        customization.text
            ? 100
            : 100;


    const totalPerItem =
        productPrice +
        customizationFee;


    const total =
        totalPerItem *
        customization.quantity;


    const productPriceElement =
        document.getElementById(
            "productPrice"
        );


    const customizationPriceElement =
        document.getElementById(
            "customizationPrice"
        );


    const totalPriceElement =
        document.getElementById(
            "totalPrice"
        );


    if (productPriceElement) {

        productPriceElement.textContent =
            `₹${(
                productPrice *
                customization.quantity
            ).toLocaleString("en-IN")}`;

    }


    if (
        customizationPriceElement
    ) {

        customizationPriceElement.textContent =
            `₹${(
                customizationFee *
                customization.quantity
            ).toLocaleString("en-IN")}`;

    }


    if (totalPriceElement) {

        totalPriceElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }

}


/* =====================================================
   ADD TO CART
===================================================== */

function setupAddToCart() {

    const button =
        document.getElementById(
            "addCustomizedProduct"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        addCustomizedProduct
    );

}


/* =====================================================
   ADD CUSTOMIZED PRODUCT
===================================================== */

function addCustomizedProduct() {

    const product =
        products[
            customization.product
        ];


    if (!product) {

        showMessage(
            "Please select a product."
        );

        return;

    }


    /*
     * Require size.
     */

    if (!customization.size) {

        showMessage(
            "Please select a size."
        );

        return;

    }


    const customizationFee =
        100;


    const unitPrice =
        product.price +
        customizationFee;


    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "hashiraCart"
                )
            ) || [];

    }

    catch {

        cart = [];

    }


    /*
     * Create unique customized ID.
     */

    const customizedId =
        `custom-${Date.now()}`;


    const customizedProduct = {

        productId:
            customizedId,

        name:
            `${product.name} — Customized`,

        price:
            unitPrice,

        image:
            "assets/images/hashira-logo.jpeg",

        quantity:
            customization.quantity,

        size:
            customization.size,

        color:
            customization.colorName,

        customText:
            customization.text,

        textPosition:
            customization.position,

        customized:
            true

    };


    cart.push(
        customizedProduct
    );


    localStorage.setItem(
        "hashiraCart",
        JSON.stringify(cart)
    );


    /*
     * Success message.
     */

    showMessage(
        "Customized product added to your bag."
    );


    /*
     * Redirect after short delay.
     */

    setTimeout(
        () => {

            window.location.href =
                "cart.html";

        },
        1000
    );

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message) {

    const element =
        document.getElementById(
            "customizeMessage"
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
   EXPORT STATE
===================================================== */

window.hashiraCustomization =
    customization;
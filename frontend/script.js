/* =========================================================
   HASHIRA FASHION STORE
   MAIN WEBSITE + CART + CHECKOUT + CUSTOMIZATION
   ========================================================= */

const API_URL = "http://localhost:5000/api";

const CART_KEY = "hashiraCart";
const WISHLIST_KEY = "hashiraWishlist";
const ORDERS_KEY = "hashiraOrders";

const TOKEN_KEYS = [
    "hashiraUserToken"
];


/* =========================================================
   RANDOM BACKGROUND IMAGES
   IMPORTANT:
   These are ONLY section backgrounds.
   They are NEVER added as products.
   ========================================================= */

const backgrounds = {

    home: [
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=90"
    ],

    men: [
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=2200&q=90"
    ],

    women: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=2200&q=90"
    ],

    customize: [
        "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=90"
    ],

    editorial: [
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=90",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=90"
    ]

};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let products = [];
let cart = [];
let wishlist = [];

let selectedProduct = null;
let selectedSize = null;


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadCart();
    loadWishlist();

    applyBackgrounds();

    setupAnnouncement();
    setupNavigation();
    setupSearch();
    setupMobileMenu();
    setupAccount();

    setupCart();
    setupQuickView();

    setupCustomization();
    setupNewsletter();

    setupCategoryFilters();

    setupCheckoutPage();

    updateCartUI();
    updateWishlistUI();
    updateAccountUI();

    loadProducts();

});


/* =========================================================
   BACKGROUND SYSTEM
   ========================================================= */

function randomImage(list) {

    if (!Array.isArray(list) || list.length === 0) {
        return "";
    }

    return list[
        Math.floor(Math.random() * list.length)
    ];
}


function setBackgroundById(id, list) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    const image = randomImage(list);

    if (!image) {
        return;
    }

    element.style.backgroundImage =
        `linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.25)),url("${image}")`;

    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
}


function setBackgroundByClass(className, list) {

    const elements =
        document.querySelectorAll(className);

    if (!elements.length) {
        return;
    }

    const image = randomImage(list);

    if (!image) {
        return;
    }

    elements.forEach(element => {

        element.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.25)),url("${image}")`;

        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
        element.style.backgroundRepeat = "no-repeat";

    });
}


function applyBackgrounds() {

    /* ID based backgrounds */

    setBackgroundById(
        "heroImage",
        backgrounds.home
    );

    setBackgroundById(
        "menBackground",
        backgrounds.men
    );

    setBackgroundById(
        "womenBackground",
        backgrounds.women
    );

    setBackgroundById(
        "customizeBackground",
        backgrounds.customize
    );

    setBackgroundById(
        "editorialBackground",
        backgrounds.editorial
    );


    /* Class based backgrounds */

    setBackgroundByClass(
        ".hero-image",
        backgrounds.home
    );

    setBackgroundByClass(
        ".men-image",
        backgrounds.men
    );

    setBackgroundByClass(
        ".women-image",
        backgrounds.women
    );

    setBackgroundByClass(
        ".customize-image",
        backgrounds.customize
    );

    setBackgroundByClass(
        ".editorial-image",
        backgrounds.editorial
    );

    setBackgroundByClass(
        ".home-background",
        backgrounds.home
    );

    setBackgroundByClass(
        ".men-background",
        backgrounds.men
    );

    setBackgroundByClass(
        ".women-background",
        backgrounds.women
    );

    setBackgroundByClass(
        ".customize-background",
        backgrounds.customize
    );

}


/* =========================================================
   ANNOUNCEMENT
   ========================================================= */

function setupAnnouncement() {

    const button =
        document.getElementById("closeAnnouncement");

    const announcement =
        document.getElementById("announcement");

    if (!button || !announcement) {
        return;
    }

    button.addEventListener("click", () => {

        announcement.style.display = "none";

    });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener("click", () => {

                document
                    .querySelectorAll(".nav-link")
                    .forEach(item => {

                        item.classList.remove("active");

                    });

                link.classList.add("active");

            });

        });


    document
        .querySelectorAll("[data-filter-link]")
        .forEach(link => {

            link.addEventListener("click", event => {

                const category =
                    link.dataset.filterLink;

                if (!category) {
                    return;
                }

                event.preventDefault();

                filterProducts(category);

                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            });

        });


    /* MEN */

    document
        .querySelectorAll('a[href="#men"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                event.preventDefault();

                filterProducts("men");

                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            });

        });


    /* WOMEN */

    document
        .querySelectorAll('a[href="#women"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                event.preventDefault();

                filterProducts("women");

                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            });

        });


    /* CUSTOMIZATION */

    document
        .querySelectorAll(
            'a[href="#customize"], [data-customize]'
        )
        .forEach(link => {

            link.addEventListener("click", event => {

                event.preventDefault();

                document
                    .getElementById("customize")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            });

        });

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const button =
        document.getElementById("searchButton");

    const panel =
        document.getElementById("searchPanel");

    const close =
        document.getElementById("closeSearch");

    const input =
        document.getElementById("searchInput");

    const results =
        document.getElementById("searchResults");


    if (!button || !panel || !input || !results) {
        return;
    }


    button.addEventListener("click", () => {

        panel.classList.add("show");

        document.body.classList.add("no-scroll");

        setTimeout(() => {
            input.focus();
        }, 100);

    });


    close?.addEventListener(
        "click",
        closeSearchPanel
    );


    input.addEventListener("input", () => {

        const query =
            input.value
                .trim()
                .toLowerCase();


        if (!query) {

            results.innerHTML = "";

            return;

        }


        const matches =
            products.filter(product => {

                const name =
                    String(product.name || "")
                        .toLowerCase();

                const type =
                    String(product.type || "")
                        .toLowerCase();

                const category =
                    String(product.category || "")
                        .toLowerCase();

                return (
                    name.includes(query) ||
                    type.includes(query) ||
                    category.includes(query)
                );

            });


        if (!matches.length) {

            results.innerHTML =
                "<p>No products found.</p>";

            return;

        }


        results.innerHTML =
            matches
                .slice(0, 10)
                .map(product => {

                    return `
                        <button
                            type="button"
                            class="search-result"
                            data-product-id="${escapeAttribute(
                                getProductId(product)
                            )}">
                            ${escapeHTML(
                                product.name || "Product"
                            )}
                        </button>
                    `;

                })
                .join("");


        results
            .querySelectorAll("[data-product-id]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const product =
                        findProduct(
                            button.dataset.productId
                        );

                    if (product) {

                        closeSearchPanel();

                        openQuickView(product);

                    }

                });

            });

    });

}


function closeSearchPanel() {

    const panel =
        document.getElementById("searchPanel");

    panel?.classList.remove("show");

    document.body.classList.remove("no-scroll");

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById("mobileMenuButton");

    const menu =
        document.getElementById("mobileMenu");

    const close =
        document.getElementById("closeMobileMenu");


    if (!button || !menu) {
        return;
    }


    button.addEventListener("click", () => {

        menu.classList.add("show");

        document.body.classList.add("no-scroll");

    });


    close?.addEventListener(
        "click",
        closeMobileMenu
    );


    menu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });

}


function closeMobileMenu() {

    document
        .getElementById("mobileMenu")
        ?.classList.remove("show");

    document.body.classList.remove("no-scroll");

}


/* =========================================================
   ACCOUNT
   ========================================================= */

function getToken() {

    for (const key of TOKEN_KEYS) {

        const local =
            localStorage.getItem(key);

        if (local) {
            return local;
        }


        const session =
            sessionStorage.getItem(key);

        if (session) {
            return session;
        }

    }

    return null;
}


function getUser() {

    const local =
        localStorage.getItem("hashiraUser");

    if (local) {

        try {
            return JSON.parse(local);
        }
        catch {}
    }


    const session =
        sessionStorage.getItem("hashiraUser");

    if (session) {

        try {
            return JSON.parse(session);
        }
        catch {}
    }


    return null;

}


function setupAccount() {

    const account =
        document.getElementById("userAccount");

    const dropdown =
        document.getElementById("accountDropdown");

    const logout =
        document.getElementById("logoutButton");

    const orders =
        document.getElementById("ordersButton");


    account?.addEventListener("click", event => {

        event.stopPropagation();

        dropdown?.classList.toggle("show");

    });


    document.addEventListener("click", event => {

        if (
            dropdown &&
            !event.target.closest(".account-area")
        ) {

            dropdown.classList.remove("show");

        }

    });


    logout?.addEventListener(
        "click",
        logoutUser
    );


    orders?.addEventListener("click", () => {

        window.location.href = "orders.html";

    });

}


function updateAccountUI() {

    const token = getToken();
    const user = getUser();

    const login =
        document.getElementById("loginLink");

    const account =
        document.getElementById("userAccount");

    const name =
        document.getElementById("userName");

    const avatar =
        document.getElementById("userAvatar");

    const accountName =
        document.getElementById("accountUserName");

    const accountEmail =
        document.getElementById("accountUserEmail");


    if (token && user) {

        if (login) {
            login.style.display = "none";
        }

        if (account) {
            account.style.display = "flex";
        }

        const userName =
            user.name || "User";

        if (name) {
            name.textContent = userName;
        }

        if (avatar) {
            avatar.textContent =
                userName
                    .charAt(0)
                    .toUpperCase();
        }

        if (accountName) {
            accountName.textContent =
                userName;
        }

        if (accountEmail) {
            accountEmail.textContent =
                user.email || "";
        }

    }
    else {

        if (login) {
            login.style.display = "inline";
        }

        if (account) {
            account.style.display = "none";
        }

    }

}


function logoutUser() {

    localStorage.removeItem(
        "hashiraUserToken"
    );

    sessionStorage.removeItem(
        "hashiraUserToken"
    );

    localStorage.removeItem(
        "hashiraUser"
    );

    sessionStorage.removeItem(
        "hashiraUser"
    );

    updateAccountUI();

    showToast(
        "Signed out successfully."
    );

}


/* =========================================================
   PRODUCTS
   ========================================================= */

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_URL}/products`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products."
            );

        }


        const data =
            await response.json();


        const received =
            Array.isArray(data)
                ? data
                : Array.isArray(data.products)
                    ? data.products
                    : [];


        /*
         * IMPORTANT:
         *
         * Only MEN and WOMEN products are displayed.
         *
         * Random background images are NOT products.
         */

        products =
            received
                .filter(product => {

                    const category =
                        String(
                            product.category || ""
                        )
                            .trim()
                            .toLowerCase();

                    return (
                        category === "men" ||
                        category === "women"
                    );

                })
                .map(product => {

                    return {
                        ...product,

                        category:
                            String(
                                product.category || ""
                            )
                                .trim()
                                .toLowerCase()

                    };

                });


        renderProducts(products);

        updateCheckoutSummary();

    }
    catch (error) {

        console.error(
            "HASHIRA product loading error:",
            error
        );

        renderProductError();

    }

}


/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function isUploadedImage(image) {

    if (
        !image ||
        typeof image !== "string"
    ) {
        return false;
    }

    const value =
        image.trim();

    if (!value) {
        return false;
    }

    /*
     * Admin-uploaded Base64 image.
     */

    if (
        value.startsWith("data:image/")
    ) {
        return true;
    }

    /*
     * Local uploaded assets.
     */

    if (
        value.startsWith("assets/") ||
        value.startsWith("./assets/") ||
        value.startsWith("../assets/")
    ) {
        return true;
    }

    /*
     * Backend uploaded image.
     */

    if (
        value.startsWith("/uploads/") ||
        value.startsWith("uploads/")
    ) {
        return true;
    }

    /*
     * Existing absolute uploaded/backend image.
     *
     * We allow it because your admin/backend may
     * return an absolute URL for an uploaded image.
     */

    if (
        value.startsWith("http://localhost:5000/") ||
        value.startsWith("https://localhost:5000/")
    ) {
        return true;
    }

    /*
     * Reject unrelated external images.
     */

    return false;

}


function normalizeImageUrl(image) {

    if (!image) {
        return "";
    }

    const value =
        String(image).trim();


    if (
        value.startsWith("data:image/")
    ) {
        return value;
    }


    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }


    if (
        value.startsWith("/uploads/")
    ) {

        return (
            "http://localhost:5000" +
            value
        );

    }


    if (
        value.startsWith("uploads/")
    ) {

        return (
            "http://localhost:5000/" +
            value
        );

    }


    return value;

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(list) {

    const grid =
        document.getElementById("productGrid");

    const empty =
        document.getElementById("emptyProducts");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (
        !Array.isArray(list) ||
        !list.length
    ) {

        if (empty) {
            empty.style.display = "block";
        }

        return;

    }


    if (empty) {
        empty.style.display = "none";
    }


    list.forEach(product => {

        grid.appendChild(
            createProductCard(product)
        );

    });

}


function renderProductError() {

    const grid =
        document.getElementById("productGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = `
        <div class="product-loading">
            <p>COLLECTION COULD NOT BE LOADED.</p>
            <small>
                Make sure your backend is running on port 5000.
            </small>
        </div>
    `;

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className =
        "product-card";


    const id =
        getProductId(product);

    const name =
        product.name || "HASHIRA Product";

    const price =
        Number(product.price || 0);

    const image =
        normalizeImageUrl(product.image);

    const category =
        normalizeCategory(product.category);

    const stock =
        Number(product.stock || 0);


    let badges = "";


    if (product.isNew) {

        badges += `
            <span class="product-badge">
                NEW
            </span>
        `;

    }


    if (product.sale) {

        badges += `
            <span class="product-badge">
                SALE
            </span>
        `;

    }


    let stockText = "IN STOCK";


    if (stock <= 0) {

        stockText = "OUT OF STOCK";

    }
    else if (stock <= 5) {

        stockText =
            `ONLY ${stock} LEFT`;

    }


    card.innerHTML = `

        <div class="product-image">

            ${
                image
                    ? `
                        <img
                            src="${escapeAttribute(image)}"
                            alt="${escapeAttribute(name)}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div class="no-product-image">
                            IMAGE UNAVAILABLE
                        </div>
                    `
            }

            <div class="product-badges">
                ${badges}
            </div>

            <button
                class="add-cart"
                type="button"
                data-product-id="${escapeAttribute(id)}"
                ${stock <= 0 ? "disabled" : ""}
            >
                ${
                    stock <= 0
                        ? "OUT OF STOCK"
                        : "ADD +"
                }
            </button>

        </div>


        <div class="product-info">

            <p class="product-category">
                ${escapeHTML(category)}
            </p>

            <h3>
                ${escapeHTML(name)}
            </h3>

            <p class="product-type">
                ${escapeHTML(
                    product.type || "Clothing"
                )}
            </p>

            <div class="product-price">
                ₹${price.toLocaleString("en-IN")}
            </div>

            <p class="product-stock">
                ${stockText}
            </p>

        </div>

    `;


    const add =
        card.querySelector(".add-cart");


    add?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const current =
                findProduct(
                    add.dataset.productId
                );

            if (current) {

                addProductToCart(
                    current
                );

            }

        }
    );


    card
        .querySelector(".product-image")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".add-cart"
                    )
                ) {
                    return;
                }

                openQuickView(product);

            }
        );


    return card;

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function setupCategoryFilters() {

    document
        .querySelectorAll(".category-tab")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-tab"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    filterProducts(
                        button.dataset.category
                    );

                }
            );

        });

}


function filterProducts(category) {

    if (
        !category ||
        category === "all"
    ) {

        renderProducts(products);

        return;

    }


    const normalized =
        String(category)
            .trim()
            .toLowerCase();


    const filtered =
        products.filter(product => {

            return (
                String(
                    product.category || ""
                )
                    .trim()
                    .toLowerCase() ===
                normalized
            );

        });


    renderProducts(filtered);

}


/* =========================================================
   QUICK VIEW
   ========================================================= */

function setupQuickView() {

    const close =
        document.getElementById("quickClose");

    const overlay =
        document.getElementById(
            "quickViewOverlay"
        );

    const add =
        document.getElementById("quickAdd");


    close?.addEventListener(
        "click",
        closeQuickView
    );


    overlay?.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeQuickView();

            }

        }
    );


    add?.addEventListener(
        "click",
        () => {

            if (!selectedProduct) {
                return;
            }

            addProductToCart(
                selectedProduct,
                selectedSize
            );

            closeQuickView();

        }
    );

}


function openQuickView(product) {

    selectedProduct =
        product;


    const overlay =
        document.getElementById(
            "quickViewOverlay"
        );

    if (!overlay) {
        return;
    }


    const image =
        document.getElementById(
            "quickImage"
        );

    const category =
        document.getElementById(
            "quickCategory"
        );

    const name =
        document.getElementById(
            "quickName"
        );

    const price =
        document.getElementById(
            "quickPrice"
        );

    const description =
        document.getElementById(
            "quickDescription"
        );

    const sizes =
        document.getElementById(
            "quickSizes"
        );


    if (image) {

        const imageUrl =
            normalizeImageUrl(
                product.image
            );

        image.style.backgroundImage =
            imageUrl
                ? `url("${imageUrl}")`
                : "none";

    }


    if (category) {

        category.textContent =
            normalizeCategory(
                product.category
            );

    }


    if (name) {

        name.textContent =
            product.name ||
            "HASHIRA Product";

    }


    if (price) {

        price.textContent =
            `₹${Number(
                product.price || 0
            ).toLocaleString("en-IN")}`;

    }


    if (description) {

        description.textContent =
            product.description ||
            "A contemporary HASHIRA piece designed for modern style.";

    }


    if (sizes) {

        const availableSizes =
            Array.isArray(product.sizes) &&
            product.sizes.length
                ? product.sizes
                : ["M"];


        selectedSize =
            availableSizes[0];


        sizes.innerHTML =
            availableSizes
                .map(size => {

                    return `
                        <button
                            type="button"
                            class="size-button ${
                                size === selectedSize
                                    ? "active"
                                    : ""
                            }"
                            data-size="${escapeAttribute(size)}">
                            ${escapeHTML(size)}
                        </button>
                    `;

                })
                .join("");


        sizes
            .querySelectorAll(
                ".size-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        sizes
                            .querySelectorAll(
                                ".size-button"
                            )
                            .forEach(item => {

                                item.classList.remove(
                                    "active"
                                );

                            });


                        button.classList.add(
                            "active"
                        );


                        selectedSize =
                            button.dataset.size;

                    }
                );

            });

    }


    overlay.classList.add("show");

}


function closeQuickView() {

    document
        .getElementById("quickViewOverlay")
        ?.classList.remove("show");

    selectedProduct = null;
    selectedSize = null;

}


/* =========================================================
   CART STORAGE
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                CART_KEY
            );

        cart =
            saved
                ? JSON.parse(saved)
                : [];


        if (!Array.isArray(cart)) {
            cart = [];
        }

    }
    catch {

        cart = [];

    }

}


function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   ADD PRODUCT TO CART
   ========================================================= */

function addProductToCart(
    product,
    size = null
) {

    const stock =
        Number(product.stock || 0);


    if (stock <= 0) {

        showToast(
            "This product is out of stock."
        );

        return;

    }


    const productId =
        getProductId(product);


    const finalSize =
        size ||
        (
            Array.isArray(product.sizes) &&
            product.sizes.length
                ? product.sizes[0]
                : "M"
        );


    const existing =
        cart.find(item => {

            return (
                String(item.productId) ===
                    String(productId) &&
                String(item.size) ===
                    String(finalSize)
            );

        });


    if (existing) {

        if (
            Number(existing.quantity) >=
            stock
        ) {

            showToast(
                "Maximum available stock reached."
            );

            return;

        }


        existing.quantity += 1;

    }
    else {

        cart.push({

            productId:
                productId,

            name:
                product.name,

            price:
                Number(product.price || 0),

            image:
                product.image || "",

            quantity:
                1,

            size:
                finalSize,

            stock:
                stock

        });

    }


    saveCart();

    updateCartUI();

    openCart();

    showToast(
        "Product added to your bag."
    );

}


/* =========================================================
   CART UI
   ========================================================= */

function updateCartUI() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const count =
        document.getElementById(
            "cartCount"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    const quantity =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.quantity || 0
                ),
            0
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.price || 0
                ) *
                Number(
                    item.quantity || 0
                ),
            0
        );


    if (count) {

        count.textContent =
            quantity;

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }


    if (!container) {
        return;
    }


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <p>
                    Your bag is empty.
                </p>

                <button
                    type="button"
                    id="continueShopping">
                    CONTINUE SHOPPING
                </button>

            </div>

        `;


        document
            .getElementById(
                "continueShopping"
            )
            ?.addEventListener(
                "click",
                closeCart
            );


        return;

    }


    container.innerHTML =
        cart
            .map(
                (item, index) => {

                    const image =
                        normalizeImageUrl(
                            item.image
                        );


                    return `

                        <div class="cart-item">

                            ${
                                image
                                    ? `
                                        <img
                                            class="cart-item-image"
                                            src="${escapeAttribute(image)}"
                                            alt="${escapeAttribute(item.name)}"
                                        >
                                    `
                                    : `
                                        <div class="cart-item-image no-image">
                                            HASHIRA
                                        </div>
                                    `
                            }

                            <div class="cart-item-info">

                                <h3>
                                    ${escapeHTML(
                                        item.name
                                    )}
                                </h3>

                                <p>
                                    ₹${Number(
                                        item.price || 0
                                    ).toLocaleString("en-IN")}
                                </p>

                                <p>
                                    SIZE:
                                    ${escapeHTML(
                                        item.size || "M"
                                    )}
                                </p>

                                <div class="cart-quantity">

                                    <button
                                        type="button"
                                        data-cart-action="minus"
                                        data-index="${index}">
                                        −
                                    </button>

                                    <span>
                                        ${item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        data-cart-action="plus"
                                        data-index="${index}">
                                        +
                                    </button>

                                </div>

                            </div>


                            <button
                                type="button"
                                class="remove-item"
                                data-cart-action="remove"
                                data-index="${index}">
                                ×
                            </button>

                        </div>

                    `;

                }
            )
            .join("");


    container
        .querySelectorAll(
            "[data-cart-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.cartAction;

                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (
                        action === "plus"
                    ) {

                        changeCartQuantity(
                            index,
                            1
                        );

                    }
                    else if (
                        action === "minus"
                    ) {

                        changeCartQuantity(
                            index,
                            -1
                        );

                    }
                    else if (
                        action === "remove"
                    ) {

                        removeCartItem(
                            index
                        );

                    }

                }
            );

        });

}


/* =========================================================
   CART QUANTITY
   ========================================================= */

function changeCartQuantity(
    index,
    amount
) {

    const item =
        cart[index];

    if (!item) {
        return;
    }


    const newQuantity =
        Number(item.quantity) +
        amount;


    if (newQuantity <= 0) {

        removeCartItem(index);

        return;

    }


    const stock =
        Number(item.stock || 999);


    if (newQuantity > stock) {

        showToast(
            "Maximum available stock reached."
        );

        return;

    }


    item.quantity =
        newQuantity;


    saveCart();

    updateCartUI();

}


/* =========================================================
   REMOVE CART ITEM
   ========================================================= */

function removeCartItem(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    cart.splice(
        index,
        1
    );


    saveCart();

    updateCartUI();

    showToast(
        "Item removed."
    );

}


/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function setupCart() {

    const button =
        document.getElementById(
            "cartButton"
        );

    const footer =
        document.getElementById(
            "footerCartButton"
        );

    const close =
        document.getElementById(
            "closeCart"
        );

    const overlay =
        document.getElementById(
            "drawerOverlay"
        );


    button?.addEventListener(
        "click",
        openCart
    );

    footer?.addEventListener(
        "click",
        openCart
    );

    close?.addEventListener(
        "click",
        closeCart
    );

    overlay?.addEventListener(
        "click",
        closeCart
    );

}


function openCart() {

    document
        .getElementById("cartDrawer")
        ?.classList.add("show");

    document
        .getElementById("drawerOverlay")
        ?.classList.add("show");

}


function closeCart() {

    document
        .getElementById("cartDrawer")
        ?.classList.remove("show");

    document
        .getElementById("drawerOverlay")
        ?.classList.remove("show");

}


/* =========================================================
   CHECKOUT BUTTON FROM CART
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "#checkoutButton"
            );

        if (!button) {
            return;
        }


        event.preventDefault();


        if (!cart.length) {

            showToast(
                "Your bag is empty."
            );

            return;

        }


        /*
         * Your current project uses a separate checkout.html.
         */

        window.location.href =
            "checkout.html";

    }
);


/* =========================================================
   CHECKOUT PAGE
   ========================================================= */

function setupCheckoutPage() {

    /*
     * If we are not on checkout.html,
     * do nothing.
     */

    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );


    if (!checkoutForm) {
        return;
    }


    renderCheckoutPage();


    /*
     * Payment method changes.
     */

    setupPaymentMethods();


    /*
     * Submit / PLACE ORDER
     */

    checkoutForm.addEventListener(
        "submit",
        handleCheckoutSubmit
    );


    /*
     * Some checkout designs use a button
     * instead of form submit.
     */

    const placeButton =
        document.getElementById(
            "placeOrderButton"
        );


    if (
        placeButton &&
        placeButton.type !== "submit"
    ) {

        placeButton.addEventListener(
            "click",
            handleCheckoutSubmit
        );

    }

}


/* =========================================================
   CHECKOUT SUMMARY
   ========================================================= */

function renderCheckoutPage() {

    loadCart();


    const itemCount =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.quantity || 0
                ),
            0
        );


    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.price || 0
                ) *
                Number(
                    item.quantity || 0
                ),
            0
        );


    /*
     * Free shipping over ₹2000.
     * Otherwise ₹99.
     */

    const shipping =
        subtotal >= 2000
            ? 0
            : 99;


    const total =
        subtotal +
        shipping;


    setText(
        "checkoutItemCount",
        itemCount
    );

    setText(
        "checkoutSubtotal",
        `₹${subtotal.toLocaleString("en-IN")}`
    );

    setText(
        "checkoutShipping",
        shipping === 0
            ? "FREE"
            : `₹${shipping}`
    );

    setText(
        "checkoutGrandTotal",
        `₹${total.toLocaleString("en-IN")}`
    );


    /*
     * Alternate IDs used by some versions
     * of your checkout.html.
     */

    setText(
        "subtotal",
        `₹${subtotal.toLocaleString("en-IN")}`
    );

    setText(
        "shipping",
        shipping === 0
            ? "FREE"
            : `₹${shipping}`
    );

    setText(
        "total",
        `₹${total.toLocaleString("en-IN")}`
    );


    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (!container) {
        return;
    }


    if (!cart.length) {

        container.innerHTML = `
            <p class="empty-checkout">
                Your bag is empty.
            </p>
        `;

        return;

    }


    container.innerHTML =
        cart
            .map(item => {

                const image =
                    normalizeImageUrl(
                        item.image
                    );


                return `

                    <div class="checkout-item">

                        ${
                            image
                                ? `
                                    <img
                                        src="${escapeAttribute(image)}"
                                        alt="${escapeAttribute(item.name)}"
                                    >
                                `
                                : ""
                        }

                        <div>

                            <strong>
                                ${escapeHTML(
                                    item.name
                                )}
                            </strong>

                            <p>
                                Size:
                                ${escapeHTML(
                                    item.size || "M"
                                )}
                            </p>

                            <p>
                                Qty:
                                ${Number(
                                    item.quantity || 0
                                )}
                            </p>

                        </div>

                        <strong>
                            ₹${(
                                Number(item.price || 0) *
                                Number(item.quantity || 0)
                            ).toLocaleString("en-IN")}
                        </strong>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   PAYMENT METHODS
   ========================================================= */

function setupPaymentMethods() {

    /*
     * Supports:
     *
     * input[name="paymentMethod"]
     * input[name="payment"]
     * input[name="payment-method"]
     *
     * Therefore you don't get
     * "Invalid payment method".
     */

    const paymentInputs =
        document.querySelectorAll(
            `
            input[name="paymentMethod"],
            input[name="payment"],
            input[name="payment-method"],
            input[type="radio"][value="cod"],
            input[type="radio"][value="upi"],
            input[type="radio"][value="card"]
            `
        );


    paymentInputs.forEach(input => {

        input.addEventListener(
            "change",
            updatePaymentFields
        );

    });


    updatePaymentFields();

}


/* =========================================================
   PAYMENT FIELD DISPLAY
   ========================================================= */

function updatePaymentFields() {

    const method =
        getPaymentMethod();


    const upi =
        document.getElementById(
            "upiDetails"
        ) ||
        document.getElementById(
            "upiFields"
        ) ||
        document.querySelector(
            ".upi-details"
        );


    const card =
        document.getElementById(
            "cardDetails"
        ) ||
        document.getElementById(
            "cardFields"
        ) ||
        document.querySelector(
            ".card-details"
        );


    if (upi) {

        upi.style.display =
            method === "upi"
                ? "block"
                : "none";

    }


    if (card) {

        card.style.display =
            method === "card"
                ? "block"
                : "none";

    }

}


/* =========================================================
   GET PAYMENT METHOD
   ========================================================= */

function getPaymentMethod() {

    const checked =
        document.querySelector(
            `
            input[name="paymentMethod"]:checked,
            input[name="payment"]:checked,
            input[name="payment-method"]:checked
            `
        );


    if (!checked) {

        /*
         * Try buttons.
         */

        const active =
            document.querySelector(
                `
                [data-payment-method].active,
                [data-payment].active
                `
            );


        if (active) {

            return normalizePaymentMethod(
                active.dataset.paymentMethod ||
                active.dataset.payment
            );

        }


        /*
         * Default to COD.
         *
         * This prevents invalid payment
         * method errors if the checkout
         * page doesn't have a selected
         * radio on first load.
         */

        return "cod";

    }


    return normalizePaymentMethod(
        checked.value ||
        checked.dataset.paymentMethod ||
        checked.dataset.payment
    );

}


/* =========================================================
   NORMALIZE PAYMENT
   ========================================================= */

function normalizePaymentMethod(value) {

    const method =
        String(value || "")
            .trim()
            .toLowerCase();


    if (
        method === "cod" ||
        method === "cash" ||
        method.includes("cash")
    ) {

        return "cod";

    }


    if (
        method === "upi" ||
        method.includes("upi")
    ) {

        return "upi";

    }


    if (
        method === "card" ||
        method.includes("credit") ||
        method.includes("debit")
    ) {

        return "card";

    }


    /*
     * Never return "invalid".
     *
     * Default to COD.
     */

    return "cod";

}


/* =========================================================
   CHECKOUT SUBMIT
   ========================================================= */

async function handleCheckoutSubmit(event) {

    if (event) {
        event.preventDefault();
    }


    loadCart();


    if (!cart.length) {

        showCheckoutMessage(
            "Your bag is empty.",
            false
        );

        return;

    }


    /*
     * Get all checkout fields safely.
     */

    const name =
        getInputValue([
            "checkoutName",
            "name",
            "fullName"
        ]);


    const email =
        getInputValue([
            "checkoutEmail",
            "email"
        ]);


    const phone =
        getInputValue([
            "checkoutPhone",
            "phone",
            "mobile"
        ]);


    const address =
        getInputValue([
            "checkoutAddress",
            "address",
            "shippingAddress"
        ]);


    const city =
        getInputValue([
            "checkoutCity",
            "city"
        ]);


    const state =
        getInputValue([
            "checkoutState",
            "state"
        ]);


    const pincode =
        getInputValue([
            "checkoutPincode",
            "pincode",
            "zip",
            "postalCode"
        ]);


    const paymentMethod =
        getPaymentMethod();


    /*
     * VALIDATION
     */

    if (name && name.length < 2) {

        showCheckoutMessage(
            "Please enter your full name.",
            false
        );

        focusFirst([
            "checkoutName",
            "name",
            "fullName"
        ]);

        return;

    }


    if (
        email &&
        !isValidEmail(email)
    ) {

        showCheckoutMessage(
            "Please enter a valid email address.",
            false
        );

        focusFirst([
            "checkoutEmail",
            "email"
        ]);

        return;

    }


    if (
        phone &&
        !/^[0-9]{10}$/.test(
            phone.replace(/\s+/g, "")
        )
    ) {

        showCheckoutMessage(
            "Enter a valid 10 digit phone number.",
            false
        );

        focusFirst([
            "checkoutPhone",
            "phone",
            "mobile"
        ]);

        return;

    }


    /*
     * SHIPPING ADDRESS
     *
     * This is the important fix for
     * "Shipping address required".
     */

    if (!address) {

        showCheckoutMessage(
            "Shipping address is required.",
            false
        );

        focusFirst([
            "checkoutAddress",
            "address",
            "shippingAddress"
        ]);

        return;

    }


    if (address.length < 10) {

        showCheckoutMessage(
            "Please enter your complete shipping address.",
            false
        );

        focusFirst([
            "checkoutAddress",
            "address",
            "shippingAddress"
        ]);

        return;

    }


    if (
        pincode &&
        !/^[0-9]{6}$/.test(
            pincode
        )
    ) {

        showCheckoutMessage(
            "Enter a valid 6 digit pincode.",
            false
        );

        focusFirst([
            "checkoutPincode",
            "pincode",
            "zip",
            "postalCode"
        ]);

        return;

    }


    /*
     * PAYMENT
     *
     * COD / UPI / CARD all accepted.
     */

    if (
        ![
            "cod",
            "upi",
            "card"
        ].includes(
            paymentMethod
        )
    ) {

        showCheckoutMessage(
            "Please select a payment method.",
            false
        );

        return;

    }


    /*
     * UPI DEMO VALIDATION
     */

    if (paymentMethod === "upi") {

        const upi =
            getInputValue([
                "upiId",
                "upi",
                "upiAddress"
            ]);


        if (
            upi &&
            !/^[\w.-]+@[\w.-]+$/.test(
                upi
            )
        ) {

            showCheckoutMessage(
                "Enter a valid UPI ID.",
                false
            );

            focusFirst([
                "upiId",
                "upi",
                "upiAddress"
            ]);

            return;

        }

    }


    /*
     * CARD DEMO VALIDATION
     *
     * We do NOT connect to a real payment gateway.
     */

    if (paymentMethod === "card") {

        const cardNumber =
            getInputValue([
                "cardNumber",
                "card-number"
            ]);


        const expiry =
            getInputValue([
                "expiry",
                "cardExpiry",
                "card-expiry"
            ]);


        const cvv =
            getInputValue([
                "cvv",
                "cardCvv",
                "card-cvv"
            ]);


        if (
            cardNumber &&
            !/^[0-9\s]{12,19}$/.test(
                cardNumber
            )
        ) {

            showCheckoutMessage(
                "Enter a valid card number.",
                false
            );

            return;

        }


        if (
            expiry &&
            !/^[0-9]{2}\/?[0-9]{2,4}$/.test(
                expiry
            )
        ) {

            showCheckoutMessage(
                "Enter a valid card expiry date.",
                false
            );

            return;

        }


        if (
            cvv &&
            !/^[0-9]{3,4}$/.test(
                cvv
            )
        ) {

            showCheckoutMessage(
                "Enter a valid CVV.",
                false
            );

            return;

        }

    }


    /*
     * DISABLE PLACE ORDER BUTTON
     */

    const button =
        document.getElementById(
            "placeOrderButton"
        ) ||
        document.querySelector(
            'button[type="submit"]'
        );


    if (button) {

        button.disabled = true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "PLACING ORDER...";

    }


    showCheckoutMessage(
        "Processing your order...",
        true
    );


    /*
     * CALCULATE TOTAL
     */

    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );


    const shipping =
        subtotal >= 2000
            ? 0
            : 99;


    const total =
        subtotal +
        shipping;


    /*
     * ORDER OBJECT
     */

    const orderId =
        "HASHIRA-" +
        Date.now();


    const order = {

        orderId:

            orderId,

        customer: {

            name:
                name,

            email:
                email,

            phone:
                phone

        },

        shippingAddress: {

            address:
                address,

            city:
                city,

            state:
                state,

            pincode:
                pincode

        },

        paymentMethod:

            paymentMethod,

        paymentStatus:

            paymentMethod === "cod"
                ? "PENDING"
                : "DEMO PAID",

        items:

            cart.map(item => {

                return {

                    productId:
                        item.productId,

                    name:
                        item.name,

                    price:
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 0
                        ),

                    size:
                        item.size || "M",

                    image:
                        item.image || ""

                };

            }),

        subtotal:

            subtotal,

        shipping:

            shipping,

        total:

            total,

        status:

            "PLACED",

        createdAt:

            new Date().toISOString()

    };


    /*
     * TRY BACKEND FIRST
     *
     * If backend accepts it,
     * save the returned order.
     *
     * If backend doesn't accept the
     * payment field, we still have
     * the local fallback.
     */

    let backendSuccess = false;

    let backendData = null;


    try {

        const token =
            getToken();


        if (token) {

            const response =
                await fetch(
                    `${API_URL}/orders`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                phone:
                                    phone,

                                address:
                                    address,

                                pincode:
                                    pincode,

                                items:
                                    cart.map(item => {

                                        return {

                                            productId:
                                                item.productId,

                                            quantity:
                                                Number(
                                                    item.quantity
                                                ),

                                            size:
                                                item.size ||
                                                "M"

                                        };

                                    })

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


            if (response.ok) {

                backendSuccess =
                    true;

                backendData =
                    data;

            }

        }

    }
    catch (error) {

        console.warn(
            "Backend order request failed. Using local order storage.",
            error
        );

    }


    /*
     * SAVE ORDER LOCALLY
     *
     * This guarantees that the order
     * exists even when the demo payment
     * isn't connected to a real gateway.
     */

    saveOrderLocally(
        {
            ...order,

            backendSuccess:
                backendSuccess,

            backendOrder:
                backendData?.order ||
                null

        }
    );


    /*
     * CLEAR CART
     */

    cart = [];

    localStorage.removeItem(
        CART_KEY
    );

    updateCartUI();


    /*
     * SUCCESS
     */

    showCheckoutMessage(
        "Order placed successfully!",
        true
    );


    /*
     * REDIRECT
     */

    setTimeout(() => {

        redirectAfterOrder(
            order,
            backendData
        );

    }, 1000);

}


/* =========================================================
   SAVE ORDER
   ========================================================= */

function saveOrderLocally(order) {

    let orders = [];


    try {

        const saved =
            localStorage.getItem(
                ORDERS_KEY
            );

        orders =
            saved
                ? JSON.parse(saved)
                : [];

        if (!Array.isArray(orders)) {
            orders = [];
        }

    }
    catch {

        orders = [];

    }


    orders.unshift(order);


    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );


    /*
     * Also keep the latest order separately.
     */

    localStorage.setItem(
        "hashiraLastOrder",
        JSON.stringify(order)
    );

}


/* =========================================================
   ORDER SUCCESS REDIRECT
   ========================================================= */

function redirectAfterOrder(
    order,
    backendData
) {

    /*
     * Save order ID so success page can show it.
     */

    localStorage.setItem(
        "hashiraLastOrderId",
        order.orderId
    );


    /*
     * If your success page exists,
     * go there.
     */

    const successPages = [
        "order-success.html",
        "success.html",
        "order-success.htm"
    ];


    /*
     * We cannot test filesystem existence
     * reliably from browser.
     *
     * Use your standard page first.
     */

    window.location.href =
        "order-success.html";

}


/* =========================================================
   CHECKOUT MESSAGE
   ========================================================= */

function showCheckoutMessage(
    message,
    success = false
) {

    const elements = [

        document.getElementById(
            "checkoutMessage"
        ),

        document.getElementById(
            "paymentMessage"
        ),

        document.getElementById(
            "formMessage"
        )

    ].filter(Boolean);


    if (!elements.length) {

        if (message) {
            showToast(message);
        }

        return;

    }


    elements.forEach(element => {

        element.textContent =
            message;


        element.classList.toggle(
            "success",
            Boolean(success)
        );


        element.classList.toggle(
            "error",
            !success
        );

    });

}


/* =========================================================
   CHECKOUT INPUT HELPERS
   ========================================================= */

function getInputValue(ids) {

    for (const id of ids) {

        const element =
            document.getElementById(id);


        if (
            element &&
            typeof element.value === "string"
        ) {

            return element.value.trim();

        }

    }


    return "";

}


function focusFirst(ids) {

    for (const id of ids) {

        const element =
            document.getElementById(id);

        if (element) {

            element.focus();

            return;

        }

    }

}


/* =========================================================
   CUSTOMIZATION
   ========================================================= */

function setupCustomization() {

    const button =
        document.getElementById(
            "customizeButton"
        );

    const builder =
        document.getElementById(
            "customBuilder"
        );


    if (
        button &&
        builder
    ) {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                builder.classList.add(
                    "show"
                );

                setTimeout(() => {

                    builder.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 50);

            }
        );

    }


    setupGarment();
    setupColors();
    setupCustomText();
    setupCustomCart();

}


/* =========================================================
   CUSTOM GARMENT
   ========================================================= */

function setupGarment() {

    const type =
        document.getElementById(
            "garmentType"
        );

    const preview =
        document.getElementById(
            "previewGarment"
        );


    if (
        !type ||
        !preview
    ) {
        return;
    }


    type.addEventListener(
        "change",
        () => {

            if (
                type.value ===
                "Hoodie"
            ) {

                preview.style.width =
                    "390px";

                preview.style.height =
                    "440px";

                preview.style.borderRadius =
                    "35px 35px 15px 15px";

            }
            else if (
                type.value ===
                "Jacket"
            ) {

                preview.style.width =
                    "350px";

                preview.style.height =
                    "450px";

                preview.style.borderRadius =
                    "15px";

            }
            else if (
                type.value ===
                "Shirt"
            ) {

                preview.style.width =
                    "360px";

                preview.style.height =
                    "420px";

                preview.style.borderRadius =
                    "18px";

            }
            else {

                preview.style.width =
                    "360px";

                preview.style.height =
                    "400px";

                preview.style.borderRadius =
                    "25px";

            }

        }
    );

}


/* =========================================================
   CUSTOM COLORS
   ========================================================= */

function setupColors() {

    const options =
        document.querySelectorAll(
            ".color-option"
        );

    const preview =
        document.getElementById(
            "previewGarment"
        );


    options.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                options.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                option.classList.add(
                    "active"
                );


                const color =
                    option.dataset.color;


                if (preview && color) {

                    preview.style.background =
                        color;

                    preview.style.color =
                        isLightColor(color)
                            ? "#111"
                            : "#fff";

                }

            }
        );

    });

}


/* =========================================================
   CUSTOM TEXT
   ========================================================= */

function setupCustomText() {

    const input =
        document.getElementById(
            "customText"
        );

    const preview =
        document.getElementById(
            "previewText"
        );


    if (
        !input ||
        !preview
    ) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            preview.textContent =
                input.value.trim() ||
                "HASHIRA";

        }
    );

}


/* =========================================================
   ADD CUSTOM DESIGN
   ========================================================= */

function setupCustomCart() {

    const button =
        document.getElementById(
            "addCustomCart"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const type =
                document.getElementById(
                    "garmentType"
                )?.value ||
                "Hoodie";


            const text =
                document.getElementById(
                    "customText"
                )?.value
                    .trim() ||
                "HASHIRA";


            const activeColor =
                document.querySelector(
                    ".color-option.active"
                );


            const color =
                activeColor?.dataset.color ||
                "#111111";


            cart.push({

                productId:
                    `custom-${Date.now()}`,

                name:
                    `Custom ${type} — ${text}`,

                price:
                    2999,

                image:
                    "",

                quantity:
                    1,

                size:
                    "M",

                stock:
                    1,

                custom:
                    true,

                customDetails: {

                    garment:
                        type,

                    text:
                        text,

                    color:
                        color

                }

            });


            saveCart();

            updateCartUI();

            openCart();

            showToast(
                "Custom design added to your bag."
            );

        }
    );

}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function setupNewsletter() {

    const form =
        document.getElementById(
            "newsletterForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const email =
                document.getElementById(
                    "newsletterEmail"
                )?.value
                    .trim();


            if (
                email &&
                !isValidEmail(email)
            ) {

                showToast(
                    "Please enter a valid email."
                );

                return;

            }


            showToast(
                "Thank you for joining HASHIRA."
            );


            form.reset();

        }
    );

}


/* =========================================================
   WISHLIST
   ========================================================= */

function loadWishlist() {

    try {

        const saved =
            localStorage.getItem(
                WISHLIST_KEY
            );

        wishlist =
            saved
                ? JSON.parse(saved)
                : [];


        if (!Array.isArray(wishlist)) {

            wishlist = [];

        }

    }
    catch {

        wishlist = [];

    }

}


function saveWishlist() {

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

}


function updateWishlistUI() {

    const element =
        document.getElementById(
            "wishlistCount"
        );


    if (element) {

        element.textContent =
            wishlist.length;

    }

}


/* =========================================================
   HELPERS
   ========================================================= */

function getProductId(product) {

    return String(

        product?._id ||
        product?.id ||
        product?.productId ||
        ""

    );

}


function findProduct(id) {

    return products.find(
        product =>
            String(
                getProductId(product)
            ) ===
            String(id)
    );

}


function normalizeCategory(category) {

    const value =
        String(
            category || ""
        )
            .trim()
            .toLowerCase();


    if (
        value === "men" ||
        value === "male"
    ) {

        return "Men";

    }


    if (
        value === "women" ||
        value === "female"
    ) {

        return "Women";

    }


    return category
        ? String(category)
        : "Fashion";

}


function escapeHTML(value) {

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


function escapeAttribute(value) {

    return escapeHTML(value);

}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function isLightColor(color) {

    if (
        !color ||
        !color.startsWith("#") ||
        color.length !== 7
    ) {

        return false;

    }


    const r =
        parseInt(
            color.substring(1, 3),
            16
        );

    const g =
        parseInt(
            color.substring(3, 5),
            16
        );

    const b =
        parseInt(
            color.substring(5, 7),
            16
        );


    const brightness =
        (
            r * 299 +
            g * 587 +
            b * 114
        ) / 1000;


    return brightness > 170;

}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.hashiraToastTimer
    );


    window.hashiraToastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        closeSearchPanel();

        closeMobileMenu();

        closeQuickView();

        closeCart();


        document
            .getElementById(
                "accountDropdown"
            )
            ?.classList.remove(
                "show"
            );

    }
);
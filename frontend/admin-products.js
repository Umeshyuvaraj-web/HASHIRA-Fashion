/* =====================================================
   HASHIRA ADMIN PRODUCT MANAGEMENT
   PHASE 21
===================================================== */


const API_URL =
    "http://localhost:5000/api";


let allProducts = [];

let editingProductId = null;


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeProductManagement();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

function initializeProductManagement() {

    if (
        !checkAdminAuthentication()
    ) {

        return;

    }


    loadAdminInformation();

    setupEvents();

    loadProducts();

}


/* =====================================================
   CHECK ADMIN
===================================================== */

function checkAdminAuthentication() {

    const token =
        getAdminToken();


    const admin =
        getAdminData();


    if (
        !token ||
        !admin ||
        admin.role !== "admin"
    ) {

        window.location.href =
            "admin-login.html";

        return false;

    }


    return true;

}


/* =====================================================
   GET TOKEN
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

    );

}


/* =====================================================
   GET ADMIN
===================================================== */

function getAdminData() {

    const data =

        localStorage.getItem(
            "hashiraAdmin"
        )

        ||

        sessionStorage.getItem(
            "hashiraAdmin"
        )

        ||

        localStorage.getItem(
            "hashiraUser"
        );


    if (
        !data
    ) {

        return null;

    }


    try {

        return JSON.parse(
            data
        );

    }

    catch {

        return null;

    }

}


/* =====================================================
   ADMIN INFORMATION
===================================================== */

function loadAdminInformation() {

    const admin =
        getAdminData();


    if (
        !admin
    ) {

        return;

    }


    const name =
        admin.name ||
        "Administrator";


    const nameElement =
        document.getElementById(
            "adminName"
        );


    const avatarElement =
        document.getElementById(
            "adminAvatar"
        );


    if (
        nameElement
    ) {

        nameElement.textContent =
            name;

    }


    if (
        avatarElement
    ) {

        avatarElement.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }

}


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {

    const addButton =
        document.getElementById(
            "addProductButton"
        );


    if (
        addButton
    ) {

        addButton.addEventListener(
            "click",
            () => {

                openProductModal();

            }
        );

    }


    const closeButton =
        document.getElementById(
            "closeModal"
        );


    if (
        closeButton
    ) {

        closeButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    const cancelButton =
        document.getElementById(
            "cancelModal"
        );


    if (
        cancelButton
    ) {

        cancelButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    const modal =
        document.getElementById(
            "productModal"
        );


    if (
        modal
    ) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    closeProductModal();

                }

            }
        );

    }


    const form =
        document.getElementById(
            "productForm"
        );


    if (
        form
    ) {

        form.addEventListener(
            "submit",
            saveProduct
        );

    }


    const search =
        document.getElementById(
            "searchInput"
        );


    if (
        search
    ) {

        search.addEventListener(
            "input",
            filterProducts
        );

    }


    const filter =
        document.getElementById(
            "stockFilter"
        );


    if (
        filter
    ) {

        filter.addEventListener(
            "change",
            filterProducts
        );

    }


    const refresh =
        document.getElementById(
            "refreshButton"
        );


    if (
        refresh
    ) {

        refresh.addEventListener(
            "click",
            loadProducts
        );

    }


    const logout =
        document.getElementById(
            "logoutButton"
        );


    if (
        logout
    ) {

        logout.addEventListener(
            "click",
            logoutAdmin
        );

    }


    const container =
        document.getElementById(
            "productsContainer"
        );


    if (
        container
    ) {

        container.addEventListener(
            "click",
            handleProductAction
        );

    }

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    const container =
        document.getElementById(
            "productsContainer"
        );


    if (
        container
    ) {

        container.innerHTML = `

            <div class="loading-products">
                LOADING PRODUCTS...
            </div>

        `;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/products`
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Failed to load products."
            );

        }


        const data =
            await response.json();


        allProducts =
            Array.isArray(
                data
            )
                ? data
                : [];


        updateStatistics();

        filterProducts();

    }

    catch (error) {

        console.error(
            "Load products error:",
            error
        );


        if (
            container
        ) {

            container.innerHTML = `

                <div class="empty-products">

                    <h2>
                        UNABLE TO LOAD PRODUCTS
                    </h2>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>

            `;

        }

    }

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        allProducts.length;


    const inStock =
        allProducts.filter(
            product =>
                Number(
                    product.stock || 0
                ) > 5
        ).length;


    const lowStock =
        allProducts.filter(
            product => {

                const stock =
                    Number(
                        product.stock || 0
                    );


                return (
                    stock > 0 &&
                    stock <= 5
                );

            }
        ).length;


    const outOfStock =
        allProducts.filter(
            product =>
                Number(
                    product.stock || 0
                ) === 0
        ).length;


    setText(
        "totalProducts",
        total
    );


    setText(
        "inStockProducts",
        inStock
    );


    setText(
        "lowStockProducts",
        lowStock
    );


    setText(
        "outOfStockProducts",
        outOfStock
    );

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function filterProducts() {

    const searchElement =
        document.getElementById(
            "searchInput"
        );


    const filterElement =
        document.getElementById(
            "stockFilter"
        );


    const search =
        (
            searchElement?.value
            ||
            ""
        )
            .toLowerCase()
            .trim();


    const filter =
        filterElement?.value
        ||
        "all";


    const filtered =
        allProducts.filter(
            product => {

                const name =
                    String(
                        product.name ||
                        ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !search
                    ||
                    name.includes(
                        search
                    )
                    ||
                    category.includes(
                        search
                    );


                const stock =
                    Number(
                        product.stock ||
                        0
                    );


                let matchesFilter =
                    true;


                if (
                    filter ===
                    "in-stock"
                ) {

                    matchesFilter =
                        stock > 5;

                }


                else if (
                    filter ===
                    "low-stock"
                ) {

                    matchesFilter =
                        stock > 0 &&
                        stock <= 5;

                }


                else if (
                    filter ===
                    "out-of-stock"
                ) {

                    matchesFilter =
                        stock === 0;

                }


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    renderProducts(
        filtered
    );

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(
    products
) {

    const container =
        document.getElementById(
            "productsContainer"
        );


    if (
        !container
    ) {

        return;

    }


    if (
        products.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-products">

                <h2>
                    NO PRODUCTS FOUND
                </h2>

                <p>
                    Try a different search or add a new product.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        products
            .map(
                product =>
                    createProductCard(
                        product
                    )
            )
            .join("");

}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(
    product
) {

    const stock =
        Number(
            product.stock || 0
        );


    let badgeClass =
        "";


    let badgeText =
        "IN STOCK";


    if (
        stock === 0
    ) {

        badgeClass =
            "out";

        badgeText =
            "OUT OF STOCK";

    }

    else if (
        stock <= 5
    ) {

        badgeClass =
            "low";

        badgeText =
            `${stock} LEFT`;

    }


    const image =
        product.image
            ||
        "https://via.placeholder.com/500x600?text=HASHIRA";


    return `

        <article
            class="product-card"
        >


            <div
                class="product-image-container"
            >

                <img
                    src="${escapeHTML(
                        image
                    )}"
                    alt="${escapeHTML(
                        product.name
                            ||
                        "Product"
                    )}"
                    class="product-image"
                    onerror="
                        this.src='https://via.placeholder.com/500x600?text=HASHIRA'
                    "
                >


                <span
                    class="
                        stock-badge
                        ${badgeClass}
                    "
                >

                    ${escapeHTML(
                        badgeText
                    )}

                </span>

            </div>



            <div
                class="product-details"
            >

                <p
                    class="product-category"
                >

                    ${escapeHTML(
                        product.category
                            ||
                        "UNCATEGORIZED"
                    )}

                </p>


                <h2
                    class="product-name"
                >

                    ${escapeHTML(
                        product.name
                            ||
                        "Unnamed Product"
                    )}

                </h2>


                <p
                    class="product-description"
                >

                    ${escapeHTML(
                        product.description
                            ||
                        "No product description available."
                    )}

                </p>


                <div
                    class="product-bottom"
                >

                    <strong
                        class="product-price"
                    >

                        ${formatPrice(
                            product.price
                        )}

                    </strong>


                    <span
                        class="product-stock"
                    >

                        ${stock}
                        unit${stock === 1 ? "" : "s"}

                    </span>

                </div>

            </div>



            <div
                class="product-actions"
            >

                <button
                    type="button"
                    class="product-action edit"
                    data-action="edit"
                    data-id="${escapeHTML(
                        product._id
                    )}"
                >

                    EDIT

                </button>


                <button
                    type="button"
                    class="
                        product-action
                        delete
                    "
                    data-action="delete"
                    data-id="${escapeHTML(
                        product._id
                    )}"
                >

                    DELETE

                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   PRODUCT ACTION
===================================================== */

function handleProductAction(
    event
) {

    const button =
        event.target.closest(
            "[data-action]"
        );


    if (
        !button
    ) {

        return;

    }


    const action =
        button.dataset.action;


    const id =
        button.dataset.id;


    if (
        action ===
        "edit"
    ) {

        editProduct(
            id
        );

    }


    else if (
        action ===
        "delete"
    ) {

        deleteProduct(
            id
        );

    }

}


/* =====================================================
   OPEN MODAL
===================================================== */

function openProductModal(
    product = null
) {

    const modal =
        document.getElementById(
            "productModal"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    const form =
        document.getElementById(
            "productForm"
        );


    if (
        !modal ||
        !form
    ) {

        return;

    }


    form.reset();


    editingProductId =
        product
            ? product._id
            : null;


    if (
        product
    ) {

        title.textContent =
            "EDIT PRODUCT";


        document.getElementById(
            "productId"
        ).value =
            product._id
                ||
            "";


        document.getElementById(
            "productName"
        ).value =
            product.name
                ||
            "";


        document.getElementById(
            "productPrice"
        ).value =
            product.price
                ||
            "";


        document.getElementById(
            "productStock"
        ).value =
            product.stock
                ??
            "";


        document.getElementById(
            "productCategory"
        ).value =
            product.category
                ||
            "";


        document.getElementById(
            "productImage"
        ).value =
            product.image
                ||
            "";


        document.getElementById(
            "productSizes"
        ).value =
            Array.isArray(
                product.sizes
            )
                ? product.sizes.join(
                    ", "
                )
                : "";


        document.getElementById(
            "productDescription"
        ).value =
            product.description
                ||
            "";

    }

    else {

        title.textContent =
            "ADD PRODUCT";

    }


    modal.classList.add(
        "active"
    );


    document.getElementById(
        "productName"
    ).focus();

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (
        modal
    ) {

        modal.classList.remove(
            "active"
        );

    }


    editingProductId =
        null;

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(
    id
) {

    const product =
        allProducts.find(
            item =>
                String(
                    item._id
                ) ===
                String(
                    id
                )
        );


    if (
        !product
    ) {

        showMessage(
            "Product not found.",
            true
        );

        return;

    }


    openProductModal(
        product
    );

}


/* =====================================================
   SAVE PRODUCT
===================================================== */

async function saveProduct(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const stock =
        Number(
            document.getElementById(
                "productStock"
            ).value
        );


    const category =
        document.getElementById(
            "productCategory"
        ).value.trim();


    const image =
        document.getElementById(
            "productImage"
        ).value.trim();


    const sizesText =
        document.getElementById(
            "productSizes"
        ).value.trim();


    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (
        !name
    ) {

        showMessage(
            "Product name is required.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            price
        )
        ||
        price < 0
    ) {

        showMessage(
            "Enter a valid product price.",
            true
        );

        return;

    }


    if (
        !Number.isInteger(
            stock
        )
        ||
        stock < 0
    ) {

        showMessage(
            "Stock must be a whole number greater than or equal to 0.",
            true
        );

        return;

    }


    if (
        !category
    ) {

        showMessage(
            "Product category is required.",
            true
        );

        return;

    }


    const sizes =
        sizesText

            ? sizesText
                .split(",")
                .map(
                    size =>
                        size.trim()
                )
                .filter(
                    Boolean
                )

            : [];


    const productData = {

        name:
            name,

        price:
            price,

        stock:
            stock,

        category:
            category,

        image:
            image,

        sizes:
            sizes,

        description:
            description

    };


    const button =
        document.getElementById(
            "saveProductButton"
        );


    const originalText =
        button.textContent;


    button.disabled =
        true;


    button.textContent =
        editingProductId
            ? "UPDATING..."
            : "CREATING...";


    try {

        const isEditing =
            Boolean(
                editingProductId
            );


        const url =
            isEditing

                ? `${API_URL}/products/${editingProductId}`

                : `${API_URL}/products`;


        const response =
            await fetch(
                url,
                {

                    method:
                        isEditing
                            ? "PUT"
                            : "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${getAdminToken()}`

                    },

                    body:
                        JSON.stringify(
                            productData
                        )

                }
            );


        if (
            response.status ===
            401 ||
            response.status ===
            403
        ) {

            clearAdminSession();

            window.location.href =
                "admin-login.html";

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
                "Failed to save product."

            );

        }


        closeProductModal();


        showMessage(

            isEditing

                ? "Product updated successfully."

                : "Product created successfully."

        );


        await loadProducts();

    }

    catch (error) {

        console.error(
            "Save product error:",
            error
        );


        showMessage(
            error.message,
            true
        );

    }

    finally {

        button.disabled =
            false;


        button.textContent =
            originalText;

    }

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(
    id
) {

    const product =
        allProducts.find(
            item =>
                String(
                    item._id
                ) ===
                String(
                    id
                )
        );


    if (
        !product
    ) {

        showMessage(
            "Product not found.",
            true
        );

        return;

    }


    const confirmed =
        window.confirm(

            `Delete "${product.name}"?\n\n` +
            "This action cannot be undone."

        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        const response =
            await fetch(

                `${API_URL}/products/${id}`,

                {

                    method:
                        "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${getAdminToken()}`

                    }

                }

            );


        if (
            response.status ===
            401 ||
            response.status ===
            403
        ) {

            clearAdminSession();

            window.location.href =
                "admin-login.html";

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
                "Failed to delete product."

            );

        }


        showMessage(
            "Product deleted successfully."
        );


        await loadProducts();

    }

    catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showMessage(
            error.message,
            true
        );

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutAdmin() {

    clearAdminSession();


    window.location.href =
        "admin-login.html";

}


/* =====================================================
   CLEAR ADMIN SESSION
===================================================== */

function clearAdminSession() {

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

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    error = false
) {

    const element =
        document.getElementById(
            "productMessage"
        );


    if (
        !element
    ) {

        return;

    }


    element.textContent =
        message;


    element.style.color =
        error
            ? "#b00020"
            : "#167a3a";


    element.classList.add(
        "show"
    );


    setTimeout(
        () => {

            element.classList.remove(
                "show"
            );

        },
        3500
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


    if (
        element
    ) {

        element.textContent =
            value;

    }

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

window.loadProducts =
    loadProducts;

window.editProduct =
    editProduct;

window.deleteProduct =
    deleteProduct;

window.openProductModal =
    openProductModal;

window.closeProductModal =
    closeProductModal;
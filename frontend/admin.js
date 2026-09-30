/* =====================================================
   HASHIRA ADMIN DASHBOARD
   FULL UPDATED VERSION
===================================================== */

const API_URL = "http://localhost:5000/api";

let products = [];
let editingProductId = null;


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

    setupEventListeners();

});


/* =====================================================
   EVENT LISTENERS
===================================================== */

function setupEventListeners() {

    /* LOGIN FORM */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }


    /* PRODUCT FORM */

    const productForm = document.getElementById("productForm");

    if (productForm) {

        productForm.addEventListener(
            "submit",
            handleProductSubmit
        );

    }


    /* PRODUCT IMAGE */

    const imageInput = document.getElementById("productImage");

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            previewImage
        );

    }


    /* PRODUCT SEARCH */

    const searchInput = document.getElementById("productSearch");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchProducts
        );

    }


    /* CATEGORY FILTER */

    const categoryFilter =
        document.getElementById("categoryFilter");

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            searchProducts
        );

    }


    /* CLOSE MODAL */

    const modal =
        document.getElementById("productModal");

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === this) {

                    closeProductModal();

                }

            }
        );

    }

}


/* =====================================================
   ADMIN LOGIN
===================================================== */

async function handleLogin(event) {

    event.preventDefault();


    const emailElement =
        document.getElementById("adminEmail");

    const passwordElement =
        document.getElementById("adminPassword");

    const errorElement =
        document.getElementById("loginError");


    if (!emailElement || !passwordElement) {

        return;

    }


    const email =
        emailElement.value
            .trim()
            .toLowerCase();

    const password =
        passwordElement.value;


    if (!email || !password) {

        if (errorElement) {

            errorElement.textContent =
                "Please enter email and password.";

        }

        return;

    }


    try {

        if (errorElement) {

            errorElement.textContent =
                "Signing in...";

        }


        const response =
            await fetch(
                `${API_URL}/auth/admin-login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


        const data =
            await parseResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Invalid email or password."
            );

        }


        if (!data.token) {

            throw new Error(
                "Authentication token was not received."
            );

        }


        localStorage.setItem(
            "hashiraAdminToken",
            data.token
        );


        if (data.admin) {

            localStorage.setItem(
                "hashiraAdmin",
                JSON.stringify(data.admin)
            );

        }


        if (errorElement) {

            errorElement.textContent = "";

        }


        await showAdmin();

    }

    catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        if (errorElement) {

            if (error instanceof TypeError) {

                errorElement.textContent =
                    "Cannot connect to HASHIRA server. Start the backend first.";

            }

            else {

                errorElement.textContent =
                    error.message ||
                    "Login failed.";

            }

        }

    }

}


/* =====================================================
   CHECK LOGIN
===================================================== */

function checkLogin() {

    const token =
        localStorage.getItem(
            "hashiraAdminToken"
        );


    if (token) {

        showAdmin();

    }

}


/* =====================================================
   SHOW ADMIN
===================================================== */

async function showAdmin() {

    const loginScreen =
        document.getElementById("loginScreen");

    const adminApp =
        document.getElementById("adminApp");


    if (loginScreen) {

        loginScreen.style.display =
            "none";

    }


    if (adminApp) {

        adminApp.classList.add("active");

    }


    await loadProducts();

    updateDashboard();

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "hashiraAdminToken"
    );

    localStorage.removeItem(
        "hashiraAdmin"
    );


    products = [];

    editingProductId = null;


    window.location.reload();

}


/* =====================================================
   ADMIN API REQUEST
===================================================== */

async function adminFetch(url, options = {}) {

    const token =
        localStorage.getItem(
            "hashiraAdminToken"
        );


    if (!token) {

        throw new Error(
            "Admin authentication required."
        );

    }


    const headers = {
        ...(options.headers || {}),

        "Authorization":
            `Bearer ${token}`
    };


    /*
       Only add JSON content type when
       body is NOT FormData.
    */

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {

        headers["Content-Type"] =
            "application/json";

    }


    let response;

    try {

        response =
            await fetch(
                url,
                {
                    ...options,
                    headers
                }
            );

    }

    catch (error) {

        console.error(
            "API connection error:",
            error
        );

        throw new Error(
            "Cannot connect to HASHIRA backend. Make sure server.js is running."
        );

    }


    /*
       SESSION EXPIRED
    */

    if (
        response.status === 401 ||
        response.status === 403
    ) {

        localStorage.removeItem(
            "hashiraAdminToken"
        );

        localStorage.removeItem(
            "hashiraAdmin"
        );


        throw new Error(
            "Admin session expired. Please login again."
        );

    }


    return response;

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    try {

        /*
           IMPORTANT:
           Use adminFetch here so the admin token
           is also sent when loading products.
        */

        const response =
            await adminFetch(
                `${API_URL}/products`,
                {
                    method: "GET"
                }
            );


        const data =
            await parseResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load products."
            );

        }


        if (Array.isArray(data)) {

            products = data;

        }

        else if (
            Array.isArray(data.products)
        ) {

            products = data.products;

        }

        else {

            products = [];

        }


        renderProducts(products);

        updateDashboard();


        return products;

    }

    catch (error) {

        console.error(
            "Load products error:",
            error
        );


        products = [];

        renderProducts([]);

        showToast(
            error.message ||
            "Failed to fetch products."
        );

    }

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(
    pageName,
    button = null
) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add("hidden");

        });


    const page =
        document.getElementById(
            pageName + "Page"
        );


    if (page) {

        page.classList.remove("hidden");

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    if (pageName === "products") {

        loadProducts();

    }


    if (pageName === "dashboard") {

        loadProducts();

    }

}


/* =====================================================
   DASHBOARD STATISTICS
===================================================== */

function updateDashboard() {

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );


    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    const totalStock =
        products.reduce(
            (total, product) => {

                return (
                    total +
                    Number(product.stock || 0)
                );

            },
            0
        );


    const stockElement =
        document.getElementById(
            "totalStock"
        );


    if (stockElement) {

        stockElement.textContent =
            totalStock;

    }


    const menCount =
        products.filter(
            product =>
                String(product.category)
                    .toLowerCase() === "men"
        ).length;


    const menElement =
        document.getElementById(
            "menProducts"
        );


    if (menElement) {

        menElement.textContent =
            menCount;

    }


    const womenCount =
        products.filter(
            product =>
                String(product.category)
                    .toLowerCase() === "women"
        ).length;


    const womenElement =
        document.getElementById(
            "womenProducts"
        );


    if (womenElement) {

        womenElement.textContent =
            womenCount;

    }


    renderRecentProducts();

}


/* =====================================================
   RECENT PRODUCTS
===================================================== */

function renderRecentProducts() {

    const container =
        document.getElementById(
            "recentProducts"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const recentProducts =
        products
            .slice()
            .reverse()
            .slice(0, 4);


    if (recentProducts.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No products available.</p>
            </div>
        `;

        return;

    }


    recentProducts.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "recent-product";


        card.innerHTML = `

            <img
                src="${escapeHTML(
                    product.image || ""
                )}"
                alt="${escapeHTML(
                    product.name || "Product"
                )}"
                onerror="this.src='assets/images/hashira-logo.jpeg'"
            >

            <div class="recent-info">

                <h3>
                    ${escapeHTML(
                        product.name ||
                        "Untitled"
                    )}
                </h3>

                <span>
                    ₹${Number(
                        product.price || 0
                    ).toLocaleString("en-IN")}
                </span>

            </div>
        `;


        container.appendChild(card);

    });

}


/* =====================================================
   OPEN ADD PRODUCT
===================================================== */

function openAddProduct() {

    editingProductId = null;


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    if (modalTitle) {

        modalTitle.textContent =
            "Add New Product";

    }


    const form =
        document.getElementById(
            "productForm"
        );


    if (form) {

        form.reset();

    }


    document
        .querySelectorAll(
            'input[name="size"]'
        )
        .forEach(
            checkbox => {

                checkbox.checked = false;

            }
        );


    resetImagePreview();


    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.add("active");

    }

}


/* =====================================================
   CLOSE PRODUCT MODAL
===================================================== */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.remove("active");

    }


    editingProductId = null;

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

function previewImage(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (
        !file.type.startsWith("image/")
    ) {

        showToast(
            "Please select a valid image file."
        );


        event.target.value = "";

        return;

    }


    /*
       Prevent extremely large images.
    */

    if (file.size > 5 * 1024 * 1024) {

        showToast(
            "Image must be smaller than 5 MB."
        );


        event.target.value = "";

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            const preview =
                document.getElementById(
                    "imagePreview"
                );


            if (!preview) {

                return;

            }


            preview.innerHTML = `

                <img
                    src="${e.target.result}"
                    alt="Product Preview"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                    "
                >

            `;

        };


    reader.onerror =
        function () {

            showToast(
                "Unable to preview image."
            );

        };


    reader.readAsDataURL(file);

}


/* =====================================================
   RESET IMAGE PREVIEW
===================================================== */

function resetImagePreview() {

    const preview =
        document.getElementById(
            "imagePreview"
        );


    if (!preview) {

        return;

    }


    preview.innerHTML = `

        <div>🖼️</div>

        <p>
            Upload costume image
        </p>

        <span>
            JPG / PNG
        </span>

    `;

}


/* =====================================================
   SAVE PRODUCT
===================================================== */

async function handleProductSubmit(event) {

    event.preventDefault();


    const nameElement =
        document.getElementById(
            "productName"
        );

    const categoryElement =
        document.getElementById(
            "productCategory"
        );

    const typeElement =
        document.getElementById(
            "productType"
        );

    const priceElement =
        document.getElementById(
            "productPrice"
        );

    const stockElement =
        document.getElementById(
            "productStock"
        );

    const descriptionElement =
        document.getElementById(
            "productDescription"
        );

    const featuredElement =
        document.getElementById(
            "featuredProduct"
        );

    const saleElement =
        document.getElementById(
            "saleProduct"
        );

    const imageInput =
        document.getElementById(
            "productImage"
        );


    if (
        !nameElement ||
        !categoryElement ||
        !typeElement ||
        !priceElement ||
        !stockElement ||
        !descriptionElement
    ) {

        showToast(
            "Product form is incomplete."
        );

        return;

    }


    const name =
        nameElement.value
            .trim();


    const category =
        categoryElement.value
            .trim()
            .toLowerCase();


    const type =
        typeElement.value
            .trim();


    const price =
        Number(
            priceElement.value
        );


    const stock =
        Number(
            stockElement.value
        );


    const description =
        descriptionElement.value
            .trim();


    const featured =
        featuredElement
            ? featuredElement.checked
            : false;


    const sale =
        saleElement
            ? saleElement.checked
            : false;


    /* SIZES */

    const sizes =
        Array.from(
            document.querySelectorAll(
                'input[name="size"]:checked'
            )
        ).map(
            checkbox =>
                checkbox.value
        );


    /* VALIDATION */

    if (!name) {

        showToast(
            "Enter a product name."
        );

        return;

    }


    if (!category) {

        showToast(
            "Select a category."
        );

        return;

    }


    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        showToast(
            "Enter a valid price."
        );

        return;

    }


    if (
        Number.isNaN(stock) ||
        stock < 0
    ) {

        showToast(
            "Enter a valid stock quantity."
        );

        return;

    }


    if (sizes.length === 0) {

        showToast(
            "Select at least one size."
        );

        return;

    }


    /* =================================================
       IMAGE
    ================================================= */

    let image = "";


    /*
       Keep old image during editing.
    */

    if (editingProductId) {

        const existing =
            products.find(
                product =>
                    String(product._id) ===
                    String(editingProductId)
            );


        if (existing) {

            image =
                existing.image || "";

        }

    }


    /*
       Convert new image to Base64.
    */

    if (
        imageInput &&
        imageInput.files &&
        imageInput.files.length > 0
    ) {

        try {

            image =
                await fileToBase64(
                    imageInput.files[0]
                );

        }

        catch (error) {

            console.error(
                "Image conversion error:",
                error
            );


            showToast(
                "Unable to read image."
            );

            return;

        }

    }


    /* =================================================
       PRODUCT DATA
    ================================================= */

    const productData = {

        name,

        category,

        type:
            type || "Clothing",

        price,

        stock,

        sizes,

        image,

        description,

        featured,

        sale

    };


    console.log(
        "Product data being sent:",
        productData
    );


    /* =================================================
       SAVE BUTTON
    ================================================= */

    const saveButton =
        document.querySelector(
            ".save-btn"
        );


    const originalText =
        saveButton
            ? saveButton.textContent
            : "SAVE PRODUCT";


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            "SAVING...";

    }


    try {

        let response;


        /* UPDATE */

        if (editingProductId) {

            response =
                await adminFetch(
                    `${API_URL}/products/${editingProductId}`,
                    {

                        method: "PUT",

                        body:
                            JSON.stringify(
                                productData
                            )

                    }
                );

        }


        /* CREATE */

        else {

            response =
                await adminFetch(
                    `${API_URL}/products`,
                    {

                        method: "POST",

                        body:
                            JSON.stringify(
                                productData
                            )

                    }
                );

        }


        const data =
            await parseResponse(response);


        console.log(
            "Product API response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                data.details ||
                `Server error (${response.status})`
            );

        }


        /* SUCCESS */

        if (editingProductId) {

            showToast(
                "Product updated successfully."
            );

        }

        else {

            showToast(
                "Product added successfully."
            );

        }


        closeProductModal();


        await loadProducts();

        updateDashboard();

    }

    catch (error) {

        console.error(
            "Save product error:",
            error
        );


        /*
           SHOW ACTUAL BACKEND ERROR
           instead of only:
           Failed to create product.
        */

        showToast(
            error.message ||
            "Failed to save product."
        );

    }

    finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                originalText;

        }

    }

}


/* =====================================================
   FILE TO BASE64
===================================================== */

function fileToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                error => {

                    reject(error);

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(
    productList = products
) {

    const table =
        document.getElementById(
            "productsTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:50px;
                        color:#888;
                    "
                >

                    No products found.

                </td>

            </tr>

        `;

        return;

    }


    productList.forEach(product => {

        const stock =
            Number(
                product.stock || 0
            );


        let stockClass =
            "in-stock";

        let stockText =
            "In Stock";


        if (stock === 0) {

            stockClass =
                "out-stock";

            stockText =
                "Out of Stock";

        }

        else if (stock <= 10) {

            stockClass =
                "low-stock";

            stockText =
                "Low Stock";

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="product-info">

                    <img
                        src="${escapeHTML(
                            product.image || ""
                        )}"
                        alt="${escapeHTML(
                            product.name ||
                            "Product"
                        )}"
                        onerror="this.src='assets/images/hashira-logo.jpeg'"
                    >

                    <div>

                        <strong>
                            ${escapeHTML(
                                product.name ||
                                "Untitled"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                product.type ||
                                "Clothing"
                            )}
                        </small>

                    </div>

                </div>

            </td>


            <td>

                <span class="category">

                    ${capitalize(
                        product.category || ""
                    )}

                </span>

            </td>


            <td>

                ₹${Number(
                    product.price || 0
                ).toLocaleString("en-IN")}

            </td>


            <td>

                ${stock}

            </td>


            <td>

                <span
                    class="status ${stockClass}"
                >

                    ${stockText}

                </span>

            </td>


            <td>

                <div class="actions">

                    <button
                        type="button"
                        onclick="editProduct('${escapeHTML(
                            product._id
                        )}')"
                        title="Edit"
                    >
                        ✎
                    </button>


                    <button
                        type="button"
                        onclick="deleteProduct('${escapeHTML(
                            product._id
                        )}')"
                        title="Delete"
                    >
                        ×
                    </button>

                </div>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(id) {

    const product =
        products.find(
            item =>
                String(item._id) ===
                String(id)
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;

    }


    editingProductId =
        product._id;


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    if (modalTitle) {

        modalTitle.textContent =
            "Edit Product";

    }


    setValue(
        "productName",
        product.name
    );


    setValue(
        "productCategory",
        product.category
    );


    setValue(
        "productType",
        product.type
    );


    setValue(
        "productPrice",
        product.price
    );


    setValue(
        "productStock",
        product.stock
    );


    setValue(
        "productDescription",
        product.description || ""
    );


    const featured =
        document.getElementById(
            "featuredProduct"
        );


    if (featured) {

        featured.checked =
            Boolean(
                product.featured
            );

    }


    const sale =
        document.getElementById(
            "saleProduct"
        );


    if (sale) {

        sale.checked =
            Boolean(
                product.sale
            );

    }


    /* SIZES */

    document
        .querySelectorAll(
            'input[name="size"]'
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    Array.isArray(
                        product.sizes
                    ) &&
                    product.sizes.includes(
                        checkbox.value
                    );

            }
        );


    /* IMAGE */

    const preview =
        document.getElementById(
            "imagePreview"
        );


    if (
        preview &&
        product.image
    ) {

        preview.innerHTML = `

            <img
                src="${escapeHTML(
                    product.image
                )}"
                alt="${escapeHTML(
                    product.name ||
                    "Product"
                )}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                "
                onerror="this.src='assets/images/hashira-logo.jpeg'"
            >

        `;

    }

    else {

        resetImagePreview();

    }


    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.add("active");

    }

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(id) {

    const product =
        products.find(
            item =>
                String(item._id) ===
                String(id)
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await adminFetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await parseResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Failed to delete product."
            );

        }


        showToast(
            "Product deleted successfully."
        );


        await loadProducts();

        updateDashboard();

    }

    catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showToast(
            error.message ||
            "Failed to delete product."
        );

    }

}


/* =====================================================
   SEARCH PRODUCTS
===================================================== */

function searchProducts() {

    const searchInput =
        document.getElementById(
            "productSearch"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
                .toLowerCase()
            : "all";


    const filtered =
        products.filter(product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();


            const type =
                String(
                    product.type || ""
                ).toLowerCase();


            const description =
                String(
                    product.description || ""
                ).toLowerCase();


            const nameMatch =
                name.includes(search) ||
                type.includes(search) ||
                description.includes(search);


            const productCategory =
                String(
                    product.category || ""
                ).toLowerCase();


            const categoryMatch =
                category === "all" ||
                productCategory === category;


            return (
                nameMatch &&
                categoryMatch
            );

        });


    renderProducts(filtered);

}


/* =====================================================
   OPEN STORE
===================================================== */

function openStore() {

    window.open(
        "index.html",
        "_blank"
    );

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function toggleSidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (sidebar) {

        sidebar.classList.toggle(
            "open"
        );

    }

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        alert(message);

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
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =====================================================
   PARSE API RESPONSE
===================================================== */

async function parseResponse(response) {

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    if (
        contentType.includes(
            "application/json"
        )
    ) {

        try {

            return await response.json();

        }

        catch {

            return {};

        }

    }


    try {

        const text =
            await response.text();

        return {
            message: text
        };

    }

    catch {

        return {};

    }

}


/* =====================================================
   SET VALUE
===================================================== */

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value ?? "";

    }

}


/* =====================================================
   CAPITALIZE
===================================================== */

function capitalize(text) {

    if (!text) {

        return "";

    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(value) {

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

window.openAddProduct =
    openAddProduct;

window.closeProductModal =
    closeProductModal;

window.editProduct =
    editProduct;

window.deleteProduct =
    deleteProduct;

window.searchProducts =
    searchProducts;

window.showPage =
    showPage;

window.logout =
    logout;

window.openStore =
    openStore;

window.toggleSidebar =
    toggleSidebar;

window.showToast =
    showToast;

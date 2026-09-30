/* =====================================================
   HASHIRA ORDER SUCCESS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadOrderNumber();

    }
);


/* =====================================================
   LOAD ORDER NUMBER
===================================================== */

function loadOrderNumber() {

    const element =
        document.getElementById(
            "orderNumber"
        );


    if (!element) {

        return;

    }


    const storedOrder =
        localStorage.getItem(
            "hashiraLastOrder"
        );


    if (!storedOrder) {

        element.textContent =
            "ORDER CONFIRMED";

        return;

    }


    try {

        const order =
            JSON.parse(
                storedOrder
            );


        const orderNumber =

            order.orderNumber
            ||
            order.orderId
            ||
            order._id
            ||
            "ORDER CONFIRMED";


        element.textContent =
            String(
                orderNumber
            );

    }

    catch {

        element.textContent =
            "ORDER CONFIRMED";

    }

}
async function getCartFetch() {
  const data = await fetch("/cart.js");
  return data.json();
}

async function addToCartFetch(obj) {
  const data = await fetch("/cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
  return data.json();
}

async function updateCartFetch(obj) {
  const data = await fetch("/cart/update.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });

  return data.json();
}

async function qtyBtnClickHandler(e) {
  e.preventDefault();
  const key = e.currentTarget.getAttribute("data-for-key");
  const input = document.querySelector(`[data-key="${key}"]`);
  if (e.currentTarget.name === "minus") {
    input.value = Math.max(parseInt(input.value) - 1, 1);
  } else if (e.currentTarget.name === "plus") {
    input.value = parseInt(input.value) + 1;
  }

  const obj = {
    updates: { [input.dataset.key]: input.value },
  };

  const data = await updateCartFetch(obj);

  updateCart(data);
  updateCartDrawer(data);
  updateCartBadge(data);
}

async function qtyInputChangeHandler(e) {
  const obj = {
    updates: { [e.target.dataset.key]: e.target.value },
  };

  const data = await updateCartFetch(obj);

  if (location.pathname == "/cart") {
    updateCart(data);
  }

  updateCartDrawer(data);
  updateCartBadge(data);
}

async function deleteBtnClickHandler(e) {
  const key = e.currentTarget.dataset.key;
  const obj = { updates: { [key]: 0 } };
  const data = await updateCartFetch(obj);

  if (location.pathname == "/cart") {
    document.getElementById(`cart-${key}`).remove();
    updateCart(data);
  }

  updateCartDrawer(data);
  updateCartBadge(data);
}

function showCartDrawer() {
  const cartDrawer = new bootstrap.Offcanvas("#cartDrawer");
  cartDrawer.show();
}

function updateCart(data) {
  data.items.forEach((item) => {
    const cartItem = document.getElementById(`cart-${item.id}`);
    cartItem.querySelector(".line-price").innerHTML = Shopify.formatMoney(
      item.line_price
    );
    cartItem.querySelector(".inp-qty").value = item.quantity;
  });
  document.getElementById("cart-total-price").innerHTML = Shopify.formatMoney(
    data.total_price
  );
}

function updateCartDrawer(data) {
  let cartDrawerRows = "";

  const cartDrawerTbody = document.querySelector("#cart-drawer-tbody");

  if (data && cartDrawerTbody) {
    for (const item of data.items) {
      const row = `<div id="cart-drawer-${
        item.id
      }" class="border-bottom" style="padding: var(--bs-offcanvas-padding-x) var(--bs-offcanvas-padding-y);">
                    <div class="row g-2">
                        <div class="col-3">
                            <a href="${item.url}" class="ratio ratio-1x1">
                                <img class="img-fluid rounded" src="${
                                  item.image
                                }"
                                alt="${item.title}">
                            </a>
                        </div>
                        <div class="col">
                            <div class="d-flex align-items-lg-start">
                                <a class="h6 m-0" href="${item.url}">${
        item.product_title
      }</a>
                                <button data-key="${
                                  item.id
                                }" class="btn p-0 ms-auto text-muted btn-delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fill-rule="evenodd"
                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </button>
                            </div>
                            <p class="text-muted mb-2">${item.variant_title}</p>
                            <div class="d-flex">
                                <span class="text-muted">Every 3 month</span>
                                <div class="ms-auto">
                                    ${
                                      item.original_line_price !=
                                      item.line_price
                                        ? `<span>${Shopify.formatMoney(
                                            item.original_line_price
                                          )}</span>`
                                        : ""
                                    }
                                    <span class="fw-semibold">${Shopify.formatMoney(
                                      item.line_price
                                    )}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
      cartDrawerRows += row;
    }
  }

  cartDrawerTbody.innerHTML = cartDrawerRows;

  Array.from(cartDrawerTbody.querySelectorAll(".inp-qty")).forEach((input) => {
    input.addEventListener("change", (e) => qtyInputChangeHandler(e));
  });

  Array.from(cartDrawerTbody.querySelectorAll(".btn-delete")).forEach((btn) => {
    btn.addEventListener("click", (e) => deleteBtnClickHandler(e));
  });

  document.getElementById("cart-drawer-total-price").innerHTML =
    Shopify.formatMoney(data.total_price);
  document.getElementById("cart-drawer-items-badge").innerHTML =
    data.item_count;

  if (data.items.length > 0) {
    document
      .querySelector(".cart-drawer__footer")
      .classList.remove("visually-hidden");
    document
      .querySelector(".cart-drawer__empty")
      .classList.add("visually-hidden");
  } else {
    document
      .querySelector(".cart-drawer__footer")
      .classList.add("visually-hidden");
    document
      .querySelector(".cart-drawer__empty")
      .classList.remove("visually-hidden");
  }
}

function updateCartBadge(data) {
  document.getElementById("cart-items-badge").innerHTML = data.item_count;
}

Array.from(document.querySelectorAll(".btn-qty")).forEach((btn) => {
  btn.addEventListener("click", (e) => qtyBtnClickHandler(e));
});

Array.from(document.querySelectorAll(".inp-qty")).forEach((input) => {
  input.addEventListener("change", (e) => qtyInputChangeHandler(e));
});

Array.from(document.querySelectorAll(".btn-delete")).forEach((btn) => {
  btn.addEventListener("click", (e) => deleteBtnClickHandler(e));
});

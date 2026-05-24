const container = document.getElementById("products");

if (container) {
  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
  <img src="${product.image}" alt="${product.name_ua}" class="product-img">

  <h3 data-ua="${product.name_ua}" data-en="${product.name_en}">
    ${product.name_ua}
  </h3>

  <p data-ua="${product.desc_ua}" data-en="${product.desc_en}">
    ${product.desc_ua}
  </p>

  <span class="price">${product.price} грн</span>

  <button onclick="openOrderForm('${product.name_ua}', '${product.name_en}')"
          data-ua="Замовити"
          data-en="Order">
    Замовити
  </button>
`;

    container.appendChild(card);
  });
}

const modal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");
const submitBtn = document.getElementById("submitOrderBtn");

function openOrderForm(productNameUa, productNameEn) {
  modal.style.display = "flex";

  document.getElementById("productName").value =
    currentLang === "ua" ? productNameUa : productNameEn;
}

if (closeModal) {
  closeModal.onclick = function () {
    modal.style.display = "none";
  };
}

if (submitBtn) {
submitBtn.addEventListener("click", function () {

  const customerName = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const postOffice = document.getElementById("postOffice").value.trim();
 const orderForm = document.getElementById("orderForm");

if (!orderForm.checkValidity()) {
  orderForm.reportValidity();
  return;
}
const digits = phoneInput.inputmask.unmaskedvalue();

phoneInput.setCustomValidity("");

if (digits.length !== 9) {
  phoneInput.setCustomValidity(
  currentLang === "ua"
    ? "Введіть номер телефону повністю"
    : "Enter full phone number"
);
  phoneInput.reportValidity();
  phoneInput.focus();
  return;
}

  submitBtn.innerText =
  currentLang === "ua"
    ? "Дякуємо за замовлення!"
    : "Thank you for your order!";
  submitBtn.style.background = "#6dbf73";
  submitBtn.disabled = true;

  const order = {
    name: document.getElementById("productName").value,
    quantity: document.getElementById("quantity").value,
    customerName,
    phone,
    city,
    postOffice
  };

  setTimeout(() => {
  fetch("http://127.0.0.1:3000/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  })
  .catch(error => console.error(error));
}, 0);
console.log("timer started");
  setTimeout(() => {
    console.log("timer ended");
    modal.style.display = "none";

    document.getElementById("productName").value = "";
    document.getElementById("quantity").value = "1";
    document.getElementById("customerName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("city").value = "";
    document.getElementById("postOffice").value = "";

   submitBtn.innerText =
  currentLang === "ua"
    ? "Підтвердити замовлення"
    : "Confirm order";
    submitBtn.style.background = "#c89b5e";
    submitBtn.disabled = false;

  }, 4000);
});
}
const phoneInput = document.getElementById("phone");

if (phoneInput) {
  const im = new Inputmask("+380 99 999 99 99");
  im.mask(phoneInput);

  phoneInput.addEventListener("input", function () {
    phoneInput.setCustomValidity("");
  });
}
const requiredFields = document.querySelectorAll("[required]");

requiredFields.forEach(function(field) {
  field.addEventListener("invalid", function() {
    field.setCustomValidity(
      currentLang === "ua"
        ? "Заповніть це поле"
        : "Please fill out this field"
    );
  });

  field.addEventListener("input", function() {
    field.setCustomValidity("");
  });
});
const langBtn = document.getElementById("langToggle");
let currentLang = localStorage.getItem("language") || "ua";

function applyLanguage() {
  const langIcon = document.getElementById("langIcon");

  if (langIcon) {
    langIcon.src = currentLang === "ua"
      ? "flags/ua.svg"
      : "flags/gb.svg";
  }

  const elements = document.querySelectorAll("[data-ua]");

  elements.forEach(function (el) {
    el.innerText = el.getAttribute("data-" + currentLang);
  });
}

applyLanguage();

if (langBtn) {
  langBtn.addEventListener("click", function () {
    currentLang = currentLang === "ua" ? "en" : "ua";

    localStorage.setItem("language", currentLang);

    applyLanguage();
  });
}

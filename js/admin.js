document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("isAdminLoggedIn") === "true") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  }
});
fetch("/api/orders")
  .then(response => response.json())
  .then(orders => {
    const tbody = document.querySelector("#ordersTable tbody");

    orders.forEach(order => {
      const row = document.createElement("tr");

      row.innerHTML = `
  <td>${order.id}</td>
  <td>${order.product}</td>
  <td>${order.quantity}</td>
  <td>${order.customerName}</td>
  <td>${order.phone}</td>
  <td>${order.city}</td>
  <td>${order.postOffice}</td>
  <td>${
  new Date(
    new Date(order.createdAt).getTime() + 3 * 60 * 60 * 1000
  ).toLocaleString("uk-UA")
}</td>
<td>
  <button onclick="deleteOrder(${order.id})">
    Видалити
  </button>
</td>
`;

      tbody.appendChild(row);
    });
  })
  .catch(error => console.error(error));
let selectedOrderId = null;

function deleteOrder(id) {
  selectedOrderId = id;
  document.getElementById("deleteModal").style.display = "flex";
}

window.onload = function () {
  document.getElementById("confirmDelete").onclick = function () {
    fetch("/api/orders/" + selectedOrderId, {
      method: "DELETE"
    })
    .then(() => location.reload())
    .catch(error => console.error(error));
  };

  document.getElementById("cancelDelete").onclick = function () {
    document.getElementById("deleteModal").style.display = "none";
  };
};
function loginAdmin() {
  const password =
    document.getElementById("adminPassword").value;

  fetch("/api/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("isAdminLoggedIn", "true");
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("adminPanel").style.display = "block";
    } else {
      document.getElementById("loginError").innerText =
        "Неправильний пароль";
    }
  })
  .catch(error => console.error(error));
}
function logoutAdmin() {
  localStorage.removeItem("isAdminLoggedIn");
  location.reload();
}
const API = "http://localhost:3001/api";
const socket = io("http://localhost:3001");
currentUser = null;

/* LOGIN */
loginForm.addEventListener("submit", async e => {
  e.preventDefault();

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();
  if (data.token) {
    currentUser = data.user;
    loginScreen.style.display = "none";
    mainContent.style.display = "block";
  } else alert(data.error);
});

/* REGISTRO */
registerForm.addEventListener("submit", async e => {
  e.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm-password").value;

  if (password !== confirm) {
    registerError.style.display = "block";
    return;
  }

  registerError.style.display = "none";

  try {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (data._id) {
      alert("Conta criada com sucesso!");
      showLoginScreen();
    } else {
      registerError.textContent = "Erro ao criar conta";
      registerError.style.display = "block";
    }
  } catch (err) {
    registerError.textContent = "Erro de conexão com o servidor";
    registerError.style.display = "block";
  }
});


/* PEDIDO */
checkoutBtn.addEventListener("click", async () => {
  await fetch(API + "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: currentUser._id,
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.quantity, 0)
    })
  });
  alert("Pedido enviado");
});

/* CHAT */
sendMessageBtn.addEventListener("click", () => {
  socket.emit("message", {
    sender: currentUser.username,
    text: chatInput.value
  });
  chatInput.value = "";
});

socket.on("message", msg => {
  const div = document.createElement("div");
  div.textContent = msg.sender + ": " + msg.text;
  chatMessages.appendChild(div);
});

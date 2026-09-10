const orderUrl = "https://vc-organics.milkmaster.co/";
const cart = JSON.parse(localStorage.getItem("vc-cart") || "[]");

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const header = $("#siteHeader");
const mobileMenu = $("#mobileMenu");
const menuTrigger = $("#menuTrigger");
const cartDrawer = $("#cartDrawer");
const cartCount = $("#cartCount");
const cartItems = $("#cartItems");
const cartEmpty = $("#cartEmpty");

function saveCart() {
  localStorage.setItem("vc-cart", JSON.stringify(cart));
  renderCart();
}
function addProduct(name) {
  const found = cart.find(i => i.name === name);
  if (found) found.qty += 1;
  else cart.push({ name, qty: 1 });
  saveCart();
  openCart();
}
function removeProduct(name) {
  const i = cart.findIndex(p => p.name === name);
  if (i > -1) cart.splice(i, 1);
  saveCart();
}
function renderCart() {
  cartCount.textContent = cart.reduce((n, i) => n + i.qty, 0);
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>Quantity: ${item.qty} · Live price at checkout</small></div>
      <button data-remove="${item.name}">Remove</button>
    </div>`).join("");
  cartEmpty.style.display = cart.length ? "none" : "flex";
  $$('[data-remove]').forEach(btn => btn.onclick = () => removeProduct(btn.dataset.remove));
}
function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$('[data-add]').forEach(btn => btn.addEventListener("click", () => addProduct(btn.dataset.add)));
$("#cartTrigger").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartBackdrop").addEventListener("click", closeCart);

menuTrigger.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuTrigger.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
});
$$('.mobile-menu a').forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuTrigger.setAttribute("aria-expanded", "false");
}));

window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 40), { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("in-view"); });
}, { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

$$('details').forEach(d => d.addEventListener("toggle", () => {
  if (d.open) $$('details').forEach(other => { if (other !== d) other.open = false; });
}));

document.querySelector("#year").textContent = new Date().getFullYear();
renderCart();

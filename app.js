const PRODUCTS = [
  {
    id: 1,
    name: "MacBook Air M3 13 inch",
    specs: "Apple M3 • 16GB RAM • 256GB SSD",
    price: 26990000,
    category: "laptop",
    badge: "Bán chạy",
    emoji: "💻"
  },
  {
    id: 2,
    name: "ASUS ROG Strix G16",
    specs: "i7-13650HX • RTX 4060 • 16GB • 165Hz",
    price: 32490000,
    category: "laptop",
    badge: "Gaming",
    emoji: "🎮"
  },
  {
    id: 3,
    name: "Card đồ họa RTX 4070 Super",
    specs: "12GB GDDR6X • 3 Fan tản nhiệt",
    price: 16990000,
    category: "component",
    badge: "Hot",
    emoji: "🖥️"
  },
  {
    id: 4,
    name: "CPU AMD Ryzen 7 7800X3D",
    specs: "8 nhân 16 luồng • 96MB L3 Cache",
    price: 9890000,
    category: "component",
    badge: "Best Gaming",
    emoji: "⚙️"
  },
  {
    id: 5,
    name: "RAM Corsair Vengeance 32GB",
    specs: "DDR5 6000MHz (2x16GB) • RGB",
    price: 2890000,
    category: "component",
    badge: "Bảo hành 36T",
    emoji: "💾"
  },
  {
    id: 6,
    name: "SSD Samsung 990 Pro 1TB",
    specs: "NVMe PCIe Gen 4 • Đọc 7450MB/s",
    price: 2650000,
    category: "component",
    badge: "Tốc độ cao",
    emoji: "⚡"
  },
  {
    id: 7,
    name: "Bàn phím cơ Keychron Q1 Pro",
    specs: "Nhôm CNC • Wireless • Hot-swap",
    price: 4290000,
    category: "accessory",
    badge: "Custom Gear",
    emoji: "⌨️"
  },
  {
    id: 8,
    name: "Chuột Logitech G Pro X Superlight 2",
    specs: "Không dây • 60g • Cảm biến HERO 2",
    price: 3390000,
    category: "accessory",
    badge: "Esports",
    emoji: "🖱️"
  }
];

let cart = JSON.parse(localStorage.getItem("techzone_cart") || "[]");
let activeCategory = "all";
let searchQuery = "";

const productsGrid = document.getElementById("productsGrid");
const categoryTabs = document.getElementById("categoryTabs");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const checkoutModal = document.getElementById("checkoutModal");
const toastEl = document.getElementById("toast");

const formatVND = (amount) => amount.toLocaleString("vi-VN") + "đ";

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function renderProducts() {
  const filtered = PRODUCTS.filter((p) => {
    const matchCategory = activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--muted); padding:40px 0;">Không tìm thấy sản phẩm phù hợp.</p>`;
    return;
  }

  productsGrid.innerHTML = filtered
    .map(
      (p) => `
      <article class="product-card">
        <div class="product-thumb">
          <span class="product-badge">${p.badge}</span>
          <span>${p.emoji}</span>
        </div>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-specs">${p.specs}</p>
        <div class="product-bottom">
          <span class="product-price">${formatVND(p.price)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Thêm</button>
        </div>
      </article>
    `
    )
    .join("");
}

function saveCart() {
  localStorage.setItem("techzone_cart", JSON.stringify(cart));
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = totalQty;
  cartTotal.textContent = formatVND(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="text-align:center; color:var(--muted); margin-top:40px;">Giỏ hàng đang trống.</p>`;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>${formatVND(item.price)}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <strong>${item.qty}</strong>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

window.addToCart = (id) => {
  const product = PRODUCTS.find((p) => p.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  renderCart();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
};

window.updateQty = (id, delta) => {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((c) => c.id !== id);
  saveCart();
  renderCart();
};

categoryTabs.addEventListener("click", (e) => {
  if (!e.target.classList.contains("tab")) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  e.target.classList.add("active");
  activeCategory = e.target.dataset.category;
  renderProducts();
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

const toggleCart = (open) => {
  cartDrawer.classList.toggle("open", open);
  cartOverlay.classList.toggle("open", open);
};

document.getElementById("openCartBtn").addEventListener("click", () => toggleCart(true));
document.getElementById("closeCartBtn").addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return showToast("Giỏ hàng đang trống!");
  toggleCart(false);
  checkoutModal.classList.add("open");
});

document.getElementById("closeModalBtn").addEventListener("click", () => {
  checkoutModal.classList.remove("open");
});

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("custName").value.trim();
  checkoutModal.classList.remove("open");
  cart = [];
  saveCart();
  renderCart();
  e.target.reset();
  showToast(`Cảm ơn ${name}! Đơn hàng đã được tiếp nhận.`);
});

renderProducts();
renderCart();

const PRODUCTS = [
  {
    id: 1,
    name: "Xoài Cát Hòa Lộc",
    origin: "Tiền Giang • Chuẩn VietGAP",
    price: 85000,
    unit: "kg",
    category: "vietnam",
    badge: "Bán chạy",
    emoji: "🥭"
  },
  {
    id: 2,
    name: "Bưởi Da Xanh Bến Tre",
    origin: "Bến Tre • Hữu cơ",
    price: 65000,
    unit: "kg",
    category: "vietnam",
    badge: "VietGAP",
    emoji: "🍈"
  },
  {
    id: 3,
    name: "Dâu Tây Đà Lạt Giống Nhật",
    origin: "Lâm Đồng • Trồng nhà kính",
    price: 195000,
    unit: "hộp 500g",
    category: "vietnam",
    badge: "Tươi mỗi sáng",
    emoji: "🍓"
  },
  {
    id: 4,
    name: "Nho Mẫu Đơn Shine Muscat",
    origin: "Hàn Quốc • Nhập khẩu",
    price: 390000,
    unit: "chùm 700g",
    category: "import",
    badge: "Cao cấp",
    emoji: "🍇"
  },
  {
    id: 5,
    name: "Táo Envy New Zealand",
    origin: "New Zealand • Size lớn",
    price: 145000,
    unit: "kg",
    category: "import",
    badge: "Giòn ngọt",
    emoji: "🍎"
  },
  {
    id: 6,
    name: "Cam Vàng Navel Úc",
    origin: "Úc • Không hạt",
    price: 110000,
    unit: "kg",
    category: "import",
    badge: "Giàu Vitamin C",
    emoji: "🍊"
  },
  {
    id: 7,
    name: "Combo Gia Đình Tươi Mát",
    origin: "Xoài + Bưởi + Táo + Cam (4kg)",
    price: 340000,
    unit: "combo",
    category: "gift",
    badge: "Tiết kiệm 15%",
    emoji: "🧺"
  },
  {
    id: 8,
    name: "Giỏ Quà Sức Khỏe Cao Cấp",
    origin: "Trái cây nhập khẩu + Thiệp chúc",
    price: 680000,
    unit: "giỏ",
    category: "gift",
    badge: "Quà tặng",
    emoji: "🎁"
  }
];

let cart = JSON.parse(localStorage.getItem("vuonxanh_cart") || "[]");
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
      p.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--muted); padding: 40px 0;">Không tìm thấy sản phẩm phù hợp.</p>`;
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
        <p class="product-origin">${p.origin}</p>
        <div class="product-bottom">
          <div>
            <span class="product-price">${formatVND(p.price)}</span>
            <span class="product-unit">/ ${p.unit}</span>
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Thêm</button>
        </div>
      </article>
    `
    )
    .join("");
}

function saveCart() {
  localStorage.setItem("vuonxanh_cart", JSON.stringify(cart));
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = formatVND(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="text-align:center; color:var(--muted); margin-top:40px;">Giỏ hàng đang trống. Hãy chọn vài loại trái cây tươi nhé!</p>`;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>${formatVND(item.price)} / ${item.unit}</span>
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
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
};

window.updateQty = (id, delta) => {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }
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
  if (cart.length === 0) {
    showToast("Giỏ hàng đang trống!");
    return;
  }
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

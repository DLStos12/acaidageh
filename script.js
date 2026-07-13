/* ======================================================
   CONFIGURAÇÕES GERAIS DA LOJA
   ====================================================== */

// Número que receberá os pedidos no WhatsApp.
// Use o formato: DDI + DDD + número, sem espaços, traços ou parênteses.
const STORE_WHATSAPP = "5511999999999";

/* ======================================================
   DADOS DO CARDÁPIO
   ====================================================== */

// Tamanhos disponíveis e seus respectivos preços-base.
const sizes = [
  { id: "300", name: "Açaí 300 ml", price: 14.9 },
  { id: "500", name: "Açaí 500 ml", price: 18.9 },
  { id: "700", name: "Açaí 700 ml", price: 23.9 }
];

// Ingredientes que podem ser escolhidos pelo cliente.
const ingredients = [
  { id: "banana", name: "Banana", price: 0 },
  { id: "morango", name: "Morango", price: 2.5 },
  { id: "granola", name: "Granola", price: 0 },
  { id: "pacoca", name: "Paçoca", price: 1.5 },
  { id: "leite-po", name: "Leite em pó", price: 2 },
  { id: "leite-condensado", name: "Leite condensado", price: 1.5 },
  { id: "nutella", name: "Creme de avelã", price: 4 },
  { id: "kiwi", name: "Kiwi", price: 3 },
  { id: "confete", name: "Confete", price: 1.5 },
  { id: "castanha", name: "Castanha", price: 2.5 }
];

// Produtos prontos exibidos na seção “Nosso cardápio”.
const products = [
  { name: "Açaí Tradicional", description: "Açaí, banana e granola.", price: 14.9, emoji: "🥣" },
  { name: "Açaí Especial", description: "Açaí, morango, banana e granola.", price: 18.9, emoji: "🍓" },
  { name: "Açaí Power", description: "Açaí, leite em pó, paçoca e granola.", price: 19.9, emoji: "⚡" },
  { name: "Açaí Premium", description: "Açaí, morango, kiwi, banana e creme de avelã.", price: 22.9, emoji: "👑" }
];

/* ======================================================
   ESTADO DO CARRINHO
   ====================================================== */

// Guarda todos os açaís adicionados ao pedido.
// Cada item recebe um identificador único para poder ser excluído depois.
let cart = [];
let nextCartItemId = 1;

/* ======================================================
   REFERÊNCIAS AOS ELEMENTOS DO HTML
   ====================================================== */

const sizeOptions = document.querySelector("#sizeOptions");
const ingredientOptions = document.querySelector("#ingredientOptions");
const productsGrid = document.querySelector("#productsGrid");
const summarySize = document.querySelector("#summarySize");
const summaryIngredients = document.querySelector("#summaryIngredients");
const summaryTotal = document.querySelector("#summaryTotal");
const addToOrder = document.querySelector("#addToOrder");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const sendWhatsApp = document.querySelector("#sendWhatsApp");

/* ======================================================
   FUNÇÕES AUXILIARES
   ====================================================== */

// Converte números para o formato brasileiro de moeda.
const money = value => value.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

// Protege textos inseridos dinamicamente contra HTML indesejado.
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ======================================================
   RENDERIZAÇÃO DAS OPÇÕES
   ====================================================== */

// Insere os tamanhos no formulário.
function renderSizes() {
  sizeOptions.innerHTML = sizes.map((size, index) => `
    <div class="size-card">
      <input
        type="radio"
        name="size"
        id="size-${size.id}"
        value="${size.id}"
        ${index === 0 ? "checked" : ""}
      >
      <label for="size-${size.id}">
        <strong>${size.name}</strong>
        <span>${money(size.price)}</span>
      </label>
    </div>
  `).join("");
}

// Insere os ingredientes no formulário.
function renderIngredients() {
  ingredientOptions.innerHTML = ingredients.map(item => `
    <div class="ingredient-card">
      <input type="checkbox" id="ingredient-${item.id}" value="${item.id}">
      <label for="ingredient-${item.id}">
        <span>${item.name}</span>
        <small>${item.price === 0 ? "Grátis" : `+ ${money(item.price)}`}</small>
      </label>
    </div>
  `).join("");
}

// Insere os produtos prontos no cardápio.
function renderProducts() {
  productsGrid.innerHTML = products.map((product, index) => `
    <article class="product-card">
      <div class="product-card__visual">${product.emoji}</div>
      <div class="product-card__body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-card__footer">
          <span class="product-card__price">${money(product.price)}</span>
          <button type="button" data-product="${index}" aria-label="Escolher ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

/* ======================================================
   LEITURA E RESUMO DO AÇAÍ ATUAL
   ====================================================== */

// Lê o tamanho e os ingredientes marcados neste momento.
function getSelection() {
  const selectedSizeId = document.querySelector('input[name="size"]:checked')?.value;
  const selectedSize = sizes.find(size => size.id === selectedSizeId);

  const selectedIngredients = [...document.querySelectorAll('.ingredient-card input:checked')]
    .map(input => ingredients.find(item => item.id === input.value))
    .filter(Boolean);

  const ingredientsTotal = selectedIngredients.reduce((sum, item) => sum + item.price, 0);
  const total = (selectedSize?.price || 0) + ingredientsTotal;

  return { selectedSize, selectedIngredients, total };
}

// Atualiza o resumo do açaí que ainda está sendo montado.
function updateSummary() {
  const { selectedSize, selectedIngredients, total } = getSelection();

  summarySize.textContent = selectedSize
    ? `${selectedSize.name} — ${money(selectedSize.price)}`
    : "Selecione";

  summaryIngredients.innerHTML = selectedIngredients.length
    ? selectedIngredients.map(item => `
        <li>${item.name}${item.price ? ` (+ ${money(item.price)})` : ""}</li>
      `).join("")
    : "<li>Nenhum selecionado</li>";

  summaryTotal.textContent = money(total);
}

/* ======================================================
   CARRINHO: ADICIONAR, EXIBIR E EXCLUIR
   ====================================================== */

// Adiciona o açaí atual ao carrinho.
function addCurrentAcaiToCart() {
  const { selectedSize, selectedIngredients, total } = getSelection();

  if (!selectedSize) {
    alert("Selecione um tamanho de açaí.");
    return;
  }

  // Criamos cópias dos objetos para que o item do carrinho não seja alterado
  // quando o cliente começar a montar o próximo açaí.
  cart.push({
    id: nextCartItemId++,
    size: { ...selectedSize },
    ingredients: selectedIngredients.map(item => ({ ...item })),
    total
  });

  renderCart();
  resetBuilder();
}

// Exclui apenas o item cujo identificador foi recebido.
function removeCartItem(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  renderCart();
}

// Calcula o valor somado de todos os itens do carrinho.
function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.total, 0);
}

// Atualiza visualmente a lista de açaís adicionados.
function renderCart() {
  const quantity = cart.length;

  cartCount.textContent = `${quantity} ${quantity === 1 ? "item" : "itens"}`;
  cartTotal.textContent = money(getCartTotal());

  if (quantity === 0) {
    cartItems.innerHTML = '<p class="cart__empty">Nenhum açaí adicionado ainda.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => {
    const ingredientNames = item.ingredients.length
      ? item.ingredients.map(ingredient => ingredient.name).join(", ")
      : "Sem ingredientes adicionais";

    return `
      <article class="cart-item">
        <div class="cart-item__content">
          <span class="cart-item__number">Açaí ${index + 1}</span>
          <strong>${escapeHtml(item.size.name)}</strong>
          <p>${escapeHtml(ingredientNames)}</p>
          <span class="cart-item__price">${money(item.total)}</span>
        </div>

        <button
          class="cart-item__remove"
          type="button"
          data-remove-item="${item.id}"
          aria-label="Excluir ${escapeHtml(item.size.name)} do pedido"
          title="Excluir este açaí"
        >
          <span aria-hidden="true">🗑️</span>
          <span>Excluir</span>
        </button>
      </article>
    `;
  }).join("");
}

// Volta o montador para a configuração inicial após adicionar um item.
function resetBuilder() {
  const firstSize = document.querySelector('input[name="size"]');

  if (firstSize) firstSize.checked = true;

  document.querySelectorAll('.ingredient-card input').forEach(input => {
    input.checked = false;
  });

  updateSummary();
}

/* ======================================================
   PRODUTOS PRONTOS
   ====================================================== */

// Marca automaticamente os ingredientes do produto escolhido no cardápio.
function choosePresetProduct(index) {
  const presets = [
    ["banana", "granola"],
    ["morango", "banana", "granola"],
    ["leite-po", "pacoca", "granola"],
    ["morango", "kiwi", "banana", "nutella"]
  ];

  document.querySelector("#size-300").checked = true;

  document.querySelectorAll('.ingredient-card input').forEach(input => {
    input.checked = presets[index].includes(input.value);
  });

  updateSummary();
  document.querySelector("#monte").scrollIntoView({ behavior: "smooth" });
}

/* ======================================================
   MENSAGEM E ENVIO PARA O WHATSAPP
   ====================================================== */

// Monta a mensagem completa com todos os açaís adicionados.
function buildWhatsAppMessage() {
  const nameInput = document.querySelector("#customerName");
  const name = nameInput.value.trim();
  const deliveryType = document.querySelector("#deliveryType").value;
  const notes = document.querySelector("#notes").value.trim();

  if (!name) {
    alert("Por favor, informe seu nome antes de enviar o pedido.");
    nameInput.focus();
    return null;
  }

  if (cart.length === 0) {
    alert("Adicione pelo menos um açaí ao pedido antes de enviar.");
    addToOrder.focus();
    return null;
  }

  const itemsText = cart.map((item, index) => {
    const ingredientsText = item.ingredients.length
      ? item.ingredients.map(ingredient => `• ${ingredient.name}${ingredient.price ? ` (+${money(ingredient.price)})` : ""}`).join("\n")
      : "• Sem ingredientes adicionais";

    return [
      `*${index + 1}. ${item.size.name}*`,
      ingredientsText,
      `Subtotal: ${money(item.total)}`
    ].join("\n");
  }).join("\n\n");

  return [
    "Olá! Gostaria de fazer um pedido 💜",
    "",
    `*Cliente:* ${name}`,
    `*Tipo:* ${deliveryType}`,
    "",
    "*Itens do pedido:*",
    itemsText,
    notes ? `\n*Observações:* ${notes}` : "",
    "",
    `*TOTAL DO PEDIDO: ${money(getCartTotal())}*`
  ].filter(Boolean).join("\n");
}

// Abre o WhatsApp com a mensagem já preenchida.
function sendOrder() {
  const message = buildWhatsAppMessage();
  if (!message) return;

  const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ======================================================
   MENU RESPONSIVO
   ====================================================== */

function setupMenu() {
  const menuToggle = document.querySelector("#menuToggle");
  const menu = document.querySelector("#menu");

  menuToggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ======================================================
   INICIALIZAÇÃO DO SITE
   ====================================================== */

function init() {
  document.body.classList.add("is-loading");

  renderSizes();
  renderIngredients();
  renderProducts();
  renderCart();
  updateSummary();
  setupMenu();

  // Atualiza o subtotal sempre que o cliente muda tamanho ou ingrediente.
  document.querySelector("#orderForm").addEventListener("change", updateSummary);

  // Adiciona o açaí configurado ao carrinho.
  addToOrder.addEventListener("click", addCurrentAcaiToCart);

  // Usa delegação de eventos para excluir qualquer item do carrinho.
  cartItems.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-item]");
    if (!removeButton) return;

    const itemId = Number(removeButton.dataset.removeItem);
    removeCartItem(itemId);
  });

  // Envia o pedido completo para o WhatsApp.
  sendWhatsApp.addEventListener("click", sendOrder);

  // Seleciona os ingredientes de um produto pronto.
  productsGrid.addEventListener("click", event => {
    const button = event.target.closest("button[data-product]");
    if (button) choosePresetProduct(Number(button.dataset.product));
  });

  // Preenche automaticamente o ano do rodapé.
  document.querySelector("#currentYear").textContent = new Date().getFullYear();

  // Oculta o loader após o carregamento completo da página.
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.querySelector("#loader").classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, 650);
  });
}

init();

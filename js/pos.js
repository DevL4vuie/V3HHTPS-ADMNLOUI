





// // ADDED: signOut import from the CDN (same version as your other firebase imports likely)
// import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// // ADDED: 'auth' to the imports from your local file
// import { 
//     db, auth, collection, getDocs, addDoc, updateDoc, doc, query, where, onSnapshot 
// } from './firebase.js';

// let products = [];
// let cart = [];
// let currentPaymentMethod = 'Cash'; 

// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
//     generateOrderID();
    
//     // --- FEATURE: LOGOUT BUTTON VISIBILITY CHECK ---
//     const userRole = localStorage.getItem('userRole'); 
//     const logoutBtn = document.getElementById('logout-sidebar-item');

//     // Strictly check for 'cashier'
//     if (userRole && userRole.toLowerCase() === 'cashier') {
//         if(logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         if(logoutBtn) logoutBtn.style.display = 'none';
//     }
//     // -----------------------------------------------

//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     onSnapshot(collection(db, "categories"), (snapshot) => {
//         const tabs = document.getElementById('categoryTabs');
//         if(tabs) {
//             tabs.innerHTML = '<button class="active" onclick="window.filterProducts(\'all\', this)">All</button>';
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 tabs.innerHTML += `<button onclick="window.filterProducts('${doc.id}', this)">${data.name}</button>`;
//             });
//         }
//     });

//     onSnapshot(collection(db, "products"), (snapshot) => {
//         products = [];
//         snapshot.forEach(doc => {
//             // FIX: Ensure numeric types for critical fields immediately upon load
//             const data = doc.data();
//             const stockVal = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
            
//             products.push({ 
//                 id: doc.id, 
//                 ...data,
//                 quantity: isNaN(stockVal) ? 0 : stockVal // Normalize to 'quantity'
//             });
//         });
//         renderProducts(products);
//     });

//     document.getElementById('productSearch')?.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = products.filter(p => p.name.toLowerCase().includes(term));
//         renderProducts(filtered);
//     });

//     document.getElementById('amountPaid')?.addEventListener('input', calculateChange);
// });

// function initTheme() {
//     if (localStorage.getItem('theme') === 'dark') {
//         document.body.classList.add('dark-mode');
//     }
// }

// // --- LOGOUT MODAL LOGIC (FIXED) ---
// window.openLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'flex';
// };

// window.closeLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'none';
// };

// window.confirmLogout = async function() {
//     try {
//         // 1. Sign out from Firebase Auth (This kills the session on the server/browser)
//         await signOut(auth);

//         // 2. Clear Local Storage
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userName');
        
//         // 3. Redirect to login page
//         window.location.href = 'index.html';
//     } catch (error) {
//         console.error("Logout Error:", error);
//         alert("Error logging out. Please try again.");
//     }
// };
// // ----------------------------------

// function renderProducts(list) {
//     const grid = document.getElementById('productsGrid');
//     if(!grid) return;
//     grid.innerHTML = '';
    
//     if (list.length === 0) {
//         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey);">No products found.</p>';
//         return;
//     }

//     list.forEach(p => {
//         // FIX: Explicitly convert to number to prevent string comparison errors
//         // Check both 'quantity' and 'stock' fields
//         const qty = Number(p.quantity || p.stock || 0);
//         const isOOS = qty <= 0;
        
//         const card = document.createElement('div');
//         card.className = `product-card ${isOOS ? 'oos' : ''}`;
//         card.onclick = () => !isOOS && addToCart(p);
        
//         const displayPrice = parseFloat(p.price || p.cost || 0);
//         const imgUrl = p.imageUrl || p.image || p.img || p.photoURL || '';
//         let imageHtml = '';
//         if (imgUrl) {
//             imageHtml = `
//                 <div class="card-image-box">
//                     <img src="${imgUrl}" alt="${p.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
//                     <div class="prod-icon-fallback" style="display:none"><i class="fas fa-utensils"></i></div>
//                 </div>
//             `;
//         } else {
//             imageHtml = `
//                 <div class="card-image-box">
//                     <div class="prod-icon-fallback"><i class="fas fa-utensils"></i></div>
//                 </div>
//             `;
//         }

//         card.innerHTML = `
//             ${imageHtml}
//             <div class="product-info">
//                 <div>
//                     <h4>${p.name}</h4>
//                     <p class="stock">Stock: ${qty} ${p.unit || 'pcs'}</p>
//                 </div>
//                 <span class="price">₱${displayPrice.toLocaleString()}</span>
//             </div>
//             ${isOOS ? '<div class="oos-overlay">Out of Stock</div>' : ''}
//         `;
//         grid.appendChild(card);
//     });
// }

// window.filterProducts = function(catId, btn) {
//     document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');

//     if (catId === 'all') {
//         renderProducts(products);
//     } else {
//         const filtered = products.filter(p => p.category === catId);
//         renderProducts(filtered);
//     }
// };

// function addToCart(product) {
//     const existing = cart.find(i => i.id === product.id);
//     const currentQty = existing ? existing.qty : 0;
    
//     // FIX: Ensure numeric comparison for stock limit
//     const productStock = Number(product.quantity || product.stock || 0);
    
//     if (currentQty + 1 > productStock) {
//         showToast("Not enough stock!", "error");
//         return;
//     }
//     const priceToUse = parseFloat(product.price || product.cost || 0);

//     if (existing) {
//         existing.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             name: product.name,
//             price: priceToUse,
//             qty: 1
//         });
//     }
//     renderCart();
// }

// function renderCart() {
//     const container = document.getElementById('cartItems');
//     if(!container) return;
//     container.innerHTML = '';

//     if (cart.length === 0) {
//         container.innerHTML = `
//             <div class="empty-cart-msg">
//                 <i class="fas fa-shopping-basket"></i>
//                 <p>No items added yet</p>
//             </div>
//         `;
//         updateTotals(0);
//         return;
//     }

//     let total = 0;
//     cart.forEach((item, index) => {
//         const itemTotal = item.price * item.qty;
//         total += itemTotal;

//         const div = document.createElement('div');
//         div.className = 'cart-item';
//         div.innerHTML = `
//             <div class="item-info">
//                 <h4>${item.name}</h4>
//                 <p>₱${item.price.toLocaleString()} x ${item.qty}</p>
//             </div>
//             <div class="item-total">₱${itemTotal.toLocaleString()}</div>
//             <div class="item-actions">
//                 <button onclick="window.updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
//                 <span style="font-size:12px; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
//                 <button onclick="window.updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
//                 <button class="remove" onclick="window.removeItem(${index})"><i class="fas fa-trash"></i></button>
//             </div>
//         `;
//         container.appendChild(div);
//     });

//     updateTotals(total);
// }

// window.updateQty = function(index, change) {
//     const item = cart[index];
//     const product = products.find(p => p.id === item.id);
    
//     if (change === 1) {
//         // FIX: Robust check against product stock
//         const productStock = Number(product.quantity || product.stock || 0);
//         if (item.qty + 1 > productStock) {
//             showToast("Max stock reached", "error");
//             return;
//         }
//         item.qty++;
//     } else {
//         if (item.qty > 1) item.qty--;
//         else cart.splice(index, 1);
//     }
//     renderCart();
// };

// window.removeItem = function(index) {
//     cart.splice(index, 1);
//     renderCart();
// };

// window.clearCart = function() {
//     if(confirm("Clear current order?")) {
//         cart = [];
//         renderCart();
//     }
// };

// function updateTotals(subtotal) {
//     const vat = 0;
//     const total = subtotal; 
//     document.getElementById('subtotalDisplay').innerText = '₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const vatEl = document.getElementById('vatDisplay');
//     if(vatEl) vatEl.innerText = '₱0.00'; 
//     document.getElementById('totalDisplay').innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const modalTotal = document.getElementById('modalTotalAmount');
//     if(modalTotal) {
//         modalTotal.dataset.value = total;
//         modalTotal.innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     }
// }

// // --- PAYMENT & MODAL LOGIC ---

// window.openPaymentModal = function() {
//     if (cart.length === 0) {
//         showToast("Cart is empty!", "error");
//         return;
//     }
//     document.getElementById('paymentModal').style.display = 'flex';
//     document.getElementById('amountPaid').value = '';
//     document.getElementById('changeAmount').innerText = '₱0.00';
// };

// window.closePaymentModal = function() {
//     document.getElementById('paymentModal').style.display = 'none';
// };

// window.setPaymentMethod = function(method, btn) {
//     currentPaymentMethod = method;
//     document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');

//     const cashDiv = document.getElementById('cash-payment-section');
//     const digitalDiv = document.getElementById('digital-payment-section');

//     if (method === 'Cash') {
//         cashDiv.style.display = 'block';
//         digitalDiv.style.display = 'none';
//     } else {
//         cashDiv.style.display = 'none';
//         digitalDiv.style.display = 'block';
//     }
// };

// window.setCash = function(amount) {
//     const input = document.getElementById('amountPaid');
//     // FIX: Cumulative addition logic for cash buttons
//     // Get current value or 0 if empty
//     const currentVal = parseFloat(input.value) || 0;
//     // Add the new amount to the current value
//     const newVal = currentVal + amount;
    
//     input.value = newVal;
//     calculateChange();
// };

// function calculateChange() {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const paid = parseFloat(document.getElementById('amountPaid').value || 0);
//     const change = paid - total;
    
//     const changeEl = document.getElementById('changeAmount');
//     if (change >= 0) {
//         changeEl.innerText = '₱' + change.toLocaleString(undefined, {minimumFractionDigits: 2});
//         changeEl.style.color = 'var(--navy)';
//     } else {
//         changeEl.innerText = 'Insufficient';
//         changeEl.style.color = '#f44336';
//     }
// }

// window.processPayment = async function() {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const custName = document.getElementById('customerName').value || 'Walk-in';
//     const custPhone = document.getElementById('customerPhone').value || '-';
    
//     let paid = 0;
//     let ref = '-';

//     if (currentPaymentMethod === 'Cash') {
//         paid = parseFloat(document.getElementById('amountPaid').value || 0);
//         if (paid < total) {
//             showToast("Insufficient Cash", "error");
//             return;
//         }
//     } else {
//         ref = document.getElementById('referenceNumber').value;
//         paid = total; 
//         if (!ref) {
//             showToast("Please enter Reference Number", "error");
//             return;
//         }
//     }

//     const orderData = {
//         date: new Date(),
//         orderId: document.getElementById('orderNumber').innerText,
//         customer: custName,
//         contact: custPhone,
//         items: cart,
//         total: total,
//         method: currentPaymentMethod,
//         cashReceived: paid,
//         change: paid - total,
//         reference: ref,
//         cashier: localStorage.getItem('userName') || 'Staff'
//     };

//     try {
//         await addDoc(collection(db, "transactions"), orderData);

//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 // FIX: Ensure numeric calculation for new quantity
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         showReceipt(orderData);
//         window.closePaymentModal();
//         cart = [];
//         renderCart();
//         generateOrderID();
//         document.getElementById('customerName').value = '';
//         document.getElementById('customerPhone').value = '';
//         document.getElementById('referenceNumber').value = '';
        
//         showToast("Payment Successful!", "success");

//     } catch (err) {
//         console.error(err);
//         showToast("Transaction Failed", "error");
//     }
// };

// function showReceipt(data) {
//     document.getElementById('rec-date').innerText = new Date(data.date).toLocaleString();
//     document.getElementById('rec-orderId').innerText = data.orderId;
//     document.getElementById('rec-cashier').innerText = data.cashier;
//     document.getElementById('rec-customer').innerText = data.customer;
//     document.getElementById('rec-contact').innerText = data.contact;

//     const itemsDiv = document.getElementById('rec-items');
//     itemsDiv.innerHTML = '';
//     data.items.forEach(item => {
//         itemsDiv.innerHTML += `
//             <div class="rec-item-row">
//                 <span>${item.qty}x ${item.name}</span>
//                 <span>${(item.price * item.qty).toFixed(2)}</span>
//             </div>
//         `;
//     });

//     document.getElementById('rec-subtotal').innerText = data.total.toFixed(2);
//     document.getElementById('rec-total').innerText = data.total.toFixed(2);
//     document.getElementById('rec-method').innerText = data.method;
    
//     if(data.method === 'Cash') {
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('row-change').style.display = 'flex';
//         document.getElementById('row-ref').style.display = 'none';
//         document.getElementById('rec-cash').innerText = data.cashReceived.toFixed(2);
//         document.getElementById('rec-change').innerText = data.change.toFixed(2);
//     } else {
//         document.getElementById('row-cash-paid').style.display = 'none';
//         document.getElementById('row-change').style.display = 'none';
//         document.getElementById('row-ref').style.display = 'flex';
//         document.getElementById('rec-ref').innerText = data.reference;
//     }

//     document.getElementById('receiptModal').style.display = 'flex';
// }

// window.closeReceiptModal = function() {
//     document.getElementById('receiptModal').style.display = 'none';
// };

// window.printReceipt = function() {
//     window.print();
// };

// function generateOrderID() {
//     const randomId = Math.floor(100000 + Math.random() * 900000);
//     document.getElementById('orderNumber').innerText = `#ORD-${randomId}`;
// }

// function showToast(msg, type) {
//     const container = document.getElementById('toast-container');
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = type === 'success' ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    
//     container.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
// }







// js/pos.js - CUSTOM CLEAR MODAL + LOADING SPINNER

// import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { 
//     db, auth, collection, addDoc, updateDoc, doc, onSnapshot 
// } from './firebase.js';

// let products = [];
// let cart = [];
// let currentPaymentMethod = 'Cash'; 

// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
//     generateOrderID();
    
//     // --- LOGOUT CHECK ---
//     const userRole = localStorage.getItem('userRole'); 
//     const logoutBtn = document.getElementById('logout-sidebar-item');
//     if (userRole && userRole.toLowerCase() === 'cashier') {
//         if(logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         if(logoutBtn) logoutBtn.style.display = 'none';
//     }

//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     // Load Categories
//     onSnapshot(collection(db, "categories"), (snapshot) => {
//         const tabs = document.getElementById('categoryTabs');
//         if(tabs) {
//             tabs.innerHTML = '<button class="active" onclick="window.filterProducts(\'all\', this)">All</button>';
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 tabs.innerHTML += `<button onclick="window.filterProducts('${doc.id}', this)">${data.name}</button>`;
//             });
//         }
//     });

//     // Load Products
//     onSnapshot(collection(db, "products"), (snapshot) => {
//         products = [];
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             const stockVal = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
            
//             products.push({ 
//                 id: doc.id, 
//                 ...data,
//                 quantity: isNaN(stockVal) ? 0 : stockVal
//             });
//         });
//         renderProducts(products);
//     });

//     document.getElementById('productSearch')?.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = products.filter(p => p.name.toLowerCase().includes(term));
//         renderProducts(filtered);
//     });

//     document.getElementById('amountPaid')?.addEventListener('input', calculateChange);
// });

// function initTheme() {
//     if (localStorage.getItem('theme') === 'dark') {
//         document.body.classList.add('dark-mode');
//     }
// }

// // --- LOGOUT LOGIC ---
// window.openLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'flex';
// };
// window.closeLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'none';
// };
// window.confirmLogout = async function() {
//     try {
//         await signOut(auth);
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userName');
//         window.location.href = 'index.html';
//     } catch (error) {
//         console.error("Logout Error:", error);
//     }
// };

// function renderProducts(list) {
//     const grid = document.getElementById('productsGrid');
//     if(!grid) return;
//     grid.innerHTML = '';
    
//     if (list.length === 0) {
//         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey);">No products found.</p>';
//         return;
//     }

//     list.forEach(p => {
//         const qty = Number(p.quantity || p.stock || 0);
//         const isOOS = qty <= 0;
        
//         const card = document.createElement('div');
//         card.className = `product-card ${isOOS ? 'oos' : ''}`;
//         card.onclick = () => !isOOS && addToCart(p);
        
//         const displayPrice = parseFloat(p.price || p.cost || 0);
//         const imgUrl = p.imageUrl || p.image || p.img || p.photoURL || '';
//         const imageHtml = imgUrl 
//             ? `<div class="card-image-box"><img src="${imgUrl}" alt="${p.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><div class="prod-icon-fallback" style="display:none"><i class="fas fa-utensils"></i></div></div>`
//             : `<div class="card-image-box"><div class="prod-icon-fallback"><i class="fas fa-utensils"></i></div></div>`;

//         card.innerHTML = `
//             ${imageHtml}
//             <div class="product-info">
//                 <div>
//                     <h4>${p.name}</h4>
//                     <p class="stock">Stock: ${qty} ${p.unit || 'pcs'}</p>
//                 </div>
//                 <span class="price">₱${displayPrice.toLocaleString()}</span>
//             </div>
//             ${isOOS ? '<div class="oos-overlay">Out of Stock</div>' : ''}
//         `;
//         grid.appendChild(card);
//     });
// }

// window.filterProducts = function(catId, btn) {
//     document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const filtered = (catId === 'all') ? products : products.filter(p => p.category === catId);
//     renderProducts(filtered);
// };

// function addToCart(product) {
//     const existing = cart.find(i => i.id === product.id);
//     const currentQty = existing ? existing.qty : 0;
//     const productStock = Number(product.quantity || product.stock || 0);
    
//     if (currentQty + 1 > productStock) {
//         showToast("Not enough stock!", "error");
//         return;
//     }
//     const priceToUse = parseFloat(product.price || product.cost || 0);

//     if (existing) {
//         existing.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             name: product.name,
//             price: priceToUse,
//             qty: 1
//         });
//     }
//     renderCart();
// }

// function renderCart() {
//     const container = document.getElementById('cartItems');
//     if(!container) return;
//     container.innerHTML = '';
//     if (cart.length === 0) {
//         container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i><p>No items added yet</p></div>`;
//         updateTotals(0);
//         return;
//     }
//     let total = 0;
//     cart.forEach((item, index) => {
//         const itemTotal = item.price * item.qty;
//         total += itemTotal;
//         const div = document.createElement('div');
//         div.className = 'cart-item';
//         div.innerHTML = `
//             <div class="item-info">
//                 <h4>${item.name}</h4>
//                 <p>₱${item.price.toLocaleString()} x ${item.qty}</p>
//             </div>
//             <div class="item-total">₱${itemTotal.toLocaleString()}</div>
//             <div class="item-actions">
//                 <button onclick="window.updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
//                 <span style="font-size:12px; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
//                 <button onclick="window.updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
//                 <button class="remove" onclick="window.removeItem(${index})"><i class="fas fa-trash"></i></button>
//             </div>
//         `;
//         container.appendChild(div);
//     });
//     updateTotals(total);
// }

// window.updateQty = function(index, change) {
//     const item = cart[index];
//     const product = products.find(p => p.id === item.id);
//     if (change === 1) {
//         const productStock = Number(product.quantity || product.stock || 0);
//         if (item.qty + 1 > productStock) {
//             showToast("Max stock reached", "error");
//             return;
//         }
//         item.qty++;
//     } else {
//         if (item.qty > 1) item.qty--;
//         else cart.splice(index, 1);
//     }
//     renderCart();
// };
// window.removeItem = function(index) {
//     cart.splice(index, 1);
//     renderCart();
// };

// // ============================================
// // NEW: CLEAR ORDER MODAL LOGIC (No Alert)
// // ============================================

// // 1. Triggered by the "Clear" button in HTML
// window.clearCart = function() {
//     if(cart.length === 0) return; // Don't show modal if cart is already empty
//     document.getElementById('clearOrderModal').style.display = 'flex';
// };

// // 2. Triggered by "Cancel" in the modal
// window.closeClearModal = function() {
//     document.getElementById('clearOrderModal').style.display = 'none';
// };

// // 3. Triggered by "Yes, Clear It" in the modal
// window.confirmClearOrder = function() {
//     cart = [];
//     renderCart();
//     window.closeClearModal();
//     showToast("Order cleared", "success");
// };

// function updateTotals(subtotal) {
//     const total = subtotal; 
//     document.getElementById('subtotalDisplay').innerText = '₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const vatEl = document.getElementById('vatDisplay');
//     if(vatEl) vatEl.innerText = '₱0.00'; 
//     document.getElementById('totalDisplay').innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const modalTotal = document.getElementById('modalTotalAmount');
//     if(modalTotal) {
//         modalTotal.dataset.value = total;
//         modalTotal.innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     }
// }

// // --- PAYMENT LOGIC ---

// window.openPaymentModal = function() {
//     if (cart.length === 0) {
//         showToast("Cart is empty!", "error");
//         return;
//     }
//     document.getElementById('paymentModal').style.display = 'flex';
//     document.getElementById('amountPaid').value = '';
//     document.getElementById('changeAmount').innerText = '₱0.00';
    
//     if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//     if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = ''; 
//     if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
// };
// window.closePaymentModal = function() {
//     document.getElementById('paymentModal').style.display = 'none';
// };

// window.setPaymentMethod = function(method, btn) {
//     currentPaymentMethod = method;
//     document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const cashDiv = document.getElementById('cash-payment-section');
//     const digitalDiv = document.getElementById('digital-payment-section');
//     const qrDiv = document.getElementById('qr-code-section');
//     if (method === 'Cash') {
//         if(cashDiv) cashDiv.style.display = 'block';
//         if(digitalDiv) digitalDiv.style.display = 'none';
//         if(qrDiv) qrDiv.style.display = 'none';
//     } else {
//         if(cashDiv) cashDiv.style.display = 'none';
//         if(digitalDiv) digitalDiv.style.display = 'block';
//         if(qrDiv) qrDiv.style.display = 'flex';
//     }
// };

// window.setCash = function(amount) {
//     const input = document.getElementById('amountPaid');
//     const currentVal = parseFloat(input.value) || 0;
//     input.value = currentVal + amount;
//     calculateChange();
// };

// function calculateChange() {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const paid = parseFloat(document.getElementById('amountPaid').value || 0);
//     const change = paid - total;
//     const changeEl = document.getElementById('changeAmount');
//     if (change >= 0) {
//         changeEl.innerText = '₱' + change.toLocaleString(undefined, {minimumFractionDigits: 2});
//         changeEl.style.color = 'var(--navy)';
//     } else {
//         changeEl.innerText = 'Insufficient';
//         changeEl.style.color = '#f44336';
//     }
// }

// // ============================================
// // PROCESS PAYMENT (With Spinner & Smart Selector)
// // ============================================

// window.processPayment = async function() {
//     // Finds the button automatically
//     const payBtn = document.querySelector('#paymentModal .btn-primary'); 
//     let originalBtnText = "Complete Payment";
    
//     if (payBtn) {
//         originalBtnText = payBtn.innerHTML;
//         payBtn.disabled = true;
//         payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
//     }

//     try {
//         const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//         const custName = document.getElementById('customerName')?.value || 'Walk-in';
//         const custPhone = document.getElementById('customerPhone')?.value || '-'; 
        
//         let paid = 0;
//         let ref = '-';

//         if (currentPaymentMethod === 'Cash') {
//             paid = parseFloat(document.getElementById('amountPaid').value || 0);
//             if (paid < total) {
//                 showToast("Insufficient Cash", "error");
//                 throw new Error("Insufficient Cash"); 
//             }
//         } else {
//             const refInput = document.getElementById('referenceNumber') || document.getElementById('payment-reference');
//             ref = refInput ? refInput.value : '';
//             paid = total; 
//             if (!ref) {
//                 showToast("Please enter Reference Number", "error");
//                 throw new Error("Missing Reference"); 
//             }
//         }

//         // DELAY: 1.5 Seconds
//         await new Promise(resolve => setTimeout(resolve, 1500));

//         const orderData = {
//             date: new Date(),
//             orderId: document.getElementById('orderNumber').innerText,
//             customer: custName,
//             contact: custPhone,
//             items: cart,
//             total: total,
//             method: currentPaymentMethod,
//             cashReceived: paid,
//             change: paid - total,
//             reference: ref,
//             cashier: localStorage.getItem('userName') || 'Staff'
//         };

//         const docRef = await addDoc(collection(db, "transactions"), orderData);

//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         showReceipt(orderData);
//         window.closePaymentModal();
        
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
        
//         showToast("Payment Successful!", "success");

//     } catch (err) {
//         console.error(err);
//         if(err.message !== "Insufficient Cash" && err.message !== "Missing Reference") {
//             showToast("Transaction Failed", "error");
//         }
//     } finally {
//         if (payBtn) {
//             payBtn.disabled = false;
//             payBtn.innerHTML = originalBtnText;
//         }
//     }
// };

// function showReceipt(data) {
//     document.getElementById('rec-date').innerText = new Date(data.date).toLocaleString();
//     document.getElementById('rec-orderId').innerText = data.orderId;
//     document.getElementById('rec-cashier').innerText = data.cashier;
//     document.getElementById('rec-customer').innerText = data.customer;
//     document.getElementById('rec-contact').innerText = data.contact;

//     const itemsDiv = document.getElementById('rec-items');
//     itemsDiv.innerHTML = '';
//     data.items.forEach(item => {
//         itemsDiv.innerHTML += `<div class="rec-item-row"><span>${item.qty}x ${item.name}</span><span>${(item.price * item.qty).toFixed(2)}</span></div>`;
//     });

//     document.getElementById('rec-subtotal').innerText = data.total.toFixed(2);
//     document.getElementById('rec-total').innerText = data.total.toFixed(2);
//     document.getElementById('rec-method').innerText = data.method;
    
//     if(data.method === 'Cash') {
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('row-change').style.display = 'flex';
//         document.getElementById('row-ref').style.display = 'none';
//         document.getElementById('rec-cash').innerText = data.cashReceived.toFixed(2);
//         document.getElementById('rec-change').innerText = data.change.toFixed(2);
//     } else {
//         document.getElementById('row-cash-paid').style.display = 'none';
//         document.getElementById('row-change').style.display = 'none';
//         document.getElementById('row-ref').style.display = 'flex';
//         document.getElementById('rec-ref').innerText = data.reference;
//     }
//     document.getElementById('receiptModal').style.display = 'flex';
// }
// window.closeReceiptModal = function() { document.getElementById('receiptModal').style.display = 'none'; };
// window.printReceipt = function() { window.print(); };
// function generateOrderID() {
//     const randomId = Math.floor(100000 + Math.random() * 900000);
//     document.getElementById('orderNumber').innerText = `#ORD-${randomId}`;
// }
// function showToast(msg, type) {
//     const container = document.getElementById('toast-container');
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = type === 'success' ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
//     container.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
// }


// // --- NEW FUNCTION: Process Downpayment ---
// window.processDownpayment = async function() {
//     if (cart.length === 0) return showToast('Cart is empty', 'error');

//     const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
//     // Get the input amount
//     let cashReceived = 0;
//     const cashInput = document.getElementById('cashInput');
    
//     if (cashInput) {
//         cashReceived = parseFloat(cashInput.value);
//     }

//     // 1. Validate Amount
//     if (isNaN(cashReceived) || cashReceived <= 0) {
//         return showToast('Please enter a valid amount', 'error');
//     }

//     // 2. Prevent Downpayment if amount is greater than or equal to Total (That's a full payment)
//     if (cashReceived >= total) {
//         return showToast('Amount covers full bill. Please use "Complete Payment".', 'warning');
//     }

//     const balance = total - cashReceived;

//     // 3. Prepare Order Data with Partial Status
//     const orderData = {
//         orderNumber: document.getElementById('orderNumber').innerText,
//         date: new Date().toISOString(),
//         items: cart,
//         totalAmount: total,
//         amountPaid: cashReceived,
//         change: 0, 
//         balance: balance,       // Record the remaining balance
//         paymentMethod: currentPaymentMethod,
//         reference: document.getElementById('refInput') ? document.getElementById('refInput').value : '',
//         status: 'Partial',      // Mark as Partial
//         cashier: localStorage.getItem('username') || 'Unknown'
//     };

//     try {
//         // Save to Firebase (Assuming you have this function, if not, allow the standard save)
//         // If your saveOrder function is separate, ensure it handles the 'status' field.
//         await addDoc(collection(db, "orders"), orderData); 

//         // 4. Update Receipt Modal UI for Partial Payment
//         document.getElementById('rec-order-num').innerText = orderData.orderNumber;
//         document.getElementById('rec-date').innerText = new Date().toLocaleString();
        
//         // Render Items
//         const itemsContainer = document.getElementById('rec-items');
//         itemsContainer.innerHTML = '';
//         cart.forEach(item => {
//             itemsContainer.innerHTML += `
//                 <div class="receipt-item">
//                     <span>${item.name} x${item.qty}</span>
//                     <span>${(item.price * item.qty).toFixed(2)}</span>
//                 </div>
//             `;
//         });

//         document.getElementById('rec-total').innerText = total.toFixed(2);
        
//         // --- DISPLAY LOGIC FOR DOWNPAYMENT ---
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('rec-cash').innerText = cashReceived.toFixed(2);
        
//         // Hide Change, Show Balance
//         document.getElementById('row-change').style.display = 'none';
        
//         const rowBalance = document.getElementById('row-balance');
//         const recBalance = document.getElementById('rec-balance');
        
//         if(rowBalance && recBalance) {
//             rowBalance.style.display = 'flex';
//             recBalance.innerText = balance.toFixed(2);
//         }

//         // Handle Reference if needed
//         if (currentPaymentMethod !== 'Cash') {
//             document.getElementById('row-ref').style.display = 'flex';
//             document.getElementById('rec-ref').innerText = orderData.reference;
//         } else {
//             document.getElementById('row-ref').style.display = 'none';
//         }

//         // Show Receipt
//         document.getElementById('paymentModal').style.display = 'none';
//         document.getElementById('receiptModal').style.display = 'flex';
        
//         // Reset Cart
//         cart = [];
//         updateCartUI();
//         generateOrderID();
//         if(cashInput) cashInput.value = '';

//         showToast('Downpayment recorded successfully', 'success');

//     } catch (error) {
//         console.error("Error saving order: ", error);
//         showToast('Error saving order', 'error');
//     }
// };













//code// 2/8/26 12/12

// import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { 
//     db, auth, collection, addDoc, updateDoc, doc, onSnapshot 
// } from './firebase.js';

// let products = [];
// let cart = [];
// let currentPaymentMethod = 'Cash'; 

// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
//     generateOrderID();
    
//     // --- LOGOUT CHECK ---
//     const userRole = localStorage.getItem('userRole'); 
//     const logoutBtn = document.getElementById('logout-sidebar-item');
//     if (userRole && userRole.toLowerCase() === 'cashier') {
//         if(logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         if(logoutBtn) logoutBtn.style.display = 'none';
//     }

//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     // Load Categories
//     onSnapshot(collection(db, "categories"), (snapshot) => {
//         const tabs = document.getElementById('categoryTabs');
//         if(tabs) {
//             tabs.innerHTML = '<button class="active" onclick="window.filterProducts(\'all\', this)">All</button>';
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 tabs.innerHTML += `<button onclick="window.filterProducts('${doc.id}', this)">${data.name}</button>`;
//             });
//         }
//     });

//     // Load Products
//     onSnapshot(collection(db, "products"), (snapshot) => {
//         products = [];
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             const stockVal = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
            
//             products.push({ 
//                 id: doc.id, 
//                 ...data,
//                 quantity: isNaN(stockVal) ? 0 : stockVal
//             });
//         });
//         renderProducts(products);
//     });

//     document.getElementById('productSearch')?.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = products.filter(p => p.name.toLowerCase().includes(term));
//         renderProducts(filtered);
//     });

//     document.getElementById('amountPaid')?.addEventListener('input', calculateChange);
// });

// function initTheme() {
//     if (localStorage.getItem('theme') === 'dark') {
//         document.body.classList.add('dark-mode');
//     }
// }

// // --- LOGOUT LOGIC ---
// window.openLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'flex';
// };
// window.closeLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'none';
// };
// window.confirmLogout = async function() {
//     try {
//         await signOut(auth);
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userName');
//         window.location.href = 'index.html';
//     } catch (error) {
//         console.error("Logout Error:", error);
//     }
// };

// function renderProducts(list) {
//     const grid = document.getElementById('productsGrid');
//     if(!grid) return;
//     grid.innerHTML = '';
    
//     if (list.length === 0) {
//         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey);">No products found.</p>';
//         return;
//     }

//     list.forEach(p => {
//         const qty = Number(p.quantity || p.stock || 0);
//         const isOOS = qty <= 0;
        
//         const card = document.createElement('div');
//         card.className = `product-card ${isOOS ? 'oos' : ''}`;
//         card.onclick = () => !isOOS && addToCart(p);
        
//         const displayPrice = parseFloat(p.price || p.cost || 0);
//         const imgUrl = p.imageUrl || p.image || p.img || p.photoURL || '';
//         const imageHtml = imgUrl 
//             ? `<div class="card-image-box"><img src="${imgUrl}" alt="${p.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><div class="prod-icon-fallback" style="display:none"><i class="fas fa-utensils"></i></div></div>`
//             : `<div class="card-image-box"><div class="prod-icon-fallback"><i class="fas fa-utensils"></i></div></div>`;

//         card.innerHTML = `
//             ${imageHtml}
//             <div class="product-info">
//                 <div>
//                     <h4>${p.name}</h4>
//                     <p class="stock">Stock: ${qty} ${p.unit || 'pcs'}</p>
//                 </div>
//                 <span class="price">₱${displayPrice.toLocaleString()}</span>
//             </div>
//             ${isOOS ? '<div class="oos-overlay">Out of Stock</div>' : ''}
//         `;
//         grid.appendChild(card);
//     });
// }

// window.filterProducts = function(catId, btn) {
//     document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const filtered = (catId === 'all') ? products : products.filter(p => p.category === catId);
//     renderProducts(filtered);
// };

// function addToCart(product) {
//     const existing = cart.find(i => i.id === product.id);
//     const currentQty = existing ? existing.qty : 0;
//     const productStock = Number(product.quantity || product.stock || 0);
    
//     if (currentQty + 1 > productStock) {
//         showToast("Not enough stock!", "error");
//         return;
//     }
//     const priceToUse = parseFloat(product.price || product.cost || 0);

//     if (existing) {
//         existing.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             name: product.name,
//             price: priceToUse,
//             qty: 1
//         });
//     }
//     renderCart();
// }

// function renderCart() {
//     const container = document.getElementById('cartItems');
//     if(!container) return;
//     container.innerHTML = '';
//     if (cart.length === 0) {
//         container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i><p>No items added yet</p></div>`;
//         updateTotals(0);
//         return;
//     }
//     let total = 0;
//     cart.forEach((item, index) => {
//         const itemTotal = item.price * item.qty;
//         total += itemTotal;
//         const div = document.createElement('div');
//         div.className = 'cart-item';
//         div.innerHTML = `
//             <div class="item-info">
//                 <h4>${item.name}</h4>
//                 <p>₱${item.price.toLocaleString()} x ${item.qty}</p>
//             </div>
//             <div class="item-total">₱${itemTotal.toLocaleString()}</div>
//             <div class="item-actions">
//                 <button onclick="window.updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
//                 <span style="font-size:12px; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
//                 <button onclick="window.updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
//                 <button class="remove" onclick="window.removeItem(${index})"><i class="fas fa-trash"></i></button>
//             </div>
//         `;
//         container.appendChild(div);
//     });
//     updateTotals(total);
// }

// window.updateQty = function(index, change) {
//     const item = cart[index];
//     const product = products.find(p => p.id === item.id);
//     if (change === 1) {
//         const productStock = Number(product.quantity || product.stock || 0);
//         if (item.qty + 1 > productStock) {
//             showToast("Max stock reached", "error");
//             return;
//         }
//         item.qty++;
//     } else {
//         if (item.qty > 1) item.qty--;
//         else cart.splice(index, 1);
//     }
//     renderCart();
// };
// window.removeItem = function(index) {
//     cart.splice(index, 1);
//     renderCart();
// };

// // ============================================
// // CLEAR ORDER MODAL LOGIC
// // ============================================

// window.clearCart = function() {
//     if(cart.length === 0) return;
//     document.getElementById('clearOrderModal').style.display = 'flex';
// };

// window.closeClearModal = function() {
//     document.getElementById('clearOrderModal').style.display = 'none';
// };

// window.confirmClearOrder = function() {
//     cart = [];
//     renderCart();
//     window.closeClearModal();
//     showToast("Order cleared", "success");
// };

// function updateTotals(subtotal) {
//     const total = subtotal; 
//     document.getElementById('subtotalDisplay').innerText = '₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const vatEl = document.getElementById('vatDisplay');
//     if(vatEl) vatEl.innerText = '₱0.00'; 
//     document.getElementById('totalDisplay').innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const modalTotal = document.getElementById('modalTotalAmount');
//     if(modalTotal) {
//         modalTotal.dataset.value = total;
//         modalTotal.innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     }
// }

// // --- PAYMENT LOGIC ---

// window.openPaymentModal = function() {
//     if (cart.length === 0) {
//         showToast("Cart is empty!", "error");
//         return;
//     }
//     document.getElementById('paymentModal').style.display = 'flex';
//     document.getElementById('amountPaid').value = '';
//     document.getElementById('changeAmount').innerText = '₱0.00';
//     document.getElementById('changeAmount').style.color = 'var(--navy)';
    
//     if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//     if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = ''; 
//     if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
// };
// window.closePaymentModal = function() {
//     document.getElementById('paymentModal').style.display = 'none';
// };

// window.setPaymentMethod = function(method, btn) {
//     currentPaymentMethod = method;
//     document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const cashDiv = document.getElementById('cash-payment-section');
//     const digitalDiv = document.getElementById('digital-payment-section');
//     const qrDiv = document.getElementById('qr-code-section');
//     if (method === 'Cash') {
//         if(cashDiv) cashDiv.style.display = 'block';
//         if(digitalDiv) digitalDiv.style.display = 'none';
//         if(qrDiv) qrDiv.style.display = 'none';
//     } else {
//         if(cashDiv) cashDiv.style.display = 'none';
//         if(digitalDiv) digitalDiv.style.display = 'block';
//         if(qrDiv) qrDiv.style.display = 'flex';
//     }
// };

// window.setCash = function(amount) {
//     const input = document.getElementById('amountPaid');
//     const currentVal = parseFloat(input.value) || 0;
//     input.value = currentVal + amount;
//     calculateChange();
// };

// function calculateChange() {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const input = document.getElementById('amountPaid');
//     const paid = parseFloat(input.value || 0);
//     const change = paid - total;
//     const changeEl = document.getElementById('changeAmount');
    
//     changeEl.innerText = '₱' + change.toLocaleString(undefined, {minimumFractionDigits: 2});
    
//     if (change >= 0) {
//         changeEl.style.color = 'var(--navy)';
//     } else {
//         changeEl.style.color = '#f44336'; 
//     }
// }

// // ============================================
// // PROCESS COMPLETE PAYMENT (FULL)
// // ============================================

// window.processPayment = async function() {
//     const payBtn = document.querySelector('#paymentModal .btn-primary'); 
//     let originalBtnText = "Complete Payment";
    
//     if (payBtn) {
//         originalBtnText = payBtn.innerHTML;
//         payBtn.disabled = true;
//         payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
//     }

//     try {
//         const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//         const custName = document.getElementById('customerName')?.value || 'Walk-in';
//         const custPhone = document.getElementById('customerPhone')?.value || '-'; 
        
//         let paid = 0;
//         let ref = '-';

//         if (currentPaymentMethod === 'Cash') {
//             paid = parseFloat(document.getElementById('amountPaid').value || 0);
            
//             if (paid < total) {
//                 showToast("Insufficient Cash", "error");
//                 throw new Error("Insufficient Cash"); 
//             }
//         } else {
//             const refInput = document.getElementById('referenceNumber') || document.getElementById('payment-reference');
//             ref = refInput ? refInput.value : '';
//             paid = total; 
//             if (!ref) {
//                 showToast("Please enter Reference Number", "error");
//                 throw new Error("Missing Reference"); 
//             }
//         }

//         // DELAY
//         await new Promise(resolve => setTimeout(resolve, 1500));

//         const orderData = {
//             date: new Date().toISOString(),
//             orderId: document.getElementById('orderNumber').innerText,
//             customer: custName,
//             contact: custPhone,
//             items: cart,
//             total: total,
//             method: currentPaymentMethod,
//             cashReceived: paid,
//             change: paid - total,
//             reference: ref,
//             cashier: localStorage.getItem('userName') || 'Staff'
//         };

//         await addDoc(collection(db, "transactions"), orderData);

//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         showReceipt(orderData);
//         window.closePaymentModal();
        
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
        
//         showToast("Payment Successful!", "success");

//     } catch (err) {
//         console.error(err);
//         if(err.message !== "Insufficient Cash" && err.message !== "Missing Reference") {
//             showToast("Transaction Failed", "error");
//         }
//     } finally {
//         if (payBtn) {
//             payBtn.disabled = false;
//             payBtn.innerHTML = originalBtnText;
//         }
//     }
// };

// function showReceipt(data) {
//     document.getElementById('rec-date').innerText = new Date(data.date).toLocaleString();
//     document.getElementById('rec-orderId').innerText = data.orderId;
//     document.getElementById('rec-cashier').innerText = data.cashier;
//     if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = data.customer;
//     if(document.getElementById('rec-contact')) document.getElementById('rec-contact').innerText = data.contact;

//     const itemsDiv = document.getElementById('rec-items');
//     itemsDiv.innerHTML = '';
//     data.items.forEach(item => {
//         itemsDiv.innerHTML += `<div class="rec-item-row"><span>${item.qty}x ${item.name}</span><span>${(item.price * item.qty).toFixed(2)}</span></div>`;
//     });

//     document.getElementById('rec-subtotal').innerText = data.total.toFixed(2);
//     document.getElementById('rec-total').innerText = data.total.toFixed(2);
//     document.getElementById('rec-method').innerText = data.method;
    
//     // Default visibility
//     const rowBalance = document.getElementById('row-balance');
//     if(rowBalance) rowBalance.style.display = 'none';

//     if(data.method === 'Cash') {
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('row-change').style.display = 'flex';
//         document.getElementById('row-ref').style.display = 'none';
//         document.getElementById('rec-cash').innerText = data.cashReceived.toFixed(2);
//         document.getElementById('rec-change').innerText = data.change.toFixed(2);
//     } else {
//         document.getElementById('row-cash-paid').style.display = 'none';
//         document.getElementById('row-change').style.display = 'none';
//         document.getElementById('row-ref').style.display = 'flex';
//         document.getElementById('rec-ref').innerText = data.reference;
//     }
//     document.getElementById('receiptModal').style.display = 'flex';
// }

// window.closeReceiptModal = function() { document.getElementById('receiptModal').style.display = 'none'; };
// window.printReceipt = function() { window.print(); };

// function generateOrderID() {
//     const randomId = Math.floor(100000 + Math.random() * 900000);
//     document.getElementById('orderNumber').innerText = `#ORD-${randomId}`;
// }

// function showToast(msg, type) {
//     const container = document.getElementById('toast-container');
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = type === 'success' ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
//     container.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
// }

// // ============================================
// // DOWNPAYMENT LOGIC (Includes Digital Popup)
// // ============================================

// window.processDownpayment = async function() {
//     if (cart.length === 0) return showToast('Cart is empty', 'error');

//     // 1. Check for Digital Payment (GCash/Bank) -> Show Popup
//     if (currentPaymentMethod !== 'Cash') {
//         window.openDigitalDPModal();
//         return;
//     }

//     // 2. Standard Cash Logic
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const cashInput = document.getElementById('amountPaid');
//     let cashReceived = 0;
    
//     if (cashInput) {
//         cashReceived = parseFloat(cashInput.value);
//     }

//     if (isNaN(cashReceived) || cashReceived <= 0) {
//         return showToast('Please enter a valid amount', 'error');
//     }

//     if (cashReceived >= total) {
//         return showToast('Amount covers full bill. Please use "Complete Payment".', 'warning');
//     }

//     // Call shared save function
//     saveDownpayment(cashReceived, 'Cash', '');
// };

// // --- Digital Modal Functions ---

// window.openDigitalDPModal = function() {
//     document.getElementById('lbl-digi-method').innerText = currentPaymentMethod;
//     document.getElementById('digi-dp-amount').value = '';
//     // Pre-fill ref if user typed it in main modal
//     const mainRef = document.getElementById('referenceNumber');
//     document.getElementById('digi-dp-ref').value = mainRef ? mainRef.value : '';
    
//     document.getElementById('digitalDownpaymentModal').style.display = 'flex';
//     document.getElementById('digi-dp-amount').focus();
// };

// window.closeDigitalDPModal = function() {
//     document.getElementById('digitalDownpaymentModal').style.display = 'none';
// };

// window.confirmDigitalDP = function() {
//     const amountVal = parseFloat(document.getElementById('digi-dp-amount').value);
//     const refVal = document.getElementById('digi-dp-ref').value;
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);

//     if (isNaN(amountVal) || amountVal <= 0) {
//         return showToast("Please enter a valid amount", "error");
//     }
//     if (amountVal >= total) {
//         return showToast("Amount covers full bill. Use 'Complete Payment'", "warning");
//     }
//     if (!refVal.trim()) {
//         return showToast("Reference Number is required for Digital payments", "error");
//     }

//     window.closeDigitalDPModal();
//     saveDownpayment(amountVal, currentPaymentMethod, refVal);
// };

// // --- Shared Save Function for Downpayments ---
// // --- Shared Save Function for Downpayments (FIXED: NOW REDUCES STOCK) ---
// async function saveDownpayment(amountPaid, method, reference) {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const balance = total - amountPaid;

//     const orderData = {
//         orderId: document.getElementById('orderNumber').innerText,
//         date: new Date().toISOString(),
//         items: cart,
//         total: total,
//         cashReceived: amountPaid,
//         change: 0, 
//         balance: balance,
//         method: method,
//         reference: reference,
//         status: 'Partial',
//         cashier: localStorage.getItem('userName') || 'Staff',
//         customer: document.getElementById('customerName')?.value || 'Walk-in',
//         contact: document.getElementById('customerPhone')?.value || '-'
//     };

//     try {
//         // 1. Save Transaction
//         await addDoc(collection(db, "transactions"), orderData); 

//         // 2. REDUCE STOCK (This was missing before!)
//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             // Get current stock from our local products list
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 // Update Firebase
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         // 3. Update Receipt UI
//         document.getElementById('rec-orderId').innerText = orderData.orderId;
//         document.getElementById('rec-date').innerText = new Date().toLocaleString();
//         document.getElementById('rec-cashier').innerText = orderData.cashier;
//         if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = orderData.customer;

//         const itemsContainer = document.getElementById('rec-items');
//         itemsContainer.innerHTML = '';
//         cart.forEach(item => {
//             itemsContainer.innerHTML += `
//                 <div class="rec-item-row">
//                     <span>${item.qty}x ${item.name}</span>
//                     <span>${(item.price * item.qty).toFixed(2)}</span>
//                 </div>
//             `;
//         });

//         document.getElementById('rec-total').innerText = total.toFixed(2);
        
//         // Show Paid Amount
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('rec-cash').innerText = amountPaid.toFixed(2);
        
//         // Hide Change, Show Balance
//         document.getElementById('row-change').style.display = 'none';
        
//         const rowBalance = document.getElementById('row-balance');
//         const recBalance = document.getElementById('rec-balance');
//         if(rowBalance && recBalance) {
//             rowBalance.style.display = 'flex';
//             recBalance.innerText = balance.toFixed(2);
//         }

//         // Handle Reference Logic for Receipt
//         if (method !== 'Cash') {
//             document.getElementById('row-ref').style.display = 'flex';
//             document.getElementById('rec-ref').innerText = reference;
//         } else {
//             document.getElementById('row-ref').style.display = 'none';
//         }

//         // Close Modals & Open Receipt
//         document.getElementById('paymentModal').style.display = 'none';
//         document.getElementById('receiptModal').style.display = 'flex';
        
//         // Reset
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('amountPaid')) document.getElementById('amountPaid').value = '';
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';

//         showToast('Downpayment recorded & Stock updated!', 'success');

//     } catch (error) {
//         console.error("Error saving order: ", error);
//         showToast('Error saving order', 'error');
//     }
// }













//FINALE CODE PERO NEED ICHANGES

// import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { 
//     db, auth, collection, addDoc, updateDoc, doc, onSnapshot 
// } from './firebase.js';

// let products = [];
// let cart = [];
// let currentPaymentMethod = 'Cash'; 

// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
//     generateOrderID();
    
//     // --- LOGOUT CHECK ---
//     const userRole = localStorage.getItem('userRole'); 
//     const logoutBtn = document.getElementById('logout-sidebar-item');
//     if (userRole && userRole.toLowerCase() === 'cashier') {
//         if(logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         if(logoutBtn) logoutBtn.style.display = 'none';
//     }

//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     // Load Categories
//     onSnapshot(collection(db, "categories"), (snapshot) => {
//         const tabs = document.getElementById('categoryTabs');
//         if(tabs) {
//             tabs.innerHTML = '<button class="active" onclick="window.filterProducts(\'all\', this)">All</button>';
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 tabs.innerHTML += `<button onclick="window.filterProducts('${doc.id}', this)">${data.name}</button>`;
//             });
//         }
//     });

//     // Load Products
//     onSnapshot(collection(db, "products"), (snapshot) => {
//         products = [];
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             const stockVal = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
            
//             products.push({ 
//                 id: doc.id, 
//                 ...data,
//                 quantity: isNaN(stockVal) ? 0 : stockVal
//             });
//         });
//         renderProducts(products);
//     });

//     document.getElementById('productSearch')?.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = products.filter(p => p.name.toLowerCase().includes(term));
//         renderProducts(filtered);
//     });

//     document.getElementById('amountPaid')?.addEventListener('input', calculateChange);
// });

// function initTheme() {
//     if (localStorage.getItem('theme') === 'dark') {
//         document.body.classList.add('dark-mode');
//     }
// }

// // --- LOGOUT LOGIC ---
// window.openLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'flex';
// };
// window.closeLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'none';
// };
// window.confirmLogout = async function() {
//     try {
//         await signOut(auth);
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userName');
//         window.location.href = 'index.html';
//     } catch (error) {
//         console.error("Logout Error:", error);
//     }
// };

// function renderProducts(list) {
//     const grid = document.getElementById('productsGrid');
//     if(!grid) return;
//     grid.innerHTML = '';
    
//     if (list.length === 0) {
//         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey);">No products found.</p>';
//         return;
//     }

//     list.forEach(p => {
//         const qty = Number(p.quantity || p.stock || 0);
//         const isOOS = qty <= 0;
        
//         const card = document.createElement('div');
//         card.className = `product-card ${isOOS ? 'oos' : ''}`;
//         card.onclick = () => !isOOS && addToCart(p);
        
//         const displayPrice = parseFloat(p.price || p.cost || 0);
//         const imgUrl = p.imageUrl || p.image || p.img || p.photoURL || '';
//         const imageHtml = imgUrl 
//             ? `<div class="card-image-box"><img src="${imgUrl}" alt="${p.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><div class="prod-icon-fallback" style="display:none"><i class="fas fa-utensils"></i></div></div>`
//             : `<div class="card-image-box"><div class="prod-icon-fallback"><i class="fas fa-utensils"></i></div></div>`;

//         card.innerHTML = `
//             ${imageHtml}
//             <div class="product-info">
//                 <div>
//                     <h4>${p.name}</h4>
//                     <p class="stock">Stock: ${qty} ${p.unit || 'pcs'}</p>
//                 </div>
//                 <span class="price">₱${displayPrice.toLocaleString()}</span>
//             </div>
//             ${isOOS ? '<div class="oos-overlay">Out of Stock</div>' : ''}
//         `;
//         grid.appendChild(card);
//     });
// }

// window.filterProducts = function(catId, btn) {
//     document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const filtered = (catId === 'all') ? products : products.filter(p => p.category === catId);
//     renderProducts(filtered);
// };

// function addToCart(product) {
//     const existing = cart.find(i => i.id === product.id);
//     const currentQty = existing ? existing.qty : 0;
//     const productStock = Number(product.quantity || product.stock || 0);
    
//     if (currentQty + 1 > productStock) {
//         showToast("Not enough stock!", "error");
//         return;
//     }
//     const priceToUse = parseFloat(product.price || product.cost || 0);

//     if (existing) {
//         existing.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             name: product.name,
//             price: priceToUse,
//             qty: 1
//         });
//     }
//     renderCart();
// }

// function renderCart() {
//     const container = document.getElementById('cartItems');
//     if(!container) return;
//     container.innerHTML = '';
//     if (cart.length === 0) {
//         container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i><p>No items added yet</p></div>`;
//         updateTotals(0);
//         return;
//     }
//     let total = 0;
//     cart.forEach((item, index) => {
//         const itemTotal = item.price * item.qty;
//         total += itemTotal;
//         const div = document.createElement('div');
//         div.className = 'cart-item';
//         div.innerHTML = `
//             <div class="item-info">
//                 <h4>${item.name}</h4>
//                 <p>₱${item.price.toLocaleString()} x ${item.qty}</p>
//             </div>
//             <div class="item-total">₱${itemTotal.toLocaleString()}</div>
//             <div class="item-actions">
//                 <button onclick="window.updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
//                 <span style="font-size:12px; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
//                 <button onclick="window.updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
//                 <button class="remove" onclick="window.removeItem(${index})"><i class="fas fa-trash"></i></button>
//             </div>
//         `;
//         container.appendChild(div);
//     });
//     updateTotals(total);
// }

// window.updateQty = function(index, change) {
//     const item = cart[index];
//     const product = products.find(p => p.id === item.id);
//     if (change === 1) {
//         const productStock = Number(product.quantity || product.stock || 0);
//         if (item.qty + 1 > productStock) {
//             showToast("Max stock reached", "error");
//             return;
//         }
//         item.qty++;
//     } else {
//         if (item.qty > 1) item.qty--;
//         else cart.splice(index, 1);
//     }
//     renderCart();
// };
// window.removeItem = function(index) {
//     cart.splice(index, 1);
//     renderCart();
// };

// window.clearCart = function() {
//     if(cart.length === 0) return;
//     document.getElementById('clearOrderModal').style.display = 'flex';
// };

// window.closeClearModal = function() {
//     document.getElementById('clearOrderModal').style.display = 'none';
// };

// window.confirmClearOrder = function() {
//     cart = [];
//     renderCart();
//     window.closeClearModal();
//     showToast("Order cleared", "success");
// };

// function updateTotals(subtotal) {
//     const total = subtotal; 
//     document.getElementById('subtotalDisplay').innerText = '₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const vatEl = document.getElementById('vatDisplay');
//     if(vatEl) vatEl.innerText = '₱0.00'; 
//     document.getElementById('totalDisplay').innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const modalTotal = document.getElementById('modalTotalAmount');
//     if(modalTotal) {
//         modalTotal.dataset.value = total;
//         modalTotal.innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     }
// }

// // --- PAYMENT LOGIC ---

// window.openPaymentModal = function() {
//     if (cart.length === 0) {
//         showToast("Cart is empty!", "error");
//         return;
//     }
//     document.getElementById('paymentModal').style.display = 'flex';
//     document.getElementById('amountPaid').value = '';
//     document.getElementById('changeAmount').innerText = '₱0.00';
//     document.getElementById('changeAmount').style.color = 'var(--navy)';
    
//     if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//     if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = ''; 
//     if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
// };
// window.closePaymentModal = function() {
//     document.getElementById('paymentModal').style.display = 'none';
// };

// window.setPaymentMethod = function(method, btn) {
//     currentPaymentMethod = method;
//     document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const cashDiv = document.getElementById('cash-payment-section');
//     const digitalDiv = document.getElementById('digital-payment-section');
//     const qrDiv = document.getElementById('qr-code-section');
//     if (method === 'Cash') {
//         if(cashDiv) cashDiv.style.display = 'block';
//         if(digitalDiv) digitalDiv.style.display = 'none';
//         if(qrDiv) qrDiv.style.display = 'none';
//     } else {
//         if(cashDiv) cashDiv.style.display = 'none';
//         if(digitalDiv) digitalDiv.style.display = 'block';
//         if(qrDiv) qrDiv.style.display = 'flex';
//     }
// };

// window.setCash = function(amount) {
//     const input = document.getElementById('amountPaid');
//     const currentVal = parseFloat(input.value) || 0;
//     input.value = currentVal + amount;
//     calculateChange();
// };

// function calculateChange() {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const input = document.getElementById('amountPaid');
//     const paid = parseFloat(input.value || 0);
//     const change = paid - total;
//     const changeEl = document.getElementById('changeAmount');
    
//     // Always show the number
//     changeEl.innerText = '₱' + change.toLocaleString(undefined, {minimumFractionDigits: 2});
    
//     if (change >= 0) {
//         changeEl.style.color = 'var(--navy)';
//     } else {
//         changeEl.style.color = '#f44336'; 
//     }
// }

// // ============================================
// // PROCESS COMPLETE PAYMENT (Simple Loading + Stock Reduction)
// // ============================================

// window.processPayment = async function() {
//     // 1. SAFE WAY TO FIND BUTTON: By its onclick attribute
//     const payBtn = document.querySelector('button[onclick="window.processPayment()"]');
//     setBtnLoading(payBtn, true);

//     try {
//         const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//         const custName = document.getElementById('customerName')?.value || 'Walk-in';
//         const custPhone = document.getElementById('customerPhone')?.value || '-'; 
        
//         let paid = 0;
//         let ref = '-';

//         if (currentPaymentMethod === 'Cash') {
//             paid = parseFloat(document.getElementById('amountPaid').value || 0);
            
//             if (paid < total) {
//                 showToast("Insufficient Cash", "error");
//                 throw new Error("Insufficient Cash"); 
//             }
//         } else {
//             const refInput = document.getElementById('referenceNumber') || document.getElementById('payment-reference');
//             ref = refInput ? refInput.value : '';
//             paid = total; 
//             if (!ref) {
//                 showToast("Please enter Reference Number", "error");
//                 throw new Error("Missing Reference"); 
//             }
//         }

//         const orderData = {
//             date: new Date().toISOString(),
//             orderId: document.getElementById('orderNumber').innerText,
//             customer: custName,
//             contact: custPhone,
//             items: cart,
//             total: total,
//             method: currentPaymentMethod,
//             cashReceived: paid,
//             change: paid - total,
//             reference: ref,
//             cashier: localStorage.getItem('userName') || 'Staff'
//         };

//         // SAVE
//         await addDoc(collection(db, "transactions"), orderData);

//         // REDUCE STOCK (The loop you wanted)
//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         showReceipt(orderData);
//         window.closePaymentModal();
        
//         // RESET
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
        
//         showToast("Payment Successful!", "success");

//     } catch (err) {
//         console.error(err);
//         if(err.message !== "Insufficient Cash" && err.message !== "Missing Reference") {
//             showToast("Transaction Failed", "error");
//         }
//     } finally {
//         setBtnLoading(payBtn, false);
//     }
// };

// function showReceipt(data) {
//     document.getElementById('rec-date').innerText = new Date(data.date).toLocaleString();
//     document.getElementById('rec-orderId').innerText = data.orderId;
//     document.getElementById('rec-cashier').innerText = data.cashier;
//     if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = data.customer;
//     if(document.getElementById('rec-contact')) document.getElementById('rec-contact').innerText = data.contact;

//     const itemsDiv = document.getElementById('rec-items');
//     itemsDiv.innerHTML = '';
//     data.items.forEach(item => {
//         itemsDiv.innerHTML += `<div class="rec-item-row"><span>${item.qty}x ${item.name}</span><span>${(item.price * item.qty).toFixed(2)}</span></div>`;
//     });

//     document.getElementById('rec-subtotal').innerText = data.total.toFixed(2);
//     document.getElementById('rec-total').innerText = data.total.toFixed(2);
//     document.getElementById('rec-method').innerText = data.method;
    
//     // Balance Logic
//     const rowBalance = document.getElementById('row-balance');
//     if(rowBalance) rowBalance.style.display = 'none';

//     if(data.method === 'Cash') {
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('row-change').style.display = 'flex';
//         document.getElementById('row-ref').style.display = 'none';
//         document.getElementById('rec-cash').innerText = data.cashReceived.toFixed(2);
//         document.getElementById('rec-change').innerText = data.change.toFixed(2);
//     } else {
//         document.getElementById('row-cash-paid').style.display = 'none';
//         document.getElementById('row-change').style.display = 'none';
//         document.getElementById('row-ref').style.display = 'flex';
//         document.getElementById('rec-ref').innerText = data.reference;
//     }
//     document.getElementById('receiptModal').style.display = 'flex';
// }

// window.closeReceiptModal = function() { document.getElementById('receiptModal').style.display = 'none'; };
// window.printReceipt = function() { window.print(); };

// function generateOrderID() {
//     const randomId = Math.floor(100000 + Math.random() * 900000);
//     document.getElementById('orderNumber').innerText = `#ORD-${randomId}`;
// }

// function showToast(msg, type) {
//     const container = document.getElementById('toast-container');
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = type === 'success' ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
//     container.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
// }

// // ============================================
// // PROCESS DOWNPAYMENT (Simple Loading + Stock Reduction)
// // ============================================

// window.processDownpayment = async function() {
//     if (cart.length === 0) return showToast('Cart is empty', 'error');

//     // Case 1: Digital -> Open Popup (No loading needed on main btn)
//     if (currentPaymentMethod !== 'Cash') {
//         window.openDigitalDPModal();
//         return;
//     }

//     // Case 2: Cash -> Process Immediate
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const cashInput = document.getElementById('amountPaid');
//     let cashReceived = 0;
    
//     if (cashInput) cashReceived = parseFloat(cashInput.value);

//     if (isNaN(cashReceived) || cashReceived <= 0) {
//         return showToast('Please enter a valid amount', 'error');
//     }

//     if (cashReceived >= total) {
//         return showToast('Amount covers full bill. Please use "Complete Payment".', 'warning');
//     }

//     // SAFE WAY TO FIND BUTTON
//     const dpBtn = document.querySelector('button[onclick="window.processDownpayment()"]');
//     setBtnLoading(dpBtn, true);

//     try {
//         await saveDownpayment(cashReceived, 'Cash', '');
//     } catch (e) {
//         console.error(e);
//     } finally {
//         setBtnLoading(dpBtn, false);
//     }
// };

// // --- Digital Modal Functions ---

// window.openDigitalDPModal = function() {
//     document.getElementById('lbl-digi-method').innerText = currentPaymentMethod;
//     document.getElementById('digi-dp-amount').value = '';
//     const mainRef = document.getElementById('referenceNumber');
//     document.getElementById('digi-dp-ref').value = mainRef ? mainRef.value : '';
    
//     document.getElementById('digitalDownpaymentModal').style.display = 'flex';
//     document.getElementById('digi-dp-amount').focus();
// };

// window.closeDigitalDPModal = function() {
//     document.getElementById('digitalDownpaymentModal').style.display = 'none';
// };

// window.confirmDigitalDP = async function() {
//     const amountVal = parseFloat(document.getElementById('digi-dp-amount').value);
//     const refVal = document.getElementById('digi-dp-ref').value;
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);

//     if (isNaN(amountVal) || amountVal <= 0) {
//         return showToast("Please enter a valid amount", "error");
//     }
//     if (amountVal >= total) {
//         return showToast("Amount covers full bill. Use 'Complete Payment'", "warning");
//     }
//     if (!refVal.trim()) {
//         return showToast("Reference Number is required for Digital payments", "error");
//     }

//     // SAFE WAY TO FIND BUTTON (Confirm inside Popup)
//     const confirmBtn = document.querySelector('#digitalDownpaymentModal button.btn-primary');
//     setBtnLoading(confirmBtn, true);

//     try {
//         window.closeDigitalDPModal();
//         await saveDownpayment(amountVal, currentPaymentMethod, refVal);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         setBtnLoading(confirmBtn, false);
//     }
// };

// // --- SHARED SAVE FUNCTION (WITH STOCK REDUCTION LOOP) ---
// async function saveDownpayment(amountPaid, method, reference) {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const balance = total - amountPaid;

//     const orderData = {
//         orderId: document.getElementById('orderNumber').innerText,
//         date: new Date().toISOString(),
//         items: cart,
//         total: total,
//         cashReceived: amountPaid,
//         change: 0, 
//         balance: balance,
//         method: method,
//         reference: reference,
//         status: 'Partial',
//         cashier: localStorage.getItem('userName') || 'Staff',
//         customer: document.getElementById('customerName')?.value || 'Walk-in',
//         contact: document.getElementById('customerPhone')?.value || '-'
//     };

//     try {
//         // 1. Save Transaction
//         await addDoc(collection(db, "transactions"), orderData); 

//         // 2. Reduce Stock (This is the loop you need!)
//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         // 3. Update Receipt
//         document.getElementById('rec-orderId').innerText = orderData.orderId;
//         document.getElementById('rec-date').innerText = new Date().toLocaleString();
//         document.getElementById('rec-cashier').innerText = orderData.cashier;
//         if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = orderData.customer;

//         const itemsContainer = document.getElementById('rec-items');
//         itemsContainer.innerHTML = '';
//         cart.forEach(item => {
//             itemsContainer.innerHTML += `
//                 <div class="rec-item-row">
//                     <span>${item.qty}x ${item.name}</span>
//                     <span>${(item.price * item.qty).toFixed(2)}</span>
//                 </div>
//             `;
//         });

//         document.getElementById('rec-total').innerText = total.toFixed(2);
        
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('rec-cash').innerText = amountPaid.toFixed(2);
        
//         document.getElementById('row-change').style.display = 'none';
        
//         const rowBalance = document.getElementById('row-balance');
//         const recBalance = document.getElementById('rec-balance');
//         if(rowBalance && recBalance) {
//             rowBalance.style.display = 'flex';
//             recBalance.innerText = balance.toFixed(2);
//         }

//         if (method !== 'Cash') {
//             document.getElementById('row-ref').style.display = 'flex';
//             document.getElementById('rec-ref').innerText = reference;
//         } else {
//             document.getElementById('row-ref').style.display = 'none';
//         }

//         document.getElementById('paymentModal').style.display = 'none';
//         document.getElementById('receiptModal').style.display = 'flex';
        
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('amountPaid')) document.getElementById('amountPaid').value = '';
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';

//         showToast('Downpayment recorded & Stock updated!', 'success');

//     } catch (error) {
//         console.error("Error saving order: ", error);
//         showToast('Error saving order', 'error');
//         throw error; // Rethrow to stop spinner
//     }
// }

// // --- HELPER FOR SPINNER ---
// function setBtnLoading(btn, isLoading) {
//     if(!btn) return;
//     if(isLoading) {
//         btn.dataset.originalText = btn.innerHTML;
//         btn.disabled = true;
//         btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
//     } else {
//         btn.disabled = false;
//         if(btn.dataset.originalText) {
//             btn.innerHTML = btn.dataset.originalText;
//         }
//     }
// }







//new code with cyd
// import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { 
//     db, auth, collection, addDoc, updateDoc, setDoc, doc, onSnapshot 
// } from './firebase.js';

// let products = [];
// let cart = [];
// let currentPaymentMethod = 'Cash'; 

// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
//     generateOrderID();
    
//     // --- LOGOUT CHECK ---
//     const userRole = localStorage.getItem('userRole'); 
//     const logoutBtn = document.getElementById('logout-sidebar-item');
//     if (userRole && userRole.toLowerCase() === 'cashier') {
//         if(logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         if(logoutBtn) logoutBtn.style.display = 'none';
//     }

//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     // Load Categories
//     onSnapshot(collection(db, "categories"), (snapshot) => {
//         const tabs = document.getElementById('categoryTabs');
//         if(tabs) {
//             tabs.innerHTML = '<button class="active" onclick="window.filterProducts(\'all\', this)">All</button>';
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 tabs.innerHTML += `<button onclick="window.filterProducts('${doc.id}', this)">${data.name}</button>`;
//             });
//         }
//     });

//     // Load Products
//     onSnapshot(collection(db, "products"), (snapshot) => {
//         products = [];
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             const stockVal = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
            
//             products.push({ 
//                 id: doc.id, 
//                 ...data,
//                 quantity: isNaN(stockVal) ? 0 : stockVal
//             });
//         });
//         renderProducts(products);
//     });

//     document.getElementById('productSearch')?.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = products.filter(p => p.name.toLowerCase().includes(term));
//         renderProducts(filtered);
//     });

//     document.getElementById('amountPaid')?.addEventListener('input', calculateChange);
// });

// function initTheme() {
//     if (localStorage.getItem('theme') === 'dark') {
//         document.body.classList.add('dark-mode');
//     }
// }

// // --- LOGOUT LOGIC ---
// window.openLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'flex';
// };
// window.closeLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'none';
// };
// window.confirmLogout = async function() {
//     try {
//         await signOut(auth);
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userName');
//         window.location.href = 'index.html';
//     } catch (error) {
//         console.error("Logout Error:", error);
//     }
// };

// function renderProducts(list) {
//     const grid = document.getElementById('productsGrid');
//     if(!grid) return;
//     grid.innerHTML = '';
    
//     if (list.length === 0) {
//         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey);">No products found.</p>';
//         return;
//     }

//     list.forEach(p => {
//         const qty = Number(p.quantity || p.stock || 0);
//         const isOOS = qty <= 0;
        
//         const card = document.createElement('div');
//         card.className = `product-card ${isOOS ? 'oos' : ''}`;
//         card.onclick = () => !isOOS && addToCart(p);
        
//         const displayPrice = parseFloat(p.price || p.cost || 0);
//         const imgUrl = p.imageUrl || p.image || p.img || p.photoURL || '';
//         const imageHtml = imgUrl 
//             ? `<div class="card-image-box"><img src="${imgUrl}" alt="${p.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><div class="prod-icon-fallback" style="display:none"><i class="fas fa-utensils"></i></div></div>`
//             : `<div class="card-image-box"><div class="prod-icon-fallback"><i class="fas fa-utensils"></i></div></div>`;

//         card.innerHTML = `
//             ${imageHtml}
//             <div class="product-info">
//                 <div>
//                     <h4>${p.name}</h4>
//                     <p class="stock">Stock: ${qty} ${p.unit || 'pcs'}</p>
//                 </div>
//                 <span class="price">₱${displayPrice.toLocaleString()}</span>
//             </div>
//             ${isOOS ? '<div class="oos-overlay">Out of Stock</div>' : ''}
//         `;
//         grid.appendChild(card);
//     });
// }

// window.filterProducts = function(catId, btn) {
//     document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const filtered = (catId === 'all') ? products : products.filter(p => p.category === catId);
//     renderProducts(filtered);
// };

// function addToCart(product) {
//     const existing = cart.find(i => i.id === product.id);
//     const currentQty = existing ? existing.qty : 0;
//     const productStock = Number(product.quantity || product.stock || 0);
    
//     if (currentQty + 1 > productStock) {
//         showToast("Not enough stock!", "error");
//         return;
//     }
//     const priceToUse = parseFloat(product.price || product.cost || 0);

//     if (existing) {
//         existing.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             name: product.name,
//             price: priceToUse,
//             qty: 1
//         });
//     }
//     renderCart();
// }

// function renderCart() {
//     const container = document.getElementById('cartItems');
//     if(!container) return;
//     container.innerHTML = '';
//     if (cart.length === 0) {
//         container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i><p>No items added yet</p></div>`;
//         updateTotals(0);
//         return;
//     }
//     let total = 0;
//     cart.forEach((item, index) => {
//         const itemTotal = item.price * item.qty;
//         total += itemTotal;
//         const div = document.createElement('div');
//         div.className = 'cart-item';
//         div.innerHTML = `
//             <div class="item-info">
//                 <h4>${item.name}</h4>
//                 <p>₱${item.price.toLocaleString()} x ${item.qty}</p>
//             </div>
//             <div class="item-total">₱${itemTotal.toLocaleString()}</div>
//             <div class="item-actions">
//                 <button onclick="window.updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
//                 <span style="font-size:12px; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
//                 <button onclick="window.updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
//                 <button class="remove" onclick="window.removeItem(${index})"><i class="fas fa-trash"></i></button>
//             </div>
//         `;
//         container.appendChild(div);
//     });
//     updateTotals(total);
// }

// window.updateQty = function(index, change) {
//     const item = cart[index];
//     const product = products.find(p => p.id === item.id);
//     if (change === 1) {
//         const productStock = Number(product.quantity || product.stock || 0);
//         if (item.qty + 1 > productStock) {
//             showToast("Max stock reached", "error");
//             return;
//         }
//         item.qty++;
//     } else {
//         if (item.qty > 1) item.qty--;
//         else cart.splice(index, 1);
//     }
//     renderCart();
// };
// window.removeItem = function(index) {
//     cart.splice(index, 1);
//     renderCart();
// };

// window.clearCart = function() {
//     if(cart.length === 0) return;
//     document.getElementById('clearOrderModal').style.display = 'flex';
// };

// window.closeClearModal = function() {
//     document.getElementById('clearOrderModal').style.display = 'none';
// };

// window.confirmClearOrder = function() {
//     cart = [];
//     renderCart();
//     window.closeClearModal();
//     showToast("Order cleared", "success");
// };

// function updateTotals(subtotal) {
//     const total = subtotal; 
//     document.getElementById('subtotalDisplay').innerText = '₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const vatEl = document.getElementById('vatDisplay');
//     if(vatEl) vatEl.innerText = '₱0.00'; 
//     document.getElementById('totalDisplay').innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const modalTotal = document.getElementById('modalTotalAmount');
//     if(modalTotal) {
//         modalTotal.dataset.value = total;
//         modalTotal.innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     }
// }

// // --- PAYMENT LOGIC ---

// window.openPaymentModal = function() {
//     if (cart.length === 0) {
//         showToast("Cart is empty!", "error");
//         return;
//     }
//     document.getElementById('paymentModal').style.display = 'flex';
//     document.getElementById('amountPaid').value = '';
//     document.getElementById('changeAmount').innerText = '₱0.00';
//     document.getElementById('changeAmount').style.color = 'var(--navy)';
    
//     if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//     if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = ''; 
//     if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
// };
// window.closePaymentModal = function() {
//     document.getElementById('paymentModal').style.display = 'none';
// };

// window.setPaymentMethod = function(method, btn) {
//     currentPaymentMethod = method;
//     document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const cashDiv = document.getElementById('cash-payment-section');
//     const digitalDiv = document.getElementById('digital-payment-section');
//     const qrDiv = document.getElementById('qr-code-section');
//     if (method === 'Cash') {
//         if(cashDiv) cashDiv.style.display = 'block';
//         if(digitalDiv) digitalDiv.style.display = 'none';
//         if(qrDiv) qrDiv.style.display = 'none';
//     } else {
//         if(cashDiv) cashDiv.style.display = 'none';
//         if(digitalDiv) digitalDiv.style.display = 'block';
//         if(qrDiv) qrDiv.style.display = 'flex';
//     }
// };

// window.setCash = function(amount) {
//     const input = document.getElementById('amountPaid');
//     const currentVal = parseFloat(input.value) || 0;
//     input.value = currentVal + amount;
//     calculateChange();
// };

// function calculateChange() {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const input = document.getElementById('amountPaid');
//     const paid = parseFloat(input.value || 0);
//     const change = paid - total;
//     const changeEl = document.getElementById('changeAmount');
    
//     // Always show the number
//     changeEl.innerText = '₱' + change.toLocaleString(undefined, {minimumFractionDigits: 2});
    
//     if (change >= 0) {
//         changeEl.style.color = 'var(--navy)';
//     } else {
//         changeEl.style.color = '#f44336'; 
//     }
// }

// // ============================================
// // PROCESS COMPLETE PAYMENT (Simple Loading + Stock Reduction)
// // ============================================

// window.processPayment = async function() {
//     // 1. SAFE WAY TO FIND BUTTON: By its onclick attribute
//     const payBtn = document.querySelector('button[onclick="window.processPayment()"]');
//     setBtnLoading(payBtn, true);

//     try {
//         const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//         const custName = document.getElementById('customerName')?.value || 'Walk-in';
//         const custPhone = document.getElementById('customerPhone')?.value || '-'; 
//         const orderId = document.getElementById('orderNumber').innerText; // Get Order ID
        
//         let paid = 0;
//         let ref = '-';

//         if (currentPaymentMethod === 'Cash') {
//             paid = parseFloat(document.getElementById('amountPaid').value || 0);
            
//             if (paid < total) {
//                 showToast("Insufficient Cash", "error");
//                 throw new Error("Insufficient Cash"); 
//             }
//         } else {
//             const refInput = document.getElementById('referenceNumber') || document.getElementById('payment-reference');
//             ref = refInput ? refInput.value : '';
//             paid = total; 
//             if (!ref) {
//                 showToast("Please enter Reference Number", "error");
//                 throw new Error("Missing Reference"); 
//             }
//         }

//         const orderData = {
//             date: new Date().toISOString(),
//             orderId: orderId,
//             customer: custName,
//             contact: custPhone,
//             items: cart,
//             total: total,
//             method: currentPaymentMethod,
//             cashReceived: paid,
//             change: paid - total,
//             reference: ref,
//             cashier: localStorage.getItem('userName') || 'Staff'
//         };

//         // SAVE
//         await addDoc(collection(db, "transactions"), orderData);

//         // 🔥 SEND TO KITCHEN DISPLAY (CYD) 🔥
//         await sendToKitchen(orderId, cart);

//         // REDUCE STOCK (The loop you wanted)
//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         showReceipt(orderData);
//         window.closePaymentModal();
        
//         // RESET
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
        
//         showToast("Payment Successful!", "success");

//     } catch (err) {
//         console.error(err);
//         if(err.message !== "Insufficient Cash" && err.message !== "Missing Reference") {
//             showToast("Transaction Failed", "error");
//         }
//     } finally {
//         setBtnLoading(payBtn, false);
//     }
// };

// function showReceipt(data) {
//     document.getElementById('rec-date').innerText = new Date(data.date).toLocaleString();
//     document.getElementById('rec-orderId').innerText = data.orderId;
//     document.getElementById('rec-cashier').innerText = data.cashier;
//     if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = data.customer;
//     if(document.getElementById('rec-contact')) document.getElementById('rec-contact').innerText = data.contact;

//     const itemsDiv = document.getElementById('rec-items');
//     itemsDiv.innerHTML = '';
//     data.items.forEach(item => {
//         itemsDiv.innerHTML += `<div class="rec-item-row"><span>${item.qty}x ${item.name}</span><span>${(item.price * item.qty).toFixed(2)}</span></div>`;
//     });

//     document.getElementById('rec-subtotal').innerText = data.total.toFixed(2);
//     document.getElementById('rec-total').innerText = data.total.toFixed(2);
//     document.getElementById('rec-method').innerText = data.method;
    
//     // Balance Logic
//     const rowBalance = document.getElementById('row-balance');
//     if(rowBalance) rowBalance.style.display = 'none';

//     if(data.method === 'Cash') {
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('row-change').style.display = 'flex';
//         document.getElementById('row-ref').style.display = 'none';
//         document.getElementById('rec-cash').innerText = data.cashReceived.toFixed(2);
//         document.getElementById('rec-change').innerText = data.change.toFixed(2);
//     } else {
//         document.getElementById('row-cash-paid').style.display = 'none';
//         document.getElementById('row-change').style.display = 'none';
//         document.getElementById('row-ref').style.display = 'flex';
//         document.getElementById('rec-ref').innerText = data.reference;
//     }
//     document.getElementById('receiptModal').style.display = 'flex';
// }

// window.closeReceiptModal = function() { document.getElementById('receiptModal').style.display = 'none'; };
// window.printReceipt = function() { window.print(); };

// function generateOrderID() {
//     const randomId = Math.floor(100000 + Math.random() * 900000);
//     document.getElementById('orderNumber').innerText = `#ORD-${randomId}`;
// }

// function showToast(msg, type) {
//     const container = document.getElementById('toast-container');
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = type === 'success' ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
//     container.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
// }

// // ============================================
// // PROCESS DOWNPAYMENT (Simple Loading + Stock Reduction)
// // ============================================

// window.processDownpayment = async function() {
//     if (cart.length === 0) return showToast('Cart is empty', 'error');

//     // Case 1: Digital -> Open Popup (No loading needed on main btn)
//     if (currentPaymentMethod !== 'Cash') {
//         window.openDigitalDPModal();
//         return;
//     }

//     // Case 2: Cash -> Process Immediate
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const cashInput = document.getElementById('amountPaid');
//     let cashReceived = 0;
    
//     if (cashInput) cashReceived = parseFloat(cashInput.value);

//     if (isNaN(cashReceived) || cashReceived <= 0) {
//         return showToast('Please enter a valid amount', 'error');
//     }

//     if (cashReceived >= total) {
//         return showToast('Amount covers full bill. Please use "Complete Payment".', 'warning');
//     }

//     // SAFE WAY TO FIND BUTTON
//     const dpBtn = document.querySelector('button[onclick="window.processDownpayment()"]');
//     setBtnLoading(dpBtn, true);

//     try {
//         await saveDownpayment(cashReceived, 'Cash', '');
//     } catch (e) {
//         console.error(e);
//     } finally {
//         setBtnLoading(dpBtn, false);
//     }
// };

// // --- Digital Modal Functions ---

// window.openDigitalDPModal = function() {
//     document.getElementById('lbl-digi-method').innerText = currentPaymentMethod;
//     document.getElementById('digi-dp-amount').value = '';
//     const mainRef = document.getElementById('referenceNumber');
//     document.getElementById('digi-dp-ref').value = mainRef ? mainRef.value : '';
    
//     document.getElementById('digitalDownpaymentModal').style.display = 'flex';
//     document.getElementById('digi-dp-amount').focus();
// };

// window.closeDigitalDPModal = function() {
//     document.getElementById('digitalDownpaymentModal').style.display = 'none';
// };

// window.confirmDigitalDP = async function() {
//     const amountVal = parseFloat(document.getElementById('digi-dp-amount').value);
//     const refVal = document.getElementById('digi-dp-ref').value;
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);

//     if (isNaN(amountVal) || amountVal <= 0) {
//         return showToast("Please enter a valid amount", "error");
//     }
//     if (amountVal >= total) {
//         return showToast("Amount covers full bill. Use 'Complete Payment'", "warning");
//     }
//     if (!refVal.trim()) {
//         return showToast("Reference Number is required for Digital payments", "error");
//     }

//     // SAFE WAY TO FIND BUTTON (Confirm inside Popup)
//     const confirmBtn = document.querySelector('#digitalDownpaymentModal button.btn-primary');
//     setBtnLoading(confirmBtn, true);

//     try {
//         window.closeDigitalDPModal();
//         await saveDownpayment(amountVal, currentPaymentMethod, refVal);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         setBtnLoading(confirmBtn, false);
//     }
// };

// // --- SHARED SAVE FUNCTION (WITH STOCK REDUCTION LOOP) ---
// async function saveDownpayment(amountPaid, method, reference) {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const balance = total - amountPaid;
//     const orderId = document.getElementById('orderNumber').innerText; // Get Order ID

//     const orderData = {
//         orderId: orderId,
//         date: new Date().toISOString(),
//         items: cart,
//         total: total,
//         cashReceived: amountPaid,
//         change: 0, 
//         balance: balance,
//         method: method,
//         reference: reference,
//         status: 'Partial',
//         cashier: localStorage.getItem('userName') || 'Staff',
//         customer: document.getElementById('customerName')?.value || 'Walk-in',
//         contact: document.getElementById('customerPhone')?.value || '-'
//     };

//     try {
//         // 1. Save Transaction
//         await addDoc(collection(db, "transactions"), orderData); 

//         // 🔥 SEND TO KITCHEN DISPLAY (CYD) 🔥
//         await sendToKitchen(orderId, cart);

//         // 2. Reduce Stock (This is the loop you need!)
//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         // 3. Update Receipt
//         document.getElementById('rec-orderId').innerText = orderData.orderId;
//         document.getElementById('rec-date').innerText = new Date().toLocaleString();
//         document.getElementById('rec-cashier').innerText = orderData.cashier;
//         if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = orderData.customer;

//         const itemsContainer = document.getElementById('rec-items');
//         itemsContainer.innerHTML = '';
//         cart.forEach(item => {
//             itemsContainer.innerHTML += `
//                 <div class="rec-item-row">
//                     <span>${item.qty}x ${item.name}</span>
//                     <span>${(item.price * item.qty).toFixed(2)}</span>
//                 </div>
//             `;
//         });

//         document.getElementById('rec-total').innerText = total.toFixed(2);
        
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('rec-cash').innerText = amountPaid.toFixed(2);
        
//         document.getElementById('row-change').style.display = 'none';
        
//         const rowBalance = document.getElementById('row-balance');
//         const recBalance = document.getElementById('rec-balance');
//         if(rowBalance && recBalance) {
//             rowBalance.style.display = 'flex';
//             recBalance.innerText = balance.toFixed(2);
//         }

//         if (method !== 'Cash') {
//             document.getElementById('row-ref').style.display = 'flex';
//             document.getElementById('rec-ref').innerText = reference;
//         } else {
//             document.getElementById('row-ref').style.display = 'none';
//         }

//         document.getElementById('paymentModal').style.display = 'none';
//         document.getElementById('receiptModal').style.display = 'flex';
        
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('amountPaid')) document.getElementById('amountPaid').value = '';
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';

//         showToast('Downpayment recorded & Stock updated!', 'success');

//     } catch (error) {
//         console.error("Error saving order: ", error);
//         showToast('Error saving order', 'error');
//         throw error; // Rethrow to stop spinner
//     }
// }

// // --- HELPER FOR SPINNER ---
// function setBtnLoading(btn, isLoading) {
//     if(!btn) return;
//     if(isLoading) {
//         btn.dataset.originalText = btn.innerHTML;
//         btn.disabled = true;
//         btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
//     } else {
//         btn.disabled = false;
//         if(btn.dataset.originalText) {
//             btn.innerHTML = btn.dataset.originalText;
//         }
//     }
// }

// // ===============================================
// // 🔥 NEW FUNCTION: SEND ORDER TO KITCHEN SCREEN 🔥
// // ===============================================
// async function sendToKitchen(orderId, cartItems) {
//     if (!cartItems || cartItems.length === 0) return;

//     // Create a simple string of items (e.g., "1x Lechon, 2x Rice")
//     let orderString = cartItems.map(item => {
//         return `${item.qty}x ${item.name}`; 
//     }).join(", ");

//     // Send to Firebase (Overwrites the current order for the screen)
//     // The ESP32 is listening to "kitchen_queue/current_order"
//     try {
//         await setDoc(doc(db, "kitchen_queue", "current_order"), {
//             status: "PENDING",        // Triggers the RED screen
//             table: orderId,           // Uses the Order ID (e.g. #ORD-12345) as the table
//             items: orderString,       // The list of food
//             timestamp: new Date()
//         });
//         console.log("Sent to Kitchen Display!");
//     } catch (e) {
//         console.error("Error sending to kitchen: ", e);
//     }
// }












// //NEW CODE WITH CYD ALAS DOS NA
// import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// // We removed Realtime Database imports because your screenshot shows you use Firestore
// import { 
//     db, auth, collection, addDoc, updateDoc, doc, onSnapshot, rtdb, ref, set
// } from './firebase.js';

// let products = [];
// let cart = [];
// let currentPaymentMethod = 'Cash'; 

// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
//     generateOrderID();
    
//     // --- CHECK LOGIN STATUS ---
//     const userRole = localStorage.getItem('userRole'); 
//     const logoutBtn = document.getElementById('logout-sidebar-item');
//     if (userRole && userRole.toLowerCase() === 'cashier') {
//         if(logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         if(logoutBtn) logoutBtn.style.display = 'none';
//     }

//     // --- DISPLAY DATE ---
//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     // --- LOAD CATEGORIES ---
//     onSnapshot(collection(db, "categories"), (snapshot) => {
//         const tabs = document.getElementById('categoryTabs');
//         if(tabs) {
//             tabs.innerHTML = '<button class="active" onclick="window.filterProducts(\'all\', this)">All</button>';
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 tabs.innerHTML += `<button onclick="window.filterProducts('${doc.id}', this)">${data.name}</button>`;
//             });
//         }
//     });

//     // --- LOAD PRODUCTS ---
//     onSnapshot(collection(db, "products"), (snapshot) => {
//         products = [];
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             const stockVal = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
            
//             products.push({ 
//                 id: doc.id, 
//                 ...data,
//                 quantity: isNaN(stockVal) ? 0 : stockVal
//             });
//         });
//         renderProducts(products);
//     });

//     // --- SEARCH BAR ---
//     document.getElementById('productSearch')?.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = products.filter(p => p.name.toLowerCase().includes(term));
//         renderProducts(filtered);
//     });

//     // --- PAYMENT INPUT LISTENER ---
//     document.getElementById('amountPaid')?.addEventListener('input', calculateChange);
// });

// // =========================================================
// // UI FUNCTIONS
// // =========================================================

// function initTheme() {
//     if (localStorage.getItem('theme') === 'dark') {
//         document.body.classList.add('dark-mode');
//     }
// }

// window.openLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'flex';
// };
// window.closeLogoutModal = function() {
//     document.getElementById('logoutModal').style.display = 'none';
// };
// window.confirmLogout = async function() {
//     try {
//         await signOut(auth);
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userName');
//         window.location.href = 'index.html';
//     } catch (error) {
//         console.error("Logout Error:", error);
//     }
// };

// function renderProducts(list) {
//     const grid = document.getElementById('productsGrid');
//     if(!grid) return;
//     grid.innerHTML = '';
    
//     if (list.length === 0) {
//         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey);">No products found.</p>';
//         return;
//     }

//     list.forEach(p => {
//         const qty = Number(p.quantity || p.stock || 0);
//         const isOOS = qty <= 0;
        
//         const card = document.createElement('div');
//         card.className = `product-card ${isOOS ? 'oos' : ''}`;
//         card.onclick = () => !isOOS && addToCart(p);
        
//         const displayPrice = parseFloat(p.price || p.cost || 0);
//         const imgUrl = p.imageUrl || p.image || p.img || p.photoURL || '';
        
//         const imageHtml = imgUrl 
//             ? `<div class="card-image-box"><img src="${imgUrl}" alt="${p.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><div class="prod-icon-fallback" style="display:none"><i class="fas fa-utensils"></i></div></div>`
//             : `<div class="card-image-box"><div class="prod-icon-fallback"><i class="fas fa-utensils"></i></div></div>`;

//         card.innerHTML = `
//             ${imageHtml}
//             <div class="product-info">
//                 <div>
//                     <h4>${p.name}</h4>
//                     <p class="stock">Stock: ${qty} ${p.unit || 'pcs'}</p>
//                 </div>
//                 <span class="price">₱${displayPrice.toLocaleString()}</span>
//             </div>
//             ${isOOS ? '<div class="oos-overlay">Out of Stock</div>' : ''}
//         `;
//         grid.appendChild(card);
//     });
// }

// // window.filterProducts = function(catId, btn) {
// //     document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
// //     btn.classList.add('active');
// //     const filtered = (catId === 'all') ? products : products.filter(p => p.category === catId);
// //     renderProducts(filtered);
// // };
// window.filterProducts = function(catId, btn) {
//     document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
//     if (btn) btn.classList.add('active');   // ← safe guard
//     const filtered = (catId === 'all') ? products : products.filter(p => p.category === catId);
//     renderProducts(filtered);
// };
// // =========================================================
// // CART LOGIC
// // =========================================================

// function addToCart(product) {
//     const existing = cart.find(i => i.id === product.id);
//     const currentQty = existing ? existing.qty : 0;
//     const productStock = Number(product.quantity || product.stock || 0);
    
//     if (currentQty + 1 > productStock) {
//         showToast("Not enough stock!", "error");
//         return;
//     }
//     const priceToUse = parseFloat(product.price || product.cost || 0);

//     if (existing) {
//         existing.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             name: product.name,
//             price: priceToUse,
//             qty: 1
//         });
//     }
//     renderCart();
// }

// function renderCart() {
//     const container = document.getElementById('cartItems');
//     if(!container) return;
//     container.innerHTML = '';
//     if (cart.length === 0) {
//         container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i><p>No items added yet</p></div>`;
//         updateTotals(0);
//         return;
//     }
//     let total = 0;
//     cart.forEach((item, index) => {
//         const itemTotal = item.price * item.qty;
//         total += itemTotal;
//         const div = document.createElement('div');
//         div.className = 'cart-item';
//         div.innerHTML = `
//             <div class="item-info">
//                 <h4>${item.name}</h4>
//                 <p>₱${item.price.toLocaleString()} x ${item.qty}</p>
//             </div>
//             <div class="item-total">₱${itemTotal.toLocaleString()}</div>
//             <div class="item-actions">
//                 <button onclick="window.updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
//                 <span style="font-size:12px; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
//                 <button onclick="window.updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
//                 <button class="remove" onclick="window.removeItem(${index})"><i class="fas fa-trash"></i></button>
//             </div>
//         `;
//         container.appendChild(div);
//     });
//     updateTotals(total);
// }

// window.updateQty = function(index, change) {
//     const item = cart[index];
//     const product = products.find(p => p.id === item.id);
//     if (change === 1) {
//         const productStock = Number(product.quantity || product.stock || 0);
//         if (item.qty + 1 > productStock) {
//             showToast("Max stock reached", "error");
//             return;
//         }
//         item.qty++;
//     } else {
//         if (item.qty > 1) item.qty--;
//         else cart.splice(index, 1);
//     }
//     renderCart();
// };
// window.removeItem = function(index) {
//     cart.splice(index, 1);
//     renderCart();
// };

// window.clearCart = function() {
//     if(cart.length === 0) return;
//     document.getElementById('clearOrderModal').style.display = 'flex';
// };
// window.closeClearModal = function() {
//     document.getElementById('clearOrderModal').style.display = 'none';
// };
// window.confirmClearOrder = function() {
//     cart = [];
//     renderCart();
//     window.closeClearModal();
//     showToast("Order cleared", "success");
// };

// function updateTotals(subtotal) {
//     const total = subtotal; 
//     document.getElementById('subtotalDisplay').innerText = '₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
//     const modalTotal = document.getElementById('modalTotalAmount');
//     if(modalTotal) {
//         modalTotal.dataset.value = total;
//         modalTotal.innerText = '₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2});
//     }
// }

// // =========================================================
// // PAYMENT MODAL
// // =========================================================

// window.openPaymentModal = function() {
//     if (cart.length === 0) {
//         showToast("Cart is empty!", "error");
//         return;
//     }
//     document.getElementById('paymentModal').style.display = 'flex';
//     document.getElementById('amountPaid').value = '';
//     document.getElementById('changeAmount').innerText = '₱0.00';
//     document.getElementById('changeAmount').style.color = 'var(--navy)';
    
//     if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//     if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = ''; 
//     if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
// };
// window.closePaymentModal = function() {
//     document.getElementById('paymentModal').style.display = 'none';
// };

// window.setPaymentMethod = function(method, btn) {
//     currentPaymentMethod = method;
//     document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
    
//     const cashDiv = document.getElementById('cash-payment-section');
//     const digitalDiv = document.getElementById('digital-payment-section');
//     const qrDiv = document.getElementById('qr-code-section');
    
//     if (method === 'Cash') {
//         if(cashDiv) cashDiv.style.display = 'block';
//         if(digitalDiv) digitalDiv.style.display = 'none';
//         if(qrDiv) qrDiv.style.display = 'none';
//     } else {
//         if(cashDiv) cashDiv.style.display = 'none';
//         if(digitalDiv) digitalDiv.style.display = 'block';
//         if(qrDiv) qrDiv.style.display = 'flex';
//     }
// };

// window.setCash = function(amount) {
//     const input = document.getElementById('amountPaid');
//     const currentVal = parseFloat(input.value) || 0;
//     input.value = currentVal + amount;
//     calculateChange();
// };

// function calculateChange() {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const input = document.getElementById('amountPaid');
//     const paid = parseFloat(input.value || 0);
//     const change = paid - total;
//     const changeEl = document.getElementById('changeAmount');
    
//     changeEl.innerText = '₱' + change.toLocaleString(undefined, {minimumFractionDigits: 2});
    
//     if (change >= 0) {
//         changeEl.style.color = 'var(--navy)';
//     } else {
//         changeEl.style.color = '#f44336'; 
//     }
// }

// // =========================================================
// // PROCESS FULL PAYMENT
// // =========================================================

// window.processPayment = async function() {
//     const payBtn = document.querySelector('button[onclick="window.processPayment()"]');
//     setBtnLoading(payBtn, true);

//     try {
//         const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//         const custName = document.getElementById('customerName')?.value || 'Walk-in';
//         const custPhone = document.getElementById('customerPhone')?.value || '-'; 
//         const orderId = document.getElementById('orderNumber').innerText; 
        
//         let paid = 0;
//         let ref = '-';

//         if (currentPaymentMethod === 'Cash') {
//             paid = parseFloat(document.getElementById('amountPaid').value || 0);
//             if (paid < total) {
//                 showToast("Insufficient Cash", "error");
//                 throw new Error("Insufficient Cash"); 
//             }
//         } else {
//             const refInput = document.getElementById('referenceNumber') || document.getElementById('payment-reference');
//             ref = refInput ? refInput.value : '';
//             paid = total; 
//             if (!ref) {
//                 showToast("Please enter Reference Number", "error");
//                 throw new Error("Missing Reference"); 
//             }
//         }

//         const orderData = {
//             date: new Date().toISOString(),
//             orderId: orderId,
//             customer: custName,
//             contact: custPhone,
//             items: cart,
//             total: total,
//             method: currentPaymentMethod,
//             cashReceived: paid,
//             change: paid - total,
//             reference: ref,
//             cashier: localStorage.getItem('userName') || 'Staff'
//         };

//         // 1. SAVE TRANSACTION (Firestore)
//         await addDoc(collection(db, "transactions"), orderData);

//         // 2. SEND TO KITCHEN (Firestore - Matches your Screenshot)
//         await sendToKitchen(orderId, cart);

//         // 3. REDUCE STOCK (Firestore)
//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         showReceipt(orderData);
//         window.closePaymentModal();
        
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
        
//         showToast("Payment Successful!", "success");

//     } catch (err) {
//         console.error(err);
//         if(err.message !== "Insufficient Cash" && err.message !== "Missing Reference") {
//             showToast("Transaction Failed", "error");
//         }
//     } finally {
//         setBtnLoading(payBtn, false);
//     }
// };

// // =========================================================
// // PROCESS DOWNPAYMENT
// // =========================================================

// window.processDownpayment = async function() {
//     if (cart.length === 0) return showToast('Cart is empty', 'error');

//     if (currentPaymentMethod !== 'Cash') {
//         window.openDigitalDPModal();
//         return;
//     }

//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const cashInput = document.getElementById('amountPaid');
//     let cashReceived = 0;
    
//     if (cashInput) cashReceived = parseFloat(cashInput.value);

//     if (isNaN(cashReceived) || cashReceived <= 0) {
//         return showToast('Please enter a valid amount', 'error');
//     }
//     if (cashReceived >= total) {
//         return showToast('Amount covers full bill. Please use "Complete Payment".', 'warning');
//     }

//     const dpBtn = document.querySelector('button[onclick="window.processDownpayment()"]');
//     setBtnLoading(dpBtn, true);

//     try {
//         await saveDownpayment(cashReceived, 'Cash', '');
//     } catch (e) {
//         console.error(e);
//     } finally {
//         setBtnLoading(dpBtn, false);
//     }
// };

// window.openDigitalDPModal = function() {
//     document.getElementById('lbl-digi-method').innerText = currentPaymentMethod;
//     document.getElementById('digi-dp-amount').value = '';
//     const mainRef = document.getElementById('referenceNumber');
//     document.getElementById('digi-dp-ref').value = mainRef ? mainRef.value : '';
    
//     document.getElementById('digitalDownpaymentModal').style.display = 'flex';
//     document.getElementById('digi-dp-amount').focus();
// };
// window.closeDigitalDPModal = function() {
//     document.getElementById('digitalDownpaymentModal').style.display = 'none';
// };
// window.confirmDigitalDP = async function() {
//     const amountVal = parseFloat(document.getElementById('digi-dp-amount').value);
//     const refVal = document.getElementById('digi-dp-ref').value;
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);

//     if (isNaN(amountVal) || amountVal <= 0) {
//         return showToast("Please enter a valid amount", "error");
//     }
//     if (amountVal >= total) {
//         return showToast("Amount covers full bill. Use 'Complete Payment'", "warning");
//     }
//     if (!refVal.trim()) {
//         return showToast("Reference Number is required for Digital payments", "error");
//     }

//     const confirmBtn = document.querySelector('#digitalDownpaymentModal button.btn-primary');
//     setBtnLoading(confirmBtn, true);

//     try {
//         window.closeDigitalDPModal();
//         await saveDownpayment(amountVal, currentPaymentMethod, refVal);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         setBtnLoading(confirmBtn, false);
//     }
// };

// async function saveDownpayment(amountPaid, method, reference) {
//     const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
//     const balance = total - amountPaid;
//     const orderId = document.getElementById('orderNumber').innerText; 

//     const orderData = {
//         orderId: orderId,
//         date: new Date().toISOString(),
//         items: cart,
//         total: total,
//         cashReceived: amountPaid,
//         change: 0, 
//         balance: balance,
//         method: method,
//         reference: reference,
//         status: 'Partial',
//         cashier: localStorage.getItem('userName') || 'Staff',
//         customer: document.getElementById('customerName')?.value || 'Walk-in',
//         contact: document.getElementById('customerPhone')?.value || '-'
//     };

//     try {
//         await addDoc(collection(db, "transactions"), orderData); 
//         await sendToKitchen(orderId, cart);

//         for (let item of cart) {
//             const productRef = doc(db, "products", item.id);
//             const prodSnap = products.find(p => p.id === item.id); 
//             if(prodSnap) {
//                 const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
//                 const newQty = currentStock - item.qty;
//                 await updateDoc(productRef, { quantity: newQty });
//             }
//         }

//         prepareReceiptUI(orderData, total, amountPaid, balance, method, reference);
//         document.getElementById('paymentModal').style.display = 'none';
//         document.getElementById('receiptModal').style.display = 'flex';
        
//         cart = [];
//         renderCart();
//         generateOrderID();
//         if(document.getElementById('amountPaid')) document.getElementById('amountPaid').value = '';
//         if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
//         if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';

//         showToast('Downpayment recorded!', 'success');
//     } catch (error) {
//         console.error("Error saving order: ", error);
//         showToast('Error saving order', 'error');
//         throw error; 
//     }
// }

// // =========================================================
// // RECEIPT UTILS
// // =========================================================

// function showReceipt(data) {
//     prepareReceiptUI(data, data.total, data.cashReceived, 0, data.method, data.reference);
//     document.getElementById('receiptModal').style.display = 'flex';
// }

// function prepareReceiptUI(data, total, paid, balance, method, ref) {
//     document.getElementById('rec-date').innerText = new Date(data.date).toLocaleString();
//     document.getElementById('rec-orderId').innerText = data.orderId;
//     document.getElementById('rec-cashier').innerText = data.cashier;
//     if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = data.customer;

//     const itemsDiv = document.getElementById('rec-items');
//     itemsDiv.innerHTML = '';
//     data.items.forEach(item => {
//         itemsDiv.innerHTML += `<div class="rec-item-row"><span>${item.qty}x ${item.name}</span><span>${(item.price * item.qty).toFixed(2)}</span></div>`;
//     });

//     document.getElementById('rec-total').innerText = total.toFixed(2);
//     document.getElementById('rec-method').innerText = method;

//     const rowBalance = document.getElementById('row-balance');
//     if(balance > 0) {
//         if(rowBalance) {
//             rowBalance.style.display = 'flex';
//             document.getElementById('rec-balance').innerText = balance.toFixed(2);
//         }
//         document.getElementById('row-change').style.display = 'none';
//     } else {
//         if(rowBalance) rowBalance.style.display = 'none';
//         document.getElementById('row-change').style.display = 'flex';
//         const change = paid - total;
//         document.getElementById('rec-change').innerText = (change > 0 ? change : 0).toFixed(2);
//     }

//     if(method === 'Cash') {
//         document.getElementById('row-cash-paid').style.display = 'flex';
//         document.getElementById('rec-cash').innerText = paid.toFixed(2);
//         document.getElementById('row-ref').style.display = 'none';
//     } else {
//         document.getElementById('row-cash-paid').style.display = 'none';
//         document.getElementById('row-change').style.display = 'none';
//         document.getElementById('row-ref').style.display = 'flex';
//         document.getElementById('rec-ref').innerText = ref;
//     }
// }

// window.closeReceiptModal = function() { document.getElementById('receiptModal').style.display = 'none'; };
// window.printReceipt = function() { window.print(); };

// function generateOrderID() {
//     const randomId = Math.floor(100000 + Math.random() * 900000);
//     document.getElementById('orderNumber').innerText = `#ORD-${randomId}`;
// }

// function showToast(msg, type) {
//     const container = document.getElementById('toast-container');
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = type === 'success' ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
//     container.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
// }

// function setBtnLoading(btn, isLoading) {
//     if(!btn) return;
//     if(isLoading) {
//         btn.dataset.originalText = btn.innerHTML;
//         btn.disabled = true;
//         btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
//     } else {
//         btn.disabled = false;
//         if(btn.dataset.originalText) {
//             btn.innerHTML = btn.dataset.originalText;
//         }
//     }
// }

// // =========================================================
// // 🔥 UPDATED: SEND TO KITCHEN (FIRESTORE) 🔥
// // =========================================================

// // This function MUST use the 'rtdb' you imported
// async function sendToKitchen(orderId, cartItems) {
//     if (!cartItems || cartItems.length === 0) return;

//     try {
//         const itemsString = cartItems.map(item => `${item.qty}x ${item.name}`).join("\n");

//         // 🔥 This line below is what "uses" rtdb and makes it highlight!
//         await set(ref(rtdb, 'kitchen_queue/current_order'), {
//             table: orderId,
//             items: itemsString,
//             timestamp: Date.now()
//         });

//         console.log("✅ Sent to Kitchen!");
//     } catch (e) {
//         console.error("❌ Error sending to kitchen:", e);
//     }
// }



















//PROTOTYPE

//NEW CODE WITH CYD ALAS DOS NA
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    db, auth, collection, addDoc, updateDoc, doc, onSnapshot, rtdb, ref, set
} from './firebase.js';

let products = [];
let cart = [];
let currentPaymentMethod = 'Cash'; 

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    generateOrderID();
    
    // --- CHECK LOGIN STATUS ---
    const userRole = localStorage.getItem('userRole'); 
    const logoutBtn = document.getElementById('logout-sidebar-item');
    if (userRole && userRole.toLowerCase() === 'cashier') {
        if(logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if(logoutBtn) logoutBtn.style.display = 'none';
    }

    // --- DISPLAY DATE ---
    const dateEl = document.getElementById('currentDate');
    if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // --- LOAD CATEGORIES ---
    onSnapshot(collection(db, "categories"), (snapshot) => {
        const tabs = document.getElementById('categoryTabs');
        if(tabs) {
            tabs.innerHTML = '<button class="active" onclick="window.filterProducts(\'all\', this)">All</button>';
            snapshot.forEach(doc => {
                const data = doc.data();
                // FIX 1: Use data.name instead of doc.id to match products' category field
                tabs.innerHTML += `<button onclick="window.filterProducts('${data.name}', this)">${data.name}</button>`;
            });
        }
    });

    // --- LOAD PRODUCTS ---
    onSnapshot(collection(db, "products"), (snapshot) => {
        products = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const stockVal = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
            
            products.push({ 
                id: doc.id, 
                ...data,
                quantity: isNaN(stockVal) ? 0 : stockVal
            });
        });
        renderProducts(products);
    });

    // --- SEARCH BAR ---
    document.getElementById('productSearch')?.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });

    // --- PAYMENT INPUT LISTENER ---
    document.getElementById('amountPaid')?.addEventListener('input', calculateChange);
});

// =========================================================
// UI FUNCTIONS
// =========================================================

function initTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

window.openLogoutModal = function() {
    document.getElementById('logoutModal').style.display = 'flex';
};
window.closeLogoutModal = function() {
    document.getElementById('logoutModal').style.display = 'none';
};
window.confirmLogout = async function() {
    try {
        await signOut(auth);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

function renderProducts(list) {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    if (list.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey);">No products found.</p>';
        return;
    }

    list.forEach(p => {
        const qty = Number(p.quantity || p.stock || 0);
        const isOOS = qty <= 0;
        
        const card = document.createElement('div');
        card.className = `product-card ${isOOS ? 'oos' : ''}`;
        card.onclick = () => !isOOS && addToCart(p);
        
        const displayPrice = parseFloat(p.price || p.cost || 0);
        const imgUrl = p.imageUrl || p.image || p.img || p.photoURL || '';
        
        const imageHtml = imgUrl 
            ? `<div class="card-image-box"><img src="${imgUrl}" alt="${p.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><div class="prod-icon-fallback" style="display:none"><i class="fas fa-utensils"></i></div></div>`
            : `<div class="card-image-box"><div class="prod-icon-fallback"><i class="fas fa-utensils"></i></div></div>`;

        card.innerHTML = `
            ${imageHtml}
            <div class="product-info">
                <div>
                    <h4>${p.name}</h4>
                    <p class="stock">Stock: ${qty} ${p.unit || 'pcs'}</p>
                </div>
                <span class="price">₱${displayPrice.toLocaleString()}</span>
            </div>
            ${isOOS ? '<div class="oos-overlay">Out of Stock</div>' : ''}
        `;
        grid.appendChild(card);
    });
}

window.filterProducts = function(catId, btn) {
    document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    // FIX 1: Filter by category name (matches Firestore product's category field)
    const filtered = (catId === 'all') 
        ? products 
        : products.filter(p => 
            (p.category || '').toLowerCase() === catId.toLowerCase() ||
            (p.categoryId || '') === catId
        );
    renderProducts(filtered);
};

// =========================================================
// CART LOGIC
// =========================================================

function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    const currentQty = existing ? existing.qty : 0;
    const productStock = Number(product.quantity || product.stock || 0);
    
    if (currentQty + 1 > productStock) {
        showToast("Not enough stock!", "error");
        return;
    }
    const priceToUse = parseFloat(product.price || product.cost || 0);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: priceToUse,
            qty: 1
        });
    }
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    if(!container) return;
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i><p>No items added yet</p></div>`;
        updateTotals(0);
        return;
    }
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>₱${item.price.toLocaleString()} x ${item.qty}</p>
            </div>
            <div class="item-total">₱${itemTotal.toLocaleString()}</div>
            <div class="item-actions">
                <button onclick="window.updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                <span style="font-size:12px; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                <button onclick="window.updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
                <button class="remove" onclick="window.removeItem(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(div);
    });
    updateTotals(total);
}

window.updateQty = function(index, change) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    if (change === 1) {
        const productStock = Number(product.quantity || product.stock || 0);
        if (item.qty + 1 > productStock) {
            showToast("Max stock reached", "error");
            return;
        }
        item.qty++;
    } else {
        if (item.qty > 1) item.qty--;
        else cart.splice(index, 1);
    }
    renderCart();
};

window.removeItem = function(index) {
    cart.splice(index, 1);
    renderCart();
};

window.clearCart = function() {
    if(cart.length === 0) return;
    document.getElementById('clearOrderModal').style.display = 'flex';
};
window.closeClearModal = function() {
    document.getElementById('clearOrderModal').style.display = 'none';
};
window.confirmClearOrder = function() {
    cart = [];
    renderCart();
    window.closeClearModal();
    showToast("Order cleared", "success");
};

// FIX 2: updateTotals now updates ALL cart footer displays + modal
function updateTotals(subtotal) {
    const total = subtotal;
    const fmt = (n) => '₱' + n.toLocaleString(undefined, {minimumFractionDigits: 2});

    // Cart footer
    const subtotalEl = document.getElementById('subtotalDisplay');
    const vatEl = document.getElementById('vatDisplay');
    const totalEl = document.getElementById('totalDisplay');
    if(subtotalEl) subtotalEl.innerText = fmt(subtotal);
    if(vatEl) vatEl.innerText = fmt(0);
    if(totalEl) totalEl.innerText = fmt(total);

    // Payment modal total (set dataset.value for calculateChange to use)
    const modalTotal = document.getElementById('modalTotalAmount');
    if(modalTotal) {
        modalTotal.dataset.value = total;
        modalTotal.innerText = fmt(total);
    }
}

// =========================================================
// PAYMENT MODAL
// =========================================================

window.openPaymentModal = function() {
    if (cart.length === 0) {
        showToast("Cart is empty!", "error");
        return;
    }
    document.getElementById('paymentModal').style.display = 'flex';
    document.getElementById('amountPaid').value = '';
    document.getElementById('changeAmount').innerText = '₱0.00';
    document.getElementById('changeAmount').style.color = 'var(--navy)';
    
    if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
    if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = ''; 
    if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
};
window.closePaymentModal = function() {
    document.getElementById('paymentModal').style.display = 'none';
};

window.setPaymentMethod = function(method, btn) {
    currentPaymentMethod = method;
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const cashDiv = document.getElementById('cash-payment-section');
    const digitalDiv = document.getElementById('digital-payment-section');
    const qrDiv = document.getElementById('qr-code-section');
    
    if (method === 'Cash') {
        if(cashDiv) cashDiv.style.display = 'block';
        if(digitalDiv) digitalDiv.style.display = 'none';
        if(qrDiv) qrDiv.style.display = 'none';
    } else {
        if(cashDiv) cashDiv.style.display = 'none';
        if(digitalDiv) digitalDiv.style.display = 'block';
        if(qrDiv) qrDiv.style.display = 'flex';
    }
};

window.setCash = function(amount) {
    const input = document.getElementById('amountPaid');
    const currentVal = parseFloat(input.value) || 0;
    input.value = currentVal + amount;
    calculateChange();
};

function calculateChange() {
    const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
    const input = document.getElementById('amountPaid');
    const paid = parseFloat(input.value || 0);
    const change = paid - total;
    const changeEl = document.getElementById('changeAmount');
    
    changeEl.innerText = '₱' + change.toLocaleString(undefined, {minimumFractionDigits: 2});
    changeEl.style.color = change >= 0 ? 'var(--navy)' : '#f44336';
}

// =========================================================
// PROCESS FULL PAYMENT
// =========================================================

window.processPayment = async function() {
    const payBtn = document.querySelector('button[onclick="window.processPayment()"]');
    setBtnLoading(payBtn, true);

    try {
        const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
        const custName = document.getElementById('customerName')?.value || 'Walk-in';
        const custPhone = document.getElementById('customerPhone')?.value || '-'; 
        const orderId = document.getElementById('orderNumber').innerText; 
        
        let paid = 0;
        let refNum = '-';

        if (currentPaymentMethod === 'Cash') {
            paid = parseFloat(document.getElementById('amountPaid').value || 0);
            if (paid < total) {
                showToast("Insufficient Cash", "error");
                throw new Error("Insufficient Cash"); 
            }
        } else {
            const refInput = document.getElementById('referenceNumber') || document.getElementById('payment-reference');
            refNum = refInput ? refInput.value : '';
            paid = total; 
            if (!refNum) {
                showToast("Please enter Reference Number", "error");
                throw new Error("Missing Reference"); 
            }
        }

        const orderData = {
            date: new Date().toISOString(),
            orderId: orderId,
            customer: custName,
            contact: custPhone,
            items: cart,
            total: total,
            method: currentPaymentMethod,
            cashReceived: paid,
            change: paid - total,
            reference: refNum,
            cashier: localStorage.getItem('userName') || 'Staff'
        };

        await addDoc(collection(db, "transactions"), orderData);
        await sendToKitchen(orderId, cart);

        for (let item of cart) {
            const productRef = doc(db, "products", item.id);
            const prodSnap = products.find(p => p.id === item.id); 
            if(prodSnap) {
                const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
                const newQty = currentStock - item.qty;
                await updateDoc(productRef, { quantity: newQty });
            }
        }

        showReceipt(orderData);
        window.closePaymentModal();
        
        cart = [];
        renderCart();
        generateOrderID();
        if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
        if(document.getElementById('customerPhone')) document.getElementById('customerPhone').value = '';
        if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';
        
        showToast("Payment Successful!", "success");

    } catch (err) {
        console.error(err);
        if(err.message !== "Insufficient Cash" && err.message !== "Missing Reference") {
            showToast("Transaction Failed", "error");
        }
    } finally {
        setBtnLoading(payBtn, false);
    }
};

// =========================================================
// PROCESS DOWNPAYMENT
// =========================================================

window.processDownpayment = async function() {
    if (cart.length === 0) return showToast('Cart is empty', 'error');

    if (currentPaymentMethod !== 'Cash') {
        window.openDigitalDPModal();
        return;
    }

    const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
    const cashInput = document.getElementById('amountPaid');
    let cashReceived = 0;
    
    if (cashInput) cashReceived = parseFloat(cashInput.value);

    if (isNaN(cashReceived) || cashReceived <= 0) {
        return showToast('Please enter a valid amount', 'error');
    }
    if (cashReceived >= total) {
        return showToast('Amount covers full bill. Please use "Complete Payment".', 'warning');
    }

    const dpBtn = document.querySelector('button[onclick="window.processDownpayment()"]');
    setBtnLoading(dpBtn, true);

    try {
        await saveDownpayment(cashReceived, 'Cash', '');
    } catch (e) {
        console.error(e);
    } finally {
        setBtnLoading(dpBtn, false);
    }
};

window.openDigitalDPModal = function() {
    document.getElementById('lbl-digi-method').innerText = currentPaymentMethod;
    document.getElementById('digi-dp-amount').value = '';
    const mainRef = document.getElementById('referenceNumber');
    document.getElementById('digi-dp-ref').value = mainRef ? mainRef.value : '';
    document.getElementById('digitalDownpaymentModal').style.display = 'flex';
    document.getElementById('digi-dp-amount').focus();
};
window.closeDigitalDPModal = function() {
    document.getElementById('digitalDownpaymentModal').style.display = 'none';
};
window.confirmDigitalDP = async function() {
    const amountVal = parseFloat(document.getElementById('digi-dp-amount').value);
    const refVal = document.getElementById('digi-dp-ref').value;
    const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);

    if (isNaN(amountVal) || amountVal <= 0) return showToast("Please enter a valid amount", "error");
    if (amountVal >= total) return showToast("Amount covers full bill. Use 'Complete Payment'", "warning");
    if (!refVal.trim()) return showToast("Reference Number is required for Digital payments", "error");

    const confirmBtn = document.querySelector('#digitalDownpaymentModal button.btn-primary');
    setBtnLoading(confirmBtn, true);

    try {
        window.closeDigitalDPModal();
        await saveDownpayment(amountVal, currentPaymentMethod, refVal);
    } catch (e) {
        console.error(e);
    } finally {
        setBtnLoading(confirmBtn, false);
    }
};

async function saveDownpayment(amountPaid, method, reference) {
    const total = parseFloat(document.getElementById('modalTotalAmount').dataset.value || 0);
    const balance = total - amountPaid;
    const orderId = document.getElementById('orderNumber').innerText; 

    const orderData = {
        orderId: orderId,
        date: new Date().toISOString(),
        items: cart,
        total: total,
        cashReceived: amountPaid,
        change: 0, 
        balance: balance,
        method: method,
        reference: reference,
        status: 'Partial',
        cashier: localStorage.getItem('userName') || 'Staff',
        customer: document.getElementById('customerName')?.value || 'Walk-in',
        contact: document.getElementById('customerPhone')?.value || '-'
    };

    try {
        await addDoc(collection(db, "transactions"), orderData); 
        await sendToKitchen(orderId, cart);

        for (let item of cart) {
            const productRef = doc(db, "products", item.id);
            const prodSnap = products.find(p => p.id === item.id); 
            if(prodSnap) {
                const currentStock = Number(prodSnap.quantity || prodSnap.stock || 0);
                const newQty = currentStock - item.qty;
                await updateDoc(productRef, { quantity: newQty });
            }
        }

        prepareReceiptUI(orderData, total, amountPaid, balance, method, reference);
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('receiptModal').style.display = 'flex';
        
        cart = [];
        renderCart();
        generateOrderID();
        if(document.getElementById('amountPaid')) document.getElementById('amountPaid').value = '';
        if(document.getElementById('customerName')) document.getElementById('customerName').value = '';
        if(document.getElementById('referenceNumber')) document.getElementById('referenceNumber').value = '';

        showToast('Downpayment recorded!', 'success');
    } catch (error) {
        console.error("Error saving order: ", error);
        showToast('Error saving order', 'error');
        throw error; 
    }
}

// =========================================================
// RECEIPT UTILS
// =========================================================

function showReceipt(data) {
    prepareReceiptUI(data, data.total, data.cashReceived, 0, data.method, data.reference);
    document.getElementById('receiptModal').style.display = 'flex';
}

function prepareReceiptUI(data, total, paid, balance, method, refNum) {
    document.getElementById('rec-date').innerText = new Date(data.date).toLocaleString();
    document.getElementById('rec-orderId').innerText = data.orderId;
    document.getElementById('rec-cashier').innerText = data.cashier;
    if(document.getElementById('rec-customer')) document.getElementById('rec-customer').innerText = data.customer;

    const itemsDiv = document.getElementById('rec-items');
    itemsDiv.innerHTML = '';
    data.items.forEach(item => {
        itemsDiv.innerHTML += `<div class="rec-item-row"><span>${item.qty}x ${item.name}</span><span>${(item.price * item.qty).toFixed(2)}</span></div>`;
    });

    document.getElementById('rec-total').innerText = total.toFixed(2);
    document.getElementById('rec-method').innerText = method;

    const rowBalance = document.getElementById('row-balance');
    if(balance > 0) {
        if(rowBalance) { rowBalance.style.display = 'flex'; document.getElementById('rec-balance').innerText = balance.toFixed(2); }
        document.getElementById('row-change').style.display = 'none';
    } else {
        if(rowBalance) rowBalance.style.display = 'none';
        document.getElementById('row-change').style.display = 'flex';
        const change = paid - total;
        document.getElementById('rec-change').innerText = (change > 0 ? change : 0).toFixed(2);
    }

    if(method === 'Cash') {
        document.getElementById('row-cash-paid').style.display = 'flex';
        document.getElementById('rec-cash').innerText = paid.toFixed(2);
        document.getElementById('row-ref').style.display = 'none';
    } else {
        document.getElementById('row-cash-paid').style.display = 'none';
        document.getElementById('row-change').style.display = 'none';
        document.getElementById('row-ref').style.display = 'flex';
        document.getElementById('rec-ref').innerText = refNum;
    }
}

window.closeReceiptModal = function() { document.getElementById('receiptModal').style.display = 'none'; };
window.printReceipt = function() { window.print(); };

function generateOrderID() {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('orderNumber').innerText = `#ORD-${randomId}`;
}

function showToast(msg, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = type === 'success' 
        ? `<i class="fas fa-check-circle"></i> ${msg}` 
        : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setBtnLoading(btn, isLoading) {
    if(!btn) return;
    if(isLoading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        btn.disabled = false;
        if(btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
    }
}

// =========================================================
// SEND TO KITCHEN
// =========================================================

async function sendToKitchen(orderId, cartItems) {
    if (!cartItems || cartItems.length === 0) return;
    try {
        const itemsString = cartItems.map(item => `${item.qty}x ${item.name}`).join("\n");
        await set(ref(rtdb, 'kitchen_queue/current_order'), {
            table: orderId,
            items: itemsString,
            timestamp: Date.now()
        });
        console.log("✅ Sent to Kitchen!");
    } catch (e) {
        console.error("❌ Error sending to kitchen:", e);
    }
}
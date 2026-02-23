// // 1. Get the initialized Database from your local file
// import { db } from './firebase.js'; 

// // 2. Get the Firestore TOOLS directly from the Internet (CDN)
// // This was the missing link causing the "Loading..." freeze
// import { 
//     collection, 
//     doc, 
//     onSnapshot, 
//     query, 
//     setDoc, 
//     updateDoc, 
//     deleteDoc 
// } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// // 3. Get Auth tools for creating users
// import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// console.log("Users JS Starting...");

// // --- WINDOW FUNCTIONS (Keep buttons working) ---

// window.openUserModal = function() {
//     console.log("Button Clicked!"); 
//     const modal = document.getElementById('userModal');
//     if (modal) {
//         document.getElementById('modalTitle').innerText = "Add New User";
//         document.getElementById('userForm').reset();
//         document.getElementById('editUserId').value = "";
//         document.getElementById('email').disabled = false;
//         document.getElementById('passwordGroup').style.display = 'block';
//         document.getElementById('password').required = true;
//         document.getElementById('status').value = 'active';
//         modal.style.display = 'flex';
//     }
// };

// window.closeAllModals = function() {
//     document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
// };

// window.triggerEdit = function(id) {
//     const user = allUsers.find(u => u.id === id);
//     if (!user) return;
//     document.getElementById('modalTitle').innerText = "Edit User";
//     document.getElementById('editUserId').value = user.id;
//     document.getElementById('fullName').value = user.name || '';
//     document.getElementById('email').value = user.email || '';
//     document.getElementById('role').value = user.role || 'cashier';
//     document.getElementById('status').value = user.status || 'active';
//     document.getElementById('email').disabled = true;
//     document.getElementById('passwordGroup').style.display = 'none'; 
//     document.getElementById('password').required = false;
//     document.getElementById('userModal').style.display = 'flex';
// };

// window.triggerDelete = function(id) {
//     document.getElementById('deleteUserId').value = id;
//     document.getElementById('deleteModal').style.display = 'flex';
// };

// window.togglePassVisibility = function() {
//     const passInput = document.getElementById('password');
//     const icon = document.querySelector('.toggle-pass');
//     if (passInput.type === "password") {
//         passInput.type = "text";
//         icon.classList.remove('fa-eye');
//         icon.classList.add('fa-eye-slash');
//     } else {
//         passInput.type = "password";
//         icon.classList.remove('fa-eye-slash');
//         icon.classList.add('fa-eye');
//     }
// };

// // --- CONFIGURATION ---
// const firebaseConfig = {
//     apiKey: "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
//     authDomain: "pos-and-sales-monitoring.firebaseapp.com",
//     projectId: "pos-and-sales-monitoring",
//     storageBucket: "pos-and-sales-monitoring.firebasestorage.app",
//     messagingSenderId: "516453934117",
//     appId: "1:516453934117:web:1783067b8aa6b37373cbcc",
//     measurementId: "G-FT1G64DB9N"
// };

// let allUsers = [];

// // --- MAIN LOGIC ---
// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('userForm');
//     if (form) form.addEventListener('submit', handleFormSubmit);
    
//     document.getElementById('confirmDeleteBtn')?.addEventListener('click', executeDelete);
//     document.getElementById('userSearch')?.addEventListener('keyup', filterUsers);
    
//     // Load Users immediately
//     loadUsers();

//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
// });

// function loadUsers() {
//     try {
//         console.log("Attempting to load users...");
//         const q = query(collection(db, "users"));
        
//         onSnapshot(q, (snapshot) => {
//             allUsers = [];
//             snapshot.forEach(docSnap => {
//                 allUsers.push({ id: docSnap.id, ...docSnap.data() });
//             });
//             console.log(`Loaded ${allUsers.length} users.`);
//             renderUsers(allUsers);
//         }, (error) => {
//             console.error("Snapshot Error:", error);
//             document.getElementById('usersTableBody').innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
//         });
//     } catch (err) {
//         console.error("Load Function Crash:", err);
//     }
// }

// function renderUsers(users) {
//     const tbody = document.getElementById('usersTableBody');
//     if (!tbody) return;
//     tbody.innerHTML = '';

//     if (users.length === 0) {
//         tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#888;">No users found in database.</td></tr>';
//         return;
//     }

//     users.forEach(user => {
//         const name = user.name || 'Unknown';
//         const email = user.email || 'No Email';
//         const role = user.role || 'cashier';
//         const status = user.status || 'active';
//         const avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=64`;
//         const roleBadge = role === 'admin' ? 'admin' : 'cashier';
//         const isActive = status === 'active';

//         const row = `
//             <tr>
//                 <td>
//                     <div class="user-cell">
//                         <img src="${avatarUrl}" alt="${name}">
//                         <span>${name}</span>
//                     </div>
//                 </td>
//                 <td>${email}</td>
//                 <td><span class="role-badge ${roleBadge}">${role.toUpperCase()}</span></td>
//                 <td>
//                     <span class="status-badge ${isActive ? 'status-active' : 'status-disabled'}"></span>
//                     ${isActive ? 'Active' : 'Disabled'}
//                 </td>
//                 <td>
//                     <div class="actions">
//                         <button class="btn-icon" onclick="window.triggerEdit('${user.id}')"><i class="fas fa-edit"></i></button>
//                         ${role === 'admin' 
//                             ? `<button class="btn-icon" style="opacity:0.3; cursor:not-allowed;"><i class="fas fa-trash"></i></button>`
//                             : `<button class="btn-icon delete" onclick="window.triggerDelete('${user.id}')"><i class="fas fa-trash"></i></button>`
//                         }
//                     </div>
//                 </td>
//             </tr>
//         `;
//         tbody.innerHTML += row;
//     });
// }

// async function handleFormSubmit(e) {
//     e.preventDefault();
//     const saveBtn = document.getElementById('saveUserBtn');
    
//     const id = document.getElementById('editUserId').value;
//     const name = document.getElementById('fullName').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const role = document.getElementById('role').value;
//     const status = document.getElementById('status').value;

//     saveBtn.innerText = "Processing...";
//     saveBtn.disabled = true;

//     try {
//         if (id) {
//             await updateDoc(doc(db, "users", id), { name, role, status });
//             showToast("User updated successfully");
//         } else {
//             if (password.length < 6) throw new Error("Password must be 6+ characters");
            
//             let secondaryApp;
//             try { secondaryApp = getApp("SecondaryApp"); } 
//             catch (e) { secondaryApp = initializeApp(firebaseConfig, "SecondaryApp"); }
            
//             const secondaryAuth = getAuth(secondaryApp);
//             const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            
//             await setDoc(doc(db, "users", cred.user.uid), {
//                 name, email, role, status, createdAt: new Date()
//             });
            
//             showToast("User created successfully");
//         }
//         window.closeAllModals();
//     } catch (err) {
//         console.error(err);
//         if(err.code === 'auth/email-already-in-use') showToast("Email already exists", "error");
//         else showToast(err.message, "error");
//     } finally {
//         saveBtn.innerText = "Save User";
//         saveBtn.disabled = false;
//     }
// }

// async function executeDelete() {
//     const id = document.getElementById('deleteUserId').value;
//     const btn = document.getElementById('confirmDeleteBtn');
//     btn.innerText = "Deleting...";
//     btn.disabled = true;

//     try {
//         await deleteDoc(doc(db, "users", id));
//         showToast("User deleted");
//         window.closeAllModals();
//     } catch (err) {
//         showToast(err.message, "error");
//     } finally {
//         btn.innerText = "Delete";
//         btn.disabled = false;
//     }
// }

// function filterUsers() {
//     const term = document.getElementById('userSearch').value.toLowerCase();
//     const filtered = allUsers.filter(u => 
//         (u.name && u.name.toLowerCase().includes(term)) || 
//         (u.email && u.email.toLowerCase().includes(term))
//     );
//     renderUsers(filtered);
// }

// function showToast(message, type = 'success') {
//     const container = document.getElementById('toast-container');
//     if (!container) return;
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = `<i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'}"></i> <span>${message}</span>`;
//     container.appendChild(toast);
//     setTimeout(() => {
//         toast.style.opacity = '0';
//         setTimeout(() => toast.remove(), 300);
//     }, 3000);
// }






// // 1. Get the initialized Database from your local file
// import { db } from './firebase.js'; 

// // 2. Get the Firestore TOOLS directly from the Internet (CDN)
// import { 
//     collection, 
//     doc, 
//     getDoc, 
//     onSnapshot, 
//     query, 
//     setDoc, 
//     updateDoc, 
//     deleteDoc 
// } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// // 3. Get Auth tools for creating users
// import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// console.log("Users JS Starting...");

// // --- ACCESS CONTROL CHECK ---
// const auth = getAuth();
// onAuthStateChanged(auth, async (user) => {
//     if (user) {
//         // Check if current user is Admin
//         const userRef = doc(db, "users", user.uid);
//         const userSnap = await getDoc(userRef);
        
//         if (userSnap.exists()) {
//             const userData = userSnap.data();
//             // RULE: Only Admin can access Manage Users
//             if (userData.role !== 'admin') {
//                 console.warn("Unauthorized access to Users page.");
//                 // Redirect based on role rules
//                 if (userData.role === 'cashier') window.location.href = 'pos.html';
//                 else if (userData.role === 'clerk') window.location.href = 'inventory.html';
//                 else window.location.href = 'dashboard.html';
//             }
//         }
//     }
// });

// // --- WINDOW FUNCTIONS (Keep buttons working) ---

// window.openUserModal = function() {
//     console.log("Button Clicked!"); 
//     const modal = document.getElementById('userModal');
//     if (modal) {
//         document.getElementById('modalTitle').innerText = "Add New User";
//         document.getElementById('userForm').reset();
//         document.getElementById('editUserId').value = "";
//         document.getElementById('email').disabled = false;
//         document.getElementById('passwordGroup').style.display = 'block';
//         document.getElementById('password').required = true;
//         document.getElementById('status').value = 'active';
        
//         // Handle Role Select
//         const roleSelect = document.getElementById('role');
//         // Ensure 'admin' option is REMOVED when creating new users
//         const adminOpt = roleSelect.querySelector('option[value="admin"]');
//         if(adminOpt) adminOpt.remove();
        
//         roleSelect.disabled = false;
//         roleSelect.value = 'cashier';
        
//         modal.style.display = 'flex';
//     }
// };

// window.closeAllModals = function() {
//     document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
// };

// window.triggerEdit = function(id) {
//     const user = allUsers.find(u => u.id === id);
//     if (!user) return;
    
//     document.getElementById('modalTitle').innerText = "Edit User";
//     document.getElementById('editUserId').value = user.id;
//     document.getElementById('fullName').value = user.name || '';
//     document.getElementById('email').value = user.email || '';
//     document.getElementById('status').value = user.status || 'active';
//     document.getElementById('email').disabled = true;
    
//     // Handle Role Select Logic
//     const roleSelect = document.getElementById('role');
    
//     // First, remove any old dynamic options to start clean
//     const existingAdminOpt = roleSelect.querySelector('option[value="admin"]');
//     if (existingAdminOpt) existingAdminOpt.remove();

//     if (user.role === 'admin') {
//         // If the user IS an admin, we must add the option so they can be saved correctly
//         const opt = document.createElement('option');
//         opt.value = 'admin';
//         opt.innerText = 'Administrator';
//         roleSelect.appendChild(opt);
        
//         roleSelect.value = 'admin';
//         // RULE: Disable dropdown so Admin role cannot be changed (prevents locking oneself out)
//         roleSelect.disabled = true; 
//     } else {
//         // Normal user: Enable select, ensure value is set
//         roleSelect.disabled = false;
//         roleSelect.value = user.role || 'cashier';
//     }

//     document.getElementById('passwordGroup').style.display = 'none'; 
//     document.getElementById('password').required = false;
//     document.getElementById('userModal').style.display = 'flex';
// };

// window.triggerDelete = function(id) {
//     document.getElementById('deleteUserId').value = id;
//     document.getElementById('deleteModal').style.display = 'flex';
// };

// window.togglePassVisibility = function() {
//     const passInput = document.getElementById('password');
//     const icon = document.querySelector('.toggle-pass');
//     if (passInput.type === "password") {
//         passInput.type = "text";
//         icon.classList.remove('fa-eye');
//         icon.classList.add('fa-eye-slash');
//     } else {
//         passInput.type = "password";
//         icon.classList.remove('fa-eye-slash');
//         icon.classList.add('fa-eye');
//     }
// };

// // --- CONFIGURATION ---
// const firebaseConfig = {
//     apiKey: "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
//     authDomain: "pos-and-sales-monitoring.firebaseapp.com",
//     projectId: "pos-and-sales-monitoring",
//     storageBucket: "pos-and-sales-monitoring.firebasestorage.app",
//     messagingSenderId: "516453934117",
//     appId: "1:516453934117:web:1783067b8aa6b37373cbcc",
//     measurementId: "G-FT1G64DB9N"
// };

// let allUsers = [];

// // --- MAIN LOGIC ---
// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('userForm');
//     if (form) form.addEventListener('submit', handleFormSubmit);
    
//     document.getElementById('confirmDeleteBtn')?.addEventListener('click', executeDelete);
//     document.getElementById('userSearch')?.addEventListener('keyup', filterUsers);
    
//     // Load Users
//     loadUsers();

//     const dateEl = document.getElementById('currentDate');
//     if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
// });

// function loadUsers() {
//     try {
//         console.log("Attempting to load users...");
//         const q = query(collection(db, "users"));
        
//         onSnapshot(q, (snapshot) => {
//             allUsers = [];
//             snapshot.forEach(docSnap => {
//                 allUsers.push({ id: docSnap.id, ...docSnap.data() });
//             });
//             console.log(`Loaded ${allUsers.length} users.`);
//             renderUsers(allUsers);
//         }, (error) => {
//             console.error("Snapshot Error:", error);
//             document.getElementById('usersTableBody').innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
//         });
//     } catch (err) {
//         console.error("Load Function Crash:", err);
//     }
// }

// function renderUsers(users) {
//     const tbody = document.getElementById('usersTableBody');
//     if (!tbody) return;
//     tbody.innerHTML = '';

//     if (users.length === 0) {
//         tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#888;">No users found.</td></tr>';
//         return;
//     }

//     users.forEach(user => {
//         const name = user.name || 'Unknown';
//         const email = user.email || 'No Email';
//         const role = user.role || 'cashier';
//         const status = user.status || 'active';
//         // RULE: Admin views passwords. Show 'plainPassword' if available.
//         const passwordDisplay = user.plainPassword ? user.plainPassword : '•••'; 
        
//         const avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=64`;
        
//         // Badges for roles
//         let roleBadge = 'cashier';
//         if (role === 'admin') roleBadge = 'admin';
//         if (role === 'clerk') roleBadge = 'clerk'; 

//         const isActive = status === 'active';

//         const row = `
//             <tr>
//                 <td>
//                     <div class="user-cell">
//                         <img src="${avatarUrl}" alt="${name}">
//                         <span>${name}</span>
//                     </div>
//                 </td>
//                 <td>${email}</td>
//                 <td style="font-family: monospace; color: var(--primary);">${passwordDisplay}</td>
//                 <td><span class="role-badge ${roleBadge}">${role.toUpperCase()}</span></td>
//                 <td>
//                     <span class="status-badge ${isActive ? 'status-active' : 'status-disabled'}"></span>
//                     ${isActive ? 'Active' : 'Disabled'}
//                 </td>
//                 <td>
//                     <div class="actions">
//                         <button class="btn-icon" onclick="window.triggerEdit('${user.id}')"><i class="fas fa-edit"></i></button>
//                         ${role === 'admin' 
//                             ? `<button class="btn-icon" style="opacity:0.3; cursor:not-allowed;"><i class="fas fa-trash"></i></button>`
//                             : `<button class="btn-icon delete" onclick="window.triggerDelete('${user.id}')"><i class="fas fa-trash"></i></button>`
//                         }
//                     </div>
//                 </td>
//             </tr>
//         `;
//         tbody.innerHTML += row;
//     });
// }

// async function handleFormSubmit(e) {
//     e.preventDefault();
//     const saveBtn = document.getElementById('saveUserBtn');
    
//     const id = document.getElementById('editUserId').value;
//     const name = document.getElementById('fullName').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const role = document.getElementById('role').value;
//     const status = document.getElementById('status').value;

//     // Redundant safety check
//     if (role === 'admin' && !id) {
//         showToast("Cannot create new Admins.", "error");
//         return;
//     }

//     saveBtn.innerText = "Processing...";
//     saveBtn.disabled = true;

//     try {
//         if (id) {
//             // Update existing user
//             await updateDoc(doc(db, "users", id), { name, role, status });
//             showToast("User updated successfully");
//         } else {
//             // Create new user
//             if (password.length < 6) throw new Error("Password must be 6+ characters");
            
//             // Create user in secondary app to avoid logging out current admin
//             let secondaryApp;
//             try { secondaryApp = getApp("SecondaryApp"); } 
//             catch (e) { secondaryApp = initializeApp(firebaseConfig, "SecondaryApp"); }
            
//             const secondaryAuth = getAuth(secondaryApp);
//             const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            
//             // RULE: Store password so Admin can view it later
//             await setDoc(doc(db, "users", cred.user.uid), {
//                 name, 
//                 email, 
//                 role, 
//                 status, 
//                 plainPassword: password, // Storing for "View Password" requirement
//                 createdAt: new Date()
//             });
            
//             showToast("User created successfully");
//         }
//         window.closeAllModals();
//     } catch (err) {
//         console.error(err);
//         if(err.code === 'auth/email-already-in-use') showToast("Email already exists", "error");
//         else showToast(err.message, "error");
//     } finally {
//         saveBtn.innerText = "Save User";
//         saveBtn.disabled = false;
//     }
// }

// async function executeDelete() {
//     const id = document.getElementById('deleteUserId').value;
//     const btn = document.getElementById('confirmDeleteBtn');
//     btn.innerText = "Deleting...";
//     btn.disabled = true;

//     try {
//         await deleteDoc(doc(db, "users", id));
//         showToast("User deleted");
//         window.closeAllModals();
//     } catch (err) {
//         showToast(err.message, "error");
//     } finally {
//         btn.innerText = "Delete";
//         btn.disabled = false;
//     }
// }

// function filterUsers() {
//     const term = document.getElementById('userSearch').value.toLowerCase();
//     const filtered = allUsers.filter(u => 
//         (u.name && u.name.toLowerCase().includes(term)) || 
//         (u.email && u.email.toLowerCase().includes(term))
//     );
//     renderUsers(filtered);
// }

// function showToast(message, type = 'success') {
//     const container = document.getElementById('toast-container');
//     if (!container) return;
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.innerHTML = `<i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'}"></i> <span>${message}</span>`;
//     container.appendChild(toast);
//     setTimeout(() => {
//         toast.style.opacity = '0';
//         setTimeout(() => toast.remove(), 300);
//     }, 3000);
// }







// 1. Get the initialized Database from your local file
import { db } from './firebase.js'; 

// 2. Get the Firestore TOOLS
import { 
    collection, 
    doc, 
    getDoc, 
    onSnapshot, 
    query, 
    setDoc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 3. Get Auth tools
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updatePassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

console.log("Users JS Starting...");

// --- GLOBAL STATE ---
let currentUserUid = null;
let allUsers = [];

// --- ACCESS CONTROL CHECK ---
const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserUid = user.uid; // Store for self-check later
        
        // Check if current user is Admin
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            // RULE: Only Admin can access Manage Users
            if (userData.role !== 'admin') {
                console.warn("Unauthorized access to Users page.");
                if (userData.role === 'cashier') window.location.href = 'pos.html';
                else if (userData.role === 'clerk') window.location.href = 'inventory.html';
                else window.location.href = 'dashboard.html';
            }
        }
    }
});

// --- WINDOW FUNCTIONS ---

window.openUserModal = function() {
    const modal = document.getElementById('userModal');
    if (modal) {
        // Reset UI for "Add New"
        document.getElementById('modalTitle').innerText = "Add New User";
        document.getElementById('userForm').reset();
        document.getElementById('editUserId').value = "";
        
        document.getElementById('email').disabled = false;
        document.getElementById('email').classList.remove('input-disabled');
        
        // Password is required for new users
        document.getElementById('passLabel').innerHTML = 'Password <small>(Min. 6 characters)</small>';
        document.getElementById('passHelpText').style.display = 'none';
        document.getElementById('password').required = true;

        // Reset Status UI
        const statusSelect = document.getElementById('status');
        statusSelect.disabled = false;
        statusSelect.value = 'active';
        document.getElementById('selfDisableWarning').style.display = 'none';
        
        // Handle Role Select
        const roleSelect = document.getElementById('role');
        const adminOpt = roleSelect.querySelector('option[value="admin"]');
        if(adminOpt) adminOpt.remove();
        
        roleSelect.disabled = false;
        roleSelect.value = 'cashier';
        
        modal.style.display = 'flex';
    }
};

window.closeAllModals = function() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
};

window.triggerEdit = function(id) {
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    
    document.getElementById('modalTitle').innerText = "Edit User Details";
    document.getElementById('editUserId').value = user.id;
    document.getElementById('fullName').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('status').value = user.status || 'active';
    
    // Disable Email (cannot change ID)
    const emailInput = document.getElementById('email');
    emailInput.disabled = true;
    emailInput.classList.add('input-disabled');
    
    // -- PASSWORD CHANGE LOGIC --
    // Password is optional for edits. If filled, we update it.
    document.getElementById('passLabel').innerText = 'New Password';
    document.getElementById('passHelpText').style.display = 'block';
    document.getElementById('password').value = ""; // Clear it
    document.getElementById('password').required = false;

    // -- ROLE LOGIC --
    const roleSelect = document.getElementById('role');
    const existingAdminOpt = roleSelect.querySelector('option[value="admin"]');
    if (existingAdminOpt) existingAdminOpt.remove();

    if (user.role === 'admin') {
        const opt = document.createElement('option');
        opt.value = 'admin';
        opt.innerText = 'Administrator';
        roleSelect.appendChild(opt);
        roleSelect.value = 'admin';
        roleSelect.disabled = true; 
    } else {
        roleSelect.disabled = false;
        roleSelect.value = user.role || 'cashier';
    }

    // -- SELF-DISABLE PREVENTION LOGIC --
    const statusSelect = document.getElementById('status');
    const warningText = document.getElementById('selfDisableWarning');

    if (currentUserUid && user.id === currentUserUid) {
        // If editing self, lock status to active
        statusSelect.value = 'active'; 
        statusSelect.disabled = true; 
        statusSelect.classList.add('input-disabled');
        warningText.style.display = 'block';
    } else {
        // Normal edit
        statusSelect.disabled = false; 
        statusSelect.classList.remove('input-disabled');
        warningText.style.display = 'none';
    }

    document.getElementById('userModal').style.display = 'flex';
};

window.triggerDelete = function(id) {
    // Prevent deleting yourself
    if (currentUserUid && id === currentUserUid) {
        showToast("You cannot delete your own account.", "error");
        return;
    }
    document.getElementById('deleteUserId').value = id;
    document.getElementById('deleteModal').style.display = 'flex';
};

window.generatePassword = function() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pass = "";
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const passInput = document.getElementById('password');
    passInput.value = pass;
    passInput.type = "text"; // Show it so they can read it
};

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
    authDomain: "pos-and-sales-monitoring.firebaseapp.com",
    projectId: "pos-and-sales-monitoring",
    storageBucket: "pos-and-sales-monitoring.firebasestorage.app",
    messagingSenderId: "516453934117",
    appId: "1:516453934117:web:1783067b8aa6b37373cbcc",
    measurementId: "G-FT1G64DB9N"
};

// --- MAIN LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
    
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', executeDelete);
    document.getElementById('userSearch')?.addEventListener('keyup', filterUsers);
    
    loadUsers();

    const dateEl = document.getElementById('currentDate');
    if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

function loadUsers() {
    try {
        const q = query(collection(db, "users"));
        
        onSnapshot(q, (snapshot) => {
            allUsers = [];
            snapshot.forEach(docSnap => {
                allUsers.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderUsers(allUsers);
        }, (error) => {
            console.error("Snapshot Error:", error);
            document.getElementById('usersTableBody').innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
        });
    } catch (err) {
        console.error("Load Function Crash:", err);
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#888;">No users found.</td></tr>';
        return;
    }

    users.forEach(user => {
        const name = user.name || 'Unknown';
        const email = user.email || 'No Email';
        const role = user.role || 'cashier';
        const status = user.status || 'active';
        // Display plain password or placeholders
        const passwordDisplay = user.plainPassword ? user.plainPassword : '<span style="color:#ccc; font-size:10px;">HIDDEN</span>'; 
        
        const avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=64`;
        
        let roleBadge = 'cashier';
        if (role === 'admin') roleBadge = 'admin';
        if (role === 'clerk') roleBadge = 'clerk'; 

        const isActive = status === 'active';

        const row = `
            <tr>
                <td>
                    <div class="user-cell">
                        <img src="${avatarUrl}" alt="${name}">
                        <span>${name}</span>
                    </div>
                </td>
                <td>${email}</td>
                <td style="font-family: monospace; font-size: 14px; color: var(--navy); background: #f8f9fc; padding: 5px 10px; border-radius: 6px; width: fit-content; display: inline-block; margin-top: 10px;">
                    ${passwordDisplay}
                </td>
                <td><span class="role-badge ${roleBadge}">${role.toUpperCase()}</span></td>
                <td>
                    <span class="status-badge ${isActive ? 'status-active' : 'status-disabled'}"></span>
                    ${isActive ? 'Active' : 'Disabled'}
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-icon" onclick="window.triggerEdit('${user.id}')" title="Edit User"><i class="fas fa-edit"></i></button>
                        ${role === 'admin' 
                            ? `<button class="btn-icon" style="opacity:0.3; cursor:not-allowed;" title="Admins cannot be deleted"><i class="fas fa-trash"></i></button>`
                            : `<button class="btn-icon delete" onclick="window.triggerDelete('${user.id}')" title="Delete User"><i class="fas fa-trash"></i></button>`
                        }
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Helper to get Secondary Auth instance (prevents logging out main admin)
function getSecondaryAuth() {
    let secondaryApp;
    try { 
        secondaryApp = getApp("SecondaryApp"); 
    } catch (e) { 
        secondaryApp = initializeApp(firebaseConfig, "SecondaryApp"); 
    }
    return getAuth(secondaryApp);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveUserBtn');
    
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const status = document.getElementById('status').value;

    if (role === 'admin' && !id) {
        showToast("Cannot create new Admins.", "error");
        return;
    }

    saveBtn.innerText = "Processing...";
    saveBtn.disabled = true;

    const secondaryAuth = getSecondaryAuth();

    try {
        if (id) {
            // --- UPDATE EXISTING USER ---
            const updates = { name, role, status };
            
            // Handle Password Change if a new one is typed
            if (password && password.trim() !== "") {
                if (password.length < 6) throw new Error("Password must be 6+ characters");

                // 1. Get the OLD password from DB to authenticate the user
                const userDoc = await getDoc(doc(db, "users", id));
                const oldPassword = userDoc.data().plainPassword;

                if (oldPassword) {
                    try {
                        // 2. Sign in as that user in the background
                        const userCredential = await signInWithEmailAndPassword(secondaryAuth, email, oldPassword);
                        
                        // 3. Update their password
                        await updatePassword(userCredential.user, password);
                        
                        // 4. Sign them out
                        await signOut(secondaryAuth);
                        
                        // 5. Add new password to database updates
                        updates.plainPassword = password;
                        console.log("Password updated securely via Secondary Auth.");
                    } catch (authErr) {
                        console.error("Auth Update Failed:", authErr);
                        showToast("Could not update Auth password (Old password mismatch?). Updating DB record only.", "warning");
                        // Fallback: Just update the DB record so Admin sees the 'intended' password
                        updates.plainPassword = password; 
                    }
                } else {
                    // If we don't have the old password, we can't update Auth easily without Admin SDK.
                    // We just update the DB record.
                    updates.plainPassword = password;
                    showToast("User has no stored password. DB updated, but Login password may not match.", "warning");
                }
            }

            await updateDoc(doc(db, "users", id), updates);
            showToast("User updated successfully");

        } else {
            // --- CREATE NEW USER ---
            if (password.length < 6) throw new Error("Password must be 6+ characters");
            
            const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            await signOut(secondaryAuth); // Clean up
            
            await setDoc(doc(db, "users", cred.user.uid), {
                name, 
                email, 
                role, 
                status, 
                plainPassword: password, 
                createdAt: new Date()
            });
            
            showToast("User created successfully");
        }
        window.closeAllModals();
    } catch (err) {
        console.error(err);
        if(err.code === 'auth/email-already-in-use') showToast("Email already exists", "error");
        else showToast(err.message, "error");
    } finally {
        saveBtn.innerText = "Save User";
        saveBtn.disabled = false;
    }
}

async function executeDelete() {
    const id = document.getElementById('deleteUserId').value;
    const btn = document.getElementById('confirmDeleteBtn');
    
    // Safety check again
    if(currentUserUid && id === currentUserUid) {
        showToast("Cannot delete yourself!", "error");
        window.closeAllModals();
        return;
    }

    btn.innerText = "Deleting...";
    btn.disabled = true;

    try {
        await deleteDoc(doc(db, "users", id));
        showToast("User deleted from database");
        window.closeAllModals();
    } catch (err) {
        showToast(err.message, "error");
    } finally {
        btn.innerText = "Delete";
        btn.disabled = false;
    }
}

function filterUsers() {
    const term = document.getElementById('userSearch').value.toLowerCase();
    const filtered = allUsers.filter(u => 
        (u.name && u.name.toLowerCase().includes(term)) || 
        (u.email && u.email.toLowerCase().includes(term))
    );
    renderUsers(filtered);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-check-circle';
    if(type === 'error') icon = 'fa-times-circle';
    if(type === 'warning') icon = 'fa-exclamation-triangle';

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
// ─── State ────────────────────────────────────────────────────────────────────
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editingId = null;

// ─── DOM Elements ─────────────────────────────────────────────────────────────
const coninter = document.querySelector(".coninter");
const newContact = document.querySelector(".New-contact");
const buttonAddContact = document.getElementById("buttonaddcontant");
const closeButton = document.getElementById("closebutton");
const saveButton = document.getElementById("SaveContant");
const editButton = document.getElementById("editContant");
const contactsGrid = document.getElementById("contactsGrid");
const favoritesList = document.getElementById("favoritesList");
const emergencyList = document.getElementById("emergencyList");
const totalCounter = document.getElementById("totalCounter");
const favoritesCounter = document.getElementById("favoritesCounter");
const emergencyCounter = document.getElementById("emergencyCounter");
const addTitle = document.getElementById("AddContant");
const editTitle = document.getElementById("editsContant");

// Inputs
const nameInput = document.getElementById("ContantName");
const phoneInput = document.getElementById("ContantNumber");
const emailInput = document.getElementById("ContantEmail");
const addressInput = document.getElementById("ContantAddress");
const groupSelect = document.getElementById("ContantSelect");
const notesInput = document.getElementById("floatingTextarea");
const favoriteCheck = document.getElementById("checkFavorite");
const emergencyCheck = document.getElementById("checkEmergency");

// ─── Validation ───────────────────────────────────────────────────────────────
const validations = {
  ContantName: {
    regex: /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/,
    msg: "Name should contain only letters and spaces (2-50 characters)",
  },
  ContantNumber: {
    regex: /^(01)[0125][0-9]{8}$/,
    msg: "Please enter a valid Egyptian phone number",
  },
  ContantEmail: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    msg: "Please enter a valid email address",
    optional: true,
  },
  ContantAddress: {
    regex: /^.{2,100}$/,
    msg: "Please enter a valid Address",
    optional: true,
  },
};

function validateAllInputs(input) {
  const rule = validations[input.id];
  if (!rule) return true;
  const p = input.nextElementSibling;
  const value = input.value.trim();

  if (rule.optional && value === "") {
    input.classList.remove("is-invalid", "is-valid");
    if (p) p.classList.add("d-none");
    return true;
  }

  if (rule.regex.test(value)) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (p) p.classList.add("d-none");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    if (p) {
      p.classList.remove("d-none");
      p.textContent = rule.msg;
      p.style.color = "red";
      p.style.fontSize = "12px";
    }
    return false;
  }
}

function validateForm() {
  const nameOk = validateAllInputs(nameInput);
  const phoneOk = validateAllInputs(phoneInput);
  const emailOk = validateAllInputs(emailInput);
  const addressOk = validateAllInputs(addressInput);
  return nameOk && phoneOk && emailOk && addressOk;
}

// ─── Save to localStorage ─────────────────────────────────────────────────────
function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// ─── Open / Close Modal ───────────────────────────────────────────────────────
function openModal(editMode = false) {
  coninter.classList.add("show");
  newContact.classList.add("show");
  if (editMode) {
    addTitle.classList.add("d-none");
    editTitle.classList.remove("d-none");
    saveButton.classList.add("d-none");
    editButton.classList.remove("d-none");
  } else {
    addTitle.classList.remove("d-none");
    editTitle.classList.add("d-none");
    saveButton.classList.remove("d-none");
    editButton.classList.add("d-none");
  }
}

function closeModal() {
  coninter.classList.remove("show");
  newContact.classList.remove("show");
  resetForm();
  editingId = null;
}

function resetForm() {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  groupSelect.value = "";
  notesInput.value = "";
  favoriteCheck.checked = false;
  emergencyCheck.checked = false;
  [nameInput, phoneInput, emailInput, addressInput].forEach((el) => {
    el.classList.remove("is-valid", "is-invalid");
  });
}

buttonAddContact.addEventListener("click", () => openModal(false));
closeButton.addEventListener("click", closeModal);
coninter.addEventListener("click", (e) => {
  if (e.target === coninter) closeModal();
});

// ─── Get Initials ─────────────────────────────────────────────────────────────
function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

// ─── Color from name ─────────────────────────────────────────────────────────
const colors = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#f97316",
  "#06b6d4",
];
function getColor(name) {
  let hash = 0;
  for (let c of name) hash += c.charCodeAt(0);
  return colors[hash % colors.length];
}

// ─── Render Contacts ──────────────────────────────────────────────────────────
function renderContacts(list = contacts) {
  contactsGrid.innerHTML = "";

  if (list.length === 0) {
    contactsGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-people fs-1 text-secondary"></i>
        <p class="text-secondary mt-2">No contacts found</p>
      </div>`;
    updateCounters();
    renderSideLists();
    return;
  }

  list.forEach((c) => {
    const initials = getInitials(c.name);
    const color = getColor(c.name);
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-lg-4";
    card.innerHTML = `
      <div class="bg-white rounded-4 border shadow-sm p-3 d-flex flex-column gap-2 h-100">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold fs-5 flex-shrink-0"
            style="width:50px;height:50px;background:${color}">${initials}</div>
          <div class="flex-grow-1 overflow-hidden">
            <p class="fw-bold m-0 text-truncate">${c.name}</p>
            <p class="text-secondary small m-0 text-truncate">${c.group || "No Group"}</p>
          </div>
          <div class="d-flex gap-1">
            ${c.favorite ? '<span class="badge bg-warning text-dark"><i class="bi bi-star-fill"></i></span>' : ""}
            ${c.emergency ? '<span class="badge bg-danger"><i class="bi bi-heart-pulse-fill"></i></span>' : ""}
          </div>
        </div>

        <div class="d-flex flex-column gap-1 text-secondary small">
          <span><i class="bi bi-telephone me-1"></i>${c.phone}</span>
          ${c.email ? `<span><i class="bi bi-envelope me-1"></i>${c.email}</span>` : ""}
          ${c.address ? `<span><i class="bi bi-geo-alt me-1"></i>${c.address}</span>` : ""}
        </div>

        <div class="d-flex gap-2 mt-auto pt-2 border-top flex-wrap">
          <a href="tel:${c.phone}" class="btn btn-sm btn-outline-success rounded-3 flex-fill">
            <i class="bi bi-telephone-fill"></i> Call
          </a>
          ${
            c.email
              ? `<a href="mailto:${c.email}" class="btn btn-sm btn-outline-primary rounded-3 flex-fill">
            <i class="bi bi-envelope-fill"></i> Email
          </a>`
              : ""
          }
          <button onclick="toggleFavorite('${c.id}')"
            class="btn btn-sm ${c.favorite ? "btn-warning" : "btn-outline-warning"} rounded-3">
            <i class="bi bi-star${c.favorite ? "-fill" : ""}"></i>
          </button>
          <button onclick="editContact('${c.id}')"
            class="btn btn-sm btn-outline-secondary rounded-3">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button onclick="deleteContact('${c.id}')"
            class="btn btn-sm btn-outline-danger rounded-3">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>`;
    contactsGrid.appendChild(card);
  });

  updateCounters();
  renderSideLists();
}

// ─── Side Lists ───────────────────────────────────────────────────────────────
function renderSideLists() {
  const favs = contacts.filter((c) => c.favorite);
  const emer = contacts.filter((c) => c.emergency);

  favoritesList.innerHTML = favs.length
    ? favs
        .map(
          (c) => `
        <div class="d-flex align-items-center gap-2 p-2 border-bottom">
          <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
            style="width:35px;height:35px;background:${getColor(c.name)};font-size:12px">${getInitials(c.name)}</div>
          <div class="overflow-hidden">
            <p class="m-0 fw-medium small text-truncate">${c.name}</p>
            <a href="tel:${c.phone}" class="text-secondary small text-decoration-none">${c.phone}</a>
          </div>
        </div>`,
        )
        .join("")
    : `<div class="p-3 text-center text-secondary small">No favorites yet</div>`;

  emergencyList.innerHTML = emer.length
    ? emer
        .map(
          (c) => `
        <div class="d-flex align-items-center gap-2 p-2 border-bottom">
          <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
            style="width:35px;height:35px;background:${getColor(c.name)};font-size:12px">${getInitials(c.name)}</div>
          <div class="overflow-hidden">
            <p class="m-0 fw-medium small text-truncate">${c.name}</p>
            <a href="tel:${c.phone}" class="text-secondary small text-decoration-none">${c.phone}</a>
          </div>
        </div>`,
        )
        .join("")
    : `<div class="p-3 text-center text-secondary small">No emergency contacts</div>`;
}

// ─── Counters ─────────────────────────────────────────────────────────────────
function updateCounters() {
  totalCounter.textContent = contacts.length;
  favoritesCounter.textContent = contacts.filter((c) => c.favorite).length;
  emergencyCounter.textContent = contacts.filter((c) => c.emergency).length;
}

// ─── Add Contact ──────────────────────────────────────────────────────────────
saveButton.addEventListener("click", () => {
  if (!validateForm()) return;

  const newC = {
    id: Date.now().toString(),
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    group: groupSelect.value,
    notes: notesInput.value.trim(),
    favorite: favoriteCheck.checked,
    emergency: emergencyCheck.checked,
  };

  contacts.push(newC);
  saveContacts();
  renderContacts();
  closeModal();

  Swal.fire({
    icon: "success",
    title: "Contact Added!",
    text: `${newC.name} has been added successfully.`,
    timer: 2000,
    showConfirmButton: false,
  });
});

// ─── Edit Contact ─────────────────────────────────────────────────────────────
function editContact(id) {
  const c = contacts.find((c) => c.id === id);
  if (!c) return;
  editingId = id;

  nameInput.value = c.name;
  phoneInput.value = c.phone;
  emailInput.value = c.email;
  addressInput.value = c.address;
  groupSelect.value = c.group;
  notesInput.value = c.notes;
  favoriteCheck.checked = c.favorite;
  emergencyCheck.checked = c.emergency;

  openModal(true);
}

editButton.addEventListener("click", () => {
  if (!validateForm()) return;

  const idx = contacts.findIndex((c) => c.id === editingId);
  if (idx === -1) return;

  contacts[idx] = {
    ...contacts[idx],
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    group: groupSelect.value,
    notes: notesInput.value.trim(),
    favorite: favoriteCheck.checked,
    emergency: emergencyCheck.checked,
  };

  saveContacts();
  renderContacts();
  closeModal();

  Swal.fire({
    icon: "success",
    title: "Contact Updated!",
    timer: 2000,
    showConfirmButton: false,
  });
});

// ─── Delete Contact ───────────────────────────────────────────────────────────
function deleteContact(id) {
  const c = contacts.find((c) => c.id === id);
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${c?.name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      contacts = contacts.filter((c) => c.id !== id);
      saveContacts();
      renderContacts();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

// ─── Toggle Favorite ──────────────────────────────────────────────────────────
function toggleFavorite(id) {
  const c = contacts.find((c) => c.id === id);
  if (!c) return;
  c.favorite = !c.favorite;
  saveContacts();
  renderContacts();
}

// ─── Search ───────────────────────────────────────────────────────────────────
function serach() {
  const val = document.getElementById("input1").value.trim().toLowerCase();
  if (!val) {
    renderContacts();
    return;
  }
  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(val) ||
      c.phone.includes(val) ||
      c.email.toLowerCase().includes(val),
  );
  renderContacts(filtered);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
renderContacts();

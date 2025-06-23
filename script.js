// Secure script for OPERATION CICADA archive interactions

const expectedHash = "e4ad5e24770c2a8303d2a1257c0ef111a80f8a533228d0bea798b1f29fb6cf5a";
let activeAction = null;
let loginAttempts = 0;

// Toggle dropdown
function toggleDropdown(id) {
  document.getElementById(id).classList.toggle("show");
}

// Handle top menu clicks
function menuClick(name) {
  alert(name + " menu is currently disabled.");
}

// Simulated window close
function closeWindow() {
  document.body.innerHTML = "<h1 style='text-align:center; padding-top:100px;'>[ Window Closed ]</h1>";
}

// Show login modal
function showLogin(action, fileName = null) {
  activeAction = { type: action, file: fileName };
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("password").value = "";
  document.getElementById("loginError").style.display = "none";
}

// Hide login modal
function hideLogin() {
  document.getElementById("loginModal").style.display = "none";
  activeAction = null;
}

// Handle login submission
async function verifyLogin(event) {
  event.preventDefault();
  const pw = document.getElementById("password").value;
  const hash = await sha256(pw);

  if (hash === expectedHash) {
    hideLogin();
    if (activeAction) {
      if (activeAction.type === "remove") {
        document.getElementById(activeAction.file).remove();
      } else if (activeAction.type === "upload") {
        document.getElementById("uploadPanel").style.display = "block";
      }
    }
  } else {
    loginAttempts++;
    document.getElementById("loginError").style.display = "block";
    if (loginAttempts >= 3) {
      document.getElementById("loginError").innerText = "Access Denied. Incident Logged.";
    }
  }
}

// Generate SHA-256 hash
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// File list array (initial)
const files = [
  { name: "angel_cabrera_personnel_dossier.pdf", classification: "TOP SECRET / SCI", status: "Presumed Deceased" },
  { name: "oscar_hicks_personnel_dossier.pdf", classification: "TOP SECRET / SCI", status: "Missing (MIA)" },
  { name: "irc_facility_operational_dossier_9levels.pdf", classification: "TOP SECRET / SCI", status: "Facility: DRT NODE" },
  { name: "irc_drt_branch.pdf", classification: "CONFIDENTIAL", status: "Decommissioned (Public-Facing)" },
  { name: "operation_cicada_executive_briefing.pdf", classification: "TOP SECRET / SCI", status: "Distribution: LIMITED" }
];

function addFileToList(file) {
  const ul = document.getElementById("fileList");
  const dd = document.getElementById("fileDropdown");
  const li = document.createElement("li");
  const id = file.name.replace(/\W+/g, "_");
  li.id = id;
  li.innerHTML = `
    📄 <strong>${file.name}</strong><br>
    <span class="meta">Classification: ${file.classification} &nbsp; | &nbsp; Status: ${file.status}</span><br>
    <a href="${file.name}" target="_blank">[ View Document ]</a>
    &nbsp; <button onclick="showLogin('remove', '${id}')">[ Remove File ]</button>
  `;
  ul.appendChild(li);

  const dlink = document.createElement("a");
  dlink.href = file.name;
  dlink.innerText = file.name;
  dd.appendChild(dlink);
}

function handleFileUpload() {
  const input = document.getElementById("fileInput");
  if (!input.files.length) {
    alert("No file selected.");
    return;
  }
  const file = input.files[0];
  const fakeEntry = {
    name: file.name,
    classification: "USER ADDED",
    status: "Pending Classification"
  };
  addFileToList(fakeEntry);
  input.value = "";
  document.getElementById("uploadPanel").style.display = "none";
}

window.onload = () => {
  files.forEach(file => addFileToList(file));
};

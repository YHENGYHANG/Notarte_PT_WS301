/* =========================================================
   Student Registration Form - script.js
   WS 301 Performance Task (Topics 6-11)

   Sections
   1. Element references
   2. Validation rules (one function per field)
   3. Helpers to show / clear errors (classList add & remove)
   4. Live feedback while typing
   5. Interactive features (classList.toggle, attribute changes)
   6. Submit handler (event.preventDefault)
   7. Reset handler
   ========================================================= */
"use strict";

/* ---------- 1. Element references ---------- */
const form            = document.getElementById("registrationForm");
const successBox      = document.getElementById("successMessage");
const successDetail   = document.getElementById("successDetail");

const studentIdInput  = document.getElementById("studentId");
const fullNameInput   = document.getElementById("fullName");
const emailInput      = document.getElementById("email");
const phoneInput      = document.getElementById("phone");
const dobInput        = document.getElementById("dob");
const genderGroup     = document.getElementById("genderGroup");
const programSelect   = document.getElementById("program");
const yearSelect      = document.getElementById("yearLevel");
const yearHint        = document.getElementById("yearHint");
const passwordInput   = document.getElementById("password");
const confirmInput    = document.getElementById("confirmPassword");
const addressInput    = document.getElementById("address");
const addressCount    = document.getElementById("addressCount");
const agreementInput  = document.getElementById("agreement");
const agreementGroup  = document.getElementById("agreementGroup");

const togglePwdBtn    = document.getElementById("togglePassword");
const strengthMeter   = document.getElementById("strengthMeter");
const strengthText    = document.getElementById("strengthText");

/* ---------- 2. Validation rules ----------
   Each rule returns "" when valid, or a specific error message.
   Messages are built from the data-* attributes in the HTML
   (read through element.dataset), so the wording lives in one place. */

function validateStudentId() {
  const value = studentIdInput.value.trim();
  const label = studentIdInput.dataset.label;            // dataset: "Student ID"
  if (value === "") return `${label} is required.`;
  if (!/^\d{4}-\d{4}$/.test(value)) {
    return `${label} must follow the format ${studentIdInput.dataset.format}.`;
  }
  return "";
}

function validateFullName() {
  // trim() removes outer spaces, replace() squeezes repeated inner spaces
  const value = fullNameInput.value.trim().replace(/\s+/g, " ");
  const label = fullNameInput.dataset.label;
  const minWords = Number(fullNameInput.dataset.minWords);
  if (value === "") return `${label} is required.`;
  if (!/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F .'-]*$/.test(value)) {
    return `${label} can only contain letters, spaces, apostrophes, dots and hyphens.`;
  }
  if (value.split(" ").length < minWords) {
    return `Enter your first and last name in the ${label.toLowerCase()} field.`;
  }
  return "";
}

function validateEmail() {
  const value = emailInput.value.trim();
  const label = emailInput.dataset.label;
  if (value === "") return `${label} is required.`;
  if (/\s/.test(value)) return `${label} must not contain spaces.`;
  // name@domain.tld
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value)) {
    return `Enter a valid ${label.toLowerCase()}, like name@school.edu.ph.`;
  }
  return "";
}

function validatePhone() {
  const value = phoneInput.value.trim();
  const label = phoneInput.dataset.label;
  if (value === "") return `${label} is required.`;
  if (!/^09\d{2}-\d{3}-\d{4}$/.test(value)) {
    return `${label} must follow the format ${phoneInput.dataset.format}.`;
  }
  return "";
}

function validateDob() {
  const value = dobInput.value;                           // "" or "YYYY-MM-DD"
  const label = dobInput.dataset.label;
  if (value === "") return `${label} is required.`;

  const dob = new Date(value + "T00:00:00");
  const today = new Date();
  if (dob > today) return `${label} cannot be in the future.`;

  // Work out age in whole years
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthday) age--;

  const minAge = Number(dobInput.dataset.minAge);
  if (age < minAge) return `You must be at least ${minAge} years old to register.`;
  return "";
}

function validateGender() {
  const chosen = form.querySelector('input[name="gender"]:checked');
  return chosen ? "" : "Select a gender.";
}

function validateProgram() {
  return programSelect.value === "" ? "Select a program." : "";
}

function validateYearLevel() {
  if (yearSelect.value === "") return "Select a year level.";
  // Defensive check: the chosen year must fit the program length
  const selectedProgram = programSelect.options[programSelect.selectedIndex];
  const maxYears = Number(selectedProgram.dataset.years || 0);
  if (maxYears && Number(yearSelect.value) > maxYears) {
    return `${selectedProgram.text.split(" (")[0]} only has ${maxYears} year levels.`;
  }
  return "";
}

function validatePassword() {
  const value = passwordInput.value;                      // passwords are never trimmed
  const label = passwordInput.dataset.label;
  const minLength = Number(passwordInput.dataset.minLength);
  if (value === "") return `${label} is required.`;
  if (value !== value.trim()) return `${label} must not start or end with a space.`;
  if (value.length < minLength) return `${label} must be at least ${minLength} characters long.`;
  if (!/[A-Z]/.test(value)) return `${label} needs at least one uppercase letter.`;
  if (!/[a-z]/.test(value)) return `${label} needs at least one lowercase letter.`;
  if (!/\d/.test(value))    return `${label} needs at least one number.`;
  return "";
}

function validateConfirmPassword() {
  const label = confirmInput.dataset.label;
  if (confirmInput.value === "") return `${label} is required.`;
  if (confirmInput.value !== passwordInput.value) return "Passwords do not match.";
  return "";
}

function validateAddress() {
  const value = addressInput.value.trim();
  const label = addressInput.dataset.label;
  const minLength = Number(addressInput.dataset.minLength);
  if (value === "") return `${label} is required.`;
  if (value.length < minLength) {
    return `${label} is too short. Enter at least ${minLength} characters (street, barangay, city).`;
  }
  return "";
}

function validateAgreement() {
  return agreementInput.checked ? "" : "You must agree to the terms before registering.";
}

/* Registry: ties each rule to the element that gets error styling,
   the element that receives focus, and the id of its message <p>.
   Order matches the order of the fields on the page. */
const fields = [
  { key: "studentId",       validate: validateStudentId,       target: studentIdInput, focus: studentIdInput },
  { key: "fullName",        validate: validateFullName,        target: fullNameInput,  focus: fullNameInput },
  { key: "dob",             validate: validateDob,             target: dobInput,       focus: dobInput },
  { key: "gender",          validate: validateGender,          target: genderGroup,    focus: genderGroup.querySelector("input") },
  { key: "email",           validate: validateEmail,           target: emailInput,     focus: emailInput },
  { key: "phone",           validate: validatePhone,           target: phoneInput,     focus: phoneInput },
  { key: "address",         validate: validateAddress,         target: addressInput,   focus: addressInput },
  { key: "program",         validate: validateProgram,         target: programSelect,  focus: programSelect },
  { key: "yearLevel",       validate: validateYearLevel,       target: yearSelect,     focus: yearSelect },
  { key: "password",        validate: validatePassword,        target: passwordInput,  focus: passwordInput },
  { key: "confirmPassword", validate: validateConfirmPassword, target: confirmInput,   focus: confirmInput },
  { key: "agreement",       validate: validateAgreement,       target: agreementGroup, focus: agreementInput }
];

/* ---------- 3. Show / clear errors ---------- */

function showError(field, message) {
  field.target.classList.add("error");                    // classList.add()
  field.target.classList.remove("valid");
  document.getElementById(field.key + "-error").textContent = message;
  field.target.setAttribute("aria-invalid", "true");
}

function clearError(field) {
  field.target.classList.remove("error");                 // classList.remove()
  document.getElementById(field.key + "-error").textContent = "";
  field.target.removeAttribute("aria-invalid");
}

/* Validate one field and update its UI. Returns true when valid. */
function checkField(field) {
  const message = field.validate();
  if (message) {
    showError(field, message);
    return false;
  }
  clearError(field);
  // Green outline only on single inputs that actually hold a value
  const isInput = field.target.tagName === "INPUT" || field.target.tagName === "TEXTAREA" || field.target.tagName === "SELECT";
  if (isInput) field.target.classList.add("valid");
  return true;
}

function findField(key) {
  return fields.find(function (f) { return f.key === key; });
}

/* ---------- 4. Live feedback ----------
   The event object tells us which control fired: event.target. */

// Formatters are registered first so validation always sees the formatted value
/* Phone: format as the user types (0917-123-4567) */
phoneInput.addEventListener("input", function (event) {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 11);
  const parts = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 11)].filter(Boolean);
  event.target.value = parts.join("-");
});

/* Student ID: auto-insert the dash after the 4-digit year */
studentIdInput.addEventListener("input", function (event) {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
  event.target.value = digits.length > 4 ? digits.slice(0, 4) + "-" + digits.slice(4) : digits;
});

// Shared handler for text inputs, selects, textarea
function handleFieldEvent(event) {
  const el = event.target;
  const field = fields.find(function (f) { return f.target === el; });
  if (!field) return;

  if (event.type === "blur" || event.type === "focusout") {
    // Tidy the value with trim() once the user leaves the field
    if (el.type === "text" || el.tagName === "TEXTAREA" || el.type === "email" || el.type === "tel") {
      el.value = el.value.trim().replace(/\s+/g, " ");
    }
    el.dataset.touched = "true";                          // remember the field was visited
    checkField(field);
    return;
  }

  // While typing: only re-check fields that were already visited or flagged,
  // so users are not shouted at before they finish typing.
  if (el.dataset.touched === "true" || el.classList.contains("error")) {
    checkField(field);
  }
}

[studentIdInput, fullNameInput, emailInput, phoneInput, dobInput, addressInput,
 programSelect, yearSelect, passwordInput, confirmInput].forEach(function (el) {
  el.addEventListener("input", handleFieldEvent);
  el.addEventListener("blur", handleFieldEvent);
});
// Selects and date pickers fire "change" more reliably than "input" in some browsers
[programSelect, yearSelect, dobInput].forEach(function (el) {
  el.addEventListener("change", handleFieldEvent);
});

// Radio buttons and the checkbox: validate as soon as they change
genderGroup.addEventListener("change", function (event) {
  checkField(findField("gender"));
});
agreementInput.addEventListener("change", function (event) {
  checkField(findField("agreement"));
});

/* Address: live character counter */
function updateAddressCounter() {
  const max = Number(addressInput.dataset.maxLength);
  addressCount.textContent = addressInput.value.length + " / " + max;
}
addressInput.addEventListener("input", updateAddressCounter);

/* Password: strength meter + keep confirm password in sync */
function getStrength(value) {
  if (value === "") return "empty";
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 12) score++;
  if (score <= 1) return "weak";
  if (score <= 3) return "fair";
  return "strong";
}

passwordInput.addEventListener("input", function (event) {
  const level = getStrength(event.target.value);
  strengthMeter.dataset.strength = level;                 // CSS reads [data-strength]
  strengthText.textContent = "Strength: " + (level === "empty" ? "not entered" : level);

  // If the user edits the password after typing a confirmation, re-check the match
  if (confirmInput.value !== "") checkField(findField("confirmPassword"));
});

/* ---------- 5. Interactive features ---------- */

/* Show / Hide password.
   - classList.toggle() flips the button's "is-active" style.
   - setAttribute("type") swaps password <-> text so the text becomes readable.
   Both password boxes are switched so the user can compare them. */
togglePwdBtn.addEventListener("click", function (event) {
  const nowVisible = togglePwdBtn.classList.toggle("is-active");   // classList.toggle()
  const newType = nowVisible ? "text" : "password";

  passwordInput.setAttribute("type", newType);                     // attribute manipulation
  confirmInput.setAttribute("type", newType);

  togglePwdBtn.textContent = nowVisible ? "Hide" : "Show";
  togglePwdBtn.setAttribute("aria-pressed", String(nowVisible));
});

/* Program -> Year level.
   Each <option> in the program list carries data-years (read with dataset).
   When a program is chosen, year levels beyond its length are disabled. */
programSelect.addEventListener("change", function (event) {
  syncYearLevels();
  // A previously chosen year may have just become unavailable
  if (yearSelect.dataset.touched === "true") checkField(findField("yearLevel"));
});

function syncYearLevels() {
  const selected = programSelect.options[programSelect.selectedIndex];
  const maxYears = Number(selected.dataset.years || 0);   // 0 when no program is chosen

  Array.from(yearSelect.options).forEach(function (option) {
    if (option.value === "") return;
    const unavailable = maxYears > 0 && Number(option.value) > maxYears;
    if (unavailable) {
      option.setAttribute("disabled", "disabled");        // attribute manipulation
    } else {
      option.removeAttribute("disabled");
    }
  });

  // If the current choice is no longer allowed, clear it
  const current = yearSelect.options[yearSelect.selectedIndex];
  if (current.disabled) yearSelect.value = "";

  yearHint.textContent = maxYears > 0
    ? selected.text.split(" (")[0] + " has " + maxYears + " year levels."
    : "Pick a program first. Year levels adjust to its length.";
}

/* Attributes set from JavaScript on page load */
function initAttributes() {
  // Date of birth cannot be in the future
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dobInput.setAttribute("max", `${yyyy}-${mm}-${dd}`);

  // Limit the address length using its data-max-length value
  addressInput.setAttribute("maxlength", addressInput.dataset.maxLength);

  updateAddressCounter();
  syncYearLevels();
}

/* ---------- 6. Submit handler ---------- */
form.addEventListener("submit", function (event) {
  // Stop the browser from sending / reloading the page
  event.preventDefault();

  // Hide any old success message while we re-check everything
  hideSuccess();

  let firstInvalid = null;
  fields.forEach(function (field) {
    const ok = checkField(field);
    if (!ok && firstInvalid === null) firstInvalid = field;
  });

  if (firstInvalid) {
    // Bring the user to the first problem
    firstInvalid.focus.focus();
    firstInvalid.target.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Everything is valid -> show success
  const name = fullNameInput.value.trim().replace(/\s+/g, " ");
  const id = studentIdInput.value.trim();
  const program = programSelect.options[programSelect.selectedIndex].text.split(" (")[0];
  showSuccess(name, id, program);
});

function showSuccess(name, id, program) {
  // Clear leftover validation styling after a fully valid submission
  fields.forEach(function (field) {
    clearError(field);
    field.target.classList.remove("valid");
  });

  document.getElementById("successTitle").textContent = "Registration successful!";
  successDetail.textContent =
    "Welcome, " + name + ". Student ID " + id + " is now registered under " + program + ".";
  successBox.hidden = false;
  successBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideSuccess() {
  successBox.hidden = true;
  successDetail.textContent = "";
}

/* ---------- 7. Reset handler ---------- */
form.addEventListener("reset", function (event) {
  // The "reset" event fires BEFORE the browser clears the values,
  // so UI cleanup that depends on empty values waits one tick.
  hideSuccess();

  fields.forEach(function (field) {
    clearError(field);
    field.target.classList.remove("valid");
    delete field.target.dataset.touched;                  // forget "visited" state
  });

  setTimeout(function () {
    // Back to a hidden password
    togglePwdBtn.classList.remove("is-active");
    togglePwdBtn.textContent = "Show";
    togglePwdBtn.setAttribute("aria-pressed", "false");
    passwordInput.setAttribute("type", "password");
    confirmInput.setAttribute("type", "password");

    // Strength meter, counter, year levels back to defaults
    strengthMeter.dataset.strength = "empty";
    strengthText.textContent = "Strength: not entered";
    updateAddressCounter();
    syncYearLevels();

    studentIdInput.focus();
  }, 0);
});

/* ---------- Start ---------- */
initAttributes();

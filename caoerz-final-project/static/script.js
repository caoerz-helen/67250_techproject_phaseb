const pricePerTicket = 18;

const tips = [
  "Tip: Check current exhibitions before you arrive so you can decide what to see first.",
  "Tip: Buying tickets online helps make your visit faster and easier.",
  "Tip: Use the confirmation page map to plan your route to the museum."
];

const slides = [
  {
    src: "../static/Digital Dreams Preview.png",
    alt: "Preview of the Digital Dreams exhibition",
    caption: "Digital Dreams explores generative art and digital systems."
  },
  {
    src: "../static/Code and Canvas Preview.png",
    alt: "Preview of the Code and Canvas exhibition",
    caption: "Code & Canvas highlights programming as a creative medium."
  },
  {
    src: "../static/Interactive Space Preview.png",
    alt: "Preview of an interactive MonoMuse installation",
    caption: "MonoMuse encourages immersive and interactive visitor experiences."
  }
];

let currentSlide = 0;

document.addEventListener("DOMContentLoaded", function () {
  addYear();
  setGreeting();
  activeNav();
  setupMenu();
  setupTips();
  setupFAQ();
  setupSlideshow();
  setupTicketForm();
  renderConfirmation();
  initMap();
});

function addYear() {
  const year = document.getElementById("copyYear");
  if (year) {
    year.textContent = `© ${new Date().getFullYear()} MonoMuse. All rights reserved.`;
  }
}

function setGreeting() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  const hour = new Date().getHours();

  if (hour < 12) {
    greeting.textContent = "Good morning, welcome to MonoMuse";
  } else if (hour < 18) {
    greeting.textContent = "Good afternoon, welcome to MonoMuse";
  } else {
    greeting.textContent = "Good evening, welcome to MonoMuse";
  }
}

function activeNav() {
  const navLinks = document.querySelectorAll(".nav_link");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("active");
    }
  });
}

function setupMenu() {
  const button = document.getElementById("menuButton");
  const nav = document.getElementById("topNav");

  if (button && nav) {
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }
}

function setupTips() {
  const button = document.getElementById("tipButton");
  const text = document.getElementById("tipText");

  if (button && text) {
    button.addEventListener("click", function () {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      text.textContent = randomTip;
    });
  }
}

function setupFAQ() {
  if (typeof $ !== "undefined") {
    $(".faq_question").click(function () {
      $(this).next(".faq_answer").slideToggle(200);
    });
  }
}

function setupSlideshow() {
  const image = document.getElementById("slideImage");
  const caption = document.getElementById("slideCaption");
  const prev = document.getElementById("prevSlide");
  const next = document.getElementById("nextSlide");

  if (!image || !caption || !prev || !next) return;

  showSlide(currentSlide);

  prev.addEventListener("click", function () {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });

  next.addEventListener("click", function () {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });
}

function showSlide(index) {
  const image = document.getElementById("slideImage");
  const caption = document.getElementById("slideCaption");
  if (!image || !caption) return;

  image.src = slides[index].src;
  image.alt = slides[index].alt;
  caption.textContent = slides[index].caption;
}

function setupTicketForm() {
  const form = document.getElementById("ticketForm");
  if (!form) return;

  const ticketType = document.getElementById("ticketType");
  const ticketQuantity = document.getElementById("ticketQuantity");
  const zipButton = document.getElementById("zipButton");

  if (ticketType) ticketType.addEventListener("change", updateSummary);
  if (ticketQuantity) ticketQuantity.addEventListener("input", updateSummary);
  if (zipButton) zipButton.addEventListener("click", lookupZip);

  updateSummary();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const visitDate = document.getElementById("visitDate").value.trim();
    const type = document.getElementById("ticketType").value.trim();
    const quantity = document.getElementById("ticketQuantity").value.trim();
    const email = document.getElementById("email").value.trim();
    const zip = document.getElementById("zipCode").value.trim();
    const mailingList = document.getElementById("mailingList").checked ? "Yes" : "No";

    let valid = true;

    if (!visitDate) {
      document.getElementById("dateError").textContent = "Please select a visit date.";
      valid = false;
    }

    if (!type) {
      document.getElementById("typeError").textContent = "Please select a ticket type.";
      valid = false;
    }

    if (!quantity) {
      document.getElementById("quantityError").textContent = "Please enter ticket quantity.";
      valid = false;
    } else if (isNaN(quantity) || Number(quantity) < 1 || Number(quantity) > 10 || !Number.isInteger(Number(quantity))) {
      document.getElementById("quantityError").textContent = "Quantity must be a whole number from 1 to 10.";
      valid = false;
    }

    if (!email) {
      document.getElementById("emailError").textContent = "Please enter your email.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email address.";
      valid = false;
    }

    if (zip && !/^\d{5}$/.test(zip)) {
      document.getElementById("zipError").textContent = "ZIP code must be 5 digits.";
      valid = false;
    }

    if (!valid) return;

    const total = Number(quantity) * pricePerTicket;

    const params = new URLSearchParams({
      date: visitDate,
      type: type,
      quantity: quantity,
      email: email,
      zip: zip || "Not provided",
      mailing: mailingList,
      total: total
    });

    window.location.href = `checkout.html?${params.toString()}`;
  });
}

function updateSummary() {
  const type = document.getElementById("ticketType");
  const quantity = document.getElementById("ticketQuantity");
  const summaryType = document.getElementById("summaryType");
  const summaryQuantity = document.getElementById("summaryQuantity");
  const summaryTotal = document.getElementById("summaryTotal");

  if (!type || !quantity || !summaryType || !summaryQuantity || !summaryTotal) return;

  const chosenType = type.value || "—";
  const chosenQuantity = Number(quantity.value) || 0;
  const total = chosenQuantity * pricePerTicket;

  summaryType.textContent = chosenType;
  summaryQuantity.textContent = chosenQuantity;
  summaryTotal.textContent = `$${total}`;
}

function clearErrors() {
  const errors = document.querySelectorAll(".error");
  errors.forEach(error => {
    error.textContent = "";
  });
}

async function lookupZip() {
  const zipInput = document.getElementById("zipCode");
  const zipMessage = document.getElementById("zipMessage");
  const zipResult = document.getElementById("zipResult");

  if (!zipInput || !zipMessage || !zipResult) return;

  const zip = zipInput.value.trim();
  zipMessage.textContent = "";
  zipResult.textContent = "";

  if (!zip) {
    zipMessage.textContent = "Enter a ZIP code first.";
    return;
  }

  if (!/^\d{5}$/.test(zip)) {
    zipMessage.textContent = "Please enter a valid 5-digit ZIP code.";
    return;
  }

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!response.ok) throw new Error("Not found");

    const data = await response.json();
    const city = data.places[0]["place name"];
    const state = data.places[0]["state abbreviation"];

    zipMessage.textContent = "ZIP code found.";
    zipResult.textContent = `${city}, ${state}`;
  } catch (error) {
    zipMessage.textContent = "We could not find that ZIP code.";
  }
}

function renderConfirmation() {
  const box = document.getElementById("confirmationBox");
  if (!box) return;

  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");
  const type = params.get("type");
  const quantity = params.get("quantity");
  const email = params.get("email");
  const zip = params.get("zip");
  const mailing = params.get("mailing");
  const total = params.get("total");

  if (!date || !type || !quantity || !email || !total) return;

  box.innerHTML = `
    <p><strong>Your order has been placed.</strong></p>
    <p><strong>Visit Date:</strong> ${date}</p>
    <p><strong>Ticket Type:</strong> ${type}</p>
    <p><strong>Quantity:</strong> ${quantity}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>ZIP Code:</strong> ${zip}</p>
    <p><strong>Mailing List:</strong> ${mailing}</p>
    <p><strong>Total Cost:</strong> $${total}</p>
    <p>This is a simulated checkout confirmation for the project.</p>
  `;
}

function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement || typeof L === "undefined") return;

  const map = L.map("map").setView([40.4442, -79.9436], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker([40.4442, -79.9436])
    .addTo(map)
    .bindPopup("MonoMuse<br>5030 Forbes Ave, Pittsburgh, PA 15213")
    .openPopup();
}
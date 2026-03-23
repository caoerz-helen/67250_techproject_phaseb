var x = 5;
var y = 7;
var z = x + y;
console.log(z);

var A = "Hello ";
var B = "world!";
var C = A + B;
console.log(C);

function sumnPrint(x1, x2) {
    var result = x1 + x2;
    console.log(result);
}

sumnPrint(x, y);
sumnPrint(A, B);

if (C.length > z) {
    console.log(C);
} else if (C.length < z) {
    console.log(z);
} else {
    console.log("good job!");
}

var now = new Date();
var hour = now.getHours();

function greeting(h) {
    var greetingElement = document.getElementById("greeting");

    if (greetingElement) {
        if (h < 5 || h >= 20) {
            greetingElement.innerHTML = "Good night, welcome to MonoMuse";
        } else if (h < 12) {
            greetingElement.innerHTML = "Good morning, welcome to MonoMuse";
        } else if (h < 18) {
            greetingElement.innerHTML = "Good afternoon, welcome to MonoMuse";
        } else {
            greetingElement.innerHTML = "Good evening, welcome to MonoMuse";
        }
    }
}

greeting(hour);

function addYear() {
    var yearElement = document.getElementById("copyYear");
    if (yearElement) {
        yearElement.innerHTML = "&copy; " + new Date().getFullYear() + " MonoMuse. All rights reserved.";
    }
}

function ActiveNav() {
    const navLinks = document.querySelectorAll(".nav_bar a.nav_link");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
            link.classList.add("active");
        }
    });
}

ActiveNav();

function toggleNav() {
    var nav = document.getElementById("topNav");
    if (nav) {
        nav.classList.toggle("responsive");
    }
}

function showPurchaseForm(date) {
    var formWrapper = document.getElementById("purchaseFormWrapper");
    var selectedDateInput = document.getElementById("selectedDate");

    if (formWrapper && selectedDateInput) {
        formWrapper.style.display = "block";
        selectedDateInput.value = date;
        formWrapper.scrollIntoView({ behavior: "smooth" });
    }
}

function goToCheckout() {
    window.location.href = "checkout.html";
}

function submitPurchase() {
    alert("Redirecting to payment system.");
}

async function lookupZip() {
    var zipInput = document.getElementById("zipCode");
    var cityResult = document.getElementById("cityResult");
    var stateResult = document.getElementById("stateResult");
    var zipMessage = document.getElementById("zipMessage");

    if (!zipInput || !cityResult || !stateResult || !zipMessage) {
        return;
    }

    var zip = zipInput.value.trim();

    cityResult.value = "";
    stateResult.value = "";
    zipMessage.textContent = "";

    if (!/^\d{5}$/.test(zip)) {
        zipMessage.textContent = "Please enter a valid 5-digit ZIP code.";
        return;
    }

    try {
        const response = await fetch("https://api.zippopotam.us/us/" + zip);

        if (!response.ok) {
            throw new Error("ZIP not found");
        }

        const data = await response.json();
        cityResult.value = data.places[0]["place name"];
        stateResult.value = data.places[0]["state abbreviation"];
        zipMessage.textContent = "ZIP code found successfully.";
    } catch (error) {
        zipMessage.textContent = "We could not find that ZIP code. Please try again.";
    }
}

function initLeafletMap() {
    var mapContainer = document.getElementById("map");

    if (mapContainer && typeof L !== "undefined") {
        var map = L.map("map").setView([40.444, -79.943], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.marker([40.444, -79.943]).addTo(map)
            .bindPopup("MonoMuse")
            .openPopup();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initLeafletMap();
});

if (typeof $ !== "undefined") {
    $(document).ready(function () {
        $("#longIntro").hide();
        $("#readLess").hide();

        $("#readMore").click(function () {
            $("#longIntro").show();
            $("#readLess").show();
            $("#readMore").hide();
        });

        $("#readLess").click(function () {
            $("#longIntro").hide();
            $("#readLess").hide();
            $("#readMore").show();
        });
    });
}
/* =========================================

   AL ENAYA SALON

   Main JavaScript

========================================= */

// =========================================

// Current Language

// =========================================

let currentLanguage = localStorage.getItem("alEnayaLanguage") || "ar";

// =========================================

// Elements

// =========================================

const languageBtn = document.getElementById("languageBtn");

const bookingForm = document.getElementById("bookingForm");

const confirmationSection = document.getElementById("confirmation");

const bookingDetails = document.getElementById("bookingDetails");

const newBookingBtn = document.getElementById("newBookingBtn");

const serviceSelect = document.getElementById("service");

const reviewForm = document.getElementById("reviewForm");

const reviewsList = document.getElementById("reviewsList");

// =========================================

// Language System

// =========================================

function setLanguage(language) {

    currentLanguage = language;

    localStorage.setItem("alEnayaLanguage", language);

    document.documentElement.lang = language;

    if (language === "ar") {

        document.documentElement.dir = "rtl";

        document.body.classList.remove("english");

        languageBtn.textContent = "English";

    } else {

        document.documentElement.dir = "ltr";

        document.body.classList.add("english");

        languageBtn.textContent = "العربية";

    }

    // Change every element containing data-ar / data-en

    document.querySelectorAll("[data-ar][data-en]").forEach(element => {

        const text = element.getAttribute(`data-${language}`);

        if (text) {

            element.textContent = text;

        }

    });

    // Update select options

    document.querySelectorAll("option[data-ar][data-en]").forEach(option => {

        const text = option.getAttribute(`data-${language}`);

        if (text) {

            option.textContent = text;

        }

    });

    // Update placeholders

    updatePlaceholders();

}

// =========================================

// Placeholders

// =========================================

function updatePlaceholders() {

    const placeholders = {

        ar: {

            name: "اكتبي اسمك",

            phone: "05xxxxxxxx",

            notes: "اكتبي أي ملاحظات تهمنا...",

            reviewName: "اسمك",

            reviewText: "اكتبي تعليقك..."

        },

        en: {

            name: "Enter your name",

            phone: "05xxxxxxxx",

            notes: "Write any additional notes...",

            reviewName: "Your name",

            reviewText: "Write your review..."

        }

    };

    document.getElementById("name").placeholder =

        placeholders[currentLanguage].name;

    document.getElementById("phone").placeholder =

        placeholders[currentLanguage].phone;

    document.getElementById("notes").placeholder =

        placeholders[currentLanguage].notes;

    document.getElementById("reviewName").placeholder =

        placeholders[currentLanguage].reviewName;

    document.getElementById("reviewText").placeholder =

        placeholders[currentLanguage].reviewText;

}

// =========================================

// Language Button

// =========================================

languageBtn.addEventListener("click", () => {

    if (currentLanguage === "ar") {

        setLanguage("en");

    } else {

        setLanguage("ar");

    }

});

// =========================================

// Service Buttons

// =========================================

document.querySelectorAll(".choose-service").forEach(button => {

    button.addEventListener("click", () => {

        const service = currentLanguage === "ar"

            ? button.dataset.serviceAr

            : button.dataset.serviceEn;

        const options = [...serviceSelect.options];

        const matchingOption = options.find(option => {

            return option.dataset.ar === button.dataset.serviceAr ||option.dataset.en === button.dataset.serviceEn;

        });

        if (matchingOption) {

            serviceSelect.value = matchingOption.value;

        }

        document.getElementById("booking").scrollIntoView({

            behavior: "smooth"

        });

    });

});

// =========================================

// Booking Form

// =========================================

bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const service = document.getElementById("service");

    const specialist = document.getElementById("specialist");

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const notes = document.getElementById("notes").value.trim();

    const selectedService =

        service.options[service.selectedIndex];

    const selectedSpecialist =

        specialist.options[specialist.selectedIndex];

    // Generate booking number

    const bookingNumber =

        "EN-" + Math.floor(100000 + Math.random() * 900000);

    // Format date

    const formattedDate = new Date(date).toLocaleDateString(

        currentLanguage === "ar" ? "ar-SA" : "en-US",

        {

            year: "numeric",

            month: "long",

            day: "numeric"

        }

    );

    const labels = currentLanguage === "ar"

        ? {

            name: "الاسم",

            phone: "رقم الجوال",

            service: "الخدمة",

            specialist: "المختصة",

            date: "التاريخ",

            time: "الوقت",

            notes: "الملاحظات",

            booking: "رقم الحجز"

        }

        : {

            name: "Name",

            phone: "Phone",

            service: "Service",

            specialist: "Specialist",

            date: "Date",

            time: "Time",

            notes: "Notes",

            booking: "Booking Number"

        };

    bookingDetails.innerHTML = `

        <div>

            <strong>${labels.booking}</strong>

            <span>${bookingNumber}</span>

        </div>

        <div>

            <strong>${labels.name}</strong>

            <span>${escapeHTML(name)}</span>

        </div>

        <div>

            <strong>${labels.phone}</strong>

            <span>${escapeHTML(phone)}</span>

        </div>

        <div>

            <strong>${labels.service}</strong>

            <span>

                ${currentLanguage === "ar"

                    ? selectedService.dataset.ar

                    : selectedService.dataset.en}

            </span>

        </div>

        <div>

            <strong>${labels.specialist}</strong>

            <span>

                ${currentLanguage === "ar"

                    ? selectedSpecialist.dataset?.ar || selectedSpecialist.textContent

                    : selectedSpecialist.dataset?.en || selectedSpecialist.textContent}

            </span>

        </div>

        <div>

            <strong>${labels.date}</strong>

            <span>${formattedDate}</span>

        </div>

        <div>

            <strong>${labels.time}</strong>

            <span>${escapeHTML(time)}</span>

        </div>

        ${

            notes

            ? `

                <div>

                    <strong>${labels.notes}</strong>

                    <span>${escapeHTML(notes)}</span>

                </div>

              `

            : ""

        }

    `;

    confirmationSection.classList.remove("hidden");

    bookingForm.closest(".booking-section").style.display = "none";

    confirmationSection.scrollIntoView({

        behavior: "smooth"

    });

});

// =========================================

// New Booking

// =========================================

newBookingBtn.addEventListener("click", () => {

    bookingForm.reset();

    confirmationSection.classList.add("hidden");

    bookingForm.closest(".booking-section").style.display = "block";

    document.getElementById("booking").scrollIntoView({

        behavior: "smooth"

    });

});

// =========================================

// Reviews

// =========================================

function loadReviews() {

    const savedReviews =

        JSON.parse(localStorage.getItem("alEnayaReviews") || "[]");

    savedReviews.forEach(review => {

        addReviewToPage(review);

    });

}

function addReviewToPage(review) {

    const reviewCard = document.createElement("article");

    reviewCard.className = "review-card";

    reviewCard.innerHTML = `

        <div class="stars">

            ${"★".repeat(review.rating)}

            ${"☆".repeat(5 - review.rating)}

        </div>

        <p>

            ${

                currentLanguage === "ar"

                    ? escapeHTML(review.textAr)

                    : escapeHTML(review.textEn || review.textAr)

            }

        </p>

        <strong>

            ${escapeHTML(review.name)}

        </strong>

    `;

    reviewsList.appendChild(reviewCard);

}

// =========================================

// Review Form

// =========================================

reviewForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =

        document.getElementById("reviewName").value.trim();

    const rating =

        Number(document.getElementById("reviewRating").value);

    const text =

        document.getElementById("reviewText").value.trim();

    if (!name || !rating || !text) {

        return;

    }

    const review = {

        name: name,

        rating: rating,

        textAr:

            currentLanguage === "ar"

                ? text

                : text,

        textEn:

            currentLanguage === "en"

                ? text

                : text

    };

    const reviews =

        JSON.parse(localStorage.getItem("alEnayaReviews") || "[]");

    reviews.push(review);

    localStorage.setItem(

        "alEnayaReviews",

        JSON.stringify(reviews)

    );

    addReviewToPage(review);

    reviewForm.reset();

    alert(

        currentLanguage === "ar"

            ? "تم إرسال تقييمك بنجاح ✨"

            : "Your review has been submitted ✨"

    );

});

// =========================================

// Security Helper

// =========================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}

// =========================================

// Prevent Past Dates

// =========================================

const dateInput = document.getElementById("date");

const today = new Date();

const yyyy = today.getFullYear();

const mm = String(today.getMonth() + 1).padStart(2, "0");

const dd = String(today.getDate()).padStart(2, "0");

dateInput.min =
  languageBtn.textConte

// =========================================

// Start Website

// =========================================

setLanguage(currentLanguage);

loadReviews();
document.addEventListener("DOMContentLoaded", () => {

let slideIndex = 0;

const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dots span");

const totalSlides = slides.length;

/* =====================
   SLIDER LOGIC
===================== */

function showSlide(index) {

  if (index >= totalSlides) slideIndex = 0;
  if (index < 0) slideIndex = totalSlides - 1;

  slidesContainer.style.transform =
    `translateX(-${slideIndex * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[slideIndex].classList.add("active");
}

function moveSlide(n) {
  slideIndex += n;
  showSlide(slideIndex);
}

function currentSlide(n) {
  slideIndex = n;
  showSlide(slideIndex);
}

setInterval(() => {
  slideIndex++;
  showSlide(slideIndex);
}, 4000);

showSlide(slideIndex);

window.moveSlide = moveSlide;
window.currentSlide = currentSlide;


/* =====================
   CART COUNT LOGIC
===================== */

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.innerText = cart.length;
  }
}

updateCartCount();

});

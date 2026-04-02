let slideIndex = 0;

const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dots span");

const totalSlides = slides.length;

function showSlide(index){

if(index >= totalSlides) slideIndex = 0;
if(index < 0) slideIndex = totalSlides-1;

if(slidesContainer){
slidesContainer.style.transform = `translateX(-${slideIndex*100}%)`;
}

dots.forEach(dot => dot.classList.remove("active"));

if(dots[slideIndex]){
dots[slideIndex].classList.add("active");
}

}

function moveSlide(n){
slideIndex += n;
showSlide(slideIndex);
}

function currentSlide(n){
slideIndex = n;
showSlide(slideIndex);
}

setInterval(()=>{
slideIndex++;
showSlide(slideIndex);
},4000);

showSlide(slideIndex);

function openCart(){
window.location.href="cart.html";
}

function updateCartCount(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let cartCount = document.getElementById("cartCount");

if(cartCount){
cartCount.innerText = cart.length;
}

}

window.addEventListener("DOMContentLoaded",updateCartCount);

function searchFood(){

let input = document.getElementById("searchBar").value.toLowerCase();
let items = document.querySelectorAll(".menu-item");

items.forEach(item=>{

let food = item.querySelector("h3").innerText.toLowerCase();

if(food.includes(input)){
item.style.display="block";
}
else{
item.style.display="none";
}

});

}

function logout(){
  localStorage.clear();
  window.location.href = "/login";
}

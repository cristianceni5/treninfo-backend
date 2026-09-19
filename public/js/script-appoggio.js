// =======================
// Cristian Ceni 19/09/26
// Script per carosello e altra roba nella pagina
// =======================

// Array per le foto del carosello
const photoCarosello = [
  {
    src: "img/car1.png",
    comment: "ETR 500 versione originale e in servizio Frecciarossa.",
  },
  {
    src: "img/car2.png",
    comment: "Un po' di storia.",
  }
];

// Funzione per il carosello, mi garba poco (lascia fare)
// TODO: Migliorare il carosello, magari con un framework tipo Swiper.js o non farlo laggare 
function displayCarousel() {
  const home = document.getElementById("home");
  const carousel = document.createElement("div");
  carousel.classList.add("carousel");

  photoCarosello.forEach((photo, i) => {
    const slide = document.createElement("div");
    slide.classList.add("carousel-slide");
    if (i === 0) slide.classList.add("active");
    slide.style.backgroundImage = `url('${photo.src}')`;
    if (photo.comment) {
      const label = document.createElement("span");
      label.classList.add("carousel-label");
      label.textContent = photo.comment;
      slide.appendChild(label);
    }
    carousel.appendChild(slide);
  });

  const dotsWrap = document.createElement("div");
  dotsWrap.classList.add("carousel-dots");
  photoCarosello.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  carousel.appendChild(dotsWrap);
  home.appendChild(carousel);

  let current = 0;
  function goToSlide(n) {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".dot");
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = n;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  setInterval(() => {
    goToSlide((current + 1) % photoCarosello.length);
  }, 8000);
}

// Function called when to page is shown, i take it like the void Start() of Unity, yeah don't judge me.
// Non so perchè scrivo i commenti mezzi in italiano e mezzi in inglese, ma vabbè, non è importante
onpageshow = () => {
  displayCarousel();
  displayJobs();
  displayProjects();
};

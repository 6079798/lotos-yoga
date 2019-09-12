import "core-js/modules/es.object.assign";
import "core-js/modules/es.array.from";
import "core-js/modules/es.string.pad-start";
import "core-js/modules/es.string.ends-with";
import "core-js/stable/dom-collections/for-each";

import objectFitImages from "object-fit-images";
import SmoothScroll from "smooth-scroll";

import "./sliders";
import "./forms";
import { initScroll } from "./scroll";

objectFitImages(".trainers__images img");

SmoothScroll(".nav__links a, [data-paginate]", {
  updateURL: false,
  speedAsDuration: true
});

initScroll();

const openNavBtn = document.querySelector("[data-nav-open]");
const navContainer = document.querySelector(".nav");
const closeNavBtn = navContainer.querySelector("[data-nav-close]");

const toggleNav = () => {
  //document.body.classList.toggle("page--no-scroll");
  openNavBtn.classList.toggle("nav-btn--is-hidden");
  navContainer.classList.toggle("nav--shown");
};

[openNavBtn, closeNavBtn].forEach(el =>
  el.addEventListener("click", toggleNav)
);
document.addEventListener("scrollStart", ({ detail: { toggle } }) => {
  if (toggle.hasAttribute("data-paginate")) return;
  toggleNav();
});

const expandButtons = document.querySelectorAll("[data-expand-toggler]");

expandButtons.forEach(button => {
  const container = button.closest(".reviewer").querySelector("[data-expand]");
  button.addEventListener("click", function(event) {
    event.preventDefault();
    if (!container) return;
    if (container.style.height) {
      container.style.height = "";
      this.textContent = "Читать полностью";
    } else {
      container.style.height = `${container.scrollHeight}px`;
      this.textContent = "Свернуть";
    }
  });
});

const subscriptions = document.querySelectorAll(
  ".subscription__items > .subscription__item"
);
subscriptions.forEach(el =>
  el.addEventListener("click", function() {
    subscriptions.forEach(el => {
      if (el !== this) el.classList.remove("subscription__item--active");
    });
    this.classList.toggle("subscription__item--active");
  })
);

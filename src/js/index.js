import "core-js/es/object/assign";
import "core-js/stable/dom-collections/for-each";
import "core-js/es/string/pad-start";
import "core-js/es/string/ends-with";
import "core-js/es/array/from";

import objectFitImages from "object-fit-images";
import SmoothScroll from "smooth-scroll";

import "./sliders";
import "./forms";
import { initScroll } from "./scroll";

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

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

const subscriptions = document.querySelectorAll(".subscription__item");

subscriptions.forEach(el =>
  el.addEventListener("click", function() {
    subscriptions.forEach(el => {
      if (el !== this) el.classList.remove("subscription__item--active");
    });
    this.classList.toggle("subscription__item--active");
  })
);

document.addEventListener("scrollStart", ({ detail: { toggle } }) => {
  if (toggle.matches("[data-paginate]")) return;
  toggleNav();
});

document.addEventListener("click", event => {
  if (event.target.matches("[data-expand-toggler]")) {
    event.preventDefault();
    const container = event.target
      .closest(".reviewer")
      .querySelector("[data-expand]");
    if (!container) return;
    if (container.style.height) {
      container.style.height = "";
      event.target.textContent = "Читать полностью";
    } else {
      container.style.height = `${container.scrollHeight}px`;
      event.target.textContent = "Свернуть";
    }
  }
});

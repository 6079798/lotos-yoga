import { tns } from "tiny-slider/src/tiny-slider";

const config = {
  controls: true,
  nav: false,
  loop: false,
  rewind: true,
  items: 1,
  preventScrollOnTouch: "auto",
  slideBy: "page",
  responsive: {
    768: {
      controls: false,
      nav: true
    }
  }
};

const classesSlider = tns(
  Object.assign(config, {
    container: ".classes__list",
    controlsContainer: ".classes__controls > .classes__btns",
    navContainer: ".classes__controls > .slider-nav"
  })
);

const trainersSlider = tns(
  Object.assign(config, {
    container: ".trainers__list",
    controlsContainer: ".trainers__controls > .trainers__btns",
    navContainer: ".trainers__controls > .slider-nav"
  })
);

trainersSlider.events.on("indexChanged", ({ index, navContainer }) => {
  const activeItem = navContainer.querySelector(".tns-nav-active");
  const label = navContainer.parentElement.querySelector(".slider-nav__label");
  trainersImageSlider.goTo(index);
  moveLabel(activeItem, label);
});

const trainersImageSlider = tns({
  container: ".trainers__images",
  controls: false,
  nav: false,
  touch: false,
  mouseDrag: false,
  loop: false,
  mode: "gallery"
});

const reviewersSlider = tns(
  Object.assign(config, {
    container: ".reviews__list",
    controlsContainer: ".reviews__controls > .reviews__btns",
    navContainer: ".reviews__controls > .slider-nav"
  })
);

const drawLabel = sliderNavContainer => {
  const label = document.createElement("span");
  label.classList.add("slider-nav__label");
  label.textContent = sliderNavContainer.dataset.label;
  sliderNavContainer.parentElement.insertBefore(label, sliderNavContainer);
  label.style.left = `-${label.clientWidth}px`;
  return label;
};

const moveLabel = (sliderNavContainer, label) => {
  const targetCoords = sliderNavContainer.getBoundingClientRect();
  const coords = {
    top:
      targetCoords.top -
      sliderNavContainer.parentElement.getBoundingClientRect().top
  };
  label.style.transform = `translateY(${coords.top}px)`;
};

[classesSlider, trainersSlider, reviewersSlider]
  .map(slider => slider.getInfo().navContainer)
  .forEach(slider => {
    const label = drawLabel(slider);
    slider.addEventListener("mouseover", ({ target }) => {
      if (target.tagName === "LI") {
        moveLabel(target, label);
      }
    });
    slider.addEventListener("mouseleave", () => {
      const activeItem = slider.querySelector(".tns-nav-active");
      moveLabel(activeItem, label);
    });
  });

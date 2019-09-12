import { debounce } from "./helpers";

const sections = document.querySelectorAll("section.section");
const currentPageNum = document.querySelector("[data-current]");
const totalPages = document.querySelector("[data-total]");
const paginateBtn = document.querySelector("[data-paginate]");
const footerTitle = document.querySelector("[data-footer-title]");
const headerTitle = document.querySelector("[data-header-title]");
const navContainer = document.querySelector(".nav__links");
const navLinks = navContainer.querySelectorAll(".nav__link a");

const paginate = () => {
  sections.forEach((section, idx) => {
    const isSectionOnScreen =
      window.pageYOffset >= section.offsetTop - window.innerHeight / 2;
    if (isSectionOnScreen) {
      const currentNavItem = navContainer.querySelector(
        `a[href='#${section.id}']`
      );
      if (currentNavItem) {
        navLinks.forEach(link => link.classList.remove("nav__active"));
        currentNavItem.classList.add("nav__active");
      }
      const nextSection = sections[idx + 1];
      headerTitle.textContent = section.dataset.pageTitle;
      if (nextSection) {
        paginateBtn.setAttribute("href", `#${nextSection.id}`);
        footerTitle.textContent = nextSection.dataset.pageTitle;
        if (paginateBtn.classList.contains("arrow-btn--up"))
          paginateBtn.classList.remove("arrow-btn--up");
      } else {
        paginateBtn.setAttribute("href", "#");
        paginateBtn.classList.add("arrow-btn--up");
        footerTitle.textContent = "Наверх";
      }
      currentPageNum.textContent = section.dataset.page.padStart(2, "0");
    }
  });
};

export const initScroll = () => {
  sections.forEach((section, idx) => (section.dataset.page = idx + 1));
  totalPages.textContent = `- ${sections.length.toString().padStart(2, "0")}`;
  paginate();
};

window.addEventListener("scroll", debounce(paginate), false);

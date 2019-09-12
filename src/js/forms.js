import MicroModal from "micromodal";
import Pristine from "pristinejs/dist/pristine.min.js";

const forms = document.forms;
const inputs = document.querySelectorAll(".form__input");

Pristine.addValidator(
  "phone",
  value => /^((\+7|7|8)+([0-9]){10})$/g.test(value.trim()),
  "Некорректный номер",
  2,
  false
);

Pristine.addValidator(
  "name",
  value =>
    /^[a-zA-Zа-яА-Я]+(([',. -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/gi.test(
      value.trim()
    ),
  "Некорректное имя",
  2,
  false
);

const pristineConfig = {
  classTo: "form__group",
  errorTextParent: "form__group",
  errorClass: "form__group---danger",
  successClass: "form__group--success",
  errorTextTag: "span",
  errorTextClass: "form__error"
};

let pristine;

const populateTrainers = trainers =>
  trainers.map(item => ({
    title: item.innerText.trim(),
    active: item.classList.contains("tns-nav-active")
  }));
const populateClasses = classes =>
  classes.map(item => ({
    title: item.innerText.trim(),
    active: item.classList.contains("tns-nav-active")
  }));
const populateSubscriptions = subscriptions =>
  subscriptions.map(item => ({
    title: item.innerText.trim().replace(/\s+/g, " "),
    active: item.classList.contains("subscription__item--active")
  }));

const formSelectData = {
  classes: () =>
    populateClasses(
      Array.from(
        document.querySelectorAll(".classes__controls .slider-nav__item")
      )
    ),
  trainers: () =>
    populateTrainers(
      Array.from(
        document.querySelectorAll(".trainers__controls .slider-nav__item")
      )
    ),
  subscriptions: () =>
    populateSubscriptions(
      Array.from(document.querySelectorAll(".subscription__item"))
    )
};

const formInitialData = {
  title: document.querySelector(".modal__title").innerText.trim(),
  label: document
    .querySelector(".modal__form button[type=submit]")
    .innerText.trim()
};

const renderSelect = (form, choices) => {
  const select = document.createElement("div");
  select.classList.add("form__group");
  select.innerHTML = `<select name="choice" class="form__select">
${choices
  .map(
    ({ title, active }) =>
      `<option value="${title}" ${active ? "selected" : ""}>${title}</option>`
  )
  .join("")}
</select>`;
  form.insertBefore(select, form.querySelector(".form__group"));
};

const renderForm = (modal, label, title, select) => {
  if (!modal) return;
  if (!modal.querySelector("form")) return;
  modal.querySelector("button[type=submit]").innerText =
    label !== "" ? label : formInitialData.label;
  modal.querySelector(".modal__title").innerText = title
    ? title
    : formInitialData.title;
  if (formSelectData[select] !== undefined) {
    const form = modal.querySelector("form");
    const choices = formSelectData[select]();
    renderSelect(form, choices);
  }
};

const resetForm = modal => {
  if (!modal) return;
  if (!modal.querySelector("form")) return;
  const select = modal.querySelector(".form__select");
  if (select) select.parentNode.removeChild(select);
  if (pristine && pristine instanceof Pristine) {
    pristine.reset();
    pristine.destroy();
  }
};

const renderSuccess = (
  form,
  title = "Спасибо!",
  message = "Мы свяжемся с вами в течение 15 минут..."
) => {
  const isModalForm = form.classList.contains("modal__form");
  const successMessage = `<div class="success-message">
<h2 class="success-message__title">${title}</h2>
<p class="section-text">${message}</p>
</div>`;

  if (isModalForm) {
    form.closest("div").innerHTML = successMessage;
  } else {
    const forms = document.querySelectorAll(".request__form");
    forms.forEach(form => (form.closest("div").innerHTML = successMessage));
  }
};

const doSubmit = event => {
  event.preventDefault();
  const { target: form } = event;
  pristine = new Pristine(form, pristineConfig);
  const valid = pristine.validate();
  if (valid) {
    const data = new FormData(form);
    const req = new XMLHttpRequest();
    const url = "https://echo.htmlacademy.ru";
    req.open("POST", url, true);
    req.send(data);
    req.onreadystatechange = function() {
      if (req.readyState !== 4) return;
      if (req.status !== 200) {
        alert("Ошибка отправки данных!");
      } else {
        console.log(req.responseText);
        renderSuccess(form);
      }
    };
  }
};

forms.forEach(form => form.addEventListener("submit", doSubmit));

inputs.forEach(input => {
  const label = input.parentElement.querySelector("label");
  input.addEventListener("focus", function() {
    if (label) label.classList.add("form__label--active");
  });
});

inputs.forEach(input => {
  const label = input.parentElement.querySelector("label");
  input.addEventListener("blur", function() {
    if (label && !this.value.trim())
      label.classList.remove("form__label--active");
  });
});

const modalButtons = document.querySelectorAll("[data-modal]");
modalButtons.forEach(button =>
  button.addEventListener("click", function() {
    MicroModal.show("modal", {
      disableScroll: true,
      onShow: modal =>
        renderForm(
          modal,
          this.innerText,
          this.dataset.modalTitle,
          this.dataset.select
        ),
      onClose: modal => resetForm(modal)
    });
  })
);

import MicroModal from "micromodal";
import Pristine from "pristinejs/dist/pristine.min.js";

const initialModalData = {
  form: document.querySelector(".modal__form").innerHTML,
  title: document.querySelector(".modal .modal__title").innerText
};

let validator;

const validatorConfig = {
  classTo: "form__group",
  errorTextParent: "form__group",
  errorClass: "form__group---danger",
  successClass: "form__group--success",
  errorTextTag: "span",
  errorTextClass: "form__error"
};

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

const renderSelect = (form, choices) => {
  const select = document.createElement("div");
  select.classList.add("form__group");
  select.innerHTML = `<select name="choice" class="form__select">
      ${choices
        .map(
          ({ title, active }) =>
            `<option value="${title}" ${
              active ? "selected" : ""
            }>${title}</option>`
        )
        .join("")}
</select>`;
  form.insertBefore(select, form.querySelector(".form__group"));
};

const renderForm = (modal, label, title, select) => {
  if (!modal) return;
  const form = modal.querySelector("form");
  if (!form) return;
  if (label) modal.querySelector("button[type=submit]").innerText = label;
  modal.querySelector(".modal__title").innerText =
    title || initialModalData.title;
  if (formSelectData[select] !== undefined) {
    const choices = formSelectData[select]();
    renderSelect(form, choices);
  }
};

const resetForm = modal => {
  if (!modal) return;
  const form = modal.querySelector("form");
  if (!form) return;
  form.innerHTML = initialModalData.form;
  if (validator && validator instanceof Pristine) {
    validator.reset();
    validator.destroy();
  }
};

const renderSuccess = (
  form,
  title = "Спасибо!",
  message = "Мы свяжемся с вами в течение 15 минут..."
) => {
  const isModalForm = form.matches(".modal__form");
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
  validator = new Pristine(form, validatorConfig);
  const valid = validator.validate();
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

document.addEventListener("click", ({ target }) => {
  if (!target.matches("[data-modal]")) return;
  MicroModal.show("modal", {
    disableScroll: true,
    onShow: modal =>
      renderForm(
        modal,
        target.innerText,
        target.dataset.modalTitle,
        target.dataset.select
      ),
    onClose: modal => resetForm(modal)
  });
});

document.addEventListener(
  "focus",
  ({ target }) => {
    if (!target.matches(".form__input")) return;
    const label = target.parentElement.querySelector("label");
    if (label) label.classList.add("form__label--active");
  },
  true
);

document.addEventListener(
  "blur",
  ({ target }) => {
    if (!target.matches(".form__input")) return;
    const label = target.parentElement.querySelector("label");
    if (label && !target.value.trim())
      label.classList.remove("form__label--active");
  },
  true
);

document.addEventListener("submit", doSubmit);

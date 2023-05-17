import { getCountry } from "./useAPI.js";

const main = document.querySelector(".main");
const title = document.querySelector(".header__title");
const headerInput = document.querySelector(".header__input");
const headerMode = document.querySelector(".header__mode");
const searchBtn = document.querySelector(".header__btn");
const layout = document.querySelector(".coutries");
const filter = document.querySelector(".header__filter");
const filterFlag = document.querySelector(".header__filterFlag");
const target = document.querySelector(".header__target");

// перший старт - регіон - Європа
let currentMethod;
document.addEventListener("DOMContentLoaded", async () => {
  const subLink = document.querySelectorAll(".header__list-item");
  const res = await getCountry(); // працюють дефолтні значення в useAPI
  onRequest(res.data);
  target.innerHTML = `${res.data[0].region} (${res.data.length})`;
  // розкидуєм eventListener на елементи меню, змінюєм фільтр і плейсхолдер
  for (let i = 0; i < subLink.length; i++) {
    subLink[i].addEventListener("click", (event) => {
      event.preventDefault();
      currentMethod = subLink[i].textContent;
      filterFlag.innerHTML = `Filter by ${currentMethod}`;
      headerInput.placeholder = `Search for a ${currentMethod}`;
    });
  }
});

// Пошук
searchBtn.addEventListener("click", async () => {
  const res = await getCountry(currentMethod, headerInput.value);
  onRequest(res.data);
  target.innerHTML = `${headerInput.value} (${res.data.length})`;
  headerInput.value = "";
});

// onRequest - генерим верстку
function onRequest(data) {
  console.log("onRequest reports:");
  console.log(data);
  layout.innerHTML = "";

  for (let key in data) {
    let countryName = data[key].name.common;
    let countryFlag = data[key].flags.png;
    let countryPopul = data[key].population;
    let countryCapital = data[key].capital;
    let countryRegion = data[key].region;

    layout.innerHTML += `
    <div class="coutries__country">
      <img
        class="coutries__flag"
        src="${countryFlag}"
        alt="flag-${countryName}"
      />
      <div class="coutries__wrap">
        <p class="coutries__name">${countryName}</p>
        <p class="coutries__capital">Capital: ${countryCapital}</p>
        <p class="coutries__region">Region: ${countryRegion}</p>
        <p class="coutries__population">Population: ${countryPopul}</p>
      </div>
    </div>
    `;
  }
}

// Фільтр - ховер
filter.addEventListener("mouseenter", () => {
  const sublist = document.querySelector(".header__list");
  sublist.classList.add("header__list--active");
});
filter.addEventListener("mouseleave", () => {
  const sublist = document.querySelector(".header__list");
  sublist.classList.remove("header__list--active");
});
// Фільтр - клік (+ для мобілок)
filter.addEventListener("click", () => {
  const sublist = document.querySelector(".header__list");
  sublist.classList.toggle("header__list--active");
});

// тоглим тему
headerMode.addEventListener("click", () => {
  const main = document.querySelector(".main");
  const imgDark = document.querySelector(".header__img--dark");
  const imgLight = document.querySelector(".header__img--light");
  const themeFlag = document.querySelector(".header__mode-flag");

  // тоглим тему - красим box-shadow кольором теми 1/3
  const countryBox = document.querySelectorAll(".coutries__country");
  const searchBtn = document.querySelector(".header__btn");
  const color = window
    .getComputedStyle(searchBtn)
    .getPropertyValue("background-color");
  for (let i = 0; i < countryBox.length; i++) {
    countryBox[i].style.boxShadow = "3px 3px 7px " + "black";
  } // тоглим тему - красим box-shadow 2/3

  if (main.classList.contains("main--dark")) {
    main.classList.add("main--light");
    main.classList.remove("main--dark");
    imgDark.style.display = "block";
    imgLight.style.display = "none";
    themeFlag.innerHTML = "Dark mode";
  } else {
    main.classList.add("main--dark");
    main.classList.remove("main--light");
    imgDark.style.display = "none";
    imgLight.style.display = "block";
    themeFlag.innerHTML = "Light mode";

    for (let i = 0; i < countryBox.length; i++) {
      countryBox[i].style.boxShadow = "3px 3px 7px " + color;
    } // тоглим тему - красим box-shadow 3/3
  }
});

// помилка в інпуті
export function onError() {
  headerInput.value = "ERROR";
  headerInput.style.fontWeight = "bold";
  headerInput.style.backgroundColor = "red";
  setTimeout(() => {
    headerInput.style.removeProperty("background-color");
    headerInput.value = "";
  }, 1000);
}

// інпут реагує на клавішу ENTER
headerInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBtn.click();
  }
});

// фокус на текстовий інпут при кліках по сторінці
main.addEventListener("click", () => {
  headerInput.focus();
});

// клік на тайтл "Where in the world" - перезапуск сторінки
title.addEventListener("click", () => {
  window.location.reload();
});

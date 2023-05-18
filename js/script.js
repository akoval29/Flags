import { getCountry } from "./useAPI.js";

const main = document.querySelector(".main");
const title = document.querySelector(".header__title");
const headerInput = document.querySelector(".header__input");
const headerMode = document.querySelector(".header__mode");
const searchBtn = document.querySelector(".header__btn");
const layout = document.querySelector(".coutries");

const filter = document.querySelector(".header__filter");

const listItem = document.querySelectorAll(".header__list-item");
const listItemTitle = document.querySelectorAll(".header__subList-item");

const subList = document.querySelectorAll(".header__subList-item");

const filterFlag = document.querySelector(".header__filterFlag");
const target = document.querySelector(".header__target");

// отримуєм дані
// let currentMethod;
document.addEventListener("DOMContentLoaded", async () => {
  const res = await getCountry();
  onRequest(res.data);
  target.innerHTML = `All counries (${res.data.length})`;

  // розкидуєм eventListener на елементи меню, змінюєм фільтр
  for (let i = 0; i < listItemTitle.length; i++) {
    listItemTitle[i].addEventListener("click", (event) => {
      event.preventDefault();
      filterFlag.innerHTML = `Filter by ${listItemTitle[i].textContent}`;
    });
  }
});

// Пошук
// searchBtn.addEventListener("click", async () => {
//   const res = await getCountry(currentMethod, headerInput.value);
//   onRequest(res.data);
//   target.innerHTML = `${headerInput.value} (${res.data.length})`;
//   headerInput.value = "";
// });

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

// // меню - перший рівень - ховер
// filter.addEventListener("mouseenter", () => {
//   const list = document.querySelector(".header__list");
//   list.classList.add("header__list--active");
// });
// filter.addEventListener("mouseleave", () => {
//   const list = document.querySelector(".header__list");
//   list.classList.remove("header__list--active");
// });
// // Фільтр - клік
// filter.addEventListener("click", () => {
//   const list = document.querySelector(".header__list");
//   list.classList.toggle("header__list--active");
// });

// // меню - другий рівень - ховер
// listItem.addEventListener("mouseenter", () => {
//   console.log(subList);
//   subList.classList.add("header__subList--active");
// });
// listItem.addEventListener("mouseleave", () => {
//   subList.classList.remove("header__subList--active");
// });
// // меню - другий рівень - клік
// listItem.addEventListener("click", () => {
//   subList.classList.toggle("header__subList--active");
// });

// тоглим тему
headerMode.addEventListener("click", () => {
  const main = document.querySelector(".main");
  const imgDark = document.querySelector(".header__img--dark");
  const imgLight = document.querySelector(".header__img--light");
  const themeFlag = document.querySelector(".header__mode-flag");

  // тоглим тему - красим box-shadow кольором теми 1/3
  const countryBox = document.querySelectorAll(".coutries__country");
  const filter = document.querySelector(".header__filter");
  const color = window
    .getComputedStyle(filter)
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

// помилка
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

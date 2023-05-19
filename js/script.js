import { getCountry } from "./useAPI.js";

const main = document.querySelector(".main");
const title = document.querySelector(".header__title");
const headerInput = document.querySelector(".header__input");
const headerMode = document.querySelector(".header__mode");
const searchBtn = document.querySelector(".header__btn");
const countryBox = document.querySelector(".coutries");
const filterFlag = document.querySelector(".header__filterFlag");
const sublistItem = document.querySelectorAll(".header__subList-item");
const target = document.querySelector(".header__target");

// отримуєм дані
document.addEventListener("DOMContentLoaded", async () => {
  const res = await getCountry();
  target.innerHTML = `All countries (${res.data.length})`;
  generator(res);
  onFilter(res);
});

// ФІЛЬТР - розкидуєм eventListener на елементи меню, змінюєм фільтр
function onFilter(res) {
  // кнопка All (перший header__list-item)
  const AllBtn = document.querySelector(".header__list-item");
  AllBtn.addEventListener("click", (event) => {
    event.preventDefault();
    generator(res);
    target.innerHTML = `All countries (${res.data.length})`;
    filterFlag.innerHTML = "Filter off";
  });

  // всі інші кнопки меню 2 рівня
  for (let i = 0; i < sublistItem.length; i++) {
    sublistItem[i].addEventListener("click", (event) => {
      event.preventDefault();
      // ресет всього контента перед початком фільтрування
      if (filterFlag.innerHTML !== "Filter off") {
        generator(res);
      }
      // фільтр - визначаєм куди клікнув користувач
      filterFlag.innerHTML = `Filter by ${sublistItem[i].textContent}`;
      const currentSubListItem = sublistItem[i].textContent;
      const currentListItem = sublistItem[i]
        .closest(".header__list-item")
        .querySelector(".header__list-item-title").textContent;
      console.log(`you clicked: ${currentListItem} - ${currentSubListItem}`);

      // перевіряєм наявний на сторінці контент
      // на предмет навності двох вищевказаних змінних.
      // display: none - для тих хто не відповідає їм
      const toDisplayNone = document.querySelectorAll(
        `.coutries__${currentListItem}`
      );
      toDisplayNone.forEach((element) => {
        const content = element.textContent.trim().toLowerCase();
        // регулярне вираження, яке припускає текст до і після currentSubListItem
        const regex = new RegExp(
          `${currentListItem}:.*${currentSubListItem}.*`,
          "i"
        );
        if (regex.test(content)) {
          console.log(`${currentSubListItem}-items found`);
        } else {
          element.parentNode.parentNode.style.display = "none";
          // Поле під інпутом - шукаєм країни, які не зловили display: none
          const countriesLeftCount = document.querySelectorAll(
            '.coutries__country:not([style*="display: none"])'
          ).length;
          target.innerHTML = `${currentListItem}: ${currentSubListItem} (${countriesLeftCount})`;
        }
      });
    });
  }
}

// ІНПУТ
headerInput.addEventListener("input", function () {
  const countryElements = document.querySelectorAll(".coutries__country");
  const searchText = this.value.toLowerCase(); // Отримуємо текст з інпуту та перетворюємо його в нижній регістр
  filterFlag.innerHTML = "Filter off";
  // Перебираємо всі елементи країн
  for (let i = 0; i < countryElements.length; i++) {
    const countryName = countryElements[i]
      .querySelector(".coutries__name")
      .innerText.toLowerCase();

    // Перевіряємо, чи відповідає назва країни пошуковому запиту
    if (countryName.includes(searchText)) {
      countryElements[i].style.display = "flex"; // Відображаємо елемент, якщо відповідає пошуковому запиту
    } else {
      countryElements[i].style.display = "none"; // Приховуємо елемент, якщо не відповідає пошуковому запиту
    }
    const countriesLeftCount = document.querySelectorAll(
      '.coutries__country:not([style*="display: none"])'
    ).length;
    target.innerHTML = `Input search: (${countriesLeftCount})`;
  }
});

// генерим верстку
function generator(res) {
  const { data } = res;
  console.log("generator reports:");
  console.log(data);
  countryBox.innerHTML = "";

  for (let key in data) {
    let countryFlag = data[key].flags.png;
    let countryName = data[key].name.common;
    let countryRegion = data[key].region;
    let countryCapital = data[key].capital;
    let countryPopul = data[key].population;
    let countryLang = findNestedLevels(data[key].languages).join(", ");
    let countryCurr = findNestedLevels(data[key].currencies).join(", ");

    countryBox.innerHTML += `
    <div class="coutries__country">
      <img
        class="coutries__flag"
        src="${countryFlag}"
        alt="flag-${countryName}"
        loading="lazy" 
      />
      <div class="coutries__wrap">
        <p class="coutries__name">${countryName}</p>
        <p class="coutries__capital">Capital: ${countryCapital}</p>
        <p class="coutries__region">Region: ${countryRegion}</p>
        <p class="coutries__languages">Languages: ${countryLang}</p>
        <p class="coutries__currencies">Currencies: ${countryCurr}</p>
        <p class="coutries__population">Population: ${countryPopul}</p>
      </div>
    </div>
    `;
  }
}
// Рекурсія для сильно nested ключів.
function findNestedLevels(obj) {
  let result = [];
  function search(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        search(obj[key]);
      } else {
        result.push(obj[key]);
      }
    }
  }
  search(obj);
  return result;
}

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

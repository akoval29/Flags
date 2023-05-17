import { onError } from "./script.js";

let lastRequest = null; // уникнути повторних запитів на сервер 1/3
export async function getCountry(
  searchMethod = "region",
  searchValue = "europe"
) {
  if (!searchValue || (lastRequest && lastRequest === searchValue)) {
    return;
  } // уникнути пустих і повторних запитів на сервер 2/3
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/${searchMethod}/${searchValue}`
    );
    lastRequest = searchValue; // уникнути повторних запитів на сервер 3/3

    return response;
  } catch (error) {
    onError();
    console.error(error);
    throw error;
  }
}

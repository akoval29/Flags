import { onError } from "./script.js";

const cache = {};
export async function getCountry() {
  try {
    const cacheKey = "getCountry"; // Кеш результату 1/3

    if (cache[cacheKey]) {
      return cache[cacheKey];
    } // Кеш результату 2/3

    // const response = await axios.get("https://restcountries.com/v3.1/all");
    const response = await axios.get(
      "https://restcountries.com/v3.1/name/ukraine"
    );

    // Кеш результату 3/3
    cache[cacheKey] = response;

    return response;
  } catch (error) {
    onError();
    console.error(error);
    throw error;
  }
}

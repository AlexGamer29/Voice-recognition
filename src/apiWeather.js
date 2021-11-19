export async function getWeather(city) {
  const weatherResponse = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=b06c2e69522f42759ab131715211811&q=${city}`
  ).catch((err) => {
    console.error("Cannot fetch weather: ", err);
  });

  const jsonResponse = await weatherResponse.json();
  return jsonResponse.current.temp_c;
}
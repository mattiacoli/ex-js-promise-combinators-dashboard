/*
  In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:

    Nome completo della città e paese da  /destinations?search=[query]
    (result.name, result.country, nelle nuove proprietà city e country).
    Il meteo attuale da /weathers?search={query}
    (result.temperature e result.weather_description nella nuove proprietà temperature e weather).
    Il nome dell’aeroporto principale da /airports?search={query}
    (result.name nella nuova proprietà airport).

  Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.
  Attenzione: le chiamate sono delle ricerche e ritornano un’array ciascuna, di cui devi prendere il primo risultato (il primo elemento).
  Note del docente
  Scrivi la funzione getDashboardData(query), che deve:

    Essere asincrona (async).
    Utilizzare Promise.all() per eseguire più richieste in parallelo.
    Restituire una Promise che risolve un oggetto contenente i dati aggregati.
    Stampare i dati in console in un messaggio ben formattato.
    Testa la funzione con la query "london"

  Esempio di utilizzo

  getDashboardData('london')

    .then(data => {

        console.log('Dasboard data:', data);

        console.log(

            `${data.city} is in ${data.country}.\n` +

            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`+

            `The main airport is ${data.airport}.\n`

        );

    }).catch(error => console.error(error));

  Esempio di output atteso

  // Risposta API

  {

    city: "London",

    country: "United Kingdom",

    temperature: 18,

    weather: "Partly cloudy",

    airport: "London Heathrow Airport"

  }
  ​

  // Output in console

  London is in United Kingdom.

  Today there are 18 degrees and the weather is Partly cloudy.

  The main airport is London Heathrow Airport.

*/

//funzione di supporto
async function fetchJson(url) {
  const response = await fetch(url)
  const obj = await response.json()
  return obj
}

async function getDashboardData(query) {

  // start output
  console.log(`Sto scaricando i dati per la query: ${query}`)

  // error handler try/catch
  try {
    // Promises for city, wheater, airport
    const destinationsPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`)
    const weatherPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`)
    const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`)

    // array of promises
    const promises = [destinationsPromise, weatherPromise, airportsPromise]

    const results = await Promise.all(promises)

    const destination = results[0]
    const weather = results[1]
    const airport = results[2]

    console.log(destination, weather, airport);

    const obj = {
      city: destination[0].name,

      country: destination[0].country,

      temperature: weather[0].temperature,

      weather: weather[0].weather_description,

      airport: airport[0].name
    }

    return obj

  } catch (error) {
    throw new Error(`impossibile recuperare i dati! ${error.message}`);

  }


}


getDashboardData('london')

  .then(data => {

    console.log('Dasboard data:', data);

    console.log(

      `${data.city} is in ${data.country}.\n` +

      `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +

      `The main airport is ${data.airport}.\n`

    );

  }).catch(error => console.error(error));




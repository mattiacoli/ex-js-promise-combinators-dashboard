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

    const results = await Promise.allSettled(promises)
    // get data from promises
    const destination = results[0].status === 'fulfilled' ? results[0].value : null
    const weather = results[1].status === 'fulfilled' ? results[1].value : null
    const airport = results[2].status === 'fulfilled' ? results[2].value : null

    // messages for errors
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const endpoint = ['destination', 'weather', 'airport']
        throw new Error(`Chiamata a ${endpoint[index]} fallita:  ${result.reason}`)
      }
    })

    console.log(destination, weather, airport);

    // save obj to return
    const obj = {
      city: destination[0] ? destination[0].name : null,

      country: destination[0] ? destination[0].country : null,

      temperature: weather[0] ? weather[0].temperature : null,

      weather: weather[0] ? weather[0].weather_description : null,

      airport: airport[0] ? airport[0].name : null
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

      data.city ? `${data.city} is in ${data.country}.\n` : '',

      data.temperature ? `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` : '',

      data.airport ? `The main airport is ${data.airport}.\n` : ''

    );

  }).catch(error => console.error(error));



/*
 🎯 Bonus 1 - Risultato vuoto
    Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, semplicemente i dati relativi a quella chiamata verranno settati a null e  la frase relativa non viene stampata. Testa la funzione con la query “vienna” (non trova il meteo).
*/

/*
  🎯 Bonus 2 - Chiamate fallite
    Attualmente, se una delle chiamate fallisce, **Promise.all()** rigetta l'intera operazione.
    Modifica `getDashboardData()` per usare **Promise.allSettled()**, in modo che:
      Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
      Stampa in console un messaggio di errore per ogni richiesta fallita.
      Testa la funzione con un link fittizio per il meteo (es. https://www.meteofittizio.it).

*/
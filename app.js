const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'havahavai.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()




//get player
app.get("/city/", async (request, response) => {
    const getBooksQuery = `
      SELECT
        *
      FROM
        city`;
    const booksArray = await db.all(getBooksQuery);
    response.send(booksArray);
  });

app.get("/country/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      country`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

app.get("/airport/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      airport`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

  app.get('/airport/:id/', async (request, response) => {
    const {id} = request.params
    const getBookQuery = `
      SELECT
        *
      FROM
        airport
      WHERE
        id = ${id};`
    const book = await db.get(getBookQuery)
    response.send(book)
  })

  app.get('/airport/city/country/:id/', async (request, response) => {
    const {id} = request.params
    const getBookQuery = `
    SELECT
      Airport.id AS airport_id,
      Airport.icao_code,
      Airport.iata_code,
      Airport.name AS airport_name,
      Airport.type,
      Airport.latitude_deg,
      Airport.longitude_deg,
      Airport.elevation_ft,
      City.id AS city_id,
      City.name AS city_name,
      City.country_id AS city_country_id,
      City.is_active AS city_is_active,
      City.lat AS city_lat,
      City.long AS city_long,
      Country.id AS country_id,
      Country.name AS country_name,
      Country.country_code_two,
      Country.country_code_three,
      Country.mobile_code,
      Country.continent_id
    FROM
      Airport
    JOIN
      City ON Airport.city_id = City.id
    JOIN
      Country ON City.country_id = Country.id
    WHERE
      Airport.id = ${id};`
    const book = await db.get(getBookQuery)
    response.send(book)
  })


module.exports = app

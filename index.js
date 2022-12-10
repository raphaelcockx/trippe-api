import dotenv from 'dotenv'
import express from 'express'
import { readPackageSync } from 'read-pkg'
import Trippe from 'trippe'

(async () => {
  const { version } = readPackageSync()

  dotenv.config()
  const trippe = new Trippe(process.env.API_KEY)

  const app = express()
  app.use(express.json())

  // Routes
  app.get('/', async (req, res) => {
    res.send(`Trippe API version ${version}`)
  })

  app.get('/destinations/:query', async (req, res) => {
    const { query } = req.params
    res.json(await trippe.getDestinations(query))
  })

  app.post('/destinations/:longitude/:latitude/lowest', async (req, res) => {
    const { longitude, latitude } = req.params
    res.json(await trippe.getLowestAreaPrices([+longitude, +latitude], req.body))
  })

  app.get('/hotels/:hotelCode', async (req, res) => {
    const { hotelCode } = req.params
    res.json(await trippe.getHotelDetails(hotelCode))
  })

  app.post('/hotels/:hotelCode/lowest', async (req, res) => {
    const { hotelCode } = req.params
    res.json(await trippe.getLowestHotelPrices(hotelCode, req.body))
  })

  app.post('/hotels/:hotelCode/stay', async (req, res) => {
    const { hotelCode } = req.params
    res.json(await trippe.getStayPrices(hotelCode, req.body))
  })

  app.post('/hotels/:hotelCode/book', async (req, res) => {
    const { hotelCode } = req.params
    res.json(trippe.getBookingPageUrl(hotelCode, req.body))
  })

  // Start
  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
})()

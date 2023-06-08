require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
  if(req.method === 'POST') {
    return JSON.stringify(req.body)
  }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info/', async (req, res) => {
  const count = await Person.countDocuments({});
  const body = `<div><p>Phonebook has info for ${count} people</p><p>${new Date()}</p></div>`;
  res.send(body);
})

app.get('/api/persons/', async (req, res) => {
  console.log('getting persons')
  const person = await Person.find({})
  res.json(person)
})

app.get('/api/persons/:id', async (req, res) => {
  try{
    res.send(await Person.findById(req.params.id))
  } catch (error) {
    console.log('error', error)
    throw error
  }
})

app.post('/api/persons/', async (req, res) => {
  const body = req.body

  if(body.name === undefined || body.name === '') {
    return res.status(400).json('missing name')
  }

  if(body.number === undefined || body.number === '') {
    return res.status(400).json('missing number')
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  res.json(await person.save())
})

app.delete('/api/persons/:id', async (req, res) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.log('error', error)
    throw(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
})
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

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

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const body = req.body
    console.log('body', body)
    const person = {
      name: body.name,
      number: body.number,
      _id: body._id,
    }
    res.json(await Person.findByIdAndUpdate(req.params.id, person, { new: true }))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
})
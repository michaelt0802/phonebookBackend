const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info/', (req, res) => {
  const body = `<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p></div>`
  res.send(body)
}
)

app.get('/api/persons/', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(n => n.id === id)

  if (person) {
    res.send(person)
  } else {
    res.status(404).end()
  }
})

// oof ugly
const generateID = () => {
  let randomInt = Math.floor(Math.random() * 10);
  while (persons.find(n => n.id === randomInt)) {
    randomInt = Math.floor(Math.random() * 1000);
  }

  return randomInt
}

app.post('/api/persons/', (req, res) => {
  const body = req.body

  console.log(body)

  if(!body.name) {
    return res.status(400).json('missing name')
  }

  if(!body.number) {
    return res.status(400).json('missing number')
  }

  if(persons.find(n => n.name === body.name)) {
    return res.status(400).json('person already exists')
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID()
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(n => n.id === id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
})
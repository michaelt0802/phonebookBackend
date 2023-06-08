const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length>6) {
  console.log('too many arguments provided')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://michaelt0802:${password}@cluster0.gou0y0w.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// retrieve all entries from database and console.log them
if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else { // enter new Person into database
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  })
}

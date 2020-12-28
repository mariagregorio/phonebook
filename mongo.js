const mongoose = require('mongoose')

const instructions = `To fetch phonebook entries, please provide the password as an argument: node mongo.js <password> 
To add new entry, provide password, name and phone number: node mongo.js <password> <name> <number>`

if (process.argv.length < 3 || process.argv.length === 4 || process.argv.length > 5) {
  console.log(instructions)
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://pepito:${password}@cluster0.cho8j.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // fetch all entries in phonebook
  Person
    .find({})
    .then(res => {
      console.log('phonebook:')
      res.map(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
}
else if (process.argv.length === 5) {
  // add entry to phonebook
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`${process.argv[3]} was added to the phonebook`)
    mongoose.connection.close()
  })
}

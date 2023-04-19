const mongoose = require('mongoose')
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}



const url =`mongodb+srv://fullstack:${password}@cluster0.r298rmv.mongodb.net/app-note?retryWrites=true&w=majority`



mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3 ){
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    }).mongoose.connection.close()
  })
}

if (process.argv.length > 3 ){
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
morgan.token('person', function (req, response) { 
  return `${JSON.stringify(req.body)}` })


//función para muestra de tiempo real
let mgn = morgan(':method :url :status - :response-time ms :req[header] :person')

app.use(mgn)


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
        "number": "39-23-6423122",
        
      }
    
]

// Para mostrar el numero de contacto y cuando se consulto
app.get('/info', (request, response) => {
    let entradas = persons.length
    const fecha = new Date()
    response.send(`
    <p>Phonebook has info for ${entradas} people</p>
    <p>${fecha} </p>
    `)
    //console.log(fecha);
})

//Para mostrar los contactos
app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

//Para mostrar el contacto por el id
app.get('/api/persons/:id', (request, response)=>{
    const id = Number( request.params.id)
    //console.log('id: ',id);
    const person = persons.find(x => x.id === id )
    //console.log(person);
    if (person) {
        response.json(person)
    }
    else{
        response.status(404).send()
    }
} )

//Para borrar un contacto
app.delete('/api/persons/:id',(request,response)=>{
  const id = Number(request.params.id)
  let size = persons.length
  persons = persons.filter(x => x.id !== id)

  if (size > persons.length) {
    response.status(204).send()
  }
  else{
    response.status(404).send()
  }
})


//Para poner un contacto

app.put('/api/persons/:id', (request, response)=>{
  const id = Number( request.params.id)
  //console.log('id: ',id);
  const person = persons.find(x => x.id === id )
  const body = request.body;
  const personUpdate ={
      name: body.name,
      number : body.number,
      id: generateId()
  }
   
  console.log(person);
  if (person) {
    persons = persons.map(x => x.id !==id? x: personUpdate)
    response.json(personUpdate)
    
  }
  else{
      response.status(404).send()
  }
} )



//Para generar un ID
const generateId = () => {
  const maxId = persons.length > 0
      ? Math.max(...persons.map(x => x.id))
      : 0
  return maxId + 1
}

//Para agregar una entrada
app.post('/api/persons',(request, response) => {
  const body = request.body;
  //por si falta el nombre
  if (!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }
  //por si falta el número
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  //Por si el nombre ya existe
  const coincidecia = persons.some( persons => persons.name === body.name)
  if (coincidecia) {
    return response.status(400).json({
      error: 'name must be unique '
    })
  }

  const person = {
      name: body.name,
      number : body.number,
      id: generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})
const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
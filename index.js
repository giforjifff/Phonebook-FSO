const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { 
  if(req.method == 'POST'){
    return JSON.stringify(req.body)
  }
  return
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'))


let people = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// app.get('/', (request, response) => {
//   response.send('<h1>PhoneBook:<a href="http://localhost:3001/api/peoples">here</a></h1>')
// })

app.get('/api/peoples', (request, response) => {
  response.json(people)
})

app.get('/api/peoples/:id', (request, response) => {
  
  const id = request.params.id
  const person = people.find(peo => peo.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.get('/info',(request, response)=>{

  response.send(`<p>Phonebook has info of  ${people.length}</p><br><p>${new Date()}</p>`)
})

app.delete('/api/peoples/:id', (request, response) => {
  const id = request.params.id
  people = people.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/peoples', (request, response) => {
  const person = request.body
  if(person.name && person.number){
    const maxId = people.length > 0 ? Math.max(...people.map(p => p.id)) : 0;
    if(people.some(per => per.name.toLocaleLowerCase() === person.name.toLocaleLowerCase())){
      response.send('<p>Person Already exits</p>')
    }
    person.id = maxId + 1
    people.push(person)
    console.log(person)
    response.json(person)
  }
  else{
    response.send('<p>Name/Number Missing</p>')
  }
  
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

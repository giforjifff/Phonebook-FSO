require('dotenv').config()
const express = require('express')
const app = express()

const People = require('./models/people')

const morgan = require('morgan');
const cors = require('cors');
const { Error } = require('mongoose');

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


async function requestHandling() {
  const people = await People.find({})
  app.get('/api/peoples', (request, response) => {
    People.find({}).then((result)=>{
      console.log(result);
      
      response.json(result)
    })
  })
  
  app.get('/api/peoples/:id', (request, response) => {
    const id = request.params.id
    People.findById(id).then((person)=>{
      if(person){
        console.log(person);
        response.json(person)
      }
      else{
        response.status(404).end()
      }
      
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
  
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
    const person = new People(request.body)
    if(person.name && person.number){
      // const maxId = people.length > 0 ? Math.max(...people.map(p => p.id)) : 0;
      if(people.some(per => per.name.toLocaleLowerCase() === person.name.toLocaleLowerCase())){
        response.send('<p>Person Already exits</p>')
      }
      else{
        person.save().then((resp)=>{
          console.log('result:', resp);
          response.json(resp)
        })
      }
    }
    else{
      response.send('<p>Name/Number Missing</p>')
    }
    
  })
  
}
requestHandling()

// app.get('/', (request, response) => {
//   response.send('<h1>PhoneBook:<a href="http://localhost:3001/api/peoples">here</a></h1>')
// })



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

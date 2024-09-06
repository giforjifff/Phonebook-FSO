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
app.use((req,res,next)=>{
  console.log('Inside a Middleware');
  next()
})


app.get('/api/peoples', (request, response) => {
  People.find({}).then((result)=>{
    console.log(result);
    
    response.json(result)
  })
})

app.get('/api/peoples/:id', (request, response, next) => {
  console.log("Inside people/id");
  
  const id = request.params.id
  People.findById(id)
  .then((person)=>{
    console.log(person);
    if(person){
      response.json(person)
    }
    else{
      response.status(404).end()
    }
    
  })
  .catch(error => {
    console.log("Inside Catch");
    return next(error)
    
  })

})

app.get('/info',(request, response)=>{
  People.find({}).then(people =>{
    response.send(`<p>Phonebook has info of  ${people.length}</p><br><p>${new Date()}</p>`)
  })
})

app.delete('/api/peoples/:id', (request, response, next) => {
  console.log(request);
  
  People.findByIdAndDelete(request.params.id)
  .then(result => {
    console.log(result);
    response.status(204).end()
  })
  .catch(error => next(error))

})
app.put('/api/peoples/:id',(req,res,next)=> {
  console.log('Request Recieved');
  console.log(req.body);
  
  People.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' }  )
  .then(result=>{
    console.log(result);
    res.send(result)
  })
  .catch(error => next(error))
})
app.post('/api/peoples', (request, response, next) => {
  try {
    console.log('Inside try Block');
    
    const person = new People(request.body)
    console.log('Loading person');
    if(person.name && person.number){
      // const maxId = people.length > 0 ? Math.max(...people.map(p => p.id)) : 0;
      People.find({}).then(people=>{
        if(people.some(per => per.name.toLocaleLowerCase() === person.name.toLocaleLowerCase())){
          response.send('<p>Person Already exits</p>')
        }
        else{
          person.save()
          .then((resp)=>{
            console.log('result:', resp);
            response.json(resp)
          })
          .catch(error=>{
            console.log(error);
            
            next(error)
            
          })
        }
      })
      
    }
    else{
      response.send('<p>Name/Number Missing</p>')
  }
  } catch (error) {
    console.log('Catch Working');
    
    console.log(error.message);
    
  }
  
  
})
  


const errorHandler = (error, request, response, next) => {
  console.log('Inside errorHandler');
  
  console.error(error.message)
  console.log(error.name);
  

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  if(error.name == "ValidationError"){
    return response.status(400).send({ error: `${error.message}` })
  }

  next(error)
}
app.use((req,resp,next)=>{
  console.log('Next Works');
  next()
})
app.use(errorHandler)


// app.get('/', (request, response) => {
//   response.send('<h1>PhoneBook:<a href="http://localhost:3001/api/peoples">here</a></h1>')
// })



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



// if (process.argv.length === 3){
// People.find({}).then((result)=>{
// console.log(`PhoneBook: ${result}`);
// mongoose.connection.close()

// })
// }
// else{
//   const person = new People({
//     name: process.argv[3],
//     number: process.argv[4],
//   })
  
  
//   person.save().then(result => {
//     console.log(`Added ${result.name}: ${result.number} to phonebook`)
//     mongoose.connection.close()
//   })
// }


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
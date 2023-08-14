const express = require('express')

const app = express()

const logger = require('./loggerMiddleware')

// Para crear una nota con POST desde la carpeta request tenemos que usar bodyParser.json
app.use(express.json())
app.use(logger)

let notes = [
  {
    id: 3,
    content: 'Tengo que suscribirme al canal de midudev de YouTube y Twich',
    date: '2023-08-4T08:30:06.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que repasar las clases del bootcamp',
    date: '2023-07-4T08:30:06.098Z',
    important: false
  },
  {
    id: 1,
    content: 'Hacer los ejercicios del bootcamp',
    date: '2023-02-4T10:30:06.098Z',
    important: true
  }
]

// const app= http.createServer((request, response) => {
//    response.writeHead(200, { "Content-Type": "application/json"})
//    response.end(JSON.stringify(notes));
// })

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = notes.concat(newNote)

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

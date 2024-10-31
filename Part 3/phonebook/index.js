const express = require("express");
const app = express();
var morgan = require("morgan");
morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(requestLogger);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);

  if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  }
  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const id = Math.floor(Math.random() * 10000);
  const person = {
    id: String(id),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phone has info for ${
      persons.length
    } people</p> <p>${Date().toString()}</p>`
  );
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

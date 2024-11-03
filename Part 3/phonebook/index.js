const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
require("dotenv").config();

const app = express();
const Phonenumber = require("./models/phonenumber");

app.use(express.static("dist"));

app.use(cors());
morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
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

app.get("/api/persons", (request, response) => {
  Phonenumber.find({}).then((phonenumber) => {
    response.json(phonenumber);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Phonenumber.findById(request.params.id)
    .then((phonenumber) => {
      if (phonenumber) {
        response.json(phonenumber);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  }
  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  }
  // if (persons.find((person) => person.name === body.name)) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }

  const phonenumber = new Phonenumber({
    name: body.name,
    number: body.number,
  });
  phonenumber.save().then((savedPhonenumber) => {
    response.json(savedPhonenumber);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phonenumber.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const phonenumber = {
    name: request.body.name,
    number: request.body.number,
  };

  Phonenumber.findByIdAndUpdate(request.params.id, phonenumber, { new: true })
    .then((updatedPhoneNumber) => {
      response.json(updatedPhoneNumber);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Phonenumber.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p> <p>${new Date().toString()}</p>`
      );
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

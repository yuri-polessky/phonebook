const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("content-body", function (req, res) {
  console.log(req.body);
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content-body"
  )
);

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

const generatedId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;

  return String(maxId + 1);
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  let d = new Date(Date.now());
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${d.toString()}</p>`
  );
});

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const existPerson = persons.find((p) => p.name === body.name);

  if (existPerson) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generatedId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

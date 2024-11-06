/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const addPerson = (event) => {
    event.preventDefault();

    if (persons.find((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(persons.find((person) => person.name === newName).id, {
            name: newName,
            number: newNumber,
          })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setNotificationMessage(`Updated number of: ${returnedPerson.name}`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 3000);
          })
          .catch((error) => {
            console.log(error.response.data.error);

            if (error.response.data.error.includes("Validation failed")) {
              setNotificationMessage(error.response.data.error);
              setTimeout(() => {
                setNotificationMessage(null);
              }, 3000);
            } else {
              setNotificationMessage(
                `Information of ${newName} has already been removed from the server`
              );
              setTimeout(() => {
                setNotificationMessage(null);
              }, 3000);
            }
          });
      }
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };
    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotificationMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 3000);
      })
      .catch((error) => {
        setNotificationMessage(error.response.data.error);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 3000);
      });
  };
  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then((response) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new number</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      ></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  );
};

export default App;

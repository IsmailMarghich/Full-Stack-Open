const Persons = ({ persons, filter, deletePerson }) => {
  return (
    <ul>
      {persons
        .filter((person) => {
          return (
            filter === "" ||
            person.name.toLowerCase().includes(filter.toLowerCase())
          );
        })
        .map((person) => (
          <li className="person" key={person.name}>
            {person.name}: {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        ))}
    </ul>
  );
};

export default Persons;

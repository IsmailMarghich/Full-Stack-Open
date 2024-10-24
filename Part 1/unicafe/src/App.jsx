import { useState } from "react";

const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

const StatisticLine = ({ value, text }) => {
  return (
    <tr>
      <td>
        {text} {value}
      </td>
    </tr>
  );
};
const Statistic = ({ good, neutral, bad }) => {
  let all = good + bad + neutral;
  let average = (good * 1 + bad * -1) / all;
  let positivePercentage = ((good / all) * 100).toString() + " %";
  if (all === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine value={good} text="Good: " />
          <StatisticLine value={neutral} text="Neutral: " />
          <StatisticLine value={bad} text="Bad: " />
          <StatisticLine value={all} text="All: " />
          <StatisticLine value={average} text="Average: " />
          <StatisticLine
            value={positivePercentage}
            text="Positive percentage: "
          ></StatisticLine>
        </tbody>
      </table>
    </div>
  );
};
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)}>Good</Button>
      <Button onClick={() => setNeutral(neutral + 1)}>Neutral</Button>
      <Button onClick={() => setBad(bad + 1)}>Good</Button>
      <h1>Statistics</h1>
      <Statistic good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;

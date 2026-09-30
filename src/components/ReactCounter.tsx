import { useState } from 'react';

export default function ReactCounter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" id="react-counter" onClick={() => setCount((value) => value + 1)}>
      React: {count}
    </button>
  );
}

/** @jsxImportSource react */

import styles from "./styles.module.css";

interface CounterProps {
  initialCount?: number;
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "my-counter": any;
    }
  }
}

function Counter({ initialCount = 99 }: CounterProps) {
  console.log("Counter component rendered");
  const count = initialCount;
  // const [count, setCount] = useState(initialCount);

  // const increment = () => {
  //   setCount((prevCount) => prevCount + 1);
  // };

  // const decrement = () => {
  //   setCount((prevCount) => prevCount - 1);
  // };

  return (
    <my-counter class={styles.counter}>
      <button data-action="dec" className={styles.btn}>
        -
      </button>
      <span className={styles.count}>{count}</span>
      <button data-action="inc" className={styles.btn}>
        +
      </button>
    </my-counter>
  );
}

export default Counter;

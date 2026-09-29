/** @jsxImportSource solid-js */
import { createSignal } from 'solid-js';

export default function SolidCounter() {
  const [count, setCount] = createSignal(0);
  return (
    <button type="button" id="solid-counter" onClick={() => setCount(count() + 1)}>
      Solid: {count()}
    </button>
  );
}

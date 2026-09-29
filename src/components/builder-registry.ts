import { type RegisteredComponent } from "@builder.io/sdk-react";
import Counter from "./Counter";

export const CounterComponent = {
  name: "Counter",
  component: Counter,
  inputs: [
    {
      name: "initialCount",
      type: "number",
    },
  ],
} satisfies RegisteredComponent;

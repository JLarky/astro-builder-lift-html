/** @jsxImportSource react */

// import { CounterComponent } from "@/builder-registry";
import { Content } from "@builder.io/sdk-react";
import { CounterComponent } from "./builder-registry";

interface PageProps {
  apiKey: string;
  model: string;
  content: any;
}

export default function Page(props: PageProps) {
  if (!props.content) {
    return (
      <>
        <h1>404</h1>
        <p>Make sure you have your content published at Builder.io.</p>
      </>
    );
  }
  return (
    <>
      {/* <Counter initialCount={13} /> */}
      {/* Render the Builder page */}
      <Content
        content={props.content}
        apiKey={props.apiKey}
        model={props.model}
        customComponents={[CounterComponent]}
      />
    </>
  );
}

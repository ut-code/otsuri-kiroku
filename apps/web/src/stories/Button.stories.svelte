<script lang="ts" module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import Button from "$components/example/Button.svelte";
  import { ButtonText } from "./lib.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Example/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
      backgroundColor: { control: "color" },
      size: {
        control: { type: "select" },
        options: ["small", "medium", "large"],
      },
      primary: { control: "boolean" },
    },
    args: {
      onclick: fn(),
      children: ButtonText,
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" args={{ primary: true }} />

<Story name="Secondary" args={{ primary: false }} />

<Story name="Large" args={{ size: "large" }} />

<Story name="Small" args={{ size: "small" }} />

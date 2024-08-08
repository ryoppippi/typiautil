# typiautil

[![JSR](https://jsr.io/badges/@ryoppippi/typiautil)](https://jsr.io/@ryoppippi/typiautil)
[![JSR](https://jsr.io/badges/@ryoppippi/typiautil/score)](https://jsr.io/@ryoppippi/typiautil)

A utility library for [typia](https://typia.io/)

## Funcitons 

## Utility for OpenAI


### `typiaResponseFormat`

typia version of [`zodResponseFormat`](https://github.com/openai/openai-node/blob/31e4afd6ca50e8e2560598296c099390c5956e31/src/helpers/zod.ts#L56-L73)

```ts
import { typiaResponseFormat } from "@ryoppippi/typiautil/openai";
import typia, { tags } from "typia";
import OpenAI from "openai";

/** add description as a JSDoc */
type Output = {
  /** id of the entity */
  id: string & tags.Type<'uint32'>;

  /** name of the entity */
  name: string & tags.MinLength<1>;
}

const client = new OpenAI({})
const completion = await client.beta.chat.completions.parse({
  model: "gpt-4o-mini",
  response_format: typiaResponseFormat({
    jsonSchema: typia.json.application<[Output]>(),
    validate: typia.createValidate<Output>(), // or typia.createValidateEquals<Output>()
  }),
  messages: [
    {
      role: "system",
      content: "Extract information and return as the structured data following schema",
    },
  ],
 });

console.log(completion.choices[0].message.parsed);
```

### `typiaFunction`

typia version of [`zodFunction`](https://github.com/openai/openai-node/blob/31e4afd6ca50e8e2560598296c099390c5956e31/src/helpers/zod.ts#L80-L106)

```ts
import { typiaFunction } from "@ryoppippi/typiautil/openai";
import typia, { tags } from "typia";
import OpenAI from "openai";

// description ( you should write in JSDOC, see README.md )
type Params = {
  id: string & tags.Type<'uint32'>;
  name: string & tags.MinLength<1>;
}

function myFunction(args: Params) {
  return args;
}

const client = new OpenAI({})

const completion = await client.beta.chat.completions.parse({
  model: "gpt-4o-mini",
  tool: [typiaFunction({
    jsonSchema: typia.json.application<[Params]>(),
    validate: typia.createValidate<Params>(), // or typia.createValidateEquals<Params>()
    function: myFunction,
   })],
  messages: [
    {
      role: "system",
      content: "Extract information and return as the structured data following schema",
    },
  ],
});

console.log(completion.choices[0].message.tool_calls[0].function.parsed_arguments);
```


### `typiaJsonToOpenAIJsonSchema`

Converts JSON Schema generated by Typia to OpenAI ResponseFormat for [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs).


```ts

import { typiaJsonToOpenAIResponse } from "@ryoppippi/typiautil/openai";
import typia, { tags } from "typia";
import OpenAI from "openai";

/** add description as a JSDoc */
type Output = {
  /** id of the entity */
  id: string & tags.Type<'uint32'>;

  /** name of the entity */
  name: string & tags.MinLength<1>;
}

const client = new OpenAI({})

const chat = await client.chat.completions.create({
  model: "gpt-4o-mini",
  response_format: typiaJsonToOpenAIResponse({
    jsonSchema: typia.json.application<[Output]>(),
  }),
  messages: [
    {
      role: "system",
      content: "Extract information and return as the structured data following schema",
    },
  ],
 });

/** parse res as JSON */
const json = typia.json.validateParse<Output>(chat.choices.at(0)?.message.content as string)

console.log(json);
```

## LICENSE

[MIT](./LICENSE)

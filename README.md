# typiautil

[![JSR](https://jsr.io/badges/@ryoppippi/typiautil)](https://jsr.io/@ryoppippi/typiautil)
[![JSR](https://jsr.io/badges/@ryoppippi/typiautil)](https://jsr.io/@ryoppippi/typiautil)

A utility library for [typia](https://typia.io/)

# For OpenAI

```ts

import { typiaJsonToOpenAIJsonSchema } from "@ryoppippi/typiautil/openai";
import typia from "typia";
import OpenAI from "openai";

type T = {
  id: string;
  name: string;
}

const jsonSchema = typia.json.application<[T]>();
const openaiJsonSchema = typiaJsonToOpenAIJsonSchema(jsonSchema);
const chat = await client.chat.completions.create({
  model: "gpt-4o-mini",
  response_format: typiaJsonToOpenAIResponse(
    typia.json.application<[Output]>(),
  ),
  messages: [
    {
      role: "system",
      content: prompt,
    },
  ],
});
```

## LICENSE

[MIT](./LICENSE)

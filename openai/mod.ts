import type { ResponseFormatJSONSchema } from "openai/resources/shared.mjs";
import type * as typia from "typia";

/**
 * Params for `typiaJsonToOpenAIJsonSchema` and `typiaJsonToOpenAIResponse`
 */
export type Params = {
  /**
   * JSON Schema generated by Typia
   */
  jsonSchema: typia.IJsonApplication.IV3_1 | typia.IJsonApplication.IV3_0;

  /**
   * Whether to enable strict schema adherence when generating the output. If set to
   * true, the model will always follow the exact schema defined in the `schema`
   * field. Only a subset of JSON Schema is supported when `strict` is `true`. To
   * learn more, read the
   * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
   */
  strict?: boolean | null;
};

/**
 * Converts JSON Schema generated by Typia to OpenAI JSON Schema.
 * Recommended to use `typiaJsonToOpenAIResponse` instead.
 * @see [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
 */
export function typiaJsonToOpenAIJsonSchema(
  { jsonSchema, strict }: Params,
): ResponseFormatJSONSchema.JSONSchema {
  const { schemas } = jsonSchema.components;

  if (schemas == null) {
    throw new Error("json_schema.components.schemas is null");
  }

  const name = Object.keys(schemas).at(0);

  if (name == null) {
    throw new Error("name is null");
  }

  const targetSchema = schemas[name];

  return {
    name,
    schema: targetSchema as Record<string, unknown>,
    description: targetSchema.description,
    strict,
  };
}

/**
 * Converts JSON Schema generated by Typia to OpenAI ResponseFormat for Structured Outputs.
 * @see [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
 *
 * @example
 * ```ts
 * import { typiaJsonToOpenAIResponse } from "@ryoppippi/typiautil/openai";
 * import typia from "typia";
 * import OpenAI from "openai";
 *
 * type Output = {
 *  id: string;
 *  name: string;
 * }
 *
 * const client = new OpenAI({})
 *
 * const jsonSchema = typia.json.application<[Output]>();
 * const chat = await client.chat.completions.create({
 *  model: "gpt-4o-mini",
 *  response_format: typiaJsonToOpenAIResponse({ jsonSchema }),
 *  messages: [
 *    {
 *      role: "system",
 *     content: "Extract information and return as the structured data following schema",
 *    },
 *  ],
 * });
 * ```
 */
export function typiaJsonToOpenAIResponse(
  params: Params,
): ResponseFormatJSONSchema {
  return {
    type: "json_schema",
    json_schema: typiaJsonToOpenAIJsonSchema(params),
  };
}
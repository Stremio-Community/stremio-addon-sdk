import type { StandardSchemaV1 } from "@standard-schema/spec";

export function validate<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
): StandardSchemaV1.InferOutput<T> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous");
  }

  if (result.issues) {
    throw new ValidationError(result.issues);
  }

  return result.value;
}

export class ValidationError extends Error {
  constructor(public issues: readonly StandardSchemaV1.Issue[]) {
    super(issues[0].message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

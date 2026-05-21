import { describe, it, expect } from "vitest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { validate, ValidationError } from "./validator.js";

function makeSchema<T>(
  validateFn: StandardSchemaV1<T>["~standard"]["validate"],
): StandardSchemaV1<T> {
  return {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: validateFn,
    },
  };
}

describe("validate", () => {
  it("returns the parsed value on success", () => {
    const schema = makeSchema<{ id: string }>((value) => ({
      value: value as { id: string },
    }));

    expect(validate(schema, { id: "abc" })).toEqual({ id: "abc" });
  });

  it("throws ValidationError when issues are present", () => {
    const issues = [
      { message: "id must be a string", path: ["id"] },
      { message: "name is required" },
    ] as readonly StandardSchemaV1.Issue[];
    const schema = makeSchema<{ id: string }>(() => ({ issues }));

    expect(() => validate(schema, {} as any)).toThrow(ValidationError);

    try {
      validate(schema, {} as any);
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).name).toBe("ValidationError");
      expect((err as ValidationError).message).toBe("id must be a string");
      expect((err as ValidationError).issues).toEqual(issues);
    }
  });

  it("throws TypeError when the schema returns a Promise", () => {
    const schema = makeSchema<{ id: string }>(
      async (value) => ({ value: value as { id: string } }) as any,
    );

    expect(() => validate(schema, { id: "abc" })).toThrow(TypeError);
    expect(() => validate(schema, { id: "abc" })).toThrow(
      "Schema validation must be synchronous",
    );
  });
});

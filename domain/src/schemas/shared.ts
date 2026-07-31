import { z } from "zod";

export const nonEmptyStringSchema = z.string().trim().min(1);

export const identifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ID must use lowercase kebab-case");

export const nonNegativeIntegerSchema = z.number().int().nonnegative();

export const nonEmptyUniqueStringArraySchema = z
  .array(nonEmptyStringSchema)
  .min(1)
  .superRefine((values, ctx) => {
    const normalized = values.map((value) => value.toLocaleLowerCase());

    if (new Set(normalized).size != normalized.length) {
      ctx.addIssue({
        code: "custom",
        message: "Values must be unique",
      });
    }
  });

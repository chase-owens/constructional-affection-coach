import { ZodError } from "zod";

export type ValidationIssue = ZodError["issues"][number];

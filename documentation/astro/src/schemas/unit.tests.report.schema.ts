import { z } from "zod";

export const schema = z.object({
  name: z.string(),
  tests: z.number(),
  failures: z.number(),
  errors: z.number(),
  time: z.number(),
  testsuite: z.array(
    z.object({
      name: z.string(),
      errors: z.number(),
      failures: z.number(),
      skipped: z.number(),
      timestamp: z.string(),
      time: z.number(),
      tests: z.number(),
      testcase: z.array(
        z.object({ classname: z.string(), name: z.string(), time: z.number() })
      ),
    })
  ),
});

import { z } from "zod";

// --- // ---
// live testing:
//  bad: https://playcode.io/typescript
//  much better: https://stackblitz.com/edit/react-ts-playground-bwjkfn?file=index.tsx,src%2Ftest.ts,src%2FHello.tsx
// ---
//
/**
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 *          Tests Cases Types
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 */
export type ZodValidateTestCase<T> = {
  zodSchema: T;
  zodSchemaAsText: string;
  testTsObjectToValidate: any;
  expect: boolean;
  name: string;
};
export type FrontMatterValidateTestCase<T> = {
  zodSchema: T;
  zodSchemaAsText: string;
  expectedFrontmatter: any;
  testMarkdown: any;
  name: string;
  zodMatterShouldThrow: boolean;
};

/**
 * ------------------------------------
 * ------------------------------------
 */

export type AnyZodCoverageTestCase =
  | typeof coverageTestCase1.zodSchema
  | typeof coverageTestCase1bis.zodSchema
  | typeof coverageTestCase2.zodSchema
  | typeof coverageTestCase2bis.zodSchema
  | typeof coverageTestCase3.zodSchema
  | typeof coverageTestCase3bis.zodSchema
  | typeof coverageTestCase4.zodSchema
  | typeof coverageTestCase4bis.zodSchema
  | typeof coverageTestCase5.zodSchema
  | typeof coverageTestCase5bis.zodSchema
  | typeof coverageTestCase6.zodSchema
  | typeof coverageTestCase6bis.zodSchema
  | typeof coverageTestCase7.zodSchema
  | typeof coverageTestCase7bis.zodSchema
  | typeof coverageTestCase8.zodSchema
  | typeof coverageTestCase8bis.zodSchema
  | typeof coverageTestCase9.zodSchema
  | typeof coverageTestCase9bis.zodSchema
  | typeof coverageTestCase10.zodSchema
  | typeof coverageTestCase10bis.zodSchema
  | typeof coverageTestCase11.zodSchema
  | typeof coverageTestCase11bis.zodSchema
  | typeof coverageTestCase12.zodSchema
  | typeof coverageTestCase12bis.zodSchema
  | typeof coverageTestCase13.zodSchema
  | typeof coverageTestCase13bis.zodSchema;
/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test Case 1
 * ++++++++++++++++++++++++++++++++++++
 * +++ https://zod.dev/?id=basic-usage
 * ++++++++++++++++++++++++++++++++++++
 */
export const coverageTestCase1ZodSchema = z.string();

export const coverageTestCase1: ZodValidateTestCase<
  typeof coverageTestCase1ZodSchema
> = {
  name: `Coverage Test #1: coverageTestCase1ZodSchema should successfully parse a simple string like "tuna"`,
  zodSchema: coverageTestCase1ZodSchema,
  zodSchemaAsText: `z.string()`,
  testTsObjectToValidate: "tuna",
  expect: true,
};
const coverageTestCase1bis: ZodValidateTestCase<
  typeof coverageTestCase1ZodSchema
> = {
  ...coverageTestCase1,
  name: `Test #1bis: coverageTestCase1ZodSchema should fail parsing 12`,
  expect: false,
  testTsObjectToValidate: 12,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test Case 2
 * ++++++++++++++++++++++++++++++++++++
 * +++ https://zod.dev/?id=basic-usage
 * ++++++++++++++++++++++++++++++++++++
 */
export const coverageTestCase2ZodSchema = z.object({
  username: z.string(),
});

export const coverageTestCase2: ZodValidateTestCase<
  typeof coverageTestCase2ZodSchema
> = {
  name: `Coverage Test #2: coverageTestCase2ZodSchema should successfully parse '{ username: "Ludwig" }'`,
  zodSchema: coverageTestCase2ZodSchema,
  zodSchemaAsText: `z.object({
    username: z.string(),
  });`,
  testTsObjectToValidate: { username: "Ludwig" },
  expect: true,
};
export const coverageTestCase2bis: ZodValidateTestCase<
  typeof coverageTestCase2ZodSchema
> = {
  ...coverageTestCase2,
  name: `Coverage Test #2bis: coverageTestCase2ZodSchema should fail to parse xxx`,
  expect: false,
  testTsObjectToValidate: null,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test Case 3
 * ++++++++++++++++++++++++++++++++++++
 * +++ https://zod.dev/?id=primitives
 * ++++++++++++++++++++++++++++++++++++
 */
// **
// ######### z.string(); is already tested by {coverageTestCase1}
// *
//

// **
// ######### z.number()
// *
//
export const coverageTestCase3ZodSchema = z.number();

export const coverageTestCase3: ZodValidateTestCase<
  typeof coverageTestCase3ZodSchema
> = {
  name: `Coverage Test #3: coverageTestCase3ZodSchema should successfully parse 12`,
  zodSchema: coverageTestCase3ZodSchema,
  zodSchemaAsText: `z.number();`,
  testTsObjectToValidate: 12,
  expect: true,
};
export const coverageTestCase3bis: ZodValidateTestCase<
  typeof coverageTestCase3ZodSchema
> = {
  ...coverageTestCase3,
  name: `Coverage Test #3bis: coverageTestCase3ZodSchema should fail to parse a new Date()`,
  expect: false,
  testTsObjectToValidate: new Date(),
};

// **
// ######### z.bigint()
// *
//
export const coverageTestCase4ZodSchema = z.bigint();

export const coverageTestCase4: ZodValidateTestCase<
  typeof coverageTestCase4ZodSchema
> = {
  name: `Coverage Test #4: coverageTestCase4ZodSchema should successfully parse 2n`,
  zodSchema: coverageTestCase4ZodSchema,
  zodSchemaAsText: `z.bigint();`,
  testTsObjectToValidate: 2n, // '2n' is the number 2, as a bigint
  expect: true,
};
export const coverageTestCase4bis: ZodValidateTestCase<
  typeof coverageTestCase4ZodSchema
> = {
  ...coverageTestCase4,
  name: `Coverage Test #4bis: coverageTestCase4ZodSchema should fail to parse 2 because it is not a bigint, it is a number.`,
  expect: false,
  testTsObjectToValidate: 2,
};

// **
// ######### z.boolean()
// *
//
export const coverageTestCase5ZodSchema = z.boolean();

export const coverageTestCase5: ZodValidateTestCase<
  typeof coverageTestCase5ZodSchema
> = {
  name: `Coverage Test #5: coverageTestCase5ZodSchema should successfully parse true`,
  zodSchema: coverageTestCase5ZodSchema,
  zodSchemaAsText: `z.boolean();`,
  testTsObjectToValidate: false,
  expect: true,
};
export const coverageTestCase5bis: ZodValidateTestCase<
  typeof coverageTestCase5ZodSchema
> = {
  ...coverageTestCase5,
  name: `Coverage Test #5bis: coverageTestCase5ZodSchema should fail to parse "true" because it is not a boolean, it is a string.`,
  expect: false,
  testTsObjectToValidate: "true",
};

// **
// ######### z.date()
// *
//
export const coverageTestCase6ZodSchema = z.date();

export const coverageTestCase6: ZodValidateTestCase<
  typeof coverageTestCase6ZodSchema
> = {
  name: `Coverage Test #6: coverageTestCase6ZodSchema should successfully parse a new Date('7-14-1789')`,
  zodSchema: coverageTestCase6ZodSchema,
  zodSchemaAsText: `z.date();`,
  testTsObjectToValidate: new Date("7-14-1789"),
  expect: true,
};
export const coverageTestCase6bis: ZodValidateTestCase<
  typeof coverageTestCase6ZodSchema
> = {
  ...coverageTestCase6,
  name: `Coverage Test #6bis: coverageTestCase6ZodSchema should fail to parse '7-14-1789' because it is not a date, it is a string.`,
  expect: false,
  testTsObjectToValidate: "7-14-1789",
};

// **
// ######### z.symbol()
// *
//
export const coverageTestCase7ZodSchema = z.symbol();

export const coverageTestCase7: ZodValidateTestCase<
  typeof coverageTestCase7ZodSchema
> = {
  name: `Coverage Test #7: coverageTestCase7ZodSchema should successfully parse a Symbol('bastille')`,
  zodSchema: coverageTestCase7ZodSchema,
  zodSchemaAsText: `z.symbol();`,
  testTsObjectToValidate: Symbol("bastille"),
  expect: true,
};
export const coverageTestCase7bis: ZodValidateTestCase<
  typeof coverageTestCase7ZodSchema
> = {
  ...coverageTestCase7,
  name: `Coverage Test #7bis: coverageTestCase7ZodSchema should fail to parse NaN because it is not a symbol, it is a number.`,
  expect: false,
  testTsObjectToValidate: NaN,
};

// **
// ######### z.undefined()
// *
//
export const coverageTestCase8ZodSchema = z.undefined();

export const coverageTestCase8: ZodValidateTestCase<
  typeof coverageTestCase8ZodSchema
> = {
  name: `Coverage Test #8: coverageTestCase8ZodSchema should successfully parse a Symbol('bastille')`,
  zodSchema: coverageTestCase8ZodSchema,
  zodSchemaAsText: `z.undefined();`,
  testTsObjectToValidate: undefined,
  expect: true,
};
export const coverageTestCase8bis: ZodValidateTestCase<
  typeof coverageTestCase8ZodSchema
> = {
  ...coverageTestCase8,
  name: `Coverage Test #8bis: coverageTestCase8ZodSchema should fail to parse null because it is not undefined.`,
  expect: false,
  testTsObjectToValidate: null,
};

// **
// ######### z.null()
// *
//
export const coverageTestCase9ZodSchema = z.null();

export const coverageTestCase9: ZodValidateTestCase<
  typeof coverageTestCase9ZodSchema
> = {
  name: `Coverage Test #9: coverageTestCase9ZodSchema should successfully parse a Symbol('bastille')`,
  zodSchema: coverageTestCase9ZodSchema,
  zodSchemaAsText: `z.null();`,
  testTsObjectToValidate: null,
  expect: true,
};
export const coverageTestCase9bis: ZodValidateTestCase<
  typeof coverageTestCase9ZodSchema
> = {
  ...coverageTestCase9,
  name: `Coverage Test #9bis: coverageTestCase9ZodSchema should fail to parse undefined because it is not null.`,
  expect: false,
  testTsObjectToValidate: undefined,
};

// **
// ######### z.void()
// *
//   /!\/!\/!\
//   /!\/!\/!\
//   /!\ I don't have yet an idea to test z.void() support:
//   /!\ This is a function return type, see https://zod.dev/?id=functions.
//   /!\/!\/!\
//   /!\ This TestCase should also test support for z.function() and all the zod methods that go with it.
//   /!\/!\/!\
//   /!\ Yet: Does zod function validation make sense in
//   /!\ the context of the Pesto App, where our goal is
//   /!\ to validate values provided in markdown frontmatter?
//   /!\ The answer is probably no, and the @pesto-io/zod-reify
//   /!\ package should throw an
//   /!\ error stating that "zod.function()" is not supported.
//   /!\/!\/!\
//   /!\/!\/!\
//

// **
// ######### z.any()
// *
//

export const coverageTestCase10ZodSchema = z.any();

export const coverageTestCase10: ZodValidateTestCase<
  typeof coverageTestCase10ZodSchema
> = {
  name: `Coverage Test #10: coverageTestCase10ZodSchema(z.any()) should successfully parse the { something: 'whatever'} JSON Object.`,
  zodSchema: coverageTestCase10ZodSchema,
  zodSchemaAsText: `z.any();`,
  testTsObjectToValidate: { something: "whatever" },
  expect: true,
};
export const coverageTestCase10bis: ZodValidateTestCase<
  typeof coverageTestCase10ZodSchema
> = {
  ...coverageTestCase10,
  name: `Coverage Test #10bis: coverageTestCase10ZodSchema(z.any()) should successfully parse undefined.`,
  expect: true,
  testTsObjectToValidate: undefined,
};

export const coverageTestCase10ter: ZodValidateTestCase<
  typeof coverageTestCase10ZodSchema
> = {
  ...coverageTestCase10,
  name: `Coverage Test #10ter: coverageTestCase10ZodSchema(z.any()) should successfully parse null.`,
  expect: true,
  testTsObjectToValidate: null,
};

// **
// ######### z.unknown()
// *
//

export const coverageTestCase11ZodSchema = z.unknown();

export const coverageTestCase11: ZodValidateTestCase<
  typeof coverageTestCase11ZodSchema
> = {
  name: `Coverage Test #11: coverageTestCase11ZodSchema(z.unknown()) should successfully parse the { something: 'whatever'} JSON Object.`,
  zodSchema: coverageTestCase11ZodSchema,
  zodSchemaAsText: `z.unknown();`,
  testTsObjectToValidate: { something: "whatever" },
  expect: true,
};
export const coverageTestCase11bis: ZodValidateTestCase<
  typeof coverageTestCase11ZodSchema
> = {
  ...coverageTestCase11,
  name: `Coverage Test #11bis: coverageTestCase11ZodSchema(z.unknown()) should successfully parse undefined.`,
  expect: true,
  testTsObjectToValidate: undefined,
};

export const coverageTestCase11ter: ZodValidateTestCase<
  typeof coverageTestCase11ZodSchema
> = {
  ...coverageTestCase11,
  name: `Coverage Test #11ter: coverageTestCase11ZodSchema(z.unknown()) should successfully parse null.`,
  expect: true,
  testTsObjectToValidate: null,
};

// **
// ######### z.never()
//
// The never type represents
// the type of values that never occur: it
// can only be a function return type.
// 
// *
//   /!\/!\/!\
//   /!\/!\/!\
//   /!\ I don't have yet an idea to test z.never() support:
//   /!\ This is a function return type, see https://zod.dev/?id=functions.
//   /!\/!\/!\
//   /!\ This TestCase should also test support for z.function() and all the zod methods that go with it.
//   /!\/!\/!\
//   /!\ Yet: Does zod function validation make sense in
//   /!\ the context of the Pesto App, where our goal is
//   /!\ to validate values provided in markdown frontmatter?
//   /!\ The answer is probably no, and the @pesto-io/zod-reify
//   /!\ package should throw an
//   /!\ error stating that "zod.function()" is not supported.
//   /!\/!\/!\
//   /!\/!\/!\
// 
// 


// **
// ######### z.coerce.string()
// *
//

export const coverageTestCase12ZodSchema = z.coerce.string();

export const coverageTestCase12: ZodValidateTestCase<
  typeof coverageTestCase12ZodSchema
> = {
  name: `Coverage Test #12: coverageTestCase12ZodSchema should successfully parse a Symbol('bastille')`,
  zodSchema: coverageTestCase12ZodSchema,
  zodSchemaAsText: `z.coerce.string();`,
  testTsObjectToValidate: "whatever",
  expect: true,
};
export const coverageTestCase12bis: ZodValidateTestCase<
  typeof coverageTestCase12ZodSchema
> = {
  ...coverageTestCase12,
  name: `Coverage Test #12bis: coverageTestCase12ZodSchema should fail to parse undefined because it is not null.`,
  expect: false,
  testTsObjectToValidate: undefined,
};


// **
// ######### z.coerce.string().email().min(5)
// *
// /!\/!\ TODO /!\/!\
// /!\/!\ : THE TWO BELOW 
// /!\/!\   TEST CASES NEED TO
// /!\/!\   BE COMPLETED THEY ARE UNFINISHED!!!

export const coverageTestCase13ZodSchema = z.coerce.string().email().min(5);

export const coverageTestCase13: ZodValidateTestCase<
  typeof coverageTestCase13ZodSchema
> = {
  name: `Coverage Test #13: coverageTestCase13ZodSchema should successfully parse a Symbol('bastille')`,
  zodSchema: coverageTestCase13ZodSchema,
  zodSchemaAsText: `z.coerce.string();`,
  testTsObjectToValidate: "whatever",
  expect: true,
};
export const coverageTestCase13bis: ZodValidateTestCase<
  typeof coverageTestCase13ZodSchema
> = {
  ...coverageTestCase13,
  name: `Coverage Test #13bis: coverageTestCase13ZodSchema should fail to parse undefined because it is not null.`,
  expect: false,
  testTsObjectToValidate: undefined,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Table of all Test Cases
 * ++++++++++++++++++++++++++++++++++++
 * +++ Useful to the Jest each function
 * ++++++++++++++++++++++++++++++++++++
 */
export const allZodCoverageTesCases: {
  name: string;
  testCase: ZodValidateTestCase<AnyZodCoverageTestCase>;
}[] = [
  { name: coverageTestCase1.name, testCase: coverageTestCase1 },
  { name: coverageTestCase1bis.name, testCase: coverageTestCase1bis },
  { name: coverageTestCase2.name, testCase: coverageTestCase2 },
  { name: coverageTestCase2bis.name, testCase: coverageTestCase2bis },
  { name: coverageTestCase3.name, testCase: coverageTestCase3 },
  { name: coverageTestCase3bis.name, testCase: coverageTestCase3bis },
  { name: coverageTestCase4.name, testCase: coverageTestCase4 },
  { name: coverageTestCase4bis.name, testCase: coverageTestCase4bis },
  { name: coverageTestCase5.name, testCase: coverageTestCase5 },
  { name: coverageTestCase5bis.name, testCase: coverageTestCase5bis },
  { name: coverageTestCase6.name, testCase: coverageTestCase6 },
  { name: coverageTestCase6bis.name, testCase: coverageTestCase6bis },
  { name: coverageTestCase7.name, testCase: coverageTestCase7 },
  { name: coverageTestCase7bis.name, testCase: coverageTestCase7bis },
  { name: coverageTestCase8.name, testCase: coverageTestCase8 },
  { name: coverageTestCase8bis.name, testCase: coverageTestCase8bis },
  /// ---
  { name: coverageTestCase9.name, testCase: coverageTestCase9 },
  { name: coverageTestCase9bis.name, testCase: coverageTestCase9bis },

  { name: coverageTestCase10.name, testCase: coverageTestCase10 },
  { name: coverageTestCase10bis.name, testCase: coverageTestCase10bis },

  { name: coverageTestCase11.name, testCase: coverageTestCase11 },
  { name: coverageTestCase11bis.name, testCase: coverageTestCase11bis },

  { name: coverageTestCase12.name, testCase: coverageTestCase12 },
  { name: coverageTestCase12bis.name, testCase: coverageTestCase12bis },

  { name: coverageTestCase13.name, testCase: coverageTestCase13 },
  { name: coverageTestCase13bis.name, testCase: coverageTestCase13bis },

  /*
  { name: coverageTestCase14.name, testCase: coverageTestCase14 },
  { name: coverageTestCase14bis.name, testCase: coverageTestCase14bis },

  { name: coverageTestCase15.name, testCase: coverageTestCase15 },
  { name: coverageTestCase15bis.name, testCase: coverageTestCase15bis },

  { name: coverageTestCase16.name, testCase: coverageTestCase16 },
  { name: coverageTestCase16bis.name, testCase: coverageTestCase16bis },

  { name: coverageTestCase17.name, testCase: coverageTestCase17 },
  { name: coverageTestCase17bis.name, testCase: coverageTestCase17bis },

  { name: coverageTestCase18.name, testCase: coverageTestCase18 },
  { name: coverageTestCase18bis.name, testCase: coverageTestCase18bis },

  */

];

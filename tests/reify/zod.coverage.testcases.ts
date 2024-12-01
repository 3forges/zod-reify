import { z } from "zod";

// --- // ---
// live testing:
//  bad: https://playcode.io/typescript
//  much better: https://stackblitz.com/edit/react-ts-playground-bwjkfn?file=index.tsx,src%2Ftest.ts,src%2FHello.tsx
// ---
// Very interesting TypeScript concept to dig in: https://www.typescriptlang.org/docs/handbook/symbols.html
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
  | typeof coverageTestCase13bis.zodSchema
  | typeof coverageTestCase13ter.zodSchema
  | typeof coverageTestCase14.zodSchema
  | typeof coverageTestCase14bis.zodSchema
  | typeof coverageTestCase15.zodSchema
  | typeof coverageTestCase15bis.zodSchema
  | typeof coverageTestCase15ter.zodSchema
  | typeof coverageTestCase15quarte.zodSchema
  | typeof coverageTestCase15quinte.zodSchema
  | typeof coverageTestCase16.zodSchema
  | typeof coverageTestCase16bis.zodSchema
  | typeof coverageTestCase16ter.zodSchema
  | typeof coverageTestCase16quarte.zodSchema
  | typeof coverageTestCase17.zodSchema
  | typeof coverageTestCase18.zodSchema
  | typeof coverageTestCase19.zodSchema
  | typeof coverageTestCase20.zodSchema;
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
  name: `Coverage Test #7: coverageTestCase7ZodSchema should successfully parse a Symbol('bastille'). See https://www.typescriptlang.org/docs/handbook/symbols.html`,
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
  name: `Coverage Test #9: coverageTestCase9ZodSchema should successfully parse a Symbol('bastille'). See https://www.typescriptlang.org/docs/handbook/symbols.html`,
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
// TODO: complete all coerce examples, https://zod.dev/?id=coercion-for-primitives

export const coverageTestCase12ZodSchema = z.coerce.string();

export const coverageTestCase12: ZodValidateTestCase<
  typeof coverageTestCase12ZodSchema
> = {
  name: `Coverage Test #12: coverageTestCase12ZodSchema should successfully parse the "tuna" string`,
  zodSchema: coverageTestCase12ZodSchema,
  zodSchemaAsText: `z.coerce.string();`,
  testTsObjectToValidate: "tuna",
  expect: true,
};
export const coverageTestCase12bis: ZodValidateTestCase<
  typeof coverageTestCase12ZodSchema
> = {
  ...coverageTestCase12,
  name: `Coverage Test #12bis: coverageTestCase12ZodSchema should successfully parse the 12 number as if it was the "12" string.`,
  expect: false,
  testTsObjectToValidate: 12,
};
export const coverageTestCase12ter: ZodValidateTestCase<
  typeof coverageTestCase12ZodSchema
> = {
  ...coverageTestCase12,
  name: `Coverage Test #12ter: coverageTestCase12ZodSchema should successfully parse null as if it was the "null" string.`,
  expect: false,
  testTsObjectToValidate: null,
};
export const coverageTestCase12quarte: ZodValidateTestCase<
  typeof coverageTestCase12ZodSchema
> = {
  ...coverageTestCase12,
  name: `Coverage Test #12quarte: coverageTestCase12ZodSchema should successfully parse undefined as if it was the "undefined" 9-characters string.`,
  expect: false,
  testTsObjectToValidate: undefined,
};
export const coverageTestCase12quinte: ZodValidateTestCase<
  typeof coverageTestCase12ZodSchema
> = {
  ...coverageTestCase12,
  name: `Coverage Test #12quinte: coverageTestCase12ZodSchema should successfully parse true as if it was the "true" 4-characters string.`,
  expect: false,
  testTsObjectToValidate: true,
};

// **
// ######### z.coerce.string().email().min(5)
// *
//

export const coverageTestCase13ZodSchema = z.coerce.string().email().min(5);

export const coverageTestCase13: ZodValidateTestCase<
  typeof coverageTestCase13ZodSchema
> = {
  name: `Coverage Test #13: coverageTestCase13ZodSchema should successfully parse the "5@g.co" email address`,
  zodSchema: coverageTestCase13ZodSchema,
  zodSchemaAsText: `z.coerce.string().email().min(5);`,
  testTsObjectToValidate: "5@g.co",
  expect: true,
};

export const coverageTestCase13bis: ZodValidateTestCase<
  typeof coverageTestCase13ZodSchema
> = {
  ...coverageTestCase13,
  name: `Coverage Test #13bis: coverageTestCase13ZodSchema should fail to parse "whateverATg.co" because it has not the format of an email address.`,
  expect: false,
  testTsObjectToValidate: "whateverATg.co",
};
export const coverageTestCase13ter: ZodValidateTestCase<
  typeof coverageTestCase13ZodSchema
> = {
  ...coverageTestCase13,
  name: `Coverage Test #13ter: coverageTestCase13ZodSchema should fail to parse "whateverATg.co" because it has not the format of an email address.`,
  expect: false,
  testTsObjectToValidate: "5@g.c",
};

// **
// ######### z.coerce.string().email().min(7)
// *
//

export const coverageTestCase14ZodSchema = z.coerce.string().email().min(7);

export const coverageTestCase14: ZodValidateTestCase<
  typeof coverageTestCase14ZodSchema
> = {
  name: `Coverage Test #14: coverageTestCase14ZodSchema should successfully parse the "w@gm.co" email address, because its length is 7.`,
  zodSchema: coverageTestCase14ZodSchema,
  zodSchemaAsText: `z.coerce.string().email().min(7);`,
  testTsObjectToValidate: "w@gm.co",
  expect: true,
};
export const coverageTestCase14bis: ZodValidateTestCase<
  typeof coverageTestCase14ZodSchema
> = {
  ...coverageTestCase14,
  name: `Coverage Test #14bis: coverageTestCase14ZodSchema should fail to parse "w@g.co" because its length is less than 7, it actually is 6.`,
  expect: false,
  testTsObjectToValidate: "w@g.co",
};



// **
// ######### z.coerce.boolean()
// *
// * Boolean coercion with z.coerce.boolean() may
// * not work how you expect. 
// * Any truthy value is coerced to true, and
// * any falsy value is coerced to false.
// *  - 
// * https://developer.mozilla.org/en-US/docs/Glossary/Truthy
// * 
// * https://developer.mozilla.org/en-US/docs/Glossary/Falsy
// * 
//
/**
 * const schema = z.coerce.boolean(); // Boolean(input)
 * 
 * schema.parse("tuna"); // => true
 * schema.parse("true"); // => true
 * schema.parse("false"); // => true
 * schema.parse(1); // => true
 * schema.parse([]); // => true
 * 
 * schema.parse(0); // => false
 * schema.parse(""); // => false
 * schema.parse(undefined); // => false
 * schema.parse(null); // => false
 */
//

export const coverageTestCase15ZodSchema = z.coerce.boolean();

export const coverageTestCase15: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  name: `Coverage Test #15: coverageTestCase15ZodSchema should successfully parse the "tuna" string, because it is a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value.`,
  zodSchema: coverageTestCase15ZodSchema,
  zodSchemaAsText: `z.coerce.boolean();`,
  testTsObjectToValidate: "tuna",
  expect: true,
};
export const coverageTestCase15bis: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #15bis: coverageTestCase15ZodSchema should successfully parse the "true" string, because it is a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value.`,
  expect: false,
  testTsObjectToValidate: "true",
};

export const coverageTestCase15ter: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #15ter: coverageTestCase15ZodSchema should successfully parse the "false" string, because it is a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value.`,
  expect: false,
  testTsObjectToValidate: "false",
};


export const coverageTestCase15quarte: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #15quarte: coverageTestCase15ZodSchema should successfully parse the number 1, because it is a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value.`,
  expect: false,
  testTsObjectToValidate: 1,
};


export const coverageTestCase15quinte: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #15quinte: coverageTestCase15ZodSchema should successfully parse the empty array [], because it is a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value.`,
  expect: false,
  testTsObjectToValidate: [],
};


export const coverageTestCase16: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #16: coverageTestCase15ZodSchema should successfully parse the number 0, because it is a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value.`,
  expect: false,
  testTsObjectToValidate: 0,
};


export const coverageTestCase16bis: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #16bis: coverageTestCase15ZodSchema should successfully parse the empty string "", because it is a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value.`,
  expect: false,
  testTsObjectToValidate: "",
};

export const coverageTestCase16ter: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #16ter: coverageTestCase15ZodSchema should successfully parse an undefined value, because it is a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value.`,
  expect: false,
  testTsObjectToValidate: undefined,
};
export const coverageTestCase16quarte: ZodValidateTestCase<
  typeof coverageTestCase15ZodSchema
> = {
  ...coverageTestCase15,
  name: `Coverage Test #16quarte: coverageTestCase15ZodSchema should successfully parse null, because it is a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value.`,
  expect: false,
  testTsObjectToValidate: null,
};

//
/**
 * const schema = z.coerce.boolean(); // Boolean(input)
 * 
 * schema.parse("tuna"); // => true
 * schema.parse("true"); // => true
 * schema.parse("false"); // => true
 * schema.parse(1); // => true
 * schema.parse([]); // => true
 * 
 * schema.parse(0); // => false
 * schema.parse(""); // => false
 * schema.parse(undefined); // => false
 * schema.parse(null); // => false
 */
//
export const coverageTestCase17ZodSchema = z.literal("tuna");
let tunaLiteralExample: "tuna" = "tuna";

export const coverageTestCase17: ZodValidateTestCase<
  typeof coverageTestCase17ZodSchema
> = {
  name: `Coverage Test #17: coverageTestCase17ZodSchema should successfully parse the tunaLiteralExample variable, because its type a literal value.`,
  zodSchema: coverageTestCase17ZodSchema,
  zodSchemaAsText: `z.literal("tuna");`,
  testTsObjectToValidate: tunaLiteralExample,
  expect: true,
};

export const coverageTestCase18ZodSchema = z.literal(12);
let twelveLiteralExample: 12 = 12;

export const coverageTestCase18: ZodValidateTestCase<
  typeof coverageTestCase18ZodSchema
> = {
  name: `Coverage Test #18: coverageTestCase18ZodSchema should successfully parse the twelveLiteralExample variable, because its type a literal value.`,
  zodSchema: coverageTestCase18ZodSchema,
  zodSchemaAsText: `z.literal(12);`,
  testTsObjectToValidate: twelveLiteralExample,
  expect: true,
};

export const coverageTestCase19ZodSchema = z.literal(2n);
let twobigLiteralExample: 2n = 2n;

export const coverageTestCase19: ZodValidateTestCase<
  typeof coverageTestCase19ZodSchema
> = {
  name: `Coverage Test #19: coverageTestCase19ZodSchema should successfully parse the twobigLiteralExample variable, because its type a literal value.`,
  zodSchema: coverageTestCase19ZodSchema,
  zodSchemaAsText: `z.literal(2n);`,
  testTsObjectToValidate: twobigLiteralExample,
  expect: true,
};

export const coverageTestCase20ZodSchema = z.literal(true);
let truLiteralExample: true = true;

export const coverageTestCase20: ZodValidateTestCase<
  typeof coverageTestCase20ZodSchema
> = {
  name: `Coverage Test #20: coverageTestCase20ZodSchema should successfully parse the truLiteralExample variable, because its type a literal value.`,
  zodSchema: coverageTestCase20ZodSchema,
  zodSchemaAsText: `z.literal(true);`,
  testTsObjectToValidate: truLiteralExample,
  expect: true,
};

// I don't know how to test a Symbol literal...
/**
 * const terrificSymbol = Symbol("terrific");
 * const terrific = z.literal(terrificSymbol);
 * let exampleTerrificSymbolLiteral: Symbol = Symbol("terrific");
 * 
 */


// TODO (next): https://zod.dev/?id=strings


// **
// ######### z.string().*(*)
// *
// * All examples at https://zod.dev/?id=strings
// * 
// 
export const coverageTestCase21ZodSchema = z.string().max(5);

export const coverageTestCase21: ZodValidateTestCase<
  typeof coverageTestCase21ZodSchema
> = {
  name: `Coverage Test #21: coverageTestCase21ZodSchema should successfully parse the "five" string, because its length is less than 5.`,
  zodSchema: coverageTestCase21ZodSchema,
  zodSchemaAsText: `z.string().max(5);`,
  testTsObjectToValidate: "five",
  expect: true,
};
export const coverageTestCase21bis: ZodValidateTestCase<
  typeof coverageTestCase21ZodSchema
> = {
  ...coverageTestCase21,
  name: `Coverage Test #21bis: coverageTestCase21ZodSchema should fail to parse "onetwo" string because its length is 6, more than 5.`,
  expect: false,
  testTsObjectToValidate: "onetwo",
};

// *

export const coverageTestCase22ZodSchema = z.string().min(5);

export const coverageTestCase22: ZodValidateTestCase<
  typeof coverageTestCase22ZodSchema
> = {
  name: `Coverage Test #22: coverageTestCase22ZodSchema should successfully parse the "onetwo" string, because its length is 6, more than 5.`,
  zodSchema: coverageTestCase22ZodSchema,
  zodSchemaAsText: `z.string().min(5);`,
  testTsObjectToValidate: "onetwo",
  expect: true,
};
export const coverageTestCase22bis: ZodValidateTestCase<
  typeof coverageTestCase22ZodSchema
> = {
  ...coverageTestCase22,
  name: `Coverage Test #22bis: coverageTestCase22ZodSchema should fail to parse "five" string because its length is 4, less than 5.`,
  expect: false,
  testTsObjectToValidate: "five",
};

// *

export const coverageTestCase23ZodSchema = z.string().length(5);

export const coverageTestCase23: ZodValidateTestCase<
  typeof coverageTestCase23ZodSchema
> = {
  name: `Coverage Test #23: coverageTestCase23ZodSchema should successfully parse the "ofive" string, because its length is 5.`,
  zodSchema: coverageTestCase23ZodSchema,
  zodSchemaAsText: `z.string().length(5);`,
  testTsObjectToValidate: "ofive",
  expect: true,
};
export const coverageTestCase23bis: ZodValidateTestCase<
  typeof coverageTestCase23ZodSchema
> = {
  ...coverageTestCase23,
  name: `Coverage Test #23bis: coverageTestCase23ZodSchema should fail to parse "fourfive" string because its length is 8, not equal to 5.`,
  expect: false,
  testTsObjectToValidate: "fourfive",
};

// * z.string().email()

export const coverageTestCase24ZodSchema = z.string().email();

export const coverageTestCase24: ZodValidateTestCase<
  typeof coverageTestCase24ZodSchema
> = {
  name: `Coverage Test #24: coverageTestCase24ZodSchema should successfully parse the "ofive@pesto-io.io" string, because it is a valid email address.`,
  zodSchema: coverageTestCase24ZodSchema,
  zodSchemaAsText: `z.string().email();`,
  testTsObjectToValidate: "ofive@pesto-io.io",
  expect: true,
};
export const coverageTestCase24bis: ZodValidateTestCase<
  typeof coverageTestCase24ZodSchema
> = {
  ...coverageTestCase24,
  name: `Coverage Test #24bis: coverageTestCase24ZodSchema should fail to parse "fourfiveATpesto-io.io" string, because it is not a valid email address.`,
  expect: false,
  testTsObjectToValidate: "fourfiveATpesto-io.io",
};

// * z.string().url()

export const coverageTestCase25ZodSchema = z.string().url();

export const coverageTestCase25: ZodValidateTestCase<
  typeof coverageTestCase25ZodSchema
> = {
  name: `Coverage Test #25: coverageTestCase25ZodSchema should successfully parse the "smtp://my_emailaddress:my_password@box.domain.com" string, because it is a valid URL.`,
  zodSchema: coverageTestCase25ZodSchema,
  zodSchemaAsText: `z.string().url();`,
  testTsObjectToValidate: "smtp://my_emailaddress:my_password@box.domain.com",
  expect: true,
};
export const coverageTestCase25bis: ZodValidateTestCase<
  typeof coverageTestCase25ZodSchema
> = {
  ...coverageTestCase25,
  name: `Coverage Test #25bis: coverageTestCase25ZodSchema should fail to parse "file://my_emailaddress:my_password@box.domain.com" string, because it is not a valid URL.`,
  expect: false,
  testTsObjectToValidate: "file://my_emailaddress:my_password@box.domain.com",
};

// * z.string().emoji()
// https://github.com/muan/emoji

export const coverageTestCase26ZodSchema = z.string().emoji();

export const coverageTestCase26: ZodValidateTestCase<
  typeof coverageTestCase26ZodSchema
> = {
  name: `Coverage Test #26: coverageTestCase26ZodSchema should successfully parse the "💯" string, because it is a valid emoji.`,
  zodSchema: coverageTestCase26ZodSchema,
  zodSchemaAsText: `z.string().emoji();`,
  testTsObjectToValidate: "💯",
  expect: true,
};
export const coverageTestCase26bis: ZodValidateTestCase<
  typeof coverageTestCase26ZodSchema
> = {
  ...coverageTestCase26,
  name: `Coverage Test #26bis: coverageTestCase26ZodSchema should fail to parse ":sweat_smile:" string, because it is not a valid emoji (it is a markdown notation for emoji).`,
  expect: false,
  testTsObjectToValidate: ":sweat_smile:",
};


// * z.string().uuid()
// * 
// * https://github.com/uuidjs/uuid

export const coverageTestCase27ZodSchema = z.string().uuid();

export const coverageTestCase27: ZodValidateTestCase<
  typeof coverageTestCase27ZodSchema
> = {
  name: `Coverage Test #27: coverageTestCase27ZodSchema should successfully parse the "5be05513-709d-4e4e-b6b0-3d11824e2639" string, because it is a valid UUID.`,
  zodSchema: coverageTestCase27ZodSchema,
  zodSchemaAsText: `z.string().uuid();`,
  testTsObjectToValidate: "5be05513-709d-4e4e-b6b0-3d11824e2639",
  expect: true,
};
export const coverageTestCase27bis: ZodValidateTestCase<
  typeof coverageTestCase27ZodSchema
> = {
  ...coverageTestCase27,
  name: `Coverage Test #27bis: coverageTestCase27ZodSchema should fail to parse "xi92qbp687h3w8q81d3792v6" string, because it is not a valid UUID (it is a CUID).`,
  expect: false,
  testTsObjectToValidate: "xi92qbp687h3w8q81d3792v6",
};



// * z.string().cuid()
// * 
// * https://github.com/paralleldrive/cuid
// 

export const coverageTestCase28ZodSchema = z.string().cuid();

export const coverageTestCase28: ZodValidateTestCase<
  typeof coverageTestCase28ZodSchema
> = {
  name: `Coverage Test #28: coverageTestCase28ZodSchema should successfully parse the  "cjld2cjxh0000qzrmn831i7rn" string, because it is a valid CUID v1.`,
  zodSchema: coverageTestCase28ZodSchema,
  zodSchemaAsText: `z.string().cuid();`,
  testTsObjectToValidate: "cjld2cjxh0000qzrmn831i7rn",
  expect: true,
};
export const coverageTestCase28bis: ZodValidateTestCase<
  typeof coverageTestCase28ZodSchema
> = {
  ...coverageTestCase28,
  name: `Coverage Test #28bis: coverageTestCase28ZodSchema should fail to parse "xi92qbp687h3w8q81d3792v6" string, because it is not a valid CUID v1 (it is a CUID v2).`,
  expect: false,
  testTsObjectToValidate: "xi92qbp687h3w8q81d3792v6",
};

// * z.string().cuid2()
// * 
// * https://github.com/paralleldrive/cuid2

export const coverageTestCase29ZodSchema = z.string().cuid2();

export const coverageTestCase29: ZodValidateTestCase<
  typeof coverageTestCase29ZodSchema
> = {
  name: `Coverage Test #29: coverageTestCase29ZodSchema should successfully parse the  "xi92qbp687h3w8q81d3792v6" string, because it is a valid CUID v2.`,
  zodSchema: coverageTestCase29ZodSchema,
  zodSchemaAsText: `z.string().cuid2();`,
  testTsObjectToValidate: "xi92qbp687h3w8q81d3792v6",
  expect: true,
};
export const coverageTestCase29bis: ZodValidateTestCase<
  typeof coverageTestCase29ZodSchema
> = {
  ...coverageTestCase29,
  name: `Coverage Test #29bis: coverageTestCase29ZodSchema should fail to parse "5be05513-709d-4e4e-b6b0-3d11824e2639" string, because it is not a valid CUID v2 (it is a UUID).`,
  expect: false,
  testTsObjectToValidate: "5be05513-709d-4e4e-b6b0-3d11824e2639",
};


// * z.string().nanoid() // supported by zod verion 3.23.8, but not by zod verion 3.22.4
// * 
// * https://github.com/ai/nanoid


export const coverageTestCase30ZodSchema = z.string().nanoid();

export const coverageTestCase30: ZodValidateTestCase<
  typeof coverageTestCase30ZodSchema
> = {
  name: `Coverage Test #30: coverageTestCase30ZodSchema should successfully parse the  "01G65Z755AFWAKHE12NY0CQ9FH" string, because it is a valid Nano ID.`,
  zodSchema: coverageTestCase30ZodSchema,
  zodSchemaAsText: `z.string().nanoid();`,
  testTsObjectToValidate: "V1StGXR8_Z5jdHi6B-myT",
  expect: true,
};
export const coverageTestCase30bis: ZodValidateTestCase<
  typeof coverageTestCase30ZodSchema
> = {
  ...coverageTestCase30,
  name: `Coverage Test #30bis: coverageTestCase30ZodSchema should fail to parse "01G65Z755AFWAKHE12NY0CQ9FH" string, because it is not a valid Nano ID (it is a ULID).`,
  expect: false,
  testTsObjectToValidate: "01G65Z755AFWAKHE12NY0CQ9FH",
};


// - 

// * z.string().ulid()
// * 
// * https://github.com/oklog/ulid

export const coverageTestCase31ZodSchema = z.string().ulid();

export const coverageTestCase31: ZodValidateTestCase<
  typeof coverageTestCase31ZodSchema
> = {
  name: `Coverage Test #31: coverageTestCase31ZodSchema should successfully parse the  "01G65Z755AFWAKHE12NY0CQ9FH" string, because it is a valid ULID.`,
  zodSchema: coverageTestCase31ZodSchema,
  zodSchemaAsText: `z.string().ulid();`,
  testTsObjectToValidate: "01G65Z755AFWAKHE12NY0CQ9FH",
  expect: true,
};
export const coverageTestCase31bis: ZodValidateTestCase<
  typeof coverageTestCase31ZodSchema
> = {
  ...coverageTestCase31,
  name: `Coverage Test #31bis: coverageTestCase31ZodSchema should fail to parse "5be05513-709d-4e4e-b6b0-3d11824e2639" string, because it is not a valid ULID (it is a UUID).`,
  expect: false,
  testTsObjectToValidate: "5be05513-709d-4e4e-b6b0-3d11824e2639",
};

// * z.string().regex()
// * 
// * 

export const coverageTestCase32ZodSchema = z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

export const coverageTestCase32: ZodValidateTestCase<
  typeof coverageTestCase32ZodSchema
> = {
  name: `Coverage Test #32: coverageTestCase32ZodSchema should successfully parse the  "something@wow.io" string, because it is does comply with the  /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/g  regular expression.`,
  zodSchema: coverageTestCase32ZodSchema,
  zodSchemaAsText: `z.string().regex(/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/g);`,
  testTsObjectToValidate: "something@wow.io",
  expect: true,
};
export const coverageTestCase32bis: ZodValidateTestCase<
  typeof coverageTestCase32ZodSchema
> = {
  ...coverageTestCase32,
  name: `Coverage Test #32bis: coverageTestCase32ZodSchema should fail to parse "Anything That does not match." string, because it is does not comply with the  /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/g  regular expression.`,
  expect: false,
  testTsObjectToValidate: "Anything That does not match.",
};

//
// * z.string().includes("tuna", { message: "Must include tuna" });
// * 
// * 

export const coverageTestCase33ZodSchema = z.string().includes("red tuna is super good", { message: "Must include 'tuna is super good'" });

export const coverageTestCase33: ZodValidateTestCase<
  typeof coverageTestCase33ZodSchema
> = {
  name: `Coverage Test #33: coverageTestCase33ZodSchema should successfully parse the  "something@red tuna is super good.io" string, because it is does include the 'tuna is super good' string.`,
  zodSchema: coverageTestCase33ZodSchema,
  zodSchemaAsText: `z.string().includes("red tuna is super good", { message: "Must include 'tuna is super good'" });`,
  testTsObjectToValidate: "something@red tuna is super good.io",
  expect: true,
};
export const coverageTestCase33bis: ZodValidateTestCase<
  typeof coverageTestCase33ZodSchema
> = {
  ...coverageTestCase33,
  name: `Coverage Test #33bis: coverageTestCase33ZodSchema should fail to parse "something@tuna is super good.io" string, because it is does NOT include the 'tuna is super good' string.`,
  expect: false,
  testTsObjectToValidate: "something@tuna is super good.io",
};


//
// * z.string().includes("tuna", { message: "Must include tuna" });
// * 
// * 

export const coverageTestCase34ZodSchema = z.string().startsWith("Someone who des not like red tuna", { message: "Must start with 'Someone who des not like red tuna'" });

export const coverageTestCase34: ZodValidateTestCase<
  typeof coverageTestCase34ZodSchema
> = {
  name: `Coverage Test #34: coverageTestCase34ZodSchema should successfully parse the  "Someone who des not like red tuna has just his own tastes." string, because it is does start with the 'Someone who des not like red tuna' string.`,
  zodSchema: coverageTestCase34ZodSchema,
  zodSchemaAsText: `z.string().startsWith("Someone who des not like red tuna", { message: "Must start with 'Someone who des not like red tuna'" });`,
  testTsObjectToValidate: "Someone who des not like red tuna has just his own tastes.",
  expect: true,
};
export const coverageTestCase34bis: ZodValidateTestCase<
  typeof coverageTestCase34ZodSchema
> = {
  ...coverageTestCase34,
  name: `Coverage Test #34bis: coverageTestCase34ZodSchema should fail to parse "something@tuna is super good.io" string, because it is does NOT start with the 'Someone who des not like red tuna' string.`,
  expect: false,
  testTsObjectToValidate: "something@Someone who des not like red tuna.io",
};


// 
//
// * z.string().endsWith(".com", { message: "Only .com domains allowed" });
// * 
// * 

export const coverageTestCase35ZodSchema = z.string().endsWith(".com", { message: "Only .com domains allowed" });

export const coverageTestCase35: ZodValidateTestCase<
  typeof coverageTestCase35ZodSchema
> = {
  name: `Coverage Test #35: coverageTestCase35ZodSchema should successfully parse the  "Well OK I see .com" string, because it ends with the '.com' string.`,
  zodSchema: coverageTestCase35ZodSchema,
  zodSchemaAsText: `z.string().endsWith(".com", { message: "Only .com domains allowed" });`,
  testTsObjectToValidate: "Well OK I see .com",
  expect: true,
};
export const coverageTestCase35bis: ZodValidateTestCase<
  typeof coverageTestCase35ZodSchema
> = {
  ...coverageTestCase35,
  name: `Coverage Test #35bis: coverageTestCase35ZodSchema should fail to parse "zodrocks.co.uk" string, because it is does NOT end with the '.com' string.`,
  expect: false,
  testTsObjectToValidate: "zodrocks.co.uk",
};


// 
// * 
// * z.string().datetime({ message: "Invalid datetime string! Must be UTC." });
// * 
// 

export const coverageTestCase36ZodSchema = z.string().datetime({ message: "Invalid datetime string! Must be UTC." });

export const coverageTestCase36: ZodValidateTestCase<
  typeof coverageTestCase36ZodSchema
> = {
  name: `Coverage Test #36: coverageTestCase36ZodSchema should successfully parse the "2020-01-01T00:00:00.123456Z" string, because it is does comply with the ISO 8601 date time format.`,
  zodSchema: coverageTestCase36ZodSchema,
  zodSchemaAsText: `z.string().datetime({ message: "Invalid datetime string! Must be UTC." });`,
  testTsObjectToValidate: "2020-01-01T00:00:00.123456Z",
  expect: true,
};
export const coverageTestCase36bis: ZodValidateTestCase<
  typeof coverageTestCase36ZodSchema
> = {
  ...coverageTestCase36,
  name: `Coverage Test #36bis: coverageTestCase36ZodSchema should fail to parse the "2020-01-01T00:00:00+02:00" string, because it is does NOT comply with the ISO 8601 date time format.`,
  expect: false,
  testTsObjectToValidate: "2020-01-01T00:00:00+02:00",
};


export const coverageTestCase36ter: ZodValidateTestCase<
  typeof coverageTestCase36ZodSchema
> = {
  ...coverageTestCase36,
  name: `Coverage Test #36ter: coverageTestCase36ZodSchema should successfully parse the "2020-01-01T00:00:00.123Z" string, because it is does comply with the ISO 8601 date time format.`,
  expect: true,
  testTsObjectToValidate: "2020-01-01T00:00:00.123Z",
};
export const coverageTestCase36quarte: ZodValidateTestCase<
  typeof coverageTestCase36ZodSchema
> = {
  ...coverageTestCase36,
  name: `Coverage Test #36quarte: coverageTestCase36ZodSchema should successfully parse the "2020-01-01T00:00:00Z" string, because it is does comply with the ISO 8601 date time format.`,
  expect: true,
  testTsObjectToValidate: "2020-01-01T00:00:00Z",
};



// 
// * --- * 
// * z.string().datetime({ offset: true });
// * 
// * 
// 

export const coverageTestCase38ZodSchema = z.string().datetime({ offset: true });

export const coverageTestCase38: ZodValidateTestCase<
  typeof coverageTestCase38ZodSchema
> = {
  name: `Coverage Test #38: coverageTestCase38ZodSchema should successfully parse the "2020-01-01T00:00:00+02:00" string, because it is does comply with the ISO 8601 date time format, with offset.`,
  zodSchema: coverageTestCase38ZodSchema,
  zodSchemaAsText: `z.string().datetime({ offset: true });`,
  testTsObjectToValidate: "2020-01-01T00:00:00+02:00",
  expect: true,
};

export const coverageTestCase38bis: ZodValidateTestCase<
  typeof coverageTestCase38ZodSchema
> = {
  ...coverageTestCase38,
  name: `Coverage Test #38bis: coverageTestCase38ZodSchema should successfully parse the "2020-01-01T00:00:00.123+02:00" string, because it is does comply with the ISO 8601 date time format, with offset.`,
  expect: true,
  testTsObjectToValidate: "2020-01-01T00:00:00.123+02:00",
};

export const coverageTestCase38ter: ZodValidateTestCase<
  typeof coverageTestCase38ZodSchema
> = {
  ...coverageTestCase38,
  name: `Coverage Test #38ter: coverageTestCase38ZodSchema should successfully parse the "2020-01-01T00:00:00.123+0200" string, because it is does comply with the ISO 8601 date time format, with offset.`,
  expect: true,
  testTsObjectToValidate: "2020-01-01T00:00:00.123+0200",
};

export const coverageTestCase38quarte: ZodValidateTestCase<
  typeof coverageTestCase38ZodSchema
> = {
  ...coverageTestCase38,
  name: `Coverage Test #38quarte: coverageTestCase38ZodSchema should successfully parse the "2020-01-01T00:00:00.123+02" string, because it is does comply with the ISO 8601 date time format.`,
  expect: false,
  testTsObjectToValidate: "2020-01-01T00:00:00.123+02",
};

export const coverageTestCase38quinte: ZodValidateTestCase<
  typeof coverageTestCase38ZodSchema
> = {
  ...coverageTestCase38,
  name: `Coverage Test #38quinte: coverageTestCase38ZodSchema should successfully parse the "2020-01-01T00:00:00Z" string, because it is does comply with the ISO 8601 date time format.`,
  expect: false,
  testTsObjectToValidate: "2020-01-01T00:00:00Z",
};


// 
// * --- * 
// * const datetime = z.string().datetime({ precision: 3 });
// * 
// 

export const coverageTestCase39ZodSchema = z.string().datetime({ precision: 3 });

export const coverageTestCase39: ZodValidateTestCase<
  typeof coverageTestCase39ZodSchema
> = {
  name: `Coverage Test #39: coverageTestCase39ZodSchema should successfully parse the "2020-01-01T00:00:00.123Z" string, because it is does comply with the ISO 8601 date time format, and its precision is exactly the required 3 precision.`,
  zodSchema: coverageTestCase39ZodSchema,
  zodSchemaAsText: `z.string().datetime({ precision: 3 });`,
  testTsObjectToValidate: "2020-01-01T00:00:00.123Z",
  expect: true,
};

export const coverageTestCase39bis: ZodValidateTestCase<
  typeof coverageTestCase39ZodSchema
> = {
  ...coverageTestCase39,
  name: `Coverage Test #39bis: coverageTestCase39ZodSchema should fail to parse the "2020-01-01T00:00:00Z" string, because its precision is not the exactly required 3 precision.`,
  expect: false,
  testTsObjectToValidate: "2020-01-01T00:00:00Z",
};

export const coverageTestCase39ter: ZodValidateTestCase<
  typeof coverageTestCase39ZodSchema
> = {
  ...coverageTestCase39,
  name: `Coverage Test #39ter: coverageTestCase39ZodSchema should successfully parse the "2020-01-01T00:00:00.123456Z" string, because its precision is 6, not the exactly required 3 precision.`,
  expect: true,
  testTsObjectToValidate: "2020-01-01T00:00:00.123456Z",
};

// 
// * --- * 
// * const datetime = z.string().date();
// * 
// * https://zod.dev/?id=dates
// 
export const coverageTestCase40ZodSchema = z.string().date(); // validates strings in the format YYYY-MM-DD

export const coverageTestCase40: ZodValidateTestCase<
  typeof coverageTestCase40ZodSchema
> = {
  name: `Coverage Test #40: coverageTestCase40ZodSchema should successfully parse the "2020-01-01" string, because it does comply with the YYYY-MM-DD format.`,
  zodSchema: coverageTestCase40ZodSchema,
  zodSchemaAsText: `z.string().date();`,
  testTsObjectToValidate: "2020-01-01",
  expect: true,
};

export const coverageTestCase40bis: ZodValidateTestCase<
  typeof coverageTestCase40ZodSchema
> = {
  ...coverageTestCase40,
  name: `Coverage Test #40bis: coverageTestCase40ZodSchema should fail to parse the "2020-1-1" string, because it does NOT comply with the YYYY-MM-DD format.`,
  expect: false,
  testTsObjectToValidate: "2020-1-1",
};

export const coverageTestCase40ter: ZodValidateTestCase<
  typeof coverageTestCase40ZodSchema
> = {
  ...coverageTestCase40,
  name: `Coverage Test #40ter: coverageTestCase40ZodSchema should fail to parse the "2020-01-32" string, because it does NOT comply with the YYYY-MM-DD format.`,
  expect: false,
  testTsObjectToValidate: "2020-01-32",
};


// 
// * --- * 
// * const datetime = z.string().time();
// * https://zod.dev/?id=times
// * 
// 
export const coverageTestCase41ZodSchema = z.string().time(); // validates strings in the format HH:MM:SS[.s+]

export const coverageTestCase41: ZodValidateTestCase<
  typeof coverageTestCase41ZodSchema
> = {
  name: `Coverage Test #41: coverageTestCase41ZodSchema should successfully parse the "00:00:00" string, because it does comply with the HH:MM:SS[.s+] format.`,
  zodSchema: coverageTestCase41ZodSchema,
  zodSchemaAsText: `z.string().time();`,
  testTsObjectToValidate: "00:00:00",
  expect: true,
};

export const coverageTestCase41bis: ZodValidateTestCase<
  typeof coverageTestCase41ZodSchema
> = {
  ...coverageTestCase41,
  name: `Coverage Test #41bis: coverageTestCase41ZodSchema should successfully parse the "09:52:31" string, because it does comply with the HH:MM:SS[.s+] format.`,
  expect: true,
  testTsObjectToValidate: "09:52:31",
};

export const coverageTestCase41ter: ZodValidateTestCase<
  typeof coverageTestCase41ZodSchema
> = {
  ...coverageTestCase41,
  name: `Coverage Test #41ter: coverageTestCase41ZodSchema should successfully parse the "23:59:59.9999999" string, because it does comply with the HH:MM:SS[.s+] format.`,
  expect: true,
  testTsObjectToValidate: "23:59:59.9999999",
};

export const coverageTestCase41quarte: ZodValidateTestCase<
  typeof coverageTestCase41ZodSchema
> = {
  ...coverageTestCase41,
  name: `Coverage Test #41quarte: coverageTestCase41ZodSchema should fail to parse the "00:00:00.123Z" string, because it does NOT comply with the HH:MM:SS[.s+] format (no Z allowed).`,
  expect: false,
  testTsObjectToValidate: "00:00:00.123Z",
};

export const coverageTestCase41quinte: ZodValidateTestCase<
  typeof coverageTestCase41ZodSchema
> = {
  ...coverageTestCase41,
  name: `Coverage Test #41quinte: coverageTestCase41ZodSchema should fail to parse the "00:00:00.123+02:00" string, because it does NOT comply with the HH:MM:SS[.s+] format (no offsets allowed).`,
  expect: false,
  testTsObjectToValidate: "00:00:00.123+02:00",
};




// 
// * --- * 
// * const ip = z.string().ip();
// * https://zod.dev/?id=ip-addresses
// * 
// 
export const coverageTestCase42ZodSchema = z.string().ip(); // validates strings in the IPv4 or IPv6 format

export const coverageTestCase42: ZodValidateTestCase<
  typeof coverageTestCase42ZodSchema
> = {
  name: `Coverage Test #42: coverageTestCase42ZodSchema should successfully parse the "192.168.1.1" string, because it a valid IP Address.`,
  zodSchema: coverageTestCase42ZodSchema,
  zodSchemaAsText: `z.string().ip();`,
  testTsObjectToValidate: "192.168.1.1",
  expect: true,
};

export const coverageTestCase42bis: ZodValidateTestCase<
  typeof coverageTestCase42ZodSchema
> = {
  ...coverageTestCase42,
  name: `Coverage Test #42bis: coverageTestCase42ZodSchema should successfully parse the "84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003" string, because it is a valid IP Address.`,
  expect: true,
  testTsObjectToValidate: "84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003",
};

export const coverageTestCase42ter: ZodValidateTestCase<
  typeof coverageTestCase42ZodSchema
> = {
  ...coverageTestCase42,
  name: `Coverage Test #42ter: coverageTestCase42ZodSchema should successfully parse the "84d5:51a0:9114:1855:4cfa:f2d7:1f12:192.168.1.1" string, because it complies with IP Address format constraints (even if there are 2 IP Addresses).`,
  expect: true,
  testTsObjectToValidate: "84d5:51a0:9114:1855:4cfa:f2d7:1f12:192.168.1.1",
};

export const coverageTestCase42quarte: ZodValidateTestCase<
  typeof coverageTestCase42ZodSchema
> = {
  ...coverageTestCase42,
  name: `Coverage Test #42quarte: coverageTestCase42ZodSchema should fail to parse the "256.1.1.1" string, because it does NOT a valid IP Address ('256' is not allowed).`,
  expect: false,
  testTsObjectToValidate: "256.1.1.1",
};

export const coverageTestCase42quinte: ZodValidateTestCase<
  typeof coverageTestCase42ZodSchema
> = {
  ...coverageTestCase42,
  name: `Coverage Test #42quinte: coverageTestCase42ZodSchema should fail to parse the "84d5:51a0:9114:gggg:4cfa:f2d7:1f12:7003" string, because it does NOT a valid IP Address  ('g' is not allowed).`,
  expect: false,
  testTsObjectToValidate: "84d5:51a0:9114:gggg:4cfa:f2d7:1f12:7003",
};


// 
// * --- * 
// * const ipv4 = z.string().ip({ version: "v4" }); // validates strings in the IPv4 format
// * const ipv6 = z.string().ip({ version: "v6" }); // validates strings in the IPv6 format
// * https://zod.dev/?id=ip-addresses
// * 
// 
export const coverageTestCase43ZodSchema = z.string().ip({ version: "v4" }); // validates strings in the format HH:MM:SS[.s+]

export const coverageTestCase43: ZodValidateTestCase<
  typeof coverageTestCase43ZodSchema
> = {
  name: `Coverage Test #43: coverageTestCase43ZodSchema should successfully parse the "192.168.1.1" string, because it a valid IP v4 Address.`,
  zodSchema: coverageTestCase43ZodSchema,
  zodSchemaAsText: `z.string().ip({ version: "v4" });`,
  testTsObjectToValidate: "192.168.1.1",
  expect: true,
};

export const coverageTestCase43bis: ZodValidateTestCase<
  typeof coverageTestCase43ZodSchema
> = {
  ...coverageTestCase43,
  name: `Coverage Test #43bis: coverageTestCase43ZodSchema should fail to parse the "84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003" string, because it does NOT a valid IP v4 Address (it is an IP v6 Address).`,
  expect: false,
  testTsObjectToValidate: "84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003",
};

export const coverageTestCase44ZodSchema = z.string().ip({ version: "v6" }); // validates strings in the format HH:MM:SS[.s+]

export const coverageTestCase44: ZodValidateTestCase<
  typeof coverageTestCase44ZodSchema
> = {
  name: `Coverage Test #44: coverageTestCase44ZodSchema should fail to parse the "192.168.1.1" string, because it is NOT a valid IP v6 Address (it is an IP v4 Address).`,
  zodSchema: coverageTestCase44ZodSchema,
  zodSchemaAsText: `z.string().ip({ version: "v6" });`,
  testTsObjectToValidate: "192.168.1.1",
  expect: false,
};

export const coverageTestCase44bis: ZodValidateTestCase<
  typeof coverageTestCase44ZodSchema
> = {
  ...coverageTestCase44,
  name: `Coverage Test #44bis: coverageTestCase44ZodSchema should successfully parse the "84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003" string, because it is a valid IP v6 Address.`,
  expect: true,
  testTsObjectToValidate: "84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003",
};


// 
// * --- * 
// * 
// * https://zod.dev/?id=numbers
// * 
// * TODO: Impl. to complete
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
  { name: coverageTestCase13ter.name, testCase: coverageTestCase13ter },

  { name: coverageTestCase14.name, testCase: coverageTestCase14 },
  { name: coverageTestCase14bis.name, testCase: coverageTestCase14bis },

  { name: coverageTestCase15.name, testCase: coverageTestCase15 },
  { name: coverageTestCase15bis.name, testCase: coverageTestCase15bis },
  { name: coverageTestCase15ter.name, testCase: coverageTestCase15ter },
  { name: coverageTestCase15quarte.name, testCase: coverageTestCase15quarte },
  { name: coverageTestCase15quinte.name, testCase: coverageTestCase15quinte },

  { name: coverageTestCase16.name, testCase: coverageTestCase16 },
  { name: coverageTestCase16bis.name, testCase: coverageTestCase16bis },
  { name: coverageTestCase16ter.name, testCase: coverageTestCase16ter },
  { name: coverageTestCase16quarte.name, testCase: coverageTestCase16quarte },
  
  { name: coverageTestCase17.name, testCase: coverageTestCase17 },
  
  { name: coverageTestCase18.name, testCase: coverageTestCase18 },
  
  { name: coverageTestCase19.name, testCase: coverageTestCase19 },
  
  /*

  { name: coverageTestCase17.name, testCase: coverageTestCase17 },
  { name: coverageTestCase17bis.name, testCase: coverageTestCase17bis },

  { name: coverageTestCase18.name, testCase: coverageTestCase18 },
  { name: coverageTestCase18bis.name, testCase: coverageTestCase18bis },

  { name: coverageTestCase19.name, testCase: coverageTestCase19 },
  

  */
];













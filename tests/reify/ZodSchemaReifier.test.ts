import { parse as zodMatterParse } from "zod-matter";
import { z } from "zod";
// import * as grayMatter from "gray-matter"; // pnpm add --save gray-matter

import * as reifier from "../../src/reify";
import { FrontMatterValidateTestCase, ZodValidateTestCase } from "./zod.coverage.testcases";

// --- // --- 
// live testing: https://playcode.io/typescript
// --- 
// [jest -t '<describeString> <itString>']
// [pnpm test -- --testNamePattern 'debug - testCase15']
// [pnpm test -- -i <your-test-file> -c <jest-config> -t "<test-block-name>"]
// [pnpm test -- -i <your-test-file> -c <jest-config> -t "<test-block-name>"]
// see also https://stackoverflow.com/questions/42827054/how-do-i-run-a-single-test-using-jest
// --- 
// [pnpm test -- -i ./tests/reify/ZodSchemaReifier.test.ts -c ./jest.config.ts]
// [pnpm test -- -i ./tests/reify/ZodSchemaReifier.test.ts -c ./jest.config.ts -t 'Test #1bis: zodSchema1 should fail with null']
// --- 
// [pnpm test -- -c ./jest.config.ts]
// [pnpm test -- -c ./jest.config.ts -t 'Test #1bis: zodSchema1 should fail with null']
// --- 
// [pnpm test]
// [pnpm test -- -t 'Test #1bis: zodSchema1 should fail with null']
// [pnpm test -- -t 'Test #2: zodSchema2']
// [pnpm test -- -t 'Test #4: markdown frontmatter extraction zodSchema4']

/**
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 *          Tests constants
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 */
/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 1
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema1 = z
  .object({
    voila: z.string(),
  })
  .optional();

const testCase1: ZodValidateTestCase<typeof zodSchema1> = {
  name: `Test #1: zodSchema1`,
  zodSchema: zodSchema1,
  zodSchemaAsText: `z
  .object({
    voila: z.string(),
  })
  .optional()`,
  testTsObjectToValidate: undefined,
  expect: true,
};
const testCase1bis: ZodValidateTestCase<typeof zodSchema1> = {
  ...testCase1,
  name: `Test #1bis: zodSchema1 should fail with null`,
  expect: false,
  testTsObjectToValidate: null,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 2
 * ++++++++++++++++++++++++++++++++++++
 */

const zodSchema2 = z
  .object({
    voila: z.string(),
  })
  .array()
  .optional();

const testCase2: ZodValidateTestCase<typeof zodSchema2> = {
  name: `Test #2: zodSchema2`,
  zodSchema: zodSchema2,
  zodSchemaAsText: `z
  .object({
    voila: z.string(),
  })
  .array()
  .optional()`,
  testTsObjectToValidate: [
    {
      voila: `ça marche`,
    },
    {
      voila: `vraiment super bien!`,
    },
  ],
  expect: true,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 3
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema3 = z
  .object({
    voila: z.string(),
  })
  .array()
  .optional()
  .nullable();

const testCase3: ZodValidateTestCase<typeof zodSchema3> = {
  zodSchema: zodSchema3,
  name: `Test #3: zodSchema3`,
  zodSchemaAsText: `z
  .object({
    voila: z.string(),
  })
  .array()
  .optional()
  .nullable()`,
  testTsObjectToValidate: [
    {
      voila: `ça marche`,
    },
    {
      voila: `super bien!`,
    },
  ],
  expect: true,
};

const markdownTestCase3: FrontMatterValidateTestCase<
  typeof testCase3.zodSchema
> = {
  zodSchema: testCase3.zodSchema,
  name: `Test #3: markdown frontmatter extraction zodSchema3`,
  zodSchemaAsText: testCase3.zodSchemaAsText,
  expectedFrontmatter: [
    {
      voila: `oh que oui`,
    },
    {
      voila: `ça marche vraiment!`,
    },
  ],
  testMarkdown: `---\n
- voila: oh que oui
- voila: ça marche vraiment!
---\n
# Hello Pesto ZodSchemaReifier!
`,
  zodMatterShouldThrow: false,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 4
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema4 = z
  .object({
    title: z.string(),
    hereAnother: z.object({
      reseau: z.object({
        cesar: z.array(z.string()),
      }),
      imLackingIdea: z.boolean().optional(),
      itsForATest: z.boolean(),
    }),
    tags: z.array(z.string()),
    another: z.boolean().nullish(),
    exampleCategory: z.array(z.array(z.string().nullable())).optional(),
    example2Category: z.nullable(z.array(z.boolean())).optional(),
    example3Category: z.optional(z.number()).array(),
    example4Category: z.array(z.number()).optional(),
    image: z.string().optional(),
    somethingElseNested: z.object({
      firstname: z.string().array(),
      lastname: z.string(),
      color: z.string(),
      two: z.boolean().optional(),
      three: z.number().array().optional(),
      four: z.array(z.number()).optional(),
    }),
    department: z.object({
      divisionName: z.string(),
      secrecyTags: z.array(z.string()).optional(),
    }),
  })
  .optional();

const testCase4: ZodValidateTestCase<typeof zodSchema4> = {
  zodSchema: zodSchema4,
  name: `Test #4: zodSchema4`,
  zodSchemaAsText: `z
  .object({
    title: z.string(),
    hereAnother: z.object({
      reseau: z.object({
        cesar: z.array(z.string()),
      }),
      imLackingIdea: z.boolean().optional(),
      itsForATest: z.boolean(),
    }),
    tags: z.array(z.string()),
    another: z.boolean().nullish(),
    exampleCategory: z.array(z.array(z.string().nullable())).optional(),
    example2Category: z.nullable(z.array(z.boolean())).optional(),
    example3Category: z.optional(z.number()).array(),
    example4Category: z.array(z.number()).optional(),
    image: z.string().optional(),
    somethingElseNested: z.object({
      firstname: z.string().array(),
      lastname: z.string(),
      color: z.string(),
      two: z.boolean().optional(),
      three: z.number().array().optional(),
      four: z.array(z.number()).optional(),
    }),
    department: z.object({
      divisionName: z.string(),
      secrecyTags: z.array(z.string()).optional(),
    }),
  })
  .optional()`,
  testTsObjectToValidate: {
    title: `HiDeoo`,
    hereAnother: {
      reseau: {
        cesar: ["marc", "aurèle", "auguste"],
      },
      imLackingIdea: true,
      itsForATest: false,
    },
    tags: ["william", "the", "conquerer"],
    another: true,
    exampleCategory: [
      ["joe", "alfred", "alvin"],
      ["thirteen", "hundred", "books"],
      ["going", "overseas", "together"],
    ],
    example2Category: [false, true, false],
    example3Category: [7684464125145, 26454943684684, 1516546884648],
    example4Category: [7684464125145, 26454943684684, 1516546884648],
    image: `./images/paysages/puydedome.png`,
    somethingElseNested: {
      firstname: [`Jean-Baptiste`, `Marie`, `Éric`],
      lastname: `Lasselle`,
      color: `yellow`,
      two: false,
      three: [56, 789, 159],
      four: [15, 46, 739],
    },
    department: {
      divisionName: `CCOE`,
      secrecyTags: [`LEVEL3`, `NOCOPY`],
    },
  },
  expect: true,
};

const markDownTestCase4: FrontMatterValidateTestCase<
  typeof testCase4.zodSchema
> = {
  zodSchema: testCase4.zodSchema,
  name: `Test #4: markdown frontmatter extraction zodSchema4`,
  zodSchemaAsText: testCase4.zodSchemaAsText,
  expectedFrontmatter: testCase4.testTsObjectToValidate,
  testMarkdown: `---\n
title: HiDeoo\n
hereAnother: \n
  reseau: \n
    cesar: \n
      - marc\n
      - aurèle\n
      - auguste\n
  imLackingIdea: true\n
  itsForATest: false\n
tags: \n
  - william\n
  - the\n
  - conquerer\n
another: true\n
exampleCategory:\n
  - - joe\n
    - alfred\n
    - alvin\n
  - - thirteen\n
    - hundred\n
    - books\n
  - - going\n
    - overseas\n
    - together\n
example2Category: \n
  - false\n
  - true\n
  - false\n
example3Category: \n
  - 7684464125145\n
  - 26454943684684\n
  - 1516546884648\n
example4Category: \n
  - 7684464125145\n
  - 26454943684684\n
  - 1516546884648\n
image: "./images/paysages/puydedome.png"\n
somethingElseNested:\n
  firstname: \n
    - Jean-Baptiste\n
    - Marie\n
    - Éric\n
  lastname: Lasselle\n
  color: yellow\n
  two: false\n
  three: \n
    - 56\n
    - 789\n
    - 159\n
  four: \n
    - 15\n
    - 46\n
    - 739\n
  example1Categories: \n
    - design\n
    - terraform\n
    - plugin\n
  example2Categories: \n
    first:\n
      - joe\n
      - alfred\n
      - alvin\n
    second:\n
      - thirteen\n
      - hundred\n
      - books\n
    third:\n
      - going\n
      - overseas\n
      - together\n
department: \n
  divisionName: CCOE\n
  secrecyTags: 
    - LEVEL3\n 
    - NOCOPY\n
---\n
# Hello Pesto ZodSchemaReifier!
`,
  zodMatterShouldThrow: false,
};


/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 5
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema5 = z.object({
  title: z.string(),
  hereAnother: z.object({
    reseau: z.object({
      cesar: z.array(z.string()),
    }),
    imLackingIdea: z.boolean().optional(),
    itsForATest: z.boolean(),
  }),
  tags: z.array(z.string()),
  another: z.boolean().nullish(),
  exampleCategory: z.array(z.array(z.string().nullable())).optional(),
  example2Category: z.nullable(z.array(z.boolean())).optional(),
  example3Category: z.optional(z.number()).array(),
  example4Category: z.array(z.number()).optional(),
  image: z.string().optional(),
  somethingElseNested: z.object({
    firstname: z.string().array(),
    lastname: z.string(),
    color: z.string(),
    two: z.boolean().optional(),
    three: z.number().array().optional(),
    four: z.array(z.number()).optional(),
  }),
  department: z.object({
    divisionName: z.string(),
    secrecyTags: z.array(z.string()).optional(),
  }),
});

const testCase5: ZodValidateTestCase<typeof zodSchema5> = {
  zodSchema: zodSchema5,
  name: `Test #5: zodSchema5`,
  zodSchemaAsText: `z
  .object({
    title: z.string(),
    hereAnother: z.object({
      reseau: z.object({
        cesar: z.array(z.string()),
      }),
      imLackingIdea: z.boolean().optional(),
      itsForATest: z.boolean(),
    }),
    tags: z.array(z.string()),
    another: z.boolean().nullish(),
    exampleCategory: z.array(z.array(z.string().nullable())).optional(),
    example2Category: z.nullable(z.array(z.boolean())).optional(),
    example3Category: z.optional(z.number()).array(),
    example4Category: z.array(z.number()).optional(),
    image: z.string().optional(),
    somethingElseNested: z.object({
      firstname: z.string().array(),
      lastname: z.string(),
      color: z.string(),
      two: z.boolean().optional(),
      three: z.number().array().optional(),
      four: z.array(z.number()).optional(),
    }),
    department: z.object({
      divisionName: z.string(),
      secrecyTags: z.array(z.string()).optional(),
    }),
  })`,
  testTsObjectToValidate: {
    title: `HiDeoo`,
    hereAnother: {
      reseau: {
        cesar: ["marc", "aurèle", "auguste"],
      },
      imLackingIdea: true,
      itsForATest: false,
    },
    tags: ["william", "the", "conquerer"],
    another: true,
    exampleCategory: [
      ["joe", "alfred", "alvin"],
      ["thirteen", "hundred", "books"],
      ["going", "overseas", "together"],
    ],
    example2Category: [false, true, false],
    example3Category: [7684464125145, 26454943684684, 1516546884648],
    example4Category: [7684464125145, 26454943684684, 1516546884648],
    image: `./images/paysages/puydedome.png`,
    somethingElseNested: {
      firstname: [`Jean-Baptiste`, `Marie`, `Éric`],
      lastname: `Lasselle`,
      color: `yellow`,
      two: false,
      three: [56, 789, 159],
      four: [15, 46, 739],
    },
    department: {
      divisionName: `CCOE`,
      secrecyTags: [`LEVEL3`, `NOCOPY`],
    },
  },
  expect: true,
};
const markDownTestCase5: FrontMatterValidateTestCase<
  typeof testCase5.zodSchema
> = {
  zodSchema: testCase5.zodSchema,
  name: `Test #5: markdown frontmatter extraction zodSchema5`,
  zodSchemaAsText: testCase5.zodSchemaAsText,
  expectedFrontmatter: testCase5.testTsObjectToValidate,
  testMarkdown: `---\n
title: HiDeoo\n
hereAnother:\n
  reseau:\n
    cesar:\n
      - marc\n
      - aurèle\n
      - auguste\n
  imLackingIdea: true\n
  itsForATest: false\n
tags: \n
  - william\n
  - the\n
  - conquerer\n
another: true\n
exampleCategory:\n
  - - joe\n
    - alfred\n
    - alvin\n
  - - thirteen\n
    - hundred\n
    - books\n
  - - going\n
    - overseas\n
    - together\n
example2Category: \n
  - false\n
  - true\n
  - false\n
example3Category: \n
  - 7684464125145\n
  - 26454943684684\n
  - 1516546884648\n
example4Category: \n
  - 7684464125145\n
  - 26454943684684\n
  - 1516546884648\n
image: "./images/paysages/puydedome.png"\n
somethingElseNested:\n
  firstname: \n
    - Jean-Baptiste\n
    - Marie\n
    - Éric\n
  lastname: Lasselle\n
  color: yellow\n
  two: false\n
  three: \n
    - 56\n
    - 789\n
    - 159\n
  four: \n
    - 15\n
    - 46\n
    - 739\n
  example1Categories: \n
    - design\n
    - terraform\n
    - plugin\n
  example2Categories: \n
    first:\n
      - joe\n
      - alfred\n
      - alvin\n
    second:\n
      - thirteen\n
      - hundred\n
      - books\n
    third:\n
      - going\n
      - overseas\n
      - together\n
department: \n
  divisionName: CCOE\n
  secrecyTags: 
    - LEVEL3\n 
    - NOCOPY\n
---\n
# Hello Pesto ZodSchemaReifier!
`,
  zodMatterShouldThrow: false,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 6
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema6 = z.tuple([
  z.object({ first: z.array(z.string()) }),
  z.object({ second: z.array(z.string()) }),
  z.object({ third: z.array(z.string()) }),
]);

const testCase6: ZodValidateTestCase<typeof zodSchema6> = {
  zodSchema: zodSchema6,
  name: `Test #6: zodSchema6`,
  zodSchemaAsText: `z.tuple([
      z.object({first: z.array(z.string())}),
      z.object({second: z.array(z.string())}),
      z.object({third: z.array(z.string())}),
    ])`,
  testTsObjectToValidate: [
    {
      first: [
        "I am in the [first]",
        "I am an example of a tuple as defined by zod",
      ],
    },
    {
      second: [
        "I am in the [second]",
        "I am an example of a tuple as defined by zod",
      ],
    },
    {
      third: [
        "I am in the [third]",
        "I am an example of a tuple as defined by zod",
      ],
    },
  ],
  expect: true,
};
const markDownTestCase6: FrontMatterValidateTestCase<
  typeof testCase6.zodSchema
> = {
  zodSchema: testCase6.zodSchema,
  name: `Test #6: markdown frontmatter extraction zodSchema6`,
  zodSchemaAsText: testCase6.zodSchemaAsText,
  expectedFrontmatter: testCase6.testTsObjectToValidate,
  testMarkdown: undefined,
  zodMatterShouldThrow: true, // https://github.com/jonschlinkert/gray-matter/blob/ce67a86dba419381db0dd01cc84e2d30a1d1e6a5/lib/utils.js#L46
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 7
 * ++++++++++++++++++++++++++++++++++++
 */

const zodSchema7 = z
  .tuple([
    z.object({ first: z.array(z.string()) }),
    z.object({ second: z.array(z.string()) }),
    z.object({ third: z.array(z.string()) }),
  ])
  .nullable()
  .optional();

const testCase7: ZodValidateTestCase<typeof zodSchema7> = {
  zodSchema: zodSchema7,
  name: `Test #7: zodSchema7`,
  zodSchemaAsText: `z.tuple([
      z.object({first: z.array(z.string())}),
      z.object({second: z.array(z.string())}),
      z.object({third: z.array(z.string())}),
    ]).nullable().optional()`,
  testTsObjectToValidate: [
    {
      first: [
        "I am in the [first]",
        "I am an example of a tuple as defined by zod",
      ],
    },
    {
      second: [
        "I am in the [second]",
        "I am an example of a tuple as defined by zod",
      ],
    },
    {
      third: [
        "I am in the [third]",
        "I am an example of a tuple as defined by zod",
      ],
    },
  ],
  expect: true,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 8
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema8 = z.boolean().nullable().optional();
const testCase8: ZodValidateTestCase<typeof zodSchema8> = {
  zodSchema: zodSchema8,
  name: `Test #8: zodSchema8`,
  zodSchemaAsText: `z.boolean().nullable().optional()`,
  testTsObjectToValidate: false,
  expect: true,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 9
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema9 = z.array(z.boolean().nullish()).nullable().optional();
const testCase9: ZodValidateTestCase<typeof zodSchema9> = {
  zodSchema: zodSchema9,
  name: `Test #9: zodSchema9`,
  zodSchemaAsText: `z.array(z.boolean().nullish()).nullable().optional()`,
  testTsObjectToValidate: [true, false, true],
  expect: true,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 10
 * ++++++++++++++++++++++++++++++++++++
 */

const zodSchema10 = z
  .object({
    un: z.object({
      deux: z.object({
        trois: z.object({
          quatre: z.object({
            cinq: z.object({
              six: z.object({
                sept: z.string(),
              }),
            }),
          }),
        }),
      }),
    }),
  })
  .strict()
  .optional()
  .nullable();

const testCase10: ZodValidateTestCase<typeof zodSchema10> = {
  zodSchema: zodSchema10,
  name: `Test #10: zodSchema10`,
  zodSchemaAsText: `z
  .object({
    un: z.object({
      deux: z.object({
        trois: z.object({
          quatre: z.object({
            cinq: z.object({
              six: z.object({
                sept: z.string(),
              }),
            }),
          }),
        }),
      }),
    })
  })
  .strict().optional().nullable()`,
  testTsObjectToValidate: {
    un: {
      deux: {
        trois: {
          quatre: {
            cinq: {
              six: {
                sept: `Excellent!`,
              },
            },
          },
        },
      },
    },
  },
  expect: true,
};

const testCase10bis: ZodValidateTestCase<typeof zodSchema10> = {
  ...testCase10,
  name: `Test #10bis: zodSchema10`,
  expect: true,
  testTsObjectToValidate: null,
};

const testCase10ter: ZodValidateTestCase<typeof zodSchema10> = {
  ...testCase10,
  name: `Test #10ter: zodSchema10`,
  expect: true,
  testTsObjectToValidate: undefined,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 11
 * ++++++++++++++++++++++++++++++++++++
 */

const zodSchema11 = z.string().datetime();

const testCase11: ZodValidateTestCase<typeof zodSchema11> = {
  zodSchema: zodSchema11,
  name: `Test #11: zodSchema11, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime()`,
  testTsObjectToValidate: `2020-01-01T00:00:00Z`,
  expect: true,
};
const testCase11bis: ZodValidateTestCase<typeof zodSchema11> = {
  zodSchema: zodSchema11,
  name: `Test #11bis: zodSchema11, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime()`,
  testTsObjectToValidate: `2020-01-01T00:00:00.123Z`,
  expect: true,
};
const testCase11ter: ZodValidateTestCase<typeof zodSchema11> = {
  zodSchema: zodSchema11,
  name: `Test #11ter: zodSchema11, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime()`,
  testTsObjectToValidate: `2020-01-01T00:00:00.123456Z`,
  expect: true,
};
const testCase11quarte: ZodValidateTestCase<typeof zodSchema11> = {
  zodSchema: zodSchema11,
  name: `Test #11quarte: zodSchema11, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime()`,
  testTsObjectToValidate: `2020-01-01T00:00:00+02:00`,
  expect: false,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 12
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema12 = z.string().datetime({ offset: true });

const testCase12: ZodValidateTestCase<typeof zodSchema12> = {
  zodSchema: zodSchema12,
  name: `Test #12: zodSchema12, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime({ offset: true });`,
  testTsObjectToValidate: `2020-01-01T00:00:00+02:00`,
  expect: true,
};
const testCase12bis: ZodValidateTestCase<typeof zodSchema12> = {
  zodSchema: zodSchema12,
  name: `Test #12bis: zodSchema12, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime({ offset: true });`,
  testTsObjectToValidate: `2020-01-01T00:00:00.123+02:00`,
  expect: true,
};
const testCase12ter: ZodValidateTestCase<typeof zodSchema12> = {
  zodSchema: zodSchema12,
  name: `Test #12ter: zodSchema12, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime({ offset: true });`,
  testTsObjectToValidate: `2020-01-01T00:00:00.123+0200`,
  expect: true,
};
const testCase12quarte: ZodValidateTestCase<typeof zodSchema12> = {
  zodSchema: zodSchema12,
  name: `Test #12quarte: zodSchema12, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime({ offset: true });`,
  testTsObjectToValidate: `2020-01-01T00:00:00.123+02`,
  expect: true,
};
/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 13
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema13 = z.string().datetime({ precision: 3 });
const testCase13: ZodValidateTestCase<typeof zodSchema13> = {
  zodSchema: zodSchema13,
  name: `Test #13: zodSchema13, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime({ precision: 3 });`,
  testTsObjectToValidate: `2020-01-01T00:00:00.123Z`,
  expect: true,
};
const testCase13bis: ZodValidateTestCase<typeof zodSchema13> = {
  zodSchema: zodSchema13,
  name: `Test #13bis: zodSchema13, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime({ precision: 3 });`,
  testTsObjectToValidate: `2020-01-01T00:00:00Z`,
  expect: false,
};
const testCase13ter: ZodValidateTestCase<typeof zodSchema13> = {
  zodSchema: zodSchema13,
  name: `Test #13ter: zodSchema13, https://zod.dev/?id=datetimes`,
  zodSchemaAsText: `z.string().datetime({ precision: 3 });`,
  testTsObjectToValidate: `2020-01-01T00:00:00.123456Z`,
  expect: false,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 14
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema14 = z.object({
  something: z.boolean(),
});
const testCase14: ZodValidateTestCase<typeof zodSchema14> = {
  zodSchema: zodSchema14,
  name: `Test #14: zodSchema14, a simple zod object  with one boolean property, the test assigns a boolean value to the property, using an unary operator (the "not" operator).`,
  zodSchemaAsText: `z.object({ 
    something: z.boolean(),
  });`,
  testTsObjectToValidate: {
    something: !false,
  },
  expect: true,
};

const testCase14bis: ZodValidateTestCase<typeof zodSchema14> = {
  zodSchema: zodSchema14,
  name: `Test #14bis: testCase14bis, a simple zod object  with one boolean property, the test assigns a boolean value to the property, using both an unary, and a binary operator (the "not" operator, and the "or" operator).`,
  zodSchemaAsText: `z.object({ 
    something: z.boolean(),
  });`,
  testTsObjectToValidate: {
    something: !false || true,
  },
  expect: true,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 15
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema15 = z
  .date()
  .min(new Date("1900-01-01"), { message: "Too old" });
const testCase15: ZodValidateTestCase<typeof zodSchema15> = {
  zodSchema: zodSchema15,
  name: `Test #15: zodSchema15, z.date().min(new Date("1900-01-01"), { message: "Too old" })`,
  zodSchemaAsText: `z.date().min(new Date("1900-01-01"), { message: "Too old" });`,
  testTsObjectToValidate: new Date("1901-01-01"),
  expect: true,
};
const testCase15bis: ZodValidateTestCase<typeof zodSchema15> = {
  zodSchema: zodSchema15,
  name: `Test #15bis: zodSchema15, should fail to parse the "1899-01-01" date, because it is too old`,
  zodSchemaAsText: `z.date().min(new Date("1900-01-01"), { message: "Too old" });`,
  testTsObjectToValidate: new Date("1899-01-01"),
  expect: false,
};
/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 16
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema16 = z.date().max(new Date(), { message: "Too young!" });
const testCase16: ZodValidateTestCase<typeof zodSchema16> = {
  zodSchema: zodSchema16,
  name: `Test #16: zodSchema16, z.date().max(new Date(), { message: "Too young!" }) `,
  zodSchemaAsText: `z.date().max(new Date(), { message: "Too young!" });`,
  testTsObjectToValidate: new Date("2024-01-01"),
  expect: true,
};
/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 17
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema17 = z.coerce.date();
const testCase17: ZodValidateTestCase<typeof zodSchema17> = {
  zodSchema: zodSchema17,
  name: `Test #17: zodSchema17, z.coerce.date().`,
  zodSchemaAsText: `z.coerce.date();`,
  testTsObjectToValidate: new Date("2024-01-01"),
  expect: true,
};

const dateSchema = z.coerce.date();

/**
 * ------------------------------------
 * ------------------------------------
 */
type AnyFrontmatterTestCaseZodSchema =
  | typeof markdownTestCase3.zodSchema
  | typeof markDownTestCase4.zodSchema
  | typeof markDownTestCase5.zodSchema
  | typeof markDownTestCase6.zodSchema;
type AnyTestCaseZodSchema =
  | typeof testCase1.zodSchema
  | typeof testCase1bis.zodSchema
  | typeof testCase2.zodSchema
  | typeof testCase3.zodSchema
  | typeof testCase4.zodSchema
  | typeof testCase5.zodSchema
  | typeof testCase6.zodSchema
  | typeof testCase7.zodSchema
  | typeof testCase8.zodSchema
  | typeof testCase9.zodSchema
  | typeof testCase10.zodSchema
  | typeof testCase10bis.zodSchema
  | typeof testCase10ter.zodSchema
  | typeof testCase11.zodSchema
  | typeof testCase11bis.zodSchema
  | typeof testCase11ter.zodSchema
  | typeof testCase11quarte.zodSchema
  | typeof testCase12.zodSchema
  | typeof testCase12bis.zodSchema
  | typeof testCase12ter.zodSchema
  | typeof testCase12quarte.zodSchema
  | typeof testCase13.zodSchema
  | typeof testCase13bis.zodSchema
  | typeof testCase13ter.zodSchema
  | typeof testCase14.zodSchema
  | typeof testCase14bis.zodSchema
  | typeof testCase15.zodSchema
  | typeof testCase16.zodSchema
  | typeof testCase17.zodSchema;
/**
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 *          First Tests Suite:
 *             Testing the
 *  {@ZodSchemaReifier } experiment() method
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 */

describe("Tests of the {@ZodSchemaReifier} reify() method", () => {
  // beforeEach((): void => {
  //   jest.setTimeout(60000);
  // });
  afterAll(() => {
    //jest.restoreAllMocks();
    // nothing to do
  });

  /**
   *
   */
  describe("Test the reify() returns a zod schema which successfully parses the test TypeScript Object", () => {
    it.each<{name: string,testCase: ZodValidateTestCase<AnyTestCaseZodSchema>}>([
      { name: testCase1.name, testCase: testCase1},
      { name: testCase1bis.name, testCase: testCase1bis},
      { name: testCase2.name, testCase: testCase2},
      { name: testCase3.name, testCase: testCase3},
      { name: testCase4.name, testCase: testCase4},
      { name: testCase5.name, testCase: testCase5},
      { name: testCase6.name, testCase: testCase6},
      { name: testCase7.name, testCase: testCase7},
      { name: testCase8.name, testCase: testCase8},
      { name: testCase9.name, testCase: testCase9},
      { name: testCase10.name, testCase: testCase10},
      { name: testCase10bis.name, testCase: testCase10bis},
      { name: testCase10ter.name, testCase: testCase10ter},
      { name: testCase11.name, testCase: testCase11},
      { name: testCase11bis.name, testCase: testCase11bis},
      { name: testCase11ter.name, testCase: testCase11ter},
      { name: testCase11quarte.name, testCase: testCase11quarte},
      { name: testCase12.name, testCase: testCase12},
      { name: testCase12bis.name, testCase: testCase12bis},
      { name: testCase12ter.name, testCase: testCase12ter},
      { name: testCase12quarte.name, testCase: testCase12quarte},
      { name: testCase13.name, testCase: testCase13},
      { name: testCase13bis.name, testCase: testCase13bis},
      { name: testCase13ter.name, testCase: testCase13ter},
      { name: testCase14.name, testCase: testCase14},
      { name: testCase14bis.name, testCase: testCase14bis},
      { name: testCase15.name, testCase: testCase15},
      { name: testCase15bis.name, testCase: testCase15bis},
      { name: testCase16.name, testCase: testCase16},
      { name: testCase17.name, testCase: testCase17},
    ])(`Test [$name] successfully pass the zod parse test`, ({name, testCase}) => {
      
      const zodSchemaParser = new reifier.ZodSchemaReifier(
        testCase.zodSchemaAsText
      );
      const reifiedZodSchema: typeof testCase.zodSchema =
        zodSchemaParser.reify();

      console.log(` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`);
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${typeof reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testCase.testTsObjectToValidate).success is :[${reifiedZodSchema.safeParse(testCase.testTsObjectToValidate).success}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testCase.testTsObjectToValidate).success is :[${reifiedZodSchema.safeParse(testCase.testTsObjectToValidate).success}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testCase.testTsObjectToValidate)}`)
      expect(
        testCase.zodSchema.safeParse(testCase.testTsObjectToValidate).success
      ).toBe(testCase.expect);
      expect(
        reifiedZodSchema.safeParse(testCase.testTsObjectToValidate).success
      ).toBe(testCase.expect);
    });
  });
});

describe("Tests of the {@ZodSchemaReifier} reify() method against the zod-matter parse method", () => {
  // beforeEach((): void => {
  //   jest.setTimeout(60000);
  // });
  afterAll(() => {
    //jest.restoreAllMocks();
    // nothing to do
  });

  /**
   *
   */
  describe("Test the reify() returns a zod schema which successfully extracts the frontmatter from the test markdown", () => {
    it.each<{name: string,testCase: FrontMatterValidateTestCase<AnyFrontmatterTestCaseZodSchema>}>([
      {name: markdownTestCase3.name, testCase: markdownTestCase3},
      {name: markDownTestCase4.name, testCase: markDownTestCase4},
      {name: markDownTestCase5.name, testCase: markDownTestCase5},
      // markDownTestCase6 // test case 6 gives a zod tuple but zod matter expects a zod object
    ])(
      `Test [$name] should successfully parse the test markdown`,
      ({name, testCase}) => {

        const zodSchemaParser = new reifier.ZodSchemaReifier(
          testCase.zodSchemaAsText
        );

        const reifiedZodSchema: any = zodSchemaParser.reify();

        console.log(` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`);
        console.log(
          ` >>>>>>> reifiedZodSchema's type is :[${typeof reifiedZodSchema}]`
        );
        console.log(
          ` >>>>>>> testCase.testMarkdown is :[${testCase.testMarkdown}]`
        );
        console.log(
          ` >>>>>>> testCase.expectedFrontmatter is :[${JSON.stringify(
            testCase.expectedFrontmatter,
            null,
            2
          )}]`
        );
        expect(
          testCase.zodSchema.safeParse(testCase.expectedFrontmatter).success
        ).toBe(true);
        expect(
          reifiedZodSchema.safeParse(testCase.expectedFrontmatter).success
        ).toBe(true);
        
        if (!testCase.zodMatterShouldThrow) {
          const { data } = zodMatterParse(
            testCase.testMarkdown,
            reifiedZodSchema
          ); // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
          console.log(
            ` >>>>>>> zod-matter extracted fronmatter is :[${JSON.stringify(
              data,
              null,
              2
            )}]`
          );
          console.log(
            ` >>>>>>> expected frontmatter is :[${JSON.stringify(
              testCase.expectedFrontmatter,
              null,
              2
            )}]`
          );
          expect(data).toMatchObject(testCase.expectedFrontmatter);
        }

        // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema5)}`)
      }
    );

    it.each<{name: string,testCase: FrontMatterValidateTestCase<AnyFrontmatterTestCaseZodSchema>}>([
      {name: markDownTestCase6.name, testCase: markDownTestCase6}, // test case 6 gives a zod tuple but zod matter expects a zod object
    ])(`Test [$name] should throw an error because zod matter parse does not accept zod tuples as input schema`, ({name, testCase}) => {

      const zodSchemaParser = new reifier.ZodSchemaReifier(
        testCase.zodSchemaAsText
      );

      const reifiedZodSchema: any = zodSchemaParser.reify();

      console.log(` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`);
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${typeof reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> testCase.testMarkdown is :[${testCase.testMarkdown}]`
      );
      console.log(
        ` >>>>>>> testCase.expectedFrontmatter is :[${JSON.stringify(
          testCase.expectedFrontmatter,
          null,
          2
        )}]`
      );

      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema5)}`)
      expect(
        testCase.zodSchema.safeParse(testCase.expectedFrontmatter).success
      ).toBe(true);
      expect(
        reifiedZodSchema.safeParse(testCase.expectedFrontmatter).success
      ).toBe(true);

      if (testCase.zodMatterShouldThrow) {
        // expect(zodMatterParse(testCase.testMarkdown, reifiedZodSchema)).toThrow(Error)//.toThrow(/([a-z]|[A-Z])+/i)
        // expect(zodMatterParse(testCase.testMarkdown, reifiedZodSchema)).toThrow(typeof TypeError)
        expect(() => {
          zodMatterParse(testCase.testMarkdown, reifiedZodSchema);
        }).toThrow(Error);
        if (testCase.name == markDownTestCase6.name) {
          // https://github.com/jonschlinkert/gray-matter/blob/ce67a86dba419381db0dd01cc84e2d30a1d1e6a5/lib/utils.js#L46
          expect(() => {
            zodMatterParse(testCase.testMarkdown, reifiedZodSchema);
          }).toThrow(TypeError);
          expect(() => {
            zodMatterParse(testCase.testMarkdown, reifiedZodSchema);
          }).toThrow("expected input to be a string or buffer");
        }
      } else {
        const { data } = zodMatterParse(
          testCase.testMarkdown,
          reifiedZodSchema
        ); // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
        console.log(
          ` >>>>>>> zod-matter extracted fronmatter is :[${JSON.stringify(
            data,
            null,
            2
          )}]`
        );
        console.log(
          ` >>>>>>> expected frontmatter is :[${JSON.stringify(
            testCase.expectedFrontmatter,
            null,
            2
          )}]`
        );
        expect(data).toMatchObject(testCase.expectedFrontmatter);
      }

    });
  });
});

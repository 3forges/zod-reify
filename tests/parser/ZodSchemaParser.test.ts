import { parse as zodMatterParse } from "zod-matter";
import { AnyZodObject, z } from "zod";
import * as grayMatter from "gray-matter"; // pnpm add --save gray-matter

import * as parser from "../../src/parser";
import { FunctionExpression, Node, ts } from "ts-morph";

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
const zodSchemaInstance1 = z
  .object({
    voila: z.string(),
  })
  .optional();

const zodSchemaAsText1 = `z
  .object({
    voila: z.string(),
  })
  .optional()`;

// const testTsObjectToParse1 = null // fails the test
const testTsObjectToParse1 = undefined
/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 2
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchemaInstance2 = z
  .object({
    voila: z.string(),
  })
  .array()
  .optional();

const zodSchemaAsText2 = `z
  .object({
    voila: z.string(),
  })
  .array()
  .optional()`;
const testTsObjectToParse2 = [{
  voila: `ça marche`
},{
  voila: `vraiment super bien!`
}]

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 3
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchemaInstance3 = z
  .object({
    voila: z.string(),
  })
  .array()
  .optional()
  .nullable();
const zodSchemaAsText3 = `z
  .object({
    voila: z.string(),
  })
  .array()
  .optional()
  .nullable()`;
const testMarkDown3 = `---\n
- voila: oh que oui
- voila: ça marche vraiment!
---\n
# Hello Pesto ZodSchemaParser!
`
const testTsObjectToParse3 = [{
  voila: `ça marche`
},{
  voila: `super bien!`
}]

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 4
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchemaInstance4 = z
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

const zodSchemaAsText4 = `z
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
  .optional()`;


const testMarkDown4 = `---\n
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
# Hello Pesto ZodSchemaParser!
`

const testTsObjectToParse4 = {
  title: `HiDeoo`,
  hereAnother: {
    reseau: {
      cesar: [
        "marc",
        "aurèle",
        "auguste"
      ]},
    imLackingIdea: true,
    itsForATest: false,
  },
  tags: [
    "william",
    "the",
    "conquerer"
  ],
  another: true,
  exampleCategory: [
    [ 
      "joe",
      "alfred",
      "alvin",
    ],
    [ 
      "thirteen",
      "hundred",
      "books",
    ],
    [ 
      "going",
      "overseas",
      "together",
    ]
  ],
  example2Category: [
    false,
    true,
    false
  ],
  example3Category: [
    7684464125145,
    26454943684684,
    1516546884648
  ],
  example4Category: [
    7684464125145,
    26454943684684,
    1516546884648
  ],
  image: `./images/paysages/puydedome.png`,
  somethingElseNested: {
    firstname: [
      `Jean-Baptiste`,
      `Marie`,
      `Éric`
    ],
    lastname: `Lasselle`,
    color: `yellow`,
    two: false,
    three: [
      56,
      789,
      159
    ],
    four: [
      15,
      46,
      739
    ]
  },
  department: {
    divisionName: `CCOE`,
    secrecyTags: [
      `LEVEL3`, 
      `NOCOPY`
    ]
  },
}

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 5
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchemaInstance5 = z
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
  });



const zodSchemaAsText5 = `z
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
  })`;

const testMarkDown5 = `---\n
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
# Hello Pesto ZodSchemaParser!
`

const testTsObjectToParse5 = {
  title: `HiDeoo`,
  hereAnother: {
    reseau: {
      cesar: [
        "marc",
        "aurèle",
        "auguste"
      ]},
    imLackingIdea: true,
    itsForATest: false,
  },
  tags: [
    "william",
    "the",
    "conquerer"
  ],
  another: true,
  exampleCategory: [
    [ 
      "joe",
      "alfred",
      "alvin",
    ],
    [ 
      "thirteen",
      "hundred",
      "books",
    ],
    [ 
      "going",
      "overseas",
      "together",
    ]
  ],
  example2Category: [
    false,
    true,
    false
  ],
  example3Category: [
    7684464125145,
    26454943684684,
    1516546884648
  ],
  example4Category: [
    7684464125145,
    26454943684684,
    1516546884648
  ],
  image: `./images/paysages/puydedome.png`,
  somethingElseNested: {
    firstname: [
      `Jean-Baptiste`,
      `Marie`,
      `Éric`
    ],
    lastname: `Lasselle`,
    color: `yellow`,
    two: false,
    three: [
      56,
      789,
      159
    ],
    four: [
      15,
      46,
      739
    ]
  },
  department: {
    divisionName: `CCOE`,
    secrecyTags: [
      `LEVEL3`, 
      `NOCOPY`
    ]
  },
}








/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 6
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema6 = z.tuple([
  z.object({first: z.array(z.string())}),
  z.object({second: z.array(z.string())}),
  z.object({third: z.array(z.string())}),
])
const zodSchemaAsText6 = `z.tuple([
      z.object({first: z.array(z.string())}),
      z.object({second: z.array(z.string())}),
      z.object({third: z.array(z.string())}),
    ])`
    //z.keyOf(zodSchema6)
const testTsObjectToParse6 = [
  {
    first: [
      "I am in the [first]",
      "I am an example of a tuple as defined by zod"
    ]
  },
  { 
    second: [
      "I am in the [second]",
      "I am an example of a tuple as defined by zod"
    ]
  },
  { 
    third: [
      "I am in the [third]",
      "I am an example of a tuple as defined by zod"
    ]
  }
]

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 7
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema7 = z.tuple([
  z.object({first: z.array(z.string())}),
  z.object({second: z.array(z.string())}),
  z.object({third: z.array(z.string())}),
]).nullable().optional()
const zodSchemaAsText7 = `z.tuple([
      z.object({first: z.array(z.string())}),
      z.object({second: z.array(z.string())}),
      z.object({third: z.array(z.string())}),
    ]).nullable().optional()`
const testTsObjectToParse7 = [
  { 
    first: [
      "I am in the [first]",
      "I am an example of a tuple as defined by zod"
    ]
  },
  { 
    second: [
      "I am in the [second]",
      "I am an example of a tuple as defined by zod"
    ]
  },
  { 
    third: [
      "I am in the [third]",
      "I am an example of a tuple as defined by zod"
    ]
  }
]

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 8
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema8 = z.boolean().nullable().optional()
const zodSchemaAsText8 = `z.boolean().nullable().optional()`
const testTsObjectToParse8 = false


/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 9
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema9 = z.array(z.boolean().nullish()).nullable().optional()
const zodSchemaAsText9 = `z.array(z.boolean().nullish()).nullable().optional()`
const testTsObjectToParse9 = [
  true,
  false,
  true
]

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 10
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchemaInstance10 = z
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
  .strict().optional().nullable();

const zodSchemaAsText10 = `z
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
  .strict().optional().nullable()`;

// const testTsObjectToParse1 = null // fails the test
const testTsObjectToParse10 = undefined
const testTsObjectToParse10bis = null
const testTsObjectToParse10ter = {
  un: {
    deux: {
      trois: {
        quatre: {
          cinq: {
            six: {
              sept: `Excellent!`
            }
          }
        }
      }
    }
  }
}

/**
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 *          First Tests Suite:
 *             Testing the
 *  {@ZodSchemaParser } experiment() method
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 */


describe("Testing - ZodSchemaParser experiment() method", () => {
  afterAll(() => {
    //jest.restoreAllMocks();
    // nothing to do
  });

  /**
   * 
   */
  describe("[zodSchemaAsText1] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText1 : [${zodSchemaAsText1}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText1);
     const reifiedZodSchema: typeof zodSchemaInstance1 = zodSchemaParser.betterExperiment()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse1) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse1), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToParse1)}`)
      expect(zodSchemaInstance2.safeParse(testTsObjectToParse1).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse1).success).toBe(true);

      // below, an example zod-matter test
      
      
      // const { data } = zodMatterParse(testMarkDown5, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      // expect(data).toEqual(testTsObjectToParse5);
      
    });
  });

  /**
   * 
   */
  describe("[zodSchemaAsText2] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText2 : [${zodSchemaAsText2}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText2);

     const reifiedZodSchema: typeof zodSchemaInstance2 = zodSchemaParser.betterExperiment()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse2) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse2), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToParse2)}`)
      expect(zodSchemaInstance2.safeParse(testTsObjectToParse2).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse2).success).toBe(true);

      // below, an example zod-matter test
      
      
      // const { data } = zodMatterParse(testMarkDown5, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      // expect(data).toEqual(testTsObjectToParse5);
      
    });
  });

  describe("[zodSchemaAsText3] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText3 : [${zodSchemaAsText3}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText3);

     const reifiedZodSchema: typeof zodSchemaInstance3 = zodSchemaParser.betterExperiment()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse3) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse3), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchemaInstance3)}`)
      expect(zodSchemaInstance3.safeParse(testTsObjectToParse3).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse3).success).toBe(true);

      // const { data } = zodMatterParse(testMarkDown3, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      
    });

  });

  describe("[zodSchemaAsText4] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText4 : [${zodSchemaAsText4}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText4);

     const reifiedZodSchema: typeof zodSchemaInstance4 = zodSchemaParser.betterExperiment()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse4) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse4), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchemaInstance4)}`)
      expect(zodSchemaInstance4.safeParse(testTsObjectToParse4).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse4).success).toBe(true);

      // const { data } = zodMatterParse(testMarkDown3, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      
    });

  });

  /**
   * 
   */
  describe("[zodSchemaAsText5] - Test the betterExperiment() method reifies a zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText5 : [${zodSchemaAsText5}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText5);

     const reifiedZodSchema: typeof zodSchemaInstance5 = zodSchemaParser.betterExperiment()
     
     
     
      /*
     */
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse5) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse5), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchemaInstance5)}`)
      expect(zodSchemaInstance5.safeParse(testTsObjectToParse5).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse5).success).toBe(true);

      /**
       * below, an example zod-matter test
       */
      /*
      const { data } = zodMatterParse(testMarkDown5, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      expect(data).toEqual(testTsObjectToParse5);
      */
      
    });

  });

  /**
   * 
   */
  describe("[zodSchemaAsText6] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText6 : [${zodSchemaAsText6}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText6);

     const reifiedZodSchema: typeof zodSchema6 = zodSchemaParser.betterExperiment()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse6) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse6), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema6)}`)
      expect(zodSchema6.safeParse(testTsObjectToParse6).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse6).success).toBe(true);

      // const { data } = zodMatterParse(testMarkDown, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      
    });

  });

  /**
   * 
   */
  describe("[zodSchemaAsText7] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText7 : [${zodSchemaAsText7}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText7);
     const reifiedZodSchema: typeof zodSchema7 = zodSchemaParser.betterExperiment()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse7) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse7), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToParse7)}`)
      expect(zodSchema7.safeParse(testTsObjectToParse7).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse7).success).toBe(true);

      // below, an example zod-matter test

      //const { data } = zodMatterParse(testMarkDown5, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      //expect(data).toEqual(testTsObjectToParse5);
      
    });
  });

  /**
   * 
   */
  describe("[zodSchemaAsText8] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText8 : [${zodSchemaAsText8}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText8);

     const reifiedZodSchema: typeof zodSchema8 = zodSchemaParser.betterExperiment()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse8) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse8), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToParse8)}`)
      expect(zodSchema8.safeParse(testTsObjectToParse8).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse8).success).toBe(true);

      
       // below, an example zod-matter test
       
      
      // const { data } = zodMatterParse(testMarkDown5, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      // expect(data).toEqual(testTsObjectToParse5);
      
    });
  });

  /**
   * 
   */
  describe("[zodSchemaAsText9] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText9 : [${zodSchemaAsText9}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText9);

     const reifiedZodSchema: typeof zodSchema9 = zodSchemaParser.betterExperiment()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse9) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse9), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToParse9)}`)
      expect(zodSchema9.safeParse(testTsObjectToParse9).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse9).success).toBe(true);

      
    });
  });



  

  /**
   * 
   */
  describe("[zodSchemaAsText10] - Test the betterExperiment() method properly find the top function call in the zod schema", () => {
    it(`which successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText10 : [${zodSchemaAsText10}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText10);

     const reifiedZodSchema: typeof zodSchemaInstance10 = zodSchemaParser.betterExperiment()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse10) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse10ter), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToParse9)}`)
      expect(zodSchemaInstance10.safeParse(testTsObjectToParse10ter).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse10ter).success).toBe(true)
      expect(zodSchemaInstance10.safeParse(testTsObjectToParse10bis).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse10bis).success).toBe(true)
      expect(zodSchemaInstance10.safeParse(testTsObjectToParse10).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse10).success).toBe(true)

      
    });
  });



});





























describe("Testing - ZodSchemaParser with zod-matter", () => {
  afterAll(() => {
    //jest.restoreAllMocks();
    // nothing to do
  });
  /**
   * 
   */
  describe("[zodSchemaAsText5] - Test that the betterExperiment() method reifies a zod schema", () => {
    it(`which successfully extracts frontmatter from markdown using zod-matter`, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText5 : [${zodSchemaAsText5}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText5);

     const reifiedZodSchema: typeof zodSchemaInstance5 = zodSchemaParser.betterExperiment()
     
     
     
      /*
     */
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse5) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse5), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchemaInstance5)}`)
      expect(zodSchemaInstance5.safeParse(testTsObjectToParse5).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse5).success).toBe(true);

      /**
       * below, an example zod-matter test
       */
      const { data } = zodMatterParse(testMarkDown5, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      console.log(
        ` >>>>>>> zod-matter extracted fronmatter is :[${JSON.stringify(data, null, 2)}]`
      );
      console.log(
        ` >>>>>>> testTsObjectToParse5 is :[${JSON.stringify(testTsObjectToParse5, null, 2)}]`
      );
      expect(data).toMatchObject(testTsObjectToParse5);
      /*
      */
      
    });

  });

});

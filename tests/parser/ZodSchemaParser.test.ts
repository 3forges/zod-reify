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


/**
 * -----------------------
 */
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


/**
 * 
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

/**
 * 
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

/**
 * 
 */
const zodSchema8 = z.boolean().nullable().optional()
const zodSchemaAsText8 = `z.boolean().nullable().optional()`

/**
 * 
 */
const zodSchema9 = z.array(z.boolean().nullish()).nullable().optional()
const zodSchemaAsText9 = `z.array(z.boolean().nullish()).nullable().optional()`
/**
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 *          First Tests Suite:
 *             Testing the
 *  {@ZodSchemaParser } parse() method
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 */

describe("Testing - ZodSchemaParser parse() method", () => {
  afterAll(() => {
    //jest.restoreAllMocks();
    // nothing to do
  });

  describe("Test the parse() method properly instantiate the zod schema", () => {
    it(`shall return the same extracted frontmatter `, async () => {
      console.log(
          ` >>>>>>> zodSchemaAsText5 : [${zodSchemaAsText5}]`
      );
      const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText5);

      const resultingInstantiatedSchema = zodSchemaParser.betterExperiment()

      const resultOfZodParse = resultingInstantiatedSchema.safeParse({
        title: `Exemple5`,
        hereAnother: {
            reseau: {
              cesar: [
                `Marc`,
                `Aurèle`
              ]
            },
            imLackingIdea: false,
            itsForATest: true,
          },
        tags: [
            `Collège`,
            `de`,
            `France`
          ],
        another: undefined,
        exampleCategory: [
            [null]
        ],
        example2Category: [
            true,
            false,
            (2 * 3 == 1)
          ],
        example3Category: [
            56.02,
            68.12,
            89
          ],
        example4Category: [
          45.6,
          24.8,
          75.69
        ],
        image: `https://www.college-de-france.fr/sites/default/files/styles/1_1_header_portrait_s/public/media/portrait/2024-07/Francois-Marie-Breon.jpg?h=f0d95172&itok=JcMp_Fyk`,
        somethingElseNested: {
          firstname: [
            `François`,
            `Marie`
          ],
          lastname: `Bréon`,
          color: `yellow`,
          two: true,
          three: [
            12,
            74,
            163
          ],
          four: [
            17,
            23,
            97
          ],
        },
        department: {
          divisionName: 'Devops',
          secrecyTags: [
            "LEVEL1"
          ]
        },
      })
      console.log(
        ` >>>>>>> resultOfZodParse :[${JSON.stringify(resultOfZodParse, null, 2)}]`
      );
      expect(resultOfZodParse.success).toBe(true);
    });

  });
});


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

  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText3 : [${zodSchemaAsText3}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText3);

     const reifiedZodSchema: typeof zodSchemaInstance3 = zodSchemaParser.betterExperiment()
     
     
     
      /*
     */
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToParse3) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToParse3), null, 2)}]`
      );
      expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchemaInstance3)}`)
      expect(zodSchemaInstance3.parse(testTsObjectToParse3)).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToParse3).success).toBe(true);

      // const { data } = zodMatterParse(testMarkDown3, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      
    });

  });

  /**
   * 
   */
  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText5 : [${zodSchemaAsText5}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText5);

     const experimentResult: {noArgsFunctionCallsStack: string[]; topZodFunctionCallWithArgs: Node<ts.Node>[]; } = zodSchemaParser.betterExperiment()
     
      /*
     */
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.noArgsFunctionCallsStack :[${experimentResult.noArgsFunctionCallsStack}]`
      );
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.length :[${experimentResult.topZodFunctionCallWithArgs.length}]`
      );
      experimentResult.topZodFunctionCallWithArgs.forEach((node: Node<ts.Node>) => {
        console.log(
          ` >>>>>>> experimentResult.topZodFunctionCallWithArgs :[${node.print()}]`
        );
      })
     
     //expect(experimentResult.print() === `nullable`).toBe(true);
    });

  });

  /**
   * 
   */
  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText6 : [${zodSchemaAsText6}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText6);

     const experimentResult: {noArgsFunctionCallsStack: string[]; topZodFunctionCallWithArgs: Node<ts.Node>[]; } = zodSchemaParser.betterExperiment()
     
      /*
     */
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.noArgsFunctionCallsStack :[${experimentResult.noArgsFunctionCallsStack}]`
      );
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.length :[${experimentResult.topZodFunctionCallWithArgs.length}]`
      );
      experimentResult.topZodFunctionCallWithArgs.forEach((node: Node<ts.Node>) => {
        console.log(
          ` >>>>>>> experimentResult.topZodFunctionCallWithArgs :[${node.print()}]`
        );
      })
     
     //expect(experimentResult.print() === `nullable`).toBe(true);
    });

  });

  /**
   * 
   */
  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText7 : [${zodSchemaAsText7}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText7);

     const experimentResult: {noArgsFunctionCallsStack: string[]; topZodFunctionCallWithArgs: Node<ts.Node>[]; } = zodSchemaParser.betterExperiment()
     
      /*
     */
      console.log(
        ` >>>>>>> [zodSchemaAsText7] experimentResult.topZodFunctionCallWithArgs.noArgsFunctionCallsStack :[${experimentResult.noArgsFunctionCallsStack}]`
      );
      console.log(
        ` >>>>>>> [zodSchemaAsText7] experimentResult.topZodFunctionCallWithArgs.length :[${experimentResult.topZodFunctionCallWithArgs.length}]`
      );
      experimentResult.topZodFunctionCallWithArgs.forEach((node: Node<ts.Node>) => {
        console.log(
          ` >>>>>>> [zodSchemaAsText7] experimentResult.topZodFunctionCallWithArgs :[${node.print()}]`
        );
      })
     
     //expect(experimentResult.print() === `nullable`).toBe(true);
    });
  });

  /**
   * 
   */
  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText8 : [${zodSchemaAsText8}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText8);

     const experimentResult: {noArgsFunctionCallsStack: string[]; topZodFunctionCallWithArgs: Node<ts.Node>[]; } = zodSchemaParser.betterExperiment()
     
      /*
     */
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.noArgsFunctionCallsStack :[${experimentResult.noArgsFunctionCallsStack}]`
      );
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.length :[${experimentResult.topZodFunctionCallWithArgs.length}]`
      );
      experimentResult.topZodFunctionCallWithArgs.forEach((node: Node<ts.Node>) => {
        console.log(
          ` >>>>>>> experimentResult.topZodFunctionCallWithArgs :[${node.print()}]`
        );
      })
     //expect(experimentResult.print() === `nullable`).toBe(true);
    });
  });

  /**
   * 
   */
  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText9 : [${zodSchemaAsText9}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText9);

     const experimentResult: {noArgsFunctionCallsStack: string[]; topZodFunctionCallWithArgs: Node<ts.Node>[]; } = zodSchemaParser.betterExperiment()
     
    /**
     * 
     */
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.noArgsFunctionCallsStack :[${experimentResult.noArgsFunctionCallsStack}]`
      );
      console.log(
        ` >>>>>>> experimentResult.topZodFunctionCallWithArgs.length :[${experimentResult.topZodFunctionCallWithArgs.length}]`
      );
      experimentResult.topZodFunctionCallWithArgs.forEach((node: Node<ts.Node>) => {
        console.log(
          ` >>>>>>> experimentResult.topZodFunctionCallWithArgs :[${node.print()}]`
        );
      })
     //expect(experimentResult.print() === `nullable`).toBe(true);
    });
  });

  /**
   * 
   */
  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText2 : [${zodSchemaAsText2}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText2);

     const betterExperimentResult: {noArgsFunctionCallsStack: string[]; topZodFunctionCallWithArgs: Node<ts.Node>[]; } = zodSchemaParser.betterExperiment()
     
    /**
     * 
     */

      /*
      console.log(
        ` >>>>>>> betterExperimentResult.topZodFunctionCallWithArgs.noArgsFunctionCallsStack :[${betterExperimentResult.noArgsFunctionCallsStack}]`
      );
      console.log(
        ` >>>>>>> betterExperimentResult.topZodFunctionCallWithArgs.length :[${betterExperimentResult.topZodFunctionCallWithArgs.length}]`
      );
      betterExperimentResult.topZodFunctionCallWithArgs.forEach((node: Node<ts.Node>) => {
        console.log(
          ` >>>>>>> experimentResult.topZodFunctionCallWithArgs :[${node.print()}]`
        );
      })
      */
     //expect(experimentResult.print() === `nullable`).toBe(true);
    });
  });

  /**
   * 
   */
  describe("Test the experiment() method properly find the top function call in the zod schema", () => {
    it(`shall return the top function call `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText5 : [${zodSchemaAsText5}]`
     );
     const zodSchemaParser = new parser.ZodSchemaParser(zodSchemaAsText5);

     const betterExperimentResult: {noArgsFunctionCallsStack: string[]; topZodFunctionCallWithArgs: Node<ts.Node>[]; } = zodSchemaParser.betterExperiment()
     
    /**
     * 
     */
      /*
      console.log(
        ` >>>>>>> betterExperimentResult.topZodFunctionCallWithArgs.noArgsFunctionCallsStack :[${betterExperimentResult.noArgsFunctionCallsStack}]`
      );
      console.log(
        ` >>>>>>> betterExperimentResult.topZodFunctionCallWithArgs.length :[${betterExperimentResult.topZodFunctionCallWithArgs.length}]`
      );
      betterExperimentResult.topZodFunctionCallWithArgs.forEach((node: Node<ts.Node>) => {
        console.log(
          ` >>>>>>> experimentResult.topZodFunctionCallWithArgs :[${node.print()}]`
        );
      })
      */
     //expect(experimentResult.print() === `nullable`).toBe(true);
    });
  });

  


});

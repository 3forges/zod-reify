import { parse as zodMatterParse } from "zod-matter";
import { z } from "zod";
// import * as grayMatter from "gray-matter"; // pnpm add --save gray-matter

import * as reifier from "../../src/reify";

/**
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 *          Tests constants
 * ------------------------------------
 * ------------------------------------
 * ------------------------------------
 */
type ZodValidateTestCase<T> = {
  zodSchema: T;
  zodSchemaAsText: string;
  testTsObjectToValidate: any;
  expect: boolean;
  name: string;
};
type FrontMatterValidateTestCase<T> = {
  zodSchema: T;
  zodSchemaAsText: string;
  expectedFrontmatter: any;
  testMarkdown: any;
  name: string;
  zodMatterShouldThrow: boolean;
};
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
  name: `Test #1bis: zodSchema1`,
  expect: false,
  testTsObjectToValidate: null,
};
/*
const zodSchema1 = z
  .object({
    voila: z.string(),
  })
  .optional();

const zodSchemaAsText1 = `z
  .object({
    voila: z.string(),
  })
  .optional()`;

// const testTsObjectToValidate1 = null // fails the test
const testTsObjectToValidate1 = undefined
*/
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

/*
const zodSchema2 = z
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
const testTsObjectToValidate2 = [{
  voila: `ça marche`
},{
  voila: `vraiment super bien!`
}]

*/

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
/*
const zodSchema3 = z
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
# Hello Pesto ZodSchemaReifier!
`
const testTsObjectToValidate3 = [{
  voila: `ça marche`
},{
  voila: `super bien!`
}]
*/
const markdownTestCase3: FrontMatterValidateTestCase<typeof testCase3.zodSchema> = {
  zodSchema: testCase3.zodSchema,
  name: `Test #3: markdown frontmatter extraction zodSchema3`,
  zodSchemaAsText: testCase3.zodSchemaAsText,
  expectedFrontmatter:[
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
  zodMatterShouldThrow: false
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

const markDownTestCase4: FrontMatterValidateTestCase<typeof testCase4.zodSchema> = {
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
  zodMatterShouldThrow: false
};

/*

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
# Hello Pesto ZodSchemaReifier!
`

const testTsObjectToValidate4 = {
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

*/

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
const markDownTestCase5: FrontMatterValidateTestCase<typeof testCase5.zodSchema> = {
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
  zodMatterShouldThrow: false
};

/*
const zodSchema5 = z
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
# Hello Pesto ZodSchemaReifier!
`

const testTsObjectToValidate5 = {
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

*/

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
const markDownTestCase6: FrontMatterValidateTestCase<typeof testCase6.zodSchema> = {
  zodSchema: testCase6.zodSchema,
  name: `Test #6: markdown frontmatter extraction zodSchema6`,
  zodSchemaAsText: testCase6.zodSchemaAsText,
  expectedFrontmatter: testCase6.testTsObjectToValidate,
  testMarkdown: undefined,
  zodMatterShouldThrow: true // https://github.com/jonschlinkert/gray-matter/blob/ce67a86dba419381db0dd01cc84e2d30a1d1e6a5/lib/utils.js#L46
};
/*
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
const testTsObjectToValidate6 = [
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
*/
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

/*
const markDownTestCase7: FrontMatterValidateTestCase = {
  ...testCase7,
  testMarkdown: undefined
}
*/

/*
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
const testTsObjectToValidate7 = [
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

*/
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

/*
const markDownTestCase8: FrontMatterValidateTestCase = {
  ...testCase8,
  testMarkdown: undefined
}
*/

/*
const zodSchema8 = z.boolean().nullable().optional()
const zodSchemaAsText8 = `z.boolean().nullable().optional()`
const testTsObjectToValidate8 = false
*/

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
/*
const markDownTestCase9: FrontMatterValidateTestCase = {
  ...testCase9,
  testMarkdown: undefined
}
*/

/*
const zodSchema9 = z.array(z.boolean().nullish()).nullable().optional()
const zodSchemaAsText9 = `z.array(z.boolean().nullish()).nullable().optional()`
const testTsObjectToValidate9 = [
  true,
  false,
  true
]
*/

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

/*
const markDownTestCase10: FrontMatterValidateTestCase = {
  zodSchema: undefined,
  zodSchemaAsText: undefined,
  testTsObjectToValidate: undefined,
  testMarkdown: undefined
}
*/

/*

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

// const testTsObjectToValidate1 = null // fails the test
const testTsObjectToValidate10 = undefined
const testTsObjectToValidate10bis = null
const testTsObjectToValidate10ter = {
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

*/


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
const zodSchema12 = z.string().datetime({ offset: true });;

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
const zodSchema13 = z.string().datetime({ precision: 3 });;
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
const zodSchema15 = z.date().min(new Date("1900-01-01"), { message: "Too old" });
const testCase15: ZodValidateTestCase<typeof zodSchema15> = {
  zodSchema: zodSchema15,
  name: `Test #15: zodSchema15, a simple zod object  with one boolean property, the test assigns a boolean value to the property, using an unary operator (the "not" operator).`,
  zodSchemaAsText: `z.date().min(new Date("1900-01-01"), { message: "Too old" });`,
  testTsObjectToValidate: new Date("1901-01-01"),
  expect: true,
};

/**
 * ++++++++++++++++++++++++++++++++++++
 *          Test 16
 * ++++++++++++++++++++++++++++++++++++
 */
const zodSchema16 = z.date().max(new Date(), { message: "Too young!" });
const testCase16: ZodValidateTestCase<typeof zodSchema16> = {
  zodSchema: zodSchema16,
  name: `Test #16: zodSchema16, a simple zod object  with one boolean property, the test assigns a boolean value to the property, using an unary operator (the "not" operator).`,
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
  name: `Test #17: zodSchema17, a simple zod object  with one boolean property, the test assigns a boolean value to the property, using an unary operator (the "not" operator).`,
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
  typeof markdownTestCase3.zodSchema |
  typeof markDownTestCase4.zodSchema |
  typeof markDownTestCase5.zodSchema |
  typeof markDownTestCase6.zodSchema
type AnyTestCaseZodSchema =
  typeof testCase1.zodSchema
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

describe("Tests of the {@ZodSchemaReifier} reify() method against the zod parse method", () => {
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
    it.each<ZodValidateTestCase<AnyTestCaseZodSchema>>([
      testCase1,
      testCase1bis,
      testCase2,
      testCase3,
      testCase4,
      testCase5,
      testCase6,
      testCase7,
      testCase8,
      testCase9,
      testCase10,
      testCase10bis,
      testCase10ter,
      testCase11,
      testCase11bis,
      testCase11ter,
      testCase11quarte,
      testCase12,
      testCase12bis,
      testCase12ter,
      testCase12quarte,
      testCase13,
      testCase13bis,
      testCase13ter,
      testCase14,
      testCase14bis,
      testCase15,
      testCase16,
      testCase17,
    ])(`[%p] successfully pass the zod parse test`, (testCase) => {
      console.log(
        ` >>>>>>> TEST CASE [${testCase.name}] - testCase.zodSchemaAsText=[${testCase.zodSchemaAsText}]`
      );
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
        ` >>>>>>> reifiedZodSchema.safeParse(testCase.testTsObjectToValidate) is :[${JSON.stringify(
          reifiedZodSchema.safeParse(testCase.testTsObjectToValidate),
          null,
          2
        )}]`
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
    it.each<FrontMatterValidateTestCase<AnyFrontmatterTestCaseZodSchema>>([
      markdownTestCase3,
      markDownTestCase4,
      markDownTestCase5,
      // markDownTestCase6 // test case 6 gives a zod tuple but zod matter expects a zod object
    ])(`[%p] successfully pass the zod parse test [%p]`, (testCase) => {
      console.log(
        ` >>>>>>> TEST CASE [${testCase.name}] - testCase.zodSchemaAsText=[${testCase.zodSchemaAsText}]`
      );

    const zodSchemaParser = new reifier.ZodSchemaReifier(testCase.zodSchemaAsText);

    const reifiedZodSchema: any = zodSchemaParser.reify()
    
    
    

    console.log(
      ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
    );
     console.log(
       ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
     );
     console.log(
       ` >>>>>>> testCase.testMarkdown is :[${testCase.testMarkdown}]`
     );
     console.log(
       ` >>>>>>> testCase.expectedFrontmatter is :[${JSON.stringify(testCase.expectedFrontmatter, null, 2)}]`
     );
     // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema5)}`)
     expect(testCase.zodSchema.safeParse(testCase.expectedFrontmatter).success).toBe(true)
     expect(reifiedZodSchema.safeParse(testCase.expectedFrontmatter).success).toBe(true);
     if (!testCase.zodMatterShouldThrow) {
       const { data } = zodMatterParse(testCase.testMarkdown, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
       console.log(
         ` >>>>>>> zod-matter extracted fronmatter is :[${JSON.stringify(data, null, 2)}]`
       );
       console.log(
         ` >>>>>>> expected frontmatter is :[${JSON.stringify(testCase.expectedFrontmatter, null, 2)}]`
       );
       expect(data).toMatchObject(testCase.expectedFrontmatter);
     }

    });

    it.each<FrontMatterValidateTestCase<AnyFrontmatterTestCaseZodSchema>>([
      markDownTestCase6 // test case 6 gives a zod tuple but zod matter expects a zod object
    ])(`[%p] should throw an error because zod matter parse does not accept zod tuples as input schema`, (testCase) => {
      console.log(
        ` >>>>>>> TEST CASE [${testCase.name}] - testCase.zodSchemaAsText=[${testCase.zodSchemaAsText}]`
      );

    const zodSchemaParser = new reifier.ZodSchemaReifier(testCase.zodSchemaAsText);

    const reifiedZodSchema: any = zodSchemaParser.reify()
    
    
    

    console.log(
      ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
    );
    console.log(
      ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
    );
    console.log(
      ` >>>>>>> testCase.testMarkdown is :[${testCase.testMarkdown}]`
    );
     console.log(
       ` >>>>>>> testCase.expectedFrontmatter is :[${JSON.stringify(testCase.expectedFrontmatter, null, 2)}]`
     );
     // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema5)}`)
     expect(testCase.zodSchema.safeParse(testCase.expectedFrontmatter).success).toBe(true)
     expect(reifiedZodSchema.safeParse(testCase.expectedFrontmatter).success).toBe(true);


     if (testCase.zodMatterShouldThrow) {
      

      // expect(zodMatterParse(testCase.testMarkdown, reifiedZodSchema)).toThrow(Error)//.toThrow(/([a-z]|[A-Z])+/i)
      // expect(zodMatterParse(testCase.testMarkdown, reifiedZodSchema)).toThrow(typeof TypeError)
      expect(() => {
        zodMatterParse(testCase.testMarkdown, reifiedZodSchema)
      }).toThrow(Error)
      if (testCase.name == markDownTestCase6.name) {
        // https://github.com/jonschlinkert/gray-matter/blob/ce67a86dba419381db0dd01cc84e2d30a1d1e6a5/lib/utils.js#L46
        expect(() => {
          zodMatterParse(testCase.testMarkdown, reifiedZodSchema)
        }).toThrow(TypeError)
        expect(() => {
          zodMatterParse(testCase.testMarkdown, reifiedZodSchema)
        }).toThrow('expected input to be a string or buffer')
      }
      
     } else {

       const { data } = zodMatterParse(testCase.testMarkdown, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
       console.log(
         ` >>>>>>> zod-matter extracted fronmatter is :[${JSON.stringify(data, null, 2)}]`
       );
       console.log(
         ` >>>>>>> expected frontmatter is :[${JSON.stringify(testCase.expectedFrontmatter, null, 2)}]`
       );
       expect(data).toMatchObject(testCase.expectedFrontmatter);
     }

    });
  });
});

/*

describe("Testing - ZodSchemaReifier experiment() method", () => {
  afterAll(() => {
    //jest.restoreAllMocks();
    // nothing to do
  });

  describe("[zodSchemaAsText1] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText1 : [${zodSchemaAsText1}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText1);
     const reifiedZodSchema: typeof zodSchema1 = zodSchemaParser.reify()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate1) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate1), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToValidate1)}`)
      expect(zodSchema2.safeParse(testTsObjectToValidate1).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate1).success).toBe(true);

    });
  });

  describe("[zodSchemaAsText2] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText2 : [${zodSchemaAsText2}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText2);

     const reifiedZodSchema: typeof zodSchema2 = zodSchemaParser.reify()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate2) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate2), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToValidate2)}`)
      expect(zodSchema2.safeParse(testTsObjectToValidate2).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate2).success).toBe(true);

    });
  });

  describe("[zodSchemaAsText3] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText3 : [${zodSchemaAsText3}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText3);

     const reifiedZodSchema: typeof zodSchema3 = zodSchemaParser.reify()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate3) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate3), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema3)}`)
      expect(zodSchema3.safeParse(testTsObjectToValidate3).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate3).success).toBe(true);

    });

  });

  describe("[zodSchemaAsText4] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText4 : [${zodSchemaAsText4}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText4);

     const reifiedZodSchema: typeof zodSchema4 = zodSchemaParser.reify()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate4) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate4), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema4)}`)
      expect(zodSchema4.safeParse(testTsObjectToValidate4).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate4).success).toBe(true);
    });

  });

  describe("[zodSchemaAsText5] - Test the reify() method reifies a zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText5 : [${zodSchemaAsText5}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText5);

     const reifiedZodSchema: typeof zodSchema5 = zodSchemaParser.reify()
     
     
     

      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate5) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate5), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema5)}`)
      expect(zodSchema5.safeParse(testTsObjectToValidate5).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate5).success).toBe(true);

    });

  });


  describe("[zodSchemaAsText6] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText6 : [${zodSchemaAsText6}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText6);

     const reifiedZodSchema: typeof zodSchema6 = zodSchemaParser.reify()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate6) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate6), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema6)}`)
      expect(zodSchema6.safeParse(testTsObjectToValidate6).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate6).success).toBe(true);

    });

  });


  describe("[zodSchemaAsText7] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText7 : [${zodSchemaAsText7}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText7);
     const reifiedZodSchema: typeof zodSchema7 = zodSchemaParser.reify()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate7) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate7), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToValidate7)}`)
      expect(zodSchema7.safeParse(testTsObjectToValidate7).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate7).success).toBe(true);
    });
  });


  describe("[zodSchemaAsText8] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText8 : [${zodSchemaAsText8}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText8);

     const reifiedZodSchema: typeof zodSchema8 = zodSchemaParser.reify()
     
     
     
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate8) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate8), null, 2)}]`
      );
      //expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToValidate8)}`)
      expect(zodSchema8.safeParse(testTsObjectToValidate8).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate8).success).toBe(true);
    });
  });


  describe("[zodSchemaAsText9] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText9 : [${zodSchemaAsText9}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText9);

     const reifiedZodSchema: typeof zodSchema9 = zodSchemaParser.reify()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate9) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate9), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToValidate9)}`)
      expect(zodSchema9.safeParse(testTsObjectToValidate9).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate9).success).toBe(true);

      
    });
  });



  


  describe("[zodSchemaAsText10] - Test the reify() method properly find the top function call in the zod schema", () => {
    it(`[%p] successfully pass the zod parse test `, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText10 : [${zodSchemaAsText10}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText10);

     const reifiedZodSchema: typeof zodSchema10 = zodSchemaParser.reify()
     
     
     
      
      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate10) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate10ter), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof testTsObjectToValidate9)}`)
      expect(zodSchema10.safeParse(testTsObjectToValidate10ter).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate10ter).success).toBe(true)
      expect(zodSchema10.safeParse(testTsObjectToValidate10bis).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate10bis).success).toBe(true)
      expect(zodSchema10.safeParse(testTsObjectToValidate10).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate10).success).toBe(true)

      
    });
  });



});





























describe("Testing - ZodSchemaReifier with zod-matter", () => {
  afterAll(() => {
    //jest.restoreAllMocks();
    // nothing to do
  });

  describe("[zodSchemaAsText5] - Test that the reify() method reifies a zod schema", () => {
    it(`which successfully extracts frontmatter from markdown using zod-matter`, async () => {
     console.log(
         ` >>>>>>> zodSchemaAsText5 : [${zodSchemaAsText5}]`
     );
     const zodSchemaParser = new reifier.ZodSchemaReifier(zodSchemaAsText5);

     const reifiedZodSchema: typeof zodSchema5 = zodSchemaParser.reify()
     
     
     

      console.log(
        ` >>>>>>> reifiedZodSchema :[${reifiedZodSchema}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema's type is :[${(typeof reifiedZodSchema)}]`
      );
      console.log(
        ` >>>>>>> reifiedZodSchema.safeParse(testTsObjectToValidate5) is :[${JSON.stringify(reifiedZodSchema.safeParse(testTsObjectToValidate5), null, 2)}]`
      );
      // expect(`${(typeof reifiedZodSchema)}`).toEqual(`${(typeof zodSchema5)}`)
      expect(zodSchema5.safeParse(testTsObjectToValidate5).success).toBe(true)
      expect(reifiedZodSchema.safeParse(testTsObjectToValidate5).success).toBe(true);


      const { data } = zodMatterParse(testMarkDown5, reifiedZodSchema) // zod-matter expects a zod schema of type "AnyZodObject", but this test case is not  it's a // ZodNullable etc..
      console.log(
        ` >>>>>>> zod-matter extracted fronmatter is :[${JSON.stringify(data, null, 2)}]`
      );
      console.log(
        ` >>>>>>> testTsObjectToValidate5 is :[${JSON.stringify(testTsObjectToValidate5, null, 2)}]`
      );
      expect(data).toMatchObject(testTsObjectToValidate5);

      
    });

  });

});

*/

# ts-morph, TS Compiler API, and tree algorithms

Here I am analyzing which tree algorithms are aavilable in the ts-morph / TS Compiler APIs, to traverse a TypeScript language piece of source code.

In particular, what i am interested in, is to determine what algorithm I can use, to instantiate a zod schema, from a text which happens to be TypeScript Source code, of the following form:

```TypeScript
import { z } from "zod";

let doesntMatter = z.object({
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

```

The goal of my algorithm, is to instantiate the `doesntMatter` object, just out of reading as text, the above source code.

## For each descendant

So there is a very well known object method in the ts-morph API, called `forEachDescendant`, which you can typically use over a `Node`.

### First exeriment

Using basic ts-morph, I accessed the above displayed `exampleCategory` JSON object property. That property is a node, And I called the `forEachDescendant` method over that node, to traverse all of its "_descendants_", as the ts-morph/TS Compiler API calls them. I ended up with the below output:

```bash
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.array(z.array(z.string().nullable())).optional()]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.array(z.array(z.string().nullable())).optional]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.array(z.array(z.string().nullable()))]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.array]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [array]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.array(z.string().nullable())]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.array]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [array]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.string().nullable()]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.string().nullable]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.string()]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z.string]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [z]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [string]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [nullable]
[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [optional]
```

So, in the listed descendants, if we ignore the `exampleCategory` descendant node, the above output matches this piece of TypeScript source code:

```TypeScript
z.array(z.array(z.string().nullable())).optional()
```

I then built the tree of zod function calls, and the path that the `forEachDescendant` method walks, to list all the descendants, that's how it looks:

![forEachDescendant tree walk](./../images/tree.algorithms/tree.of.zod.functions.calls.example1.without_empty.path.PNG)

There we now clearly see what kind of tree wlking algotrithm the `forEachDescendant` method uses: it's going to the leave of each branch of the tree, then goes back up to the closest branching, then down to the end of the branch,e tc...

In other words, its a Depth first-search (DFS) In-order traversal.

Now we know who we deal with, and we have a more accurate question:

Is it possible to instantiate a zod schema object, using a Depth first-search (DFS) In-order traversal algorithm?

How would I do that?


## References

* About tree traversal algorithms: https://builtin.com/software-engineering-perspectives/tree-traversal
* https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-10-depth-first-search/
* https://www.cs.cornell.edu/courses/cs2110/2017sp/online/dfs/dfs01.html
* https://web.stanford.edu/class/archive/cs/cs106x/cs106x.1192/lectures/Lecture22/Lecture22.pdf
* https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4402567
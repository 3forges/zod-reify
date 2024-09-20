# The Zod Parser

## The algorithm

* A function able to reify 

```TypeScript
export class ZodSchemaReifier {

/**
 * 
 * ZodExpression
 * 
 */
  private reify
}
```

## Zod Support

The package will soon and easily support all of the [`zod`](https://zod.dev) Functions, but:
* The `infer` TypeScript operator won't be supported.
* There must not be external dependencies except the zod library, in the zod expression provided as string to the constructor.
* zodify, zod-reify

```TypeScript

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
 * Below all methods support for AnyZodObject
 * meaning for schema of the 
 * 
 * z.object({
 *   //...
 * })
 * 
 * form.
 * 
 * https://zod.dev/?id=objects
 * 
 * the non supported methods are not supported because
 * they do take 
 */

// Not supported:
zodSchemaInstance5.extend
zodSchemaInstance5.merge
zodSchemaInstance5.pick
zodSchemaInstance5.omit
zodSchemaInstance5.partial
zodSchemaInstance5.deepPartial
zodSchemaInstance5.catch
zodSchemaInstance5.catchall

// Supported:
zodSchemaInstance5.required
zodSchemaInstance5.passthrough
zodSchemaInstance5.strict
zodSchemaInstance5.strip

/**
 * Below all methods support for general zod schemas
 * meaning any zod schema no matter how it was generated
 * https://zod.dev/?id=schema-methods
 */

.parse
.parseAsync
.safeParse
.safeParseAsync
.refine
.superRefine
.transform
.brand
.pipe
// instead of [or] & [and] schema function, use intersection and union
.or
.and

// support for default and catch method also is prohibited
.catch
// yet, the lack of support for the
// default function is problematic in
// the context of astro projects...: So definitely, I 
// will have, to generalize where
// multiple function calls with
// args are present in a chain.
// 
.default

/**
 * 
 */
.describe
.optional
.nullable
.nullish
.array
.promise
.readonly

/**
 * Below all methods support for zod schemas
 * generated with the array function
 * https://zod.dev/?id=arrays
 * (all supported)
 */
zodSchemaInstance5.array().min
zodSchemaInstance5.array().max
zodSchemaInstance5.array().length
zodSchemaInstance5.array().nonempty
/**
 * Below all methods support for zod schemas
 * generated with the tuple function
 * https://zod.dev/?id=tuples
 * (all supported)
 */
.rest


```

## References

* About the `infer` `TypeSript` operator.
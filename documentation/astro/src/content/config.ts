import { z, defineCollection } from 'astro:content'
import { jsonToZod } from "json-to-zod"
import typedocData from './api-docs/data.json'; // This import style requires "esModuleInterop", see "side notes"
import { schema as apiDocsZodSchema } from '../schemas/api-docs.zod'
/*
const typedocZodSchema = jsonToZod(typedocData)

console.log(`typedocZodSchema: `, `export ${typedocZodSchema}`)
*/
// 2. Define a `type` and `schema` for each collection
const apiDocsMdCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

const apiDocsCollection = defineCollection({
  type: 'data', // v2.5.0 and later
  schema: apiDocsZodSchema,
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'api-docs': apiDocsCollection,
  'api-docs-md': apiDocsMdCollection,
};
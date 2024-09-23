![Pesto](./documentation/images/pesto-icons/32x32.png)
--

![npm bundle size](https://img.shields.io/bundlephobia/min/%403forges%2Fzod-reify?style=for-the-badge&logoColor=%23dc34eb&label=bundle%20size&labelColor=%2334eb3d&color=%23dc34eb)

![CircleCI (branch)](https://img.shields.io/circleci/build/github/3forges/zod-reify/feature%252Finit-src%252Fn%252Fci?style=for-the-badge&labelColor=%2334ebd3&color=%23eb34eb)

# Zod Reify

The `zod-reify` npm package contains `zod` related utilities that the pesto app uses.

One of the most important, is the `ZodSchemaReifier`, which is able to read some source code provided as a simple string, and to instantiate a zod schema.

* left TODO before a first release:

I have now the generalized algorithm: 
* [ ] we need to add more test cases to fully cover all zod functions support. 
* [ ] We also need to update docs and README. We also need to change the git repository.
* [x] We also need to complete method renaming. 
* [ ] We also need to replace any `console.log` with winston logging silenced by default.
* [ ] setup the cloudflare pages to publish the documentation astro website

Finally adding some speed automated tests with https://github.com/tinylibs/tinybench

Jest Tests reporting:
* [x] so i will use the Junit reporter: 
* [x] and convert it to JSON, to be used by astro, with: https://github.com/Kesin11/ts-junit2json
* [ ] a good layout for the tests report page.

## How to Use

* first, install the package:

```bash
npm i @pesto-io/zod-reify
# pnpm add @pesto-io/zod-reify
```

* Then, in your code, you can:

```TypeScript
import { ZodSchemaReifier } from "@pesto-io/zod-reify"


```

## Contribute

Git clone the source, and:

* Install dependencies:

```bash
pnpm i
```

### Generate the docs

```bash
pnpm run gen:api-docs
```

#### The Astro docs (WIP)

```bash
pnpm run build:docs:astro
# pnpm run dev:docs:astro

```
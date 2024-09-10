![Pesto](https://raw.githubusercontent.com/3forges/pesto-zod/feature/init-src/n/ci/documentation/images/pesto-icons/32x32.png)
--

![npm bundle size](https://img.shields.io/bundlephobia/min/%403forges%2Fpesto-zod?style=for-the-badge&logoColor=%23dc34eb&label=bundle%20size&labelColor=%2334eb3d&color=%23dc34eb)

![CircleCI (branch)](https://img.shields.io/circleci/build/github/3forges/pesto-zod/feature%252Finit-src%252Fn%252Fci?style=for-the-badge&labelColor=%2334ebd3&color=%23eb34eb)

# Pesto Zod

The `pesto-zod` npm package contains `zod` related utilities that the pesto app uses.

One of the most important, is the `ZodSchemaParser`, which is able to read some source code providd as a simple string, and to instantiate a zod schema.

## How to Use

* first, install the package:

```bash
npm i @pesto-io/pesto-zod
# pnpm add @pesto-io/pesto-zod
```

* Then, in your code, you can:

```TypeScript
import { ZodSchemaParser } from "@pesto-io/pesto-zod"


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
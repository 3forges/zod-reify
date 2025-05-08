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

Finally adding some speed automated tests with <https://github.com/tinylibs/tinybench>

Jest Tests reporting:

* [x] so i will use the Junit reporter:
* [x] and convert it to JSON, to be used by astro, with: <https://github.com/Kesin11/ts-junit2json>
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

### Running the Tests

`Jest` is the framework used to run automatic, non regression, unit testing.

* To run all `jest` tests, run:

```bash
pnpm test
```

Inside the `./tests/reify/ZodSchemaReifier.test.ts` Test Suite file, the tests are designed like this:
* You will find a number of `TestCase` Objects
* The Jest Tests run an `each` loop over arrays of `TestCase` Objects
* All The `TestCase` Objects implement either of:
  * `ZodValidateTestCase<T>`: the Test cases implementing that interface are all meant to test running the `zod` `safeParse` method, using a zod schema reified using the `reify` method, defined in the `ZodSchemaReifier` class, which source code is in `./src/reify/ZodSchemaReifier.ts`.
  * `FrontMatterValidateTestCase<T>`: the Test cases implementing that interface are all meant to test running the `zod` `safeParse` method, using a zod schema reified using the `reify` method, defined in the `ZodSchemaReifier` class, which source code is in `./src/reify/ZodSchemaReifier.ts`, over frontmatter data parsed by the [`zod-matter`](https://github.com/HiDeoo/zod-matter) [`parse` method](https://github.com/HiDeoo/zod-matter?tab=readme-ov-file#parse), over a test markdown.
  * both of the `ZodValidateTestCase<T>` and `FrontMatterValidateTestCase<T>` interfaces have a `name` property

* To run a single test case (important to debug your code), you can simply use the value of the `name` (coming from either of `ZodValidateTestCase<T>` or `FrontMatterValidateTestCase<T>` interfaces), like this:

```bash

# --
# below will run only the 
# 'const testCase1bis: ZodValidateTestCase', cf. The './tests/reify/ZodSchemaReifier.test.ts' Test Suite file.

pnpm test -- -t 'Test #1bis: zodSchema1 should fail with null'

# --
# below will run only the 
# 'const testCase2: ZodValidateTestCase', cf. The './tests/reify/ZodSchemaReifier.test.ts' Test Suite file.
pnpm test -- -t 'Test #2: zodSchema2'


# --
# below will run only the 
# 'const markDownTestCase4: FrontMatterValidateTestCase', cf. The './tests/reify/ZodSchemaReifier.test.ts' Test Suite file.
pnpm test -- -t 'Test #4: markdown frontmatter extraction zodSchema4'

```

Worth noting, other test run options:

```bash
# [pnpm test -- -i <your-test-file> -c <jest-config> -t "<test-block-name>"]
# --- 
# [pnpm test -- -c ./jest.config.ts]
# [pnpm test -- -c ./jest.config.ts -t 'Test #1bis: zodSchema1 should fail with null']

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

## ANNEX: The next Evolution

### Evaluate typescript from string

* <https://stackoverflow.com/questions/45153848/evaluate-typescript-from-string>

```Ts
import * as ts from "typescript";

let code: string = `({
    Run: (data: string): string => {
        console.log(data); return Promise.resolve("SUCCESS"); }
    })`;

let result = ts.transpile(code);
let runnable :any = eval(result);
runnable.Run("RUN!").then((result:string)=>{console.log(result);});
```

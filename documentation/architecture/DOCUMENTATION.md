# Architecture

## The docs architecture

### How it was setup from scratch

* We started with just the bare source code of the package:

```bash
# ---
#  We added the `typedoc` package :
pnpm add -D typedoc typedoc-plugin-markdown@next typedoc-plugin-frontmatter@next
pnpm remove typedoc-plugin-markdown@next typedoc-plugin-frontmatter@next

pnpm add -D @sisense/typedoc-plugin-markdown

pnpm remove @sisense/typedoc-plugin-markdown

pnpm add -D typedoc-plugin-markdown@next typedoc-plugin-frontmatter@next

# ---
# I don't use a [./typedoc.json] because I
# want to keep all options to generate the
# typedoc generated docs: 
#   > the default,
#   > the json format,
#   > and for using plugins i'll use the [--plugin] 
#     option
# ---
# cat <<EOF >typedoc.json
# {
#   "plugin": ["typedoc-plugin-markdown", "typedoc-plugin-frontmatter"]
# }
# EOF

rm -fr ./documentation/astro/ | true
mkdir -p documentation/astro/

# pnpm create astro@latest --typescript strict --no-install --no-git --template themesberg/flowbite-astro-admin-dashboard ./documentation/astro/

# -- not easy to find an astro theme which is using almost latest version of astro, and that works (the build for the one below fails)
# pnpm create astro@latest --typescript strict --no-install --no-git --template mearashadowfax/ScrewFast ./documentation/astro/


pnpm create astro@latest -- --typescript strict --no-install --no-git --template framework-preact ./documentation/astro/

cd ./documentation/astro/

pnpm dlx @astrojs/upgrade

# pnpm dlx astro add tailwind

pnpm add -D @astrojs/tailwind tailwindcss @preact/compat react@npm:@preact/compat react-dom@npm:@preact/compat @astrojs/sitemap astro-robots-txt react-icons flowbite

# ---
#  Then I followed a few config steps for
#  flowbite (not flowbite-react which I didn't like):
#  https://flowbite.com/docs/getting-started/astro/ 

cat <<EOF >./astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
// https://astro.build/config
export default defineConfig({
	// Enable Preact to support Preact JSX components.
	integrations: [preact({
		compat: true
	  }),
	  tailwind({
		// Example: Allow writing nested CSS declarations
		// alongside Tailwind's syntax
		nesting: true, // that's useful for postcss
		// applyBaseStyles: false,
	  }),
	  sitemap(),
	  robotsTxt()
	],
});
EOF

cat <<EOF >./tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js'
	],
	theme: {
		extend: {},
	},
	plugins: [
		require('flowbite/plugin')
	],
}
EOF
cat <<EOF >./src/content/config.ts
import { z, defineCollection } from 'astro:content'

// 2. Define a `type` and `schema` for each collection
const apiDocsCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'api-docs': apiDocsCollection,
};
EOF

# - # - # - # - # - # - # - # - # - # - # - # - # - 
# - And I wrote a few components and a layout
# - # - # - # - # - # - # - # - # - # - # - # - # - 
# pnpm i && pnpm run dev

mkdir -p documentation/astro/src/content/api-docs/
# touch documentation/astro/src/content/api-docs/.keep

# ---
#  Then we could generate the default 
#  typedoc documentation like so:
pnpm exec typedoc ./src/index.ts --out ./docs/  --tsconfig ./tsconfig.json
# ---
#  Then we could generate the json 
#  typedoc documentation like so:
pnpm exec typedoc ./src/index.ts --out documentation/astro/src/content/api-docs/  --tsconfig ./tsconfig.json --json documentation/astro/src/content/api-docs/data.json
# ---
#  Then we could generate the markdown 
#  typedoc documentation like so:
pnpm exec typedoc ./src/index.ts --out documentation/astro/src/content/api-docs/  --tsconfig ./tsconfig.json --plugin typedoc-plugin-markdown --plugin typedoc-plugin-frontmatter
```

* we added pnpm scripts:

```JSon
{
  "scripts": {
    "clean:api-docs": "chmod +x ./.npm.scripts/docs/clean.sh && bash ./.npm.scripts/docs/clean.sh",
    "gen:api-docs:html": "pnpm run clean:api-docs && pnpm exec typedoc ./src/index.ts --out ./docs/  --tsconfig ./tsconfig.json",
    "gen:api-docs:json": "pnpm run clean:api-docs && pnpm exec typedoc ./src/index.ts --out documentation/astro/src/content/api-docs/  --tsconfig ./tsconfig.json --json documentation/astro/src/content/api-docs/data.json",
    "gen:api-docs:md": "pnpm run clean:api-docs && pnpm exec typedoc ./src/index.ts --out documentation/astro/src/content/api-docs/  --tsconfig ./tsconfig.json --plugin typedoc-plugin-markdown --plugin typedoc-plugin-frontmatter",
    "build:docs": "pnpm run gen:api-docs && cd documentation/astro/ && pnpm run build",
    "dev:docs": "pnpm run gen:api-docs && cd documentation/astro/ && pnpm run dev",
    "start:docs": "cd documentation/astro/ && pnpm start"
  }
}
```

TO BE  CONTINUED:

The best option I have for now, is that my `astro` website generates its pages from the `documentation/astro/src/content/api-docs/data.json` file.

That, because `typedoc-markdown-plugin` generates subfolders in the `documentation/astro/src/content/api-docs/` folder, which `astro` does not support:
* There I know that If I want to [add an `astro` package in the `typedoc-markdown-plugin`](https://github.com/3forges/pesto-zod/issues/8)
* then i will need to somehow change only the generated directory structure, so that all generated markdown files are directly contained in adirect subfolder of the `documentation/astro/src/content/`: this mean I will probably have to dynamically edit the `src/content/config.ts` file.

That is why for the moment, I will stick to generating the default typedoc statis website.

## Custom TypeDoc Theme

I gave a try to https://carlosroso.com/how-to-customize-a-typedoc-theme/ which turned out to be outdated:

```bash

# ---
# To get access to the default theme assets, we
# have to install it as a separate npm package:
pnpm add -D typedoc-default-themes

ls -alh node_modules/typedoc-default-themes/bin/default/assets/ || true
# drwxr-xr-x 1 Utilisateur 197121 0 Apr  1 00:33 ./
# drwxr-xr-x 1 Utilisateur 197121 0 Apr  1 00:33 ../
# drwxr-xr-x 1 Utilisateur 197121 0 Apr  1 00:33 css/
# drwxr-xr-x 1 Utilisateur 197121 0 Apr  1 00:33 images/
# drwxr-xr-x 1 Utilisateur 197121 0 Apr  1 00:33 js/

export TYPEDOC_THEME_HOME=./documentation/typedoc/custom-theme

mkdir -p ${TYPEDOC_THEME_HOME}/assets/css
mkdir -p ${TYPEDOC_THEME_HOME}/assets/images

cp node_modules/typedoc-default-themes/bin/default/assets/css/* ${TYPEDOC_THEME_HOME}/assets/css/
cp node_modules/typedoc-default-themes/bin/default/assets/images/* ${TYPEDOC_THEME_HOME}/assets/images/

# ---
#  Yeah... Not so interesting actually...

```

According the documentation I quickly read, its a bit too complex for little resutl, to customize the default typedoc theme:

* Customizing the Typedoc defaults:
  * <https://carlosroso.com/how-to-customize-a-typedoc-theme/>
  * https://typedoc.org/guides/themes/
  * https://github.com/TypeStrong/typedoc/blob/master/internal-docs/custom-themes.md
## References

* <https://flowbite.com/docs/getting-started/astro/>
* <https://docs.astro.build/en/getting-started/>
* <https://github.com/3forges/pesto-api/issues/9>
* <https://github.com/3forges/pesto-zod/issues/8>
* Customizing the Typedoc defaults:
  * <https://carlosroso.com/how-to-customize-a-typedoc-theme/>
  * https://typedoc.org/guides/themes/
  * https://github.com/TypeStrong/typedoc/blob/master/internal-docs/custom-themes.md
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

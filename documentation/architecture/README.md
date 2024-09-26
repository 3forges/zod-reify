## Package structure

Pretty much like a setup for a non-library project, but with one important addition: You need to add the `"declaration": true` flag. This will generate the `.d.ts` files (aka declaration files) which contain the types of your code. This way, if someone is using your library and they also use `TypeScript`, they get the benefits of typesafety and autocomplete!

Regarding the other options, let's quickly go through those: The module compiler option `"module": "commonjs"` is required if you want your code to run seamlessly with most current `node.js` applications. Replace this with `"module": "esnext"` if you're building a library for the browser. `"target": "es2015"` specifies which version of JavaScript your code will get transpiled to. This needs to be aligned with the oldest version of `node.js` (or the oldest browser) you want to support. Choosing `es2019` as the compile target makes your library compatible with `node.js` version 12 and upwards. In 2023, this is a good compromise of transpiling to a modern-ish javascript version (which in turn allows for better performance, more terse code, etc.) and still supporting older nodejs and browser versions. If you have a specific reason to go higher (more cutting-edge native JS features needed in the generated files) or lower (stronger backwards compatibility), you may of course change the version. Lastly, `"outDir": "./dist"` will write your compiled files into the dist folder and the include option specifies where your source code lives.

There's also one all-important flag in this `package.json`: You have to declare where to find the type declarations! This is done using `"types": "dist/index.d.ts"` Otherwise the consumer won't find your module!

The final property `files` helps you to whitelist the files you want to ship to the npm registry. This is usually a much easier and safer route than using the `.npmignore` file!

<!--
```bash

```
-->

## ANNEX: References

* <https://www.tsmean.com/articles/how-to-write-a-typescript-library/>
* locally test consuming the library: https://www.tsmean.com/articles/how-to-write-a-typescript-library/local-consumer/


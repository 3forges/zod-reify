
import {
    // Identifier,
    // ImportDeclaration,
    // ImportSpecifier,
    Node,
    Project,
    StructureKind,
    TypeChecker,
    // VariableDeclaration,
    type VariableDeclarationStructure,
    type ImportDeclarationStructure,
    SourceFile as tsMorphSourceFile,
    type OptionalKind,
    DiagnosticCategory,
    // SyntaxKind,
    ObjectLiteralExpression,
    ArrayLiteralExpression,
    FunctionExpression,
    ForEachDescendantTraversalControl,
    ts,
    Structure,
    CallSignatureDeclarationStructure,
    PropertyAccessExpression,
    // CallExpression,
    // ts,
    // type ObjectLiteralElementLike,
    // type ObjectLiteralExpressionPropertyStructures,
  } from "ts-morph";
  //import * as ts from 'typescript'
  // https://www.npmjs.com/package/uuid
  // import { v4 as uuidv4 } from 'uuid';
  import { v4 as uuidv4 } from "uuid"; // pnpm add --save uuid @types/uuid
  import { z, type AnyZodObject } from "zod";
  
  
  /**
   * The {@ZodSchemaParser } class will parse a string assumed to be a zod schema source code, and will instantiate the Zod Schema.
   */
  export class ZodSchemaParser {
  
    /**
     * The unique ID of
     * this {@ZodSchemaParser } instance.
     *
     * This uuid is used to generate a unique
     * name for the sourceFile
     *
     */
    private unique_id: string;
    /**
     * The ts-morph API Project instance which
     * will used to compile/parse the typescript code which is a zodSchema
     */
    private project: Project;
    // const tsConfigRootdir = `./src`;
    private tsConfigRootdir: string;
    /**
     * The filename of the file in which the source
     * code to process will be saved to.
     */
    private filename: string;
    /**
     * The source file obeject used by the TS compiler API
     */
    private sourceFile: tsMorphSourceFile;
    /**
     * Represents a variable Declaration Statement
     * which is assigned as value, a zodSchema.
     *
     * E.g.:
     *
     * const doesntMatter = z.object({
     *   title: z.string(),
     *   tags: z.array(z.string()),
     *   image: z.string().optional(),
     * })
     */
    /**
     * The ts-morph / TypeScript Compiler API 
     * Variable Declaration of the Zod Schema, in the 
     * built ts-morph Project
     * 
     * Represents a variable Declaration Statement
     * which is assigned as value, a zodSchema.
     * 
     * E.g.:
     * 
     * <code>
     * import { z } from "zod";
     * 
     * ////
     * // Below that's the variable declaration represented:
     * ////
     * const weDontCare = z.object({
     *   // ...
     * })
     * </code>
     */
    private zodSchemaVarDeclaration: OptionalKind<VariableDeclarationStructure>;
  
    /**
     * The ts-morph / TypeScript Compiler API type checker
     */
    private typeChecker: TypeChecker; //ts.TypeChecker;
    /**
     * Represents the full statement importing zod:
     * 
     * <code>
     * // the zodImport is the full below line.
     * import { z } from "zod";
     * </code>
     * 
     * The {@ZodSchemaParser } will always use 
     * 'import { z } from "zod";' as the zod import,
     * since it is not provided by the user of the {@ZodSchemaParser } class.
     * 
     * Why? because we don't care what is
     * the zod import, as long as the zod is imported, we
     * care about instiating the Zod Schema.
     * 
     */
    private zodImport: ImportDeclarationStructure;
    /**
     * The name of the zod import.
     * 
     * E.g.:
     * 
     * <code>
     * // the name of the zod import is 'z'
     * import { z } from "zod";
     * </code>
     * 
     * <code>
     * // the name of the zod import is 'myZod'
     * import { z as myZod } from "zod";
     * </code>
     * 
     * The {@ZodSchemaParser } will always use 'z' as
     * the name of the zod import, since it is not
     * provided by the user of the {@ZodSchemaParser } class.
     * 
     * Why? because we don't care what is
     * the name of the zod import, we 
     * care about instiating the Zod Schema.
     * 
     */
    private nameOfTheZodImport: string;
    /**
     * This property represents 
     * This property is initialized by 
     * the {@ZodSchemaParser [initZodObjectLiteral(): void]}
     * method.
     */
    private zodObjectLiteral!: ObjectLiteralExpression;
      
    /**
     * 
     * Example values of <pre>zodSchemaAsString</pre> :
     * ---
     * 
     * Example 1:
     * ----------
     * 
     * <code>
     * z.object({
     *   title: z.string(),
     *   subtitle: z.string(),
     *   summary: z.string(),
     *   category: z.array(z.string()),
     *   image: z.string(),
     *   tags: z.array(z.string()),
     * })
     * </code>
     * 
     * Example 2:
     * ----------
     * 
     * <code>
     * z.object({
     *   title: z.string(),
     *   hereAnother: z.object({
     *     reseau: z.object({
     *       cesar: z.array(z.string()),
     *     }),
     *     imLackingIdea: z.boolean().optional(),
     *     itsForATest: z.boolean(),
     *   }),
     *   tags: z.array(z.string( )  ),
     *   another: z.boolean().nullish(),
     *   exampleCategory: z.array(z.array(z.string().nullable())).optional(),
     *   example2Category: z.nullable(z.array(z.boolean())).optional(),
     *   example3Category: z.optional(z.number()).array(),
     *   example4Category: z.array(z.number()).optional(),
     *   image: z.string().optional(),
     *   somethingElseNested: z.object({
     *     firstname: z.string().array(),
     *     lastname: z.string(),
     *     color: z.string(),
     *     two: z.boolean().optional(),
     *     three: z.number().array().optional(),
     *     four: z.array(z.number()).optional(),
     *   }),
     *   department: z.object({
     *     divisionName: z.string(),
     *     secrecyTags: z.array(z.string()).optional(),
     *   }),
     * })
     * </code>
     *
     * @param zodSchemaAsString the text of the zod schema, without any variable declaration, just the zod schema alone. see above example.
     * @param p_tsConfigRootdir the path to the folder used to set the <pre>rootDir</pre> TypeScript compiler configuration property value. (typically found in any <pre>tsconfig.json</pre> file)
     */
    constructor(protected zodSchemaAsString: string, p_tsConfigRootdir?: string) {
      this.tsConfigRootdir = p_tsConfigRootdir || `./src`;
      this.unique_id = uuidv4();
      this.filename = `${this.tsConfigRootdir}/zodSchemaParser.sourcefile.${this.unique_id}.ts`;
      this.project = new Project({
        tsConfigFilePath: "tsconfig.json", //"path/to/tsconfig.json",
        // skipFileDependencyResolution: true,
        skipAddingFilesFromTsConfig: true,
      });
      this.sourceFile = this.project.createSourceFile(this.filename, ``);
      console.info(
        `[@ZodSchemaParser].[constructor] zod schema provided to constructor:`,
        zodSchemaAsString
      );
      this.zodSchemaVarDeclaration = {
        name: `doesntMatter`,
        initializer: zodSchemaAsString.replace(/\s|\\n?/g, ""),
        // kind: StructureKind.VariableDeclaration, //StructureKind.VariableDeclaration,
        // hasExclamationToken: false,
        // type: `AnyZodObject`,
        // leadingTrivia: `/* Pesto beginning of declaration of variable*/`,
        // trailingTrivia: `/* Pesto end of declaration of variable*/`
      };
      this.nameOfTheZodImport = `z`;
      this.zodImport = {
        namedImports: [`${this.nameOfTheZodImport}`],
        moduleSpecifier: "zod",
        kind: StructureKind.ImportDeclaration,
      };
      this.sourceFile.addImportDeclaration(this.zodImport);
      this.sourceFile.addVariableStatement({
        declarations: [
          this.zodSchemaVarDeclaration,
          /*
          {
            name: this.zodSchemaVarDeclaration.name,
            initializer: this.zodSchemaVarDeclaration.initializer,
          },
          */
        ],
      });
  
      // this.sourceFile.save();
      this.validate();
      this.typeChecker = this.project.getTypeChecker();

      this.initZodExpressionNode()
      console.info(
        `[@ZodSchemaParser].[constructor] After [this.initZodExpressionNode()], [this.zodExpressionNode] is :`,
        this.zodExpressionNode.print()
      );
    }
    /**
     * Represents the zod instance in the source file:
     * 
     * Eg. if in the source file, we have:
     * 
     * <code>
     * import z form 'zod';
     * 
     * const weDontCare = z.array(z.string()).optional();
     * </code>
     * 
     * then, <pre>this.zodExpressionNode</pre> represents
     * the object returned by <pre>z.array(z.string()).optional()</pre>
     */
    private zodExpressionNode!: Node<ts.Node>;

    private initZodExpressionNode(): void {
      const zodSchemaVarDeclaration =
        this.sourceFile.getVariableDeclarationOrThrow(
          this.zodSchemaVarDeclaration.name
        );
        zodSchemaVarDeclaration.forEachDescendant((node: Node, traversal: ForEachDescendantTraversalControl) => {
          // traversal.skip()
          // traversal.up()
          // traversal.stop()
          console.log(
            `[@ZodSchemaParser].[initZodExpressionNode()] - WALKING DESCENDANTS OF VAR DECLARATION, current node = [${node.print()}]`
          );
          if (node.print() != this.zodSchemaVarDeclaration.name) {
            // const isYieldExpression = Node.isYieldExpression(node)
            //const isLiteralExpression = Node.isLiteralExpression(node)
            //const isExpressionStatement = Node.isExpressionStatement(node)
            // console.log(
            //   `[@ZodSchemaParser].[initZodExpressionNode()] - zodSchemaVarDeclaration.forEachDescendant() -----------------------------------------`
            // );
            this.zodExpressionNode = node
            traversal.stop()
          }
        });
    }
    /**
     * Okay, now here I can call the reccurrence : 
     * - step 1./ I call a function which will instantiate/reify the {toReturn.topZodFunctionCallWithArgs} function call.
     * - step 2./ and on the object rturned by the above function call:
     *   - I loop over each of the [toReturn.noArgsFunctionCallsStack] functions,
     *   - to call all of the function
     * 
     * - About [step 1./]: this is where I will distinguish 3 cases : 
     *   + [[CASE 1]]: the called zod function is the {z.object} function
     *   + [[CASE 2]]: the called zod function is the {z.tuple} function 
     *   + [[CASE 3]]: the called zod function is any other zod function,
     * 
     * 
     * By the way, there is one important thing to consider:
     * there might just as well be absolutelyno zodfunction call with args:
     * 
     * z.array().number().optional();
     * 
     * And in that case the {@toReturn.topZodFunctionCallWithArgs } array is an empty, zero-length array []
     * 
     */
    public reifyZodFunctionCallWithArgs(calledFunction: PropertyAccessExpression/*Node<ts.Node>*/, providedArgs: Node<ts.Node>): any {
      //throw new Error(`Not Implemented yet Exception`)
      /**
       * Okay so here:
       * + I will have to be able to determine if the called function is either object, tuple, or any other
       * + And then I already have one of those 
       *   3 cases that is implemented, the case 
       *   of the object zod function call:
       *       
       *       let toReturn: AnyZodObject = z.object({
       *         ...this.instantiateZodJsonConfig(providedArgs) //this.zodObjectLiteral
       *       });
       *       return toReturn; 
       */
      if (calledFunction.print() === `${this.nameOfTheZodImport}.object`) {
        if (Node.isObjectLiteralExpression(providedArgs)) {
          return z.object({
            /**
             * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
             * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
             * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
             * WARNING: the [this.instantiateZodJsonConfig]
             * method will need to be redesign to 
             * take in account the case where we have 
             * JSON properties using he tuple function.
             * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
             * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
             * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
             */
            ...this.instantiateZodJsonConfig(providedArgs)
          })
        } else {
          throw new Error(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs] - the provided [calledFunction] is the object zod function : [${calledFunction.print()}], but its provided arguùent is not an object literal: providedArgs.getKindName() = [${providedArgs.getKindName()}]`)
        }
      } else if (calledFunction.print() === `${this.nameOfTheZodImport}.tuple`) {
        throw new Error(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs] - method implementation not completed for case [calledFunction] is the tuple zod function`)
      } else {
        const calledZodFunctionName: string = calledFunction.print().substring(`${this.nameOfTheZodImport}.`.length - 1)
        switch (calledZodFunctionName) { // reifyNoArgsZodFunctionCallsChain
          case "string": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "boolean": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "number": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "any": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "bigint": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "date": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "function": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "nan": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "never": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "null": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "oboolean": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "unknown": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "ostring": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "void": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "nullable": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "nullish": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "array": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "enum": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "union": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "intersection": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "or": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "and": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "readonly": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "promise": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "min": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "max": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "length": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          case "nonempty": {
            console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithArgs()] - Ok zod functionName is [string]`);
            return z.string(this.experiment(providedArgs).reifiedZodExpression)
            // break;
          }
          



  
          default:
            throw new Error(
              `[@ZodSchemaParser].[reifyZodFunctionCallWithArgs(): any] - ERROR, could not determine the zod function which matches [calledZodFunctionName=${calledZodFunctionName}]`
            );
            break;
        }
      }

    }

    /**
     * This method will be a full reccurence:
     * 
     * @param aZodExpressionNode ts-morph / TypeScript Compiler API
     * @returns the reified typescript object, returned by the zod expression
     */
    public betterExperiment(aZodExpressionNode?: Node<ts.Node>): any {
      
      /**
       * The Object to return:
       * Instead of that object, the experiment method will return the instantiated zod object
       * so betterExperiment is the prototype for the 
       * generalized algorithm() which will replace parse()
       */
      let toReturn: any = null

      /**
       * We either:
       * - gather (into {toReturn.noArgsFunctionCallsStack}) the top zod function called without argument, and proceed traversing the descendants,
       * - or gather (into {toReturn.topZodFunctionCallWithArgs}) the top zod function called WITH argument(s): we then know that it is the zod function call "on the extreme left", meaning that the object calling that function is the zod named import. So we return, we do not need to proceed traversing the descendants.
       */
      const processedNode = aZodExpressionNode||this.zodExpressionNode
      if (Node.isCallExpression(processedNode)) {
        console.log(
          `[@ZodSchemaParser].[betterExperiment()] - processedNode BEFORE forEachDescendant() -  selected CallExpression node [KindName=${processedNode.getKindName()}] is :[${processedNode.print()}]`
        );
        const childrenArray: Node<ts.Node>[] = processedNode.forEachChildAsArray()
        const childrenOfChildrensArray: Node<ts.Node>[] = childrenArray[0].forEachChildAsArray()
        const descendantsArray: Node<ts.Node>[] = processedNode.forEachDescendantAsArray()
        
        console.log(
          `[@ZodSchemaParser].[betterExperiment()] - processedNode BEFORE forEachDescendant() -  selected CallExpression node children count is :[${childrenArray.length}]`
        );
        console.log(
          `[@ZodSchemaParser].[betterExperiment()] - processedNode BEFORE forEachDescendant() -  selected CallExpression node descendantsArray count is :[${descendantsArray.length}]`
        );
        /*
        descendantsArray.forEach((node:Node<ts.Node>) => {
          console.log(
            `[@ZodSchemaParser].[betterExperiment()] - processedNode descendantsArray.forEach descendant node is :[${node.print()}]`
          );
        })
        */
        const printedChildrenArray = childrenArray.map((node:Node<ts.Node>) => {
          return node.print()
        })

        /*
        const printedDescendantsArray = descendantsArray.map((node:Node<ts.Node>) => {
          return node.print()
        })
        */
        console.log(
          `[@ZodSchemaParser].[betterExperiment()] - processedNode printedChildrenArray is :[${JSON.stringify({
            printedChildrenArray: printedChildrenArray
          }, null, 2)}]`
        );

        
        /*
        console.log(
          `[@ZodSchemaParser].[betterExperiment()] - processedNode printedDescendantsArray is :[${JSON.stringify({
            printedDescendantsArray: printedDescendantsArray
          }, null, 2)}]`
        );
        */
        
        if (childrenArray.length == 2) {// i.e.: if the function call has parameters
          
          let lastIndexOfDot = childrenArray[0].print().lastIndexOf(`.`)
          let calledFunctionName = childrenArray[0].print().substring(
            lastIndexOfDot + 1 // + 1 : to exclude the dot character
          );

          const passedArgument = childrenArray[1]
          console.log(
            `[@ZodSchemaParser].[betterExperiment()] - processedNode BEFORE forEachDescendant() -  calledFunctionName is :[${calledFunctionName}]`
          );
          const printedChildrenOfChildrensArray = childrenOfChildrensArray.map((node:Node<ts.Node>) => {
            return node.print()
          })
          console.log(
            `[@ZodSchemaParser].[betterExperiment()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify({
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray
            }, null, 2)}]`
          );
          const caller = childrenOfChildrensArray[0]
          console.log(
            `[@ZodSchemaParser].[betterExperiment()] - processedNode caller is :[${caller.print()}]`
          );
          return this.reifyZodFunctionCallWithOneArg(this.betterExperiment(caller), calledFunctionName, this.betterExperiment(passedArgument))
          

        } else if (childrenArray.length == 1) { // i.e.: if function is called without parameters
          let lastIndexOfDot =
          childrenArray[0].print().lastIndexOf(`.`);
          let calledFunctionName = childrenArray[0].print().substring(
            lastIndexOfDot + 1 // + 1 : to exclude the dot character
          );
          console.log(
            `[@ZodSchemaParser].[betterExperiment()] - processedNode BEFORE forEachDescendant() -  calledFunctionName is :[${calledFunctionName}]`
          );
          const printedChildrenOfChildrensArray = childrenOfChildrensArray.map((node:Node<ts.Node>) => {
            return node.print()
          })
          console.log(
            `[@ZodSchemaParser].[betterExperiment()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify({
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray
            }, null, 2)}]`
          );
          const caller = childrenOfChildrensArray[0]
          console.log(
            `[@ZodSchemaParser].[betterExperiment()] - processedNode caller is :[${caller.print()}]`
          );
          return this.reifyNoArgsZodFunctionCall(this.betterExperiment(caller), calledFunctionName)
          
          // noArgsFunctionCallsStack.push(calledFunctionName)
          

          /////////////////////////////////////////////
          ///// TRAVERSE DESCENDANTS
          /////////////////////////////////////////////
          /**
           * 
           */
        } else if (childrenArray.length > 2) {
          throw new Error(`[@ZodSchemaParser].[betterExperiment()] - reifying a zod function call which has more than 2 passed arguments is not supported yet.`)
        }
      } else if (Node.isObjectLiteralExpression(processedNode)) {
        // that for the object function case
        return this.reifyObjectLiteralExpression(processedNode)
      } else if (Node.isArrayLiteralExpression(processedNode)) {
        // that's for the tuple function case 
        return this.reifyArrayLiteralExpression(processedNode)
      } else if (processedNode.print() == `${this.nameOfTheZodImport}`) {
        return z
      } else {
        throw new Error(`[@ZodSchemaParser].[betterExperiment()] - processed node is not an ObjectLiteralExpression, not an ArrayLiteralExpression, not a CallExpression`)
      }
      /**
       * Okay, now here I can call the reccurrence : 
       * - step 1./ I call a function which will instantiate/reify the {toReturn.topZodFunctionCallWithArgs} function call.
       * - step 2./ and on the object rturned by the above function call:
       *   - I loop over each of the [toReturn.noArgsFunctionCallsStack] functions,
       *   - to call all of the function
       * 
       * - About [step 1./]: this is where I will distinguish 3 cases : 
       *   + [[CASE 1]]: the called zod function is the {z.object} function
       *   + [[CASE 2]]: the called zod function is the {z.tuple} function 
       *   + [[CASE 3]]: the called zod function is any other zod function,
       * 
       * 
       * By the way, there is one important thing to consider:
       * there might just as well be absolutelyno zodfunction call with args:
       * 
       * z.array().number().optional();
       * 
       * And in that case 
       * - the {@toReturn.topZodFunctionCallWithArgs } array is an empty, zero-length array []
       * - and instead of calling 
       * 
       * 
       */
      
      return toReturn;
    }
    private reifyArrayLiteralExpression(processedNode: ArrayLiteralExpression): any {
      let reifiedArrayLiteralExpression: any[] = [];
  
      if (Node.isArrayLiteralExpression(processedNode)) {
        /*
          const stuff: ObjectLiteralExpressionPropertyStructures = {
            name: `manchot`,
            initializer: `"d'une certaine façon"`,
            kind: StructureKind.PropertyAssignment,
          }
          this.zodObjectLiteral.addProperty(stuff)
          */
        const elementsofTheArray = processedNode.getElements()
        for (let k = 0; k < elementsofTheArray.length; k++) {
          const elementOfTheArray = elementsofTheArray[k];
          console.log(
            `[@ZodSchemaParser].[reifyArrayLiteralExpression()] - elementOfTheArray = [${elementOfTheArray.print()}]`
          );


          const childrenArray: Node<ts.Node>[] = processedNode.forEachChildAsArray()
          const childrenOfChildrensArray: Node<ts.Node>[] = childrenArray[0].forEachChildAsArray()
          
          const printedChildrenArray = childrenArray.map((node:Node<ts.Node>) => {
            return node.print()
          })
          const printedChildrenOfChildrensArray = childrenOfChildrensArray.map((node:Node<ts.Node>) => {
            return node.print()
          })
          console.log(
            `[@ZodSchemaParser].[reifyArrayLiteralExpression()] - processedNode printedChildrenArray is :[${JSON.stringify({
              printedChildrenArray: printedChildrenArray
            }, null, 2)}]`
          );
          console.log(
            `[@ZodSchemaParser].[reifyArrayLiteralExpression()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify({
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray
            }, null, 2)}]`
          );
          reifiedArrayLiteralExpression.push(this.betterExperiment(elementOfTheArray))
          console.log(
            `[@ZodSchemaParser].[reifyArrayLiteralExpression()] - reifiedArrayLiteralExpression is now :[${JSON.stringify({
              reifiedArrayLiteralExpression: reifiedArrayLiteralExpression.map((node) => {return node.toString()/*.print()*/})
            }, null, 2)}]`
          );
        } // end of for loop over Array literal elements 
      } else {
        throw new Error(
          `[@ZodSchemaParser].[reifyArrayLiteralExpression()] - provided processedNode should be an [ArrayLiteralExpression], but it is not.`
        );
      }
      return reifiedArrayLiteralExpression;
    }

    private reifyObjectLiteralExpression(processedNode: ObjectLiteralExpression): any {
      let reifiedJsonObjectLiteralExpression: any = {};
  
      if (Node.isObjectLiteralExpression(processedNode)) {
        /*
          const stuff: ObjectLiteralExpressionPropertyStructures = {
            name: `manchot`,
            initializer: `"d'une certaine façon"`,
            kind: StructureKind.PropertyAssignment,
          }
          this.zodObjectLiteral.addProperty(stuff)
          */
        const propertiesOfTheObjLiteral = processedNode.getProperties();
        for (let k = 0; k < propertiesOfTheObjLiteral.length; k++) {
          const propertyOfTheObjLiteral = propertiesOfTheObjLiteral[k];
          console.log(
            `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral = [${propertyOfTheObjLiteral.print()}]`
          );


          const childrenArray: Node<ts.Node>[] = processedNode.forEachChildAsArray()
          const childrenOfChildrensArray: Node<ts.Node>[] = childrenArray[0].forEachChildAsArray()
          
          const printedChildrenArray = childrenArray.map((node:Node<ts.Node>) => {
            return node.print()
          })
          const printedChildrenOfChildrensArray = childrenOfChildrensArray.map((node:Node<ts.Node>) => {
            return node.print()
          })
          console.log(
            `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - processedNode printedChildrenArray is :[${JSON.stringify({
              printedChildrenArray: printedChildrenArray
            }, null, 2)}]`
          );
          console.log(
            `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify({
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray
            }, null, 2)}]`
          );
          const propStructure = propertyOfTheObjLiteral.getStructure();
          if (propStructure.kind == StructureKind.PropertyAssignment) {
            console.log(
              `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - propStructure.name = [${propStructure.name}]`
            );
            console.log(
              `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - propStructure.initializer = [${propStructure.initializer}]`
            );
            
            console.log(
              `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - is a PropertyAssignement so it will be : reifiedJsonObjectLiteralExpression[${propStructure.name}] = this.betterExperiment(${childrenOfChildrensArray[1].print()})`
            );
            reifiedJsonObjectLiteralExpression[`${propStructure.name}`] = this.betterExperiment(childrenOfChildrensArray[1])
          } else {
            console.log(
              `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - is NOT a PropertyAssignement so I don't kknow yet how to reify it: printedChildrenOfChildrensArray is :[${JSON.stringify({
                printedChildrenOfChildrensArray: printedChildrenOfChildrensArray
              }, null, 2)}]`
            );
          }
        } // end of for loop over Object literal properties 
      } else {
        throw new Error(
          `[@ZodSchemaParser].[reifyObjectLiteralExpression()] - provided objectLiteralNode should be an [ObjectLiteralExpression], but it is not.`
        );
      }
      return reifiedJsonObjectLiteralExpression;
    }
    private reifyZodFunctionCallWithOneArg(caller: any, calledFunctionName: string, passedArgument: any /* Node<ts.Node> */): any {
      let toReturn = caller;
      switch (calledFunctionName) { // reifyNoArgsZodFunctionCallsChain
        case "string": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [string]`);
          return caller.string(passedArgument);
          // break;
        }
        case "boolean": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [boolean]`);
          return caller.boolean(passedArgument);
          // break;
        }
        case "number": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [number]`);
          return caller.number(passedArgument);
          // break;
        }
        case "any": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [any]`);
          return caller.any(passedArgument);
          // break;
        }
        case "bigint": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [bigint]`);
          return caller.bigint(passedArgument);
          // break;
        }
        case "date": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [date]`);
          return caller.date(passedArgument);
          // break;
        }
        case "function": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [function]`);
          return caller.function(passedArgument);
          // break;
        }
        case "nan": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nan]`);
          return caller.nan(passedArgument);
          // break;
        }
        case "never": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [never]`);
          return caller.never(passedArgument);
          // break;
        }
        case "null": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [null]`);
          return caller.null(passedArgument);
          // break;
        }
        case "oboolean": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [oboolean]`);
          return caller.oboolean(passedArgument);
          // break;
        }
        case "unknown": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [unknown]`);
          return caller.unknown(passedArgument);
          // break;
        }
        case "ostring": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [ostring]`);
          return caller.ostring(passedArgument);
          // break;
        }
        case "void": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [void]`);
          return caller.void(passedArgument);
          // break;
        }
        case "nullable": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nullable]`);
          return caller.nullable(passedArgument);
          // break;
        }
        case "nullish": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nullish]`);
          return caller.nullish(passedArgument);
          // break;
        }
        case "object": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [object]`);
          return caller.object(passedArgument);
          // break;
        }
        case "tuple": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [tuple]`);
          return caller.tuple(passedArgument);
          // break;
        }
        case "array": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [array]`);
          return caller.array(passedArgument);
          // break;
        }
        case "optional": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [optional]`);
          return caller.optional(passedArgument);
          // break;
        }
        case "required": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [required]`);
          return caller.required(passedArgument);
          // break;
        }
        case "passthrough": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [passthrough]`);
          return caller.passthrough(passedArgument);
          // break;
        }
        case "strict": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [strict]`);
          return caller.strict(passedArgument);
          // break;
        }
        case "strip": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [strip]`);
          return caller.strip(passedArgument);
          // break;
        }
        case "default": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [default]`);
          return caller.default(passedArgument);
          // break;
        }
        case "describe": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [describe]`);
          return caller.describe(passedArgument);
          // break;
        }
        case "promise": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [promise]`);
          return caller.promise(passedArgument);
          // break;
        }
        case "readonly": {
          console.log(`[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [readonly]`);
          return caller.readonly(passedArgument);
          // break;
        }
        default:
          throw new Error(
            `[@ZodSchemaParser].[reifyZodFunctionCallWithOneArg(): any] - ERROR, could not determine the zod function which matches [calledFunctionName=${calledFunctionName}]`
          );
          break;
      }
      throw new Error("Method implementation not completed yet.");
    }

    /**
     * This method reifies the call of a zod method called without arguments 
     * 
     * <pre>caller.calledFunctionName()</pre>
     * 
     * @param caller 
     * @param calledFunctionName the zod function name, a
     * @returns the object returned by the function call
     */
    private reifyNoArgsZodFunctionCall(caller: any/*Node<ts.Node>*/, calledFunctionName: string): any {
      let toReturn = caller;
      switch (calledFunctionName) { // 
        case "string": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [string], and caller is [${caller}]`);
          return caller.string();
          // break;
        }
        case "boolean": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [boolean]`);
          return caller.boolean();
          // break;
        }
        case "number": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [number]`);
          return caller.number();
          // break;
        }
        case "any": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [any]`);
          return caller.any();
          // break;
        }
        case "bigint": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [bigint]`);
          return caller.bigint();
          // break;
        }
        case "date": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [date]`);
          return caller.date();
          // break;
        }
        case "function": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [function]`);
          return caller.function();
          // break;
        }
        case "nan": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nan]`);
          return caller.nan();
          // break;
        }
        case "never": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [never]`);
          return caller.never();
          // break;
        }
        case "null": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [null]`);
          return caller.null();
          // break;
        }
        case "oboolean": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [oboolean]`);
          return caller.oboolean();
          // break;
        }
        case "unknown": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [unknown]`);
          return caller.unknown();
          // break;
        }
        case "ostring": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [ostring]`);
          return caller.ostring();
          // break;
        }
        case "void": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [void]`);
          return caller.void();
          // break;
        }
        case "nullable": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nullable]`);
          return caller.nullable();
          // break;
        }
        case "nullish": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nullish]`);
          return caller.nullish();
          // break;
        }
        case "object": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [object]`);
          return caller.object();
          // break;
        }
        case "tuple": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [tuple]`);
          return caller.tuple();
          // break;
        }
        case "array": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [array]`);
          return caller.array();
          // break;
        }
        case "optional": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [optional]`);
          return caller.optional();
          // break;
        }
        case "required": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [required]`);
          return caller.required();
          // break;
        }
        case "passthrough": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [passthrough]`);
          return caller.passthrough();
          // break;
        }
        case "strict": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [strict]`);
          return caller.strict();
          // break;
        }
        case "strip": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [strip]`);
          return caller.strip();
          // break;
        }
        case "default": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [default]`);
          return caller.default();
          // break;
        }
        case "describe": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [describe]`);
          return caller.describe();
          // break;
        }
        case "promise": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [promise]`);
          return caller.promise();
          // break;
        }
        case "readonly": {
          console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [readonly]`);
          return caller.readonly();
          // break;
        }

        default:
          throw new Error(
            `[@ZodSchemaParser].[reifyNoArgsZodFunctionCall(): any] - ERROR, could not determine the zod function which matches [calledFunctionName=${calledFunctionName}]`
          );
          break;
      }
    }

    public experiment(aZodExpressionNode?: Node<ts.Node>): {
      noArgsFunctionCallsStack: string[]
      topZodFunctionCallWithArgs: Node<ts.Node>[]
      reifiedZodExpression: any // AnyZodObject
    } {
      
      /**
       * The Object to return:
       * Instead of that object, the experiment method will return the instantiated zod object
       * so experiment is the prototype for the 
       * generalized algorithm() which will replace parse()
       */
      let toReturn: {
        noArgsFunctionCallsStack: string[]
        topZodFunctionCallWithArgs: Node<ts.Node>[]
        reifiedZodExpression: any // AnyZodObject
      } = {
        noArgsFunctionCallsStack: [],
        topZodFunctionCallWithArgs: [],
        reifiedZodExpression: null
      }

      /**
       * We either:
       * - gather (into {toReturn.noArgsFunctionCallsStack}) the top zod function called without argument, and proceed traversing the descendants,
       * - or gather (into {toReturn.topZodFunctionCallWithArgs}) the top zod function called WITH argument(s): we then know that it is the zod function call "on the extreme left", meaning that the object calling that function is the zod named import. So we return, we do not need to proceed traversing the descendants.
       */
      const processedNode = aZodExpressionNode||this.zodExpressionNode
      if (Node.isCallExpression(processedNode)) {
        console.log(
          `[@ZodSchemaParser].[experiment()] - processedNode BEFORE forEachDescendant() -  selected CallExpression node [KindName=${processedNode.getKindName()}] is :[${processedNode.print()}]`
        );
        const childrenArray: Node<ts.Node>[] = processedNode.forEachChildAsArray()
        
        console.log(
          `[@ZodSchemaParser].[experiment()] - processedNode BEFORE forEachDescendant() -  selected CallExpression node children count is :[${childrenArray.length}]`
        );
        if (childrenArray.length > 1) {// ie: if the function call has parameters
          toReturn.topZodFunctionCallWithArgs = childrenArray
          // return toReturn
        } else if (childrenArray.length == 1) {
          let lastIndexOfDot =
          childrenArray[0].print().lastIndexOf(`.`);
          let calledFunctionName = childrenArray[0].print().substring(
            lastIndexOfDot + 1 // + 1 : to exclude the dot character
          );
          console.log(
            `[@ZodSchemaParser].[experiment()] - processedNode BEFORE forEachDescendant() -  calledFunctionName is :[${calledFunctionName}]`
          );
          // noArgsFunctionCallsStack.push(calledFunctionName)
          toReturn.noArgsFunctionCallsStack = [
            calledFunctionName,
            ...toReturn.noArgsFunctionCallsStack
          ]

          /////////////////////////////////////////////
          ///// TRAVERSE DESCENDANTS
          /////////////////////////////////////////////
          /**
           * 
           */
          processedNode.forEachDescendant((node: Node, traversal: ForEachDescendantTraversalControl) => {
            console.log(
              `[@ZodSchemaParser].[experiment()] - processedNode.forEachDescendant() -----------------------------------------`
            );
            console.log(
              `[@ZodSchemaParser].[experiment()] - processedNode.forEachDescendant() -  curent node [KindName=${node.getKindName()}] is :[${node.print()}]`
            );
            if (Node.isCallExpression(node)) {
              console.log(
                `[@ZodSchemaParser].[experiment()] - processedNode.forEachDescendant() -  selected CallExpression node [KindName=${node.getKindName()}] is :[${node.print()}]`
              );
              const childrenArray: Node<ts.Node>[] = node.forEachChildAsArray()
              // const descendantsArray: Node<ts.Node>[] = node.forEachDescendantAsArray()
              console.log(
                `[@ZodSchemaParser].[experiment()] - processedNode.forEachDescendant() -  selected CallExpression node children count is :[${childrenArray.length}]`
              );
              if (childrenArray.length > 1) {// ie: if the function call has parameters
                toReturn.topZodFunctionCallWithArgs = childrenArray
                traversal.stop()
              } else if (childrenArray.length == 1) {
                let lastIndexOfDot =
                childrenArray[0].print().lastIndexOf(`.`);
                let calledFunctionName = childrenArray[0].print().substring(
                  lastIndexOfDot + 1 // + 1 : to exclude the dot character
                );
                console.log(
                  `[@ZodSchemaParser].[experiment()] - processedNode.forEachDescendant() -  calledFunctionName is :[${calledFunctionName}]`
                );
                // noArgsFunctionCallsStack.push(calledFunctionName)
                toReturn.noArgsFunctionCallsStack = [
                  calledFunctionName,
                  ...toReturn.noArgsFunctionCallsStack
                ]
              }
            }
          });

        }
      }
      /**
       * Okay, now here I can call the reccurrence : 
       * - step 1./ I call a function which will instantiate/reify the {toReturn.topZodFunctionCallWithArgs} function call.
       * - step 2./ and on the object rturned by the above function call:
       *   - I loop over each of the [toReturn.noArgsFunctionCallsStack] functions,
       *   - to call all of the function
       * 
       * - About [step 1./]: this is where I will distinguish 3 cases : 
       *   + [[CASE 1]]: the called zod function is the {z.object} function
       *   + [[CASE 2]]: the called zod function is the {z.tuple} function 
       *   + [[CASE 3]]: the called zod function is any other zod function,
       * 
       * 
       * By the way, there is one important thing to consider:
       * there might just as well be absolutelyno zodfunction call with args:
       * 
       * z.array().number().optional();
       * 
       * And in that case 
       * - the {@toReturn.topZodFunctionCallWithArgs } array is an empty, zero-length array []
       * - and instead of calling 
       * 
       * 
       */
      if (toReturn.topZodFunctionCallWithArgs.length == 0) {
        /**
         * There, we don't need to call {this.reifyZodFunctionCallWithArgs}
         * instead, we will directly call on the named zod import, all the no args function in 
         */
        toReturn.reifiedZodExpression = this.reifyNoArgsZodFunctionCallsChain(z, toReturn.noArgsFunctionCallsStack)
      } else if (toReturn.topZodFunctionCallWithArgs.length == 2) {
        if (Node.isPropertyAccessExpression(toReturn.topZodFunctionCallWithArgs[0])) {
          toReturn.reifiedZodExpression = this.reifyNoArgsZodFunctionCallsChain(this.reifyZodFunctionCallWithArgs(toReturn.topZodFunctionCallWithArgs[0], toReturn.topZodFunctionCallWithArgs[1]), toReturn.noArgsFunctionCallsStack)
        } else {
          throw new Error(`[@ZodSchemaParser].[experiment()] - [toReturn.topZodFunctionCallWithArgs[0]] is expected to be a Property AccessExpression, but is not, its kind is : [${toReturn.topZodFunctionCallWithArgs[0].getKindName()}]`)  
        }
      } else {
        throw new Error(`[@ZodSchemaParser].[experiment()] - [toReturn.topZodFunctionCallWithArgs.length] must equal either zero or 2, but [toReturn.topZodFunctionCallWithArgs.length=[${toReturn.topZodFunctionCallWithArgs.length}]]`)
      }
      return toReturn;
    }

    private reifyNoArgsZodFunctionCallsChain(rootCaller: any, noArgsFunctionCallsStack: string[]): any {
      let toReturn = rootCaller;
      if (noArgsFunctionCallsStack.length == 0) {
        return toReturn
      } else {
        console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - length of the [noArgsFunctionCallsStack] array before [pop()] = [${noArgsFunctionCallsStack.length}]`)
        const zodFunctionName = noArgsFunctionCallsStack.pop()// noArgsFunctionCallsStack[0]
        console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - length of the [noArgsFunctionCallsStack] array after [pop()] = [${noArgsFunctionCallsStack.length}]`)
        switch (zodFunctionName) { // reifyNoArgsZodFunctionCallsChain
          case "string": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [string]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.string(), noArgsFunctionCallsStack);
            // break;
          }
          case "boolean": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [boolean]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.boolean(), noArgsFunctionCallsStack);
            // break;
          }
          case "number": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [number]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.number(), noArgsFunctionCallsStack);
            // break;
          }
          case "any": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [any]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.any(), noArgsFunctionCallsStack);
            // break;
          }
          case "bigint": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [bigint]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.bigint(), noArgsFunctionCallsStack);
            // break;
          }
          case "date": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [date]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.date(), noArgsFunctionCallsStack);
            // break;
          }
          case "function": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [function]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.function(), noArgsFunctionCallsStack);
            // break;
          }
          case "nan": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [nan]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.nan(), noArgsFunctionCallsStack);
            // break;
          }
          case "never": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [never]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.never(), noArgsFunctionCallsStack);
            // break;
          }
          case "null": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [null]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.null(), noArgsFunctionCallsStack);
            // break;
          }
          case "oboolean": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [oboolean]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.oboolean(), noArgsFunctionCallsStack);
            // break;
          }
          case "unknown": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [unknown]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.unknown(), noArgsFunctionCallsStack);
            // break;
          }
          case "ostring": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [ostring]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.ostring(), noArgsFunctionCallsStack);
            // break;
          }
          case "void": {
            console.log(`[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain()] - Ok zod functionName is [void]`);
            return this.reifyNoArgsZodFunctionCallsChain(rootCaller.void(), noArgsFunctionCallsStack);
            // break;
          }
  
          default:
            throw new Error(
              `[@ZodSchemaParser].[reifyNoArgsZodFunctionCallsChain(): any] - ERROR, could not determine the zod function which matches [zodFunctionName=${zodFunctionName}]`
            );
            break;
        }
        
      }
    }
        
    /**
     * This method validates that the
     * source code in the source file built
     * based on the constructor-provided
     * string <pre>zodSchemaAsString</pre>,
     * assumed to be a zod schema, sucessfully
     * compiles with the TypeScript Compiler.
     * -
     * https://ts-morph.com/setup/diagnostics
     * @throws an Error if the source code does not compile as TypeScript source code
     */
    private validate(): void {
      // let isTypeScriptSourceCodeValid: boolean = true
      const diagnostics = this.sourceFile.getPreEmitDiagnostics();
      // const diagnostics = this.sourceFile.getPreEmitDiagnostics()
  
      const errors = diagnostics.filter((diagnostic: { getCategory: () => any; getCode: () => number; }) => {
        // if (diagnostic.getCategory())
        switch (diagnostic.getCategory()) {
          case DiagnosticCategory.Error:
            if (diagnostic.getCode() != 0) {
              return diagnostic;
            }
            break;
          default:
            break;
        }
      });
      if (errors.length != 0) {
        console.error(
          `There is (are) compilation error(s) inside the Zod Schema you provided as string:`
        );
        errors.forEach((errorDiagnostic: { getCode: () => any; getMessageText: () => any; getLineNumber: () => any; getStart: () => any; }) => {
          console.error(
            `Compilation error inside the Zod Schema you provided as string:`,
            {
              errorExitCode: errorDiagnostic.getCode(),
              errorMsg: errorDiagnostic.getMessageText(),
              errorLineNumber: errorDiagnostic.getLineNumber(),
              errorStartPosition: errorDiagnostic.getStart(),
            }
          );
        });
        throw new Error(
          `There is (are) compilation error(s) inside the Zod Schema you provided as string:`
        );
      }
    }
  
  
    /**
     * This method parses the source code to intantiate the Zod Schema
     * @returns the Zod object, instantiated by parsing <code>this.zodSchemaVarDeclaration}</code>
     */
    public parse(): any /*AnyZodObject*/ {
      /*
        
      let toReturn: AnyZodObject = z.object({
        ...this.instantiateZodJsonConfig(this.zodObjectLiteral)
      });
      */
      return this.experiment(this.zodExpressionNode).reifiedZodExpression;
    }
    /**
     * 
     * This method instantiates a JSON Object which will be used to create a zod schema <pre>z.object(theJSONObject)</pre>
     * This method uses recurrence
     * @returns the JSON Object which will be used to create a zod schema <pre>z.object(theJSONObject)</pre>
     */
    public instantiateZodJsonConfig(
      objectLiteralNode: ObjectLiteralExpression
    ): any {
      let reifiedJsonObjectLiteralExpression: any = {};
  
      if (Node.isObjectLiteralExpression(objectLiteralNode)) {
        /*
          const stuff: ObjectLiteralExpressionPropertyStructures = {
            name: `manchot`,
            initializer: `"d'une certaine façon"`,
            kind: StructureKind.PropertyAssignment,
          }
          this.zodObjectLiteral.addProperty(stuff)
          */
        const propertiesOfTheObjLiteral = objectLiteralNode.getProperties();
        for (let k = 0; k < propertiesOfTheObjLiteral.length; k++) {
          const propertyOfTheObjLiteral = propertiesOfTheObjLiteral[k];
          console.log(
            `[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral = [${propertyOfTheObjLiteral.print()}]`
          );
          const propStructure = propertyOfTheObjLiteral.getStructure();
          if (propStructure.kind == StructureKind.PropertyAssignment) {
            console.log(
              `[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - propStructure.name = [${propStructure.name}]`
            );
            console.log(
              `[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - propStructure.initializer = [${propStructure.initializer}]`
            );
            if (
              // `${propStructure.initializer}`.includes(`${this.nameOfTheZodImport}.object`
              `${propStructure.initializer}`.startsWith(
                `${this.nameOfTheZodImport}.object`
              )
            ) {
              /**
               * So here, the initializer is of the form:
               * - z.object({/and here some properties/})
               * - in other words,
               * we need to extract the Object Literal from the initializer
               */
              let descendantObjectLiteral: ObjectLiteralExpression;
              propertyOfTheObjLiteral.forEachDescendant((node4: any, traversal4: { stop: () => void; }) => {
                if (Node.isObjectLiteralExpression(node4)) {
                  descendantObjectLiteral = node4;
                  reifiedJsonObjectLiteralExpression[`${propStructure.name}`] = z.object({
                    ...this.instantiateZodJsonConfig(descendantObjectLiteral),
                  });
                  traversal4.stop();
                }
              });
            } else {
              reifiedJsonObjectLiteralExpression[`${propStructure.name}`] = this.testInstantiateFrom(
                `${propStructure.initializer}`
              );
            }
          }
        }
      } else {
        throw new Error(
          `[@ZodSchemaParser].[parse()] - provided objectLiteralNode should be an [ObjectLiteralExpression], but it is not.`
        );
      }
      return reifiedJsonObjectLiteralExpression;
    }
    /**
     * This method parses the source code to intantiate the Zod Schema
     * @returns the Zod object, instantiated by parsing <code>this.zodSchemaVarDeclaration}</code>
     */
    public demoDFStraversal(): AnyZodObject {
      let toReturn: AnyZodObject = z.object({});
      let reifiedJsonObjectLiteralExpression: any = {};
  
  
      if (Node.isObjectLiteralExpression(this.zodObjectLiteral)) {
        /*
        const stuff: ObjectLiteralExpressionPropertyStructures = {
          name: `manchot`,
          initializer: `"d'une certaine façon"`,
          kind: StructureKind.PropertyAssignment,
        }
        this.zodObjectLiteral.addProperty(stuff)
        */
        const propertiesOfTheObjLiteral = this.zodObjectLiteral.getProperties();
        for (let k = 0; k < propertiesOfTheObjLiteral.length; k++) {
          const propertyOfTheObjLiteral = propertiesOfTheObjLiteral[k];
          console.log(
            `[@ZodSchemaParser].[demoDFStraversal()] - propertyOfTheObjLiteral = [${propertyOfTheObjLiteral.print()}]`
          );
          const propStructure = propertyOfTheObjLiteral.getStructure();
          if (propStructure.kind == StructureKind.PropertyAssignment) {
            console.log(
              `[@ZodSchemaParser].[demoDFStraversal()] - propertyOfTheObjLiteral - propStructure.name = [${propStructure.name}]`
            );
            console.log(
              `[@ZodSchemaParser].[demoDFStraversal()] - propertyOfTheObjLiteral - propStructure.initializer = [${propStructure.initializer}]`
            );
            if (
              // `${propStructure.initializer}`.includes(`${this.nameOfTheZodImport}.object`
              `${propStructure.initializer}`.startsWith(
                `${this.nameOfTheZodImport}.object`
              )
            ) {
              // okay so here, we will call the reccurrence function on
              // the descendants of a property, if and only if
              // the initializer contains the "object" string, or
              // better, if (`${propStructure.initializer}`.includes(`${this.nameOfTheZodImport}.object`))
            } else {
              
              /**
               * ---
               * Here we will analyze the AST of the
               * function calls for intantiating
               * the property eg z.string().array().optional()
               * ---
               */
              /**/
              propertyOfTheObjLiteral.forEachDescendant((node3: { print: () => any; }, traversal3: any) => {
                console.log(`[@ZodSchemaParser].[demoDFStraversal()] - propertyOfTheObjLiteral - forEachDescendant , node3 = [${node3.print()}]`)
  
              })
              
            }
            // this.zodImport.namedImports
          }
  
          // const structureOfTheProperty = propertyOfTheObjLiteral.getStructure()
          // structureOfTheProperty.kind
          // const descendantsStatements = propertyOfTheObjLiteral.getDescendantStatements()
          // console.log(`[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - descendantsStatements = [${descendantsStatements}]`)
  
          /*
          const descendantsOfProperty = propertyOfTheObjLiteral.getDescendantsOfKind(SyntaxKind.CallExpression)
          descendantsOfProperty.forEach((descendant: CallExpression<ts.CallExpression>, p: number) => {
            console.log(`[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - descendantsOfPropertyCallExpression = [${descendant.getSymbol()?.getEscapedName()}]`)
          })
          */
  
          /*
          console.log(`[@ZodSchemaParser].[parse()] - propertyOfTheObjLiteral - forEachDescendants:`)
          const what = propertyOfTheObjLiteral.forEachDescendant((node2, traversale2) => {
  
          })
          */
        }
      } else {
        throw new Error(
          `[@ZodSchemaParser].[demoDFStraversal()] - this.zodObjectLiteral should be an [ObjectLiteralExpression], but it is not.`
        );
      }
  
      /**
       * TODO: parse [theSrcCodeToParse]
       * to create the ZodSchema to return
       * -
       * I will there have to do a bit of
       * reccurrence probably, to extract
       * all curlyBraces-delimited code
       * blocks, something like that...
       *
       * And example of the string to parse would typically be:
       *
       *  z.object({
       *    title: z.string(),
       *    tags: z.array(z.string()),
       *    image: z.string().optional(),
       *    author: z.object({
       *      firstname: z.string(),
       *      lastname: z.string(),
       *    })
       *  })
       *
       * - I need a function which does this:
       *   1. it removes the first occurence of "z.object"
       *   2. it removes the first occurence of "("
       *   3. it removes the last occurence of ")"
       *   4. it removes the first occurence of "{"
       *   5. it removes the last occurence of "}"
       *   6. it splits, with the colon "," character, the string into an array
       *   7. it loops over the array items, foreach item:
       *       1 - it splits the item, with the colon ":" character, into an array
       *       2 - if the second member of the array does
       *           not start with "z.object", it adds an
       *           entry with the desired zod type
       *           (so i will have to parse the simple zod type as well...)
       *       3 - if the second member of the array starts with "z.object", it calls the recurrence
       *
       * - a function which can parse a zimple zod type (so i will have to parse the simple zod type as well...)
       *   cases:
       *     + z.string()
       *     + z.boolean()
       *     + z.number().nullable()
       *     + z.array(z.string()).optional()
       *     + z.array(z.boolean()).optional()
       *     + z.array(z.number()).optional()
       *     + z.array(z.string()).optional()
       *     + z.array(z.string()).optional()
       *     + z.array(z.string()).optional()
       *     + z.array(z.string()).optional()
       *     + z.array(z.string()).optional()
       *     Ok, vu le grand nombre de
       *     combinaisons possibles, c'est difficile
       *     à faire, ça... À réfléchir...
       *     à moins que là ausi je fasse un
       *     arbre avec une réccurrence...
       *
       *     Là ça vaut peut êtrele coup de
       *     réviser les meilleurs algorithmes
       *     de construction et parcours d'arbre...
       *
       *     Parce qu'avoir une fonction capable
       *     de parser un objet zod général, ça
       *     pourrait s'avérer très populaire...
       *
       *     développement d'un parser: techniques
       *     les plus efficaces, émissiond évènements etc
       *
       *
       * >> Might be interesting for WebUI: https://github.com/raflymln/zod-key-parser
       * >> Example tutorial how to create a parser from scratch:
       *   + https://ogzhanolguncu.com/blog/write-your-own-json-parser/
       *   + https://telefrek.medium.com/building-a-typescript-sql-parser-b80e45dd730d
       *   + https://www.cookielab.io/blog/how-to-write-your-own-json-parser-using-functional-typescript-fp-ts-part-i
       *
       * >> I didn't immediately thought of that, but f course:
       *    the TypeScript Commpiler API provides the perfect
       *    tooling to build the above mentioned tree, which
       *    actually is a TypeScript language AST instance.
       *    To build and traverse that AST, i will of course use
       *    ts-morph, perhaps a visitor pattern, and the traversal object:
       *
       *    https://ts-morph.com/navigation/#foreachdescendant
       *
       *
       *
       */
      return toReturn;
    }
  
    /**
     * The method which evaluates a tree of zod funtion calls
     * the tree is provided as a simple string, using the two methods:
     *
     * <pre>this.instantiateLeafFunctionCallFrom</pre>
     * <pre>this.instantiateFunctionCalledWithParamsFrom</pre>
     *
     *
     */
    public testInstantiateFrom(treeOfZodFunctionCalls: string): any {
      // remove all white spaces and new lines characters
      treeOfZodFunctionCalls = treeOfZodFunctionCalls.replace(/\s|\\n?/g, "");
      if (treeOfZodFunctionCalls.endsWith(`()`)) {
        let lastIndexOfDotInTreeOfZodFunctionCalls =
          treeOfZodFunctionCalls.lastIndexOf(`.`);
        let descendantCaller = treeOfZodFunctionCalls.substring(
          0,
          lastIndexOfDotInTreeOfZodFunctionCalls
        );
        let descendantCalledFunction = treeOfZodFunctionCalls
          .substring(lastIndexOfDotInTreeOfZodFunctionCalls + 1)
          .split(`(`)[0];
        return this.instantiateLeafFunctionCallFrom(
          descendantCaller,
          descendantCalledFunction
        );
      } else {
        let firstIndexOfDotInCaller = treeOfZodFunctionCalls.indexOf(`.`);
        let firstIndexOfOpeningBraceInCaller =
          treeOfZodFunctionCalls.indexOf(`(`);
        let lastIndexOfClosingBraceInCaller =
          treeOfZodFunctionCalls.lastIndexOf(`)`);
        let descendantCaller = treeOfZodFunctionCalls.substring(
          0,
          firstIndexOfDotInCaller
        );
        let descendantCalledFunction = treeOfZodFunctionCalls.substring(
          firstIndexOfDotInCaller + 1,
          firstIndexOfOpeningBraceInCaller
        );
        let descendantCalledFunctionParams = treeOfZodFunctionCalls
          .substring(
            firstIndexOfOpeningBraceInCaller + 1,
            lastIndexOfClosingBraceInCaller
          )
          .split(`,`);
        if (!(descendantCaller == this.nameOfTheZodImport)) {
          throw new Error(
            `[@ZodSchemaParser].[instantiateFrom(treeOfZodFunctionCalls: string): any] - caller is not the zod named import and caller does NOT .endsWith('()') - ERROR, the {descendantCaller=[${descendantCaller}]} was expected to be the zod named import = [${this.nameOfTheZodImport}], but it is not.`
          );
        } // so here we can return z in place of 'descendantCaller'
  
        if (!(descendantCalledFunctionParams.length == 1)) {
          throw new Error(
            `[@ZodSchemaParser].[instantiateFrom(treeOfZodFunctionCalls: string): any] - caller is not the zod named import and caller does NOT .endsWith('()') - ERROR, the {descendantCalledFunctionParams.length} is expected to be exactly 1, but {descendantCalledFunctionParams.length=[${descendantCalledFunctionParams.length}]}`
          );
        } // so here we can return z in place of 'descendantCaller'
        return this.instantiateFunctionCalledWithParamsFrom(
          descendantCalledFunction,
          descendantCalledFunctionParams[0]
        );
      }
      /**
       * TODO: implement using the below two functions
       * <pre>treeOfZodFunctionCalls</pre> is the
       * root node of the tree of zod funtion calls, as printed by forEachDescendant
       *
       * <pre>this.instantiateLeafFunctionCallFrom()</pre>
       * <pre>this.instantiateFunctionCalledWithParamsFrom()</pre>
       */
    }
  
    /**
     *
     * @param caller the caller of the function
     * @param calledFunction a function call that does not take any parameter
     * @returns
     */
    private instantiateLeafFunctionCallFrom(
      caller: string,
      calledFunction: string
    ): any {
      console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - START with params caller=[${caller}] calledFunction=[${calledFunction}]`);
      if (caller == this.nameOfTheZodImport) {
        switch (calledFunction) { 
          case "string": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [string]`);
            return z.string();
            // break;
          }
          case "boolean": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [boolean]`);
            return z.boolean();
            // break;
          }
          case "number": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [number]`);
            return z.number();
            // break;
          }
          case "any": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [any]`);
            return z.any();
            // break;
          }
          case "bigint": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [bigint]`);
            return z.bigint();
            // break;
          }
          case "date": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [date]`);
            return z.date();
            // break;
          }
          case "function": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [function]`);
            return z.function();
            // break;
          }
          case "nan": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [nan]`);
            return z.nan();
            // break;
          }
          case "never": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [never]`);
            return z.never();
            // break;
          }
          case "null": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [null]`);
            return z.null();
            // break;
          }
          case "oboolean": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [oboolean]`);
            return z.oboolean();
            // break;
          }
          case "unknown": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [unknown]`);
            return z.unknown();
            // break;
          }
          case "ostring": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [ostring]`);
            return z.ostring();
            // break;
          }
          case "void": {
            console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller is the zod named import - Ok this calledFunction is an [void]`);
            return z.void();
            // break;
          }
  
          default:
            throw new Error(
              `[@ZodSchemaParser].[instantiateLeafFunctionCallFrom(caller: string, calledFunction: string): any] - caller is the zod named import - ERROR, could not determine the zod function which matches the provided parameter[calledFunction=${calledFunction}]`
            );
            break;
        }
      } else {
        /**
         * If the caller is not
         * the zod named import, then we
         * know, that is is a function call.
         *
         * So we need a function, that from the caller, can get the descendant caller and calledFunction
         *
         */
        // from a node, i would need to get the
        if (caller.endsWith(`()`)) {
          /**
           * then we need to extract the
           * caller, and the calledFunction
           */
          let descendantCaller: string = ``;
          let descendantCalledFunction = null;
          /**
           * works only because zod function calls have a specific property:
           * - say you have 2 zod functions named 'functionWithNoParams', and 'functionWithParams'
           * - then, with the zod framework:
           *
           *
           * <code>
           * // this is accepted
           * z.functionWithParams(<and here the params>).functionWithNoParams()
           * </code>
           *
           * <code>
           * // this is NOT ever accepted (try and find a combination, you will see for yoruself...)
           * z.functionWithNoParams().functionWithParams(<and here the params>)
           * </code>
           *
           * So this means that if a Zod expression, made of
           * function calls, ends with '()', then the "previous" functions calls is either a single call to one function with parameters, or a chain of calls of function without parameters.
           */
          // let firstIndexOfFirstOpeningBrace = caller.indexOf(`(`)
          // let lastIndexOfFirstClosingBrace = caller.lastIndexOf(`)`)
          let lastIndexOfDotInCaller = caller.lastIndexOf(`.`);
          descendantCaller = caller.substring(0, lastIndexOfDotInCaller);
          descendantCalledFunction = caller
            .substring(lastIndexOfDotInCaller + 1)
            .split(`(`)[0];
  
          // return this.instantiateLeafFunctionCallFrom(descendantCaller, descendantCalledFunction)
  
          switch (calledFunction) {
            case "string": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [string]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).string();
              // break;
            }
            case "boolean": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [boolean]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).boolean();
              // break;
            }
            case "number": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [number]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).number();
              // break;
            }
            case "any": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [any]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).any();
              // break;
            }
            case "bigint": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [bigint]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).bigint();
              // break;
            }
            case "date": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [date]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).date();
              // break;
            }
            case "function": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [function]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).function();
              // break;
            }
            case "nan": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [nan]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).nan();
              // break;
            }
            case "never": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [never]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).never();
              // break;
            }
            case "null": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [null]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).null();
              // break;
            }
            case "oboolean": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [oboolean]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).oboolean();
              // break;
            }
            case "unknown": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [unknown]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).unknown();
              // break;
            }
            case "ostring": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [ostring]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).ostring();
              // break;
            }
            case "void": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [void]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).void();
              // break;
            }
            case "optional": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [optional]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).optional();
              // break;
            }
            case "array": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [array]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).array();
              // break;
            }
            case "nullish": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [nullish]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).nullish();
              // break;
            }
            case "nullable": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [nullable]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).nullable();
              // break;
            }
            case "date": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [date]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).date();
              // break;
            }
            case "datetime": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [datetime]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).datetime();
              // break;
            }
            case "time": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - Ok this calledFunction is an [time]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller DOES endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCaller=[${descendantCaller}],
                descendantCalledFunction=[${descendantCalledFunction}]
              )`)
              return this.instantiateLeafFunctionCallFrom(
                descendantCaller,
                descendantCalledFunction
              ).time();
              // break;
            }
  
            default:
              throw new Error(
                `[@ZodSchemaParser].[instantiateLeafFunctionCallFrom(caller: string, calledFunction: string): any] - caller is not the zod named import and caller.endsWith('()') - ERROR, could not determine the zod function which matches the provided parameter[calledFunction=${calledFunction}]`
              );
              break;
          }
        } else {
          /**
           * Here the caller:
           * - is not the zod named import (so its a function call)
           * - is not a leaf function call
           * - therefore, it is a function call with parameter(s)
           * - and thereafter, it is a single function call:
           *
           * > with zod, you can't chain 2 functions with no parameter(s) for the first function, and parameter(s) for the second called function
           * > with zod, you can't chain 2 functions both with parameters
           *
           *
           * e.g.:
           *
           * <code>
           * // this can never be accepted by the zod framework
           * z.somefuntion().someOtherFuntion(<here other params>)
           * </code>
           *
           * <code>
           * // this can never be accepted by the zod framework
           * z.somefuntion(<here some params>).someOtherFuntion(<here other params>)
           * </code>
           *
           * ---
           *
           * An example of this case to process could
           * be a caller of the below form:
           *
           * <code>
           * z.array(z.string().nullable())
           * </code>
           */
          let firstIndexOfDotInCaller = caller.indexOf(`.`);
          let firstIndexOfOpeningBraceInCaller = caller.indexOf(`(`);
          let lastIndexOfClosingBraceInCaller = caller.lastIndexOf(`)`);
          let descendantCaller = caller.substring(0, firstIndexOfDotInCaller);
          let descendantCalledFunction = caller.substring(
            firstIndexOfDotInCaller + 1,
            firstIndexOfOpeningBraceInCaller
          );
          let descendantCalledFunctionParams = caller
            .substring(
              firstIndexOfOpeningBraceInCaller + 1,
              lastIndexOfClosingBraceInCaller
            )
            .split(`,`);
          if (!(descendantCaller == this.nameOfTheZodImport)) {
            throw new Error(
              `[@ZodSchemaParser].[instantiateLeafFunctionCallFrom(caller: string, calledFunction: string): any] - caller is not the zod named import and caller does NOT .endsWith('()') - ERROR, the {descendantCaller=[${descendantCaller}]} was expected to be the zod named import = [${this.nameOfTheZodImport}], but it is not.`
            );
          } // so here we can return z in place of 'descendantCaller'
  
          if (!(descendantCalledFunctionParams.length == 1)) {
            throw new Error(
              `[@ZodSchemaParser].[instantiateLeafFunctionCallFrom(caller: string, calledFunction: string): any] - caller is not the zod named import and caller does NOT .endsWith('()') - ERROR, the {descendantCalledFunctionParams.length} is expected to be exactly 1, but {descendantCalledFunctionParams.length=[${descendantCalledFunctionParams.length}]}`
            );
          } // so here we can return z in place of 'descendantCaller'
  
          /// BEGIN SURGERY
  
          switch (calledFunction) {
            case "string": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [string]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).string();
              // break;
            }
            case "boolean": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [boolean]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).boolean();
              // break;
            }
            case "number": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [number]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).number();
              // break;
            }
            case "any": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [any]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).any();
              // break;
            }
            case "bigint": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [bigint]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).bigint();
              // break;
            }
            case "date": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [date]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).date();
              // break;
            }
            case "function": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [function]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).function();
              // break;
            }
            case "nan": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [nan]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).nan();
              // break;
            }
            case "never": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [never]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).never();
              // break;
            }
            case "null": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [null]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).null();
              // break;
            }
            case "oboolean": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [oboolean]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).oboolean();
              // break;
            }
            case "unknown": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [unknown]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).unknown();
              // break;
            }
            case "ostring": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [ostring]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).ostring();
              // break;
            }
            case "void": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [void]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).void();
              // break;
            }
            case "optional": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [optional]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).optional();
              // break;
            }
            case "array": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [array]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).array();
              // break;
            }
            case "nullish": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [nullish]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).nullish();
              // break;
            }
            case "nullable": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [nullable]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).nullable();
              // break;
            }
            case "time": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [time]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).time();
              // break;
            }
            case "datetime": {
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - Ok this calledFunction is an [datetime]`);
              console.log(`[@ZodSchemaParser].[instantiateLeafFunctionCallFrom()] - caller does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction=[${descendantCalledFunction}],
                descendantCalledFunctionParams[0]=[${descendantCalledFunctionParams[0]}]
              )`)
              return this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              ).datetime();
              // break;
            }
  
            default:
              throw new Error(
                `[@ZodSchemaParser].[instantiateLeafFunctionCallFrom(caller: string, calledFunction: string): any] - caller is not the zod named import and caller does NOT .endsWith('()') - ERROR, could not determine the zod function which matches the provided parameter[calledFunction=${calledFunction}]`
              );
              break;
          }
  
          /// END OF SURGERY
        }
      }
    }
  
    /**
     * This method returns <pre>z.calledFunction(<instantiated descendantCalledFunctionParam>)</pre>
     * @param calledFunction the name of a zod function, which is assumed to be called directly by the named zod import <pre>this.nameOfTheZodImport</pre>
     * @param calledFunctionParam the single parameter passed to the zod function call
     */
    private instantiateFunctionCalledWithParamsFrom(
      calledFunction: string,
      calledFunctionParam: string
    ): any {
      console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - START with params calledFunction=[${calledFunction}] calledFunctionParam=[${calledFunctionParam}]`);
      let toReturn: any;
      if (calledFunctionParam.endsWith(`()`)) {
        let lastIndexOfDotInParams = calledFunctionParam.lastIndexOf(`.`);
        let descendantCallerInParams = calledFunctionParam.substring(
          0,
          lastIndexOfDotInParams
        );
        let descendantCalledFunctionInParams = calledFunctionParam
          .substring(lastIndexOfDotInParams + 1)
          .split(`(`)[0];
  
        /// BEGIN SURGERY 2
  
        switch (calledFunction) {
          case "string": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - Ok this calledFunction is an [string]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.string(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "boolean": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [boolean]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.boolean(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "number": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [number]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.number(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "any": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [any]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.any(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "bigint": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [bigint]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.bigint(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "date": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [date]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.date(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "function": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [function]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.function(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "nan": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [nan]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.nan(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "never": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [never]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.never(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "null": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [null]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.null(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "oboolean": {
            throw new Error(
              `[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom(calledFunction: string, calledFunctionParam: string): any] - calledFunctionParam does endsWith('()') - ERROR, [oboolean] zod function cannot be called with a parameter`
            );
            //return z.oboolean(this.instantiateLeafFunctionCallFrom(descendantCallerInParams, descendantCalledFunctionInParams))
            break;
          }
          case "unknown": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [unknown]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.unknown(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "ostring": {
            throw new Error(
              `[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom(calledFunction: string, calledFunctionParam: string): any] - calledFunctionParam does endsWith('()') - ERROR, [ostring] zod function cannot be called with a parameter`
            );
            // return z.ostring(this.instantiateLeafFunctionCallFrom(descendantCallerInParams, descendantCalledFunctionInParams))
            break;
          }
          case "void": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - Ok this calledFunction is an [void]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.void(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "optional": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  Ok this calledFunction is an [optional]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') -  will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            console.log(`Ok this calledFunction is an [optional]`);
            toReturn = z.optional(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "array": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - Ok this calledFunction is an [array]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            console.log(`Ok this calledFunction is an [array]`);
            toReturn = z.array(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
          case "nullable": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - Ok this calledFunction is an [nullable]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does endsWith('()') - will call this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams=[${descendantCallerInParams}],
                descendantCalledFunctionInParams=[${descendantCalledFunctionInParams}]
              )`)
            toReturn = z.nullable(
              this.instantiateLeafFunctionCallFrom(
                descendantCallerInParams,
                descendantCalledFunctionInParams
              )
            );
            break;
          }
  
          default: {
            throw new Error(
              `[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom(calledFunction: string, calledFunctionParam: string): any] - calledFunctionParam does endsWith('()') - ERROR, could not determine the zod function which matches the provided parameter[calledFunction=${calledFunction}]`
            );
            break;
          }
        }
        return toReturn;
        /// END SURGERY 2
      } else {
        /**
         * Here the <pre>calledFunctionParam</pre>:
         * - it is a function call
         * - is not a leaf function call ( does not end with '()' )
         * - therefore, it is a function call with parameter(s)
         * - and thereafter, it is a single function call:
         *
         * > with zod, you can't chain 2 functions with no parameter(s) for the first function, and parameter(s) for the second called function
         * > with zod, you can't chain 2 functions both with parameters
         *
         *
         * e.g.:
         *
         * <code>
         * // this can never be accepted by the zod framework
         * z.somefuntion().someOtherFuntion(<here other params>)
         * </code>
         *
         * <code>
         * // this can never be accepted by the zod framework
         * z.somefuntion(<here some params>).someOtherFuntion(<here other params>)
         * </code>
         *
         * ---
         *
         * An example of this case to process could
         * be a <pre>calledFunctionParam</pre> of the below form:
         *
         * <code>
         * z.array(z.string().nullable())
         * </code>
         */
        let firstIndexOfDotInCaller = calledFunctionParam.indexOf(`.`);
        let firstIndexOfOpeningBraceInCaller = calledFunctionParam.indexOf(`(`);
        let lastIndexOfClosingBraceInCaller =
          calledFunctionParam.lastIndexOf(`)`);
        let descendantCaller = calledFunctionParam.substring(
          0,
          firstIndexOfDotInCaller
        );
        let descendantCalledFunction = calledFunctionParam.substring(
          firstIndexOfDotInCaller + 1,
          firstIndexOfOpeningBraceInCaller
        );
        let descendantCalledFunctionParams = calledFunctionParam
          .substring(
            firstIndexOfOpeningBraceInCaller + 1,
            lastIndexOfClosingBraceInCaller
          )
          .split(`,`);
        if (!(descendantCaller == this.nameOfTheZodImport)) {
          throw new Error(
            `[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom(caller: string, calledFunction: string): any] - {calledFunction}=[${calledFunction}] {calledFunctionParam}=[${calledFunctionParam}] is not the zod named import and {calledFunctionParam} does NOT .endsWith('()') - ERROR, the {descendantCaller=[${descendantCaller}]} was expected to be the zod named import = [${this.nameOfTheZodImport}], but it is not.`
          );
        } // so here we can return z in place of 'descendantCaller'
  
        if (!(descendantCalledFunctionParams.length == 1)) {
          throw new Error(
            `[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom(caller: string, calledFunction: string): any] - {calledFunction}=[${calledFunction}] {calledFunctionParam}=[${calledFunctionParam}] is not the zod named import and {calledFunctionParam} does NOT .endsWith('()') - ERROR, the {descendantCalledFunctionParams.length} is expected to be exactly 1, but {descendantCalledFunctionParams.length=[${descendantCalledFunctionParams.length}]}`
          );
        } // so here we can return z in place of 'descendantCaller'
  
        /// BEGIN SURGERY
  
        switch (calledFunction) {
          case "string": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [string]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.string(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "boolean": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [boolean]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.boolean(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "number": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [number]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.number(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "any": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [any]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.any(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "bigint": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [bigint]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.bigint(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "date": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [date]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.date(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "function": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [function]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.function(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "nan": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [nan]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.nan(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "never": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [never]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.never(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "null": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [null]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.null(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "oboolean": {
            throw new Error(
              `[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom(calledFunction: string, calledFunctionParam: string): any] - calledFunctionParam does NOT endsWith('()') - ERROR, [oboolean] zod function cannot be called with a parameter`
            );
            // return z.oboolean(this.instantiateFunctionCalledWithParamsFrom(descendantCalledFunction, descendantCalledFunctionParams[0]))
            // break;
          }
          case "unknown": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [unknown]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.unknown(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "ostring": {
            throw new Error(
              `[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom(calledFunction: string, calledFunctionParam: string): any] - calledFunctionParam does NOT endsWith('()') - ERROR, [ostring] zod function cannot be called with a parameter`
            );
            // return z.ostring(this.instantiateFunctionCalledWithParamsFrom(descendantCalledFunction, descendantCalledFunctionParams[0]))
            // break;
          }
          case "void": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [void]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.void(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "optional": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [optional]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.optional(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "array": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [array]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.array(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
          case "nullable": {
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - Ok this calledFunction is an [nullable]`);
            console.log(`[@ZodSchemaParser].[instantiateFunctionCalledWithParamsFrom()] - calledFunctionParam does NOT endsWith('()') - will call this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction="${descendantCalledFunction}",
                descendantCalledFunctionParams[0]="${descendantCalledFunctionParams[0]}"
              )`)
            toReturn = z.nullable(
              this.instantiateFunctionCalledWithParamsFrom(
                descendantCalledFunction,
                descendantCalledFunctionParams[0]
              )
            );
            break;
          }
  
          default:
            throw new Error(
              `[@ZodSchemaParser].[instantiateLeafFunctionCallFrom(caller: string, calledFunction: string): any] - caller is not the zod named import and caller does NOT .endsWith('()') - ERROR, could not determine the zod function which matches the provided parameter[calledFunction=${calledFunction}]`
            );
            break;
        }
        return toReturn;
        /// END OF SURGERY
      }
    }
  }
  
  // export type ZodFuncReturnType = z.ZodString | z.ZodBoolean | z.ZodAny | z.ZodBoolean | z.ZodBigInt | z.ZodDate | z.ZodNaN | z.ZodNever | z.ZodNull | z.ZodNumber ;
  // z.ZodTypeAny
  // z.ZodType
  // export declare class ZodString extends ZodType<string, ZodStringDef, string> {
  // so my recursive methods probably wil have to be generic: i started with 'any'
  
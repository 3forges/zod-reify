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
//import { number, z, type AnyZodObject } from "zod";
import { z } from "zod";

export interface Reifier<X> {
  reify(): X;
}
/**
 * The {@ZodSchemaReifier } class will parse a string assumed to be a zod schema source code, and will instantiate the Zod Schema.
 */
export class ZodSchemaReifier implements Reifier<any> {
  /**
   * The unique ID of
   * this {@ZodSchemaReifier } instance.
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
   * The {@ZodSchemaReifier } will always use
   * 'import { z } from "zod";' as the zod import,
   * since it is not provided by the user of the {@ZodSchemaReifier } class.
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
   * The {@ZodSchemaReifier } will always use 'z' as
   * the name of the zod import, since it is not
   * provided by the user of the {@ZodSchemaReifier } class.
   *
   * Why? because we don't care what is
   * the name of the zod import, we
   * care about instiating the Zod Schema.
   *
   */
  private nameOfTheZodImport: string;
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
      `[@ZodSchemaReifier].[constructor] zod schema provided to constructor:`,
      zodSchemaAsString
    );
    this.zodSchemaVarDeclaration = {
      name: `doesntMatter`,
      initializer: zodSchemaAsString // zodSchemaAsString.replace(/new ?/g, "new-").replace(/\s|\\n?/g, "").replace(/new-?/g, "new "),
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

    this.initZodExpressionNode();
    console.info(
      `[@ZodSchemaReifier].[constructor] After [this.initZodExpressionNode()], [this.zodExpressionNode] is :`,
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
    zodSchemaVarDeclaration.forEachDescendant(
      (node: Node, traversal: ForEachDescendantTraversalControl) => {
        // traversal.skip()
        // traversal.up()
        // traversal.stop()
        console.log(
          `[@ZodSchemaReifier].[initZodExpressionNode()] - WALKING DESCENDANTS OF VAR DECLARATION, current node = [${node.print()}]`
        );
        if (node.print() != this.zodSchemaVarDeclaration.name) {
          // const isYieldExpression = Node.isYieldExpression(node)
          //const isLiteralExpression = Node.isLiteralExpression(node)
          //const isExpressionStatement = Node.isExpressionStatement(node)
          // console.log(
          //   `[@ZodSchemaReifier].[initZodExpressionNode()] - zodSchemaVarDeclaration.forEachDescendant() -----------------------------------------`
          // );
          this.zodExpressionNode = node;
          traversal.stop();
        }
      }
    );
  }

  /**
   * This method will be a full reccurence:
   * 
   * @param aZodExpressionNode ts-morph / TypeScript Compiler API
   * @returns the reified typescript object, returned by the zod expression
   */
  public reify(aZodExpressionNode?: Node<ts.Node>): any {
    /**
     * The Object to return:
     * Instead of that object, the experiment method will return the instantiated zod object
     * so reify is the prototype for the
     * generalized algorithm() which will replace parse()
     */
    let toReturn: any = null;

    /**
     * We either:
     * - gather (into {toReturn.noArgsFunctionCallsStack}) the top zod function called without argument, and proceed traversing the descendants,
     * - or gather (into {toReturn.topZodFunctionCallWithArgs}) the top zod function called WITH argument(s): we then know that it is the zod function call "on the extreme left", meaning that the object calling that function is the zod named import. So we return, we do not need to proceed traversing the descendants.
     */
    const processedNode = aZodExpressionNode || this.zodExpressionNode;
    console.log(
      `[@ZodSchemaReifier].[reify()] - START - processedNode.getKindName() : [${processedNode.getKindName()}] - processedNode is [${processedNode.print()}]`
    );
    if (Node.isCallExpression(processedNode)) {
      console.log(
        `[@ZodSchemaReifier].[reify()] - selected CallExpression node [KindName=${processedNode.getKindName()}] is :[${processedNode.print()}]`
      );
      const childrenArray: Node<ts.Node>[] =
        processedNode.forEachChildAsArray();
      const childrenOfChildrensArray: Node<ts.Node>[] =
        childrenArray[0].forEachChildAsArray();
      const descendantsArray: Node<ts.Node>[] =
        processedNode.forEachDescendantAsArray();

      console.log(
        `[@ZodSchemaReifier].[reify()] - selected CallExpression node children count is :[${childrenArray.length}]`
      );
      console.log(
        `[@ZodSchemaReifier].[reify()] - selected CallExpression node descendantsArray count is :[${descendantsArray.length}]`
      );
      /*
        descendantsArray.forEach((node:Node<ts.Node>) => {
          console.log(
            `[@ZodSchemaReifier].[reify()] - processedNode descendantsArray.forEach descendant node is :[${node.print()}]`
          );
        })
        */
      const printedChildrenArray = childrenArray.map((node: Node<ts.Node>) => {
        return node.print();
      });

      /*
        const printedDescendantsArray = descendantsArray.map((node:Node<ts.Node>) => {
          return node.print()
        })
        */
      console.log(
        `[@ZodSchemaReifier].[reify()] - processedNode printedChildrenArray is :[${JSON.stringify(
          {
            printedChildrenArray: printedChildrenArray,
          },
          null,
          2
        )}]`
      );
      if (childrenArray.length == 2) {
        // i.e.: if the function call has parameters

        let lastIndexOfDot = childrenArray[0].print().lastIndexOf(`.`);
        let calledFunctionName = childrenArray[0].print().substring(
          lastIndexOfDot + 1 // + 1 : to exclude the dot character
        );

        const passedArgument = childrenArray[1];
        console.log(
          `[@ZodSchemaReifier].[reify()] - calledFunctionName is :[${calledFunctionName}]`
        );
        const printedChildrenOfChildrensArray = childrenOfChildrensArray.map(
          (node: Node<ts.Node>) => {
            return node.print();
          }
        );
        console.log(
          `[@ZodSchemaReifier].[reify()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify(
            {
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray,
            },
            null,
            2
          )}]`
        );
        const caller = childrenOfChildrensArray[0];
        console.log(
          `[@ZodSchemaReifier].[reify()] - processedNode caller is :[${caller.print()}]`
        );
        return this.reifyZodFunctionCallWithOneArg(
          this.reify(caller),
          calledFunctionName,
          this.reify(passedArgument)
        );
      } else if (childrenArray.length == 1) {
        // i.e.: if function is called without parameters
        let lastIndexOfDot = childrenArray[0].print().lastIndexOf(`.`);
        let calledFunctionName = childrenArray[0].print().substring(
          lastIndexOfDot + 1 // + 1 : to exclude the dot character
        );
        console.log(
          `[@ZodSchemaReifier].[reify()] - calledFunctionName is :[${calledFunctionName}]`
        );
        const printedChildrenOfChildrensArray = childrenOfChildrensArray.map(
          (node: Node<ts.Node>) => {
            return node.print();
          }
        );
        console.log(
          `[@ZodSchemaReifier].[reify()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify(
            {
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray,
            },
            null,
            2
          )}]`
        );
        const caller = childrenOfChildrensArray[0];
        console.log(
          `[@ZodSchemaReifier].[reify()] - processedNode caller is :[${caller.print()}]`
        );
        return this.reifyNoArgsZodFunctionCall(
          this.reify(caller),
          calledFunctionName
        );
      } else if (childrenArray.length == 3) {
        // i.e.: if the function call has parameters

        let lastIndexOfDot = childrenArray[0].print().lastIndexOf(`.`);
        let calledFunctionName = childrenArray[0].print().substring(
          lastIndexOfDot + 1 // + 1 : to exclude the dot character
        );
        console.log(
          `[@ZodSchemaReifier].[reify()] - calledFunctionName is :[${calledFunctionName}]`
        );
        const firstPassedArgument = childrenArray[1];
        console.log(
          `[@ZodSchemaReifier].[reify()] - firstPassedArgument is :[${firstPassedArgument}]`
        );
        const secondPassedArgument = childrenArray[2];
        console.log(
          `[@ZodSchemaReifier].[reify()] - secondPassedArgument is :[${secondPassedArgument}]`
        );
        const printedChildrenOfChildrensArray = childrenOfChildrensArray.map(
          (node: Node<ts.Node>) => {
            return node.print();
          }
        );
        console.log(
          `[@ZodSchemaReifier].[reify()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify(
            {
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray,
            },
            null,
            2
          )}]`
        );
        const caller = childrenOfChildrensArray[0];
        console.log(
          `[@ZodSchemaReifier].[reify()] - processedNode caller is :[${caller.print()}]`
        );
        return this.reifyZodFunctionCallWithTwoArgs(// reifyZodFunctionCallWithOneArg(
          this.reify(caller),
          calledFunctionName,
          this.reify(firstPassedArgument),
          this.reify(secondPassedArgument)
        );
      } else if (childrenArray.length > 3) {
        throw new Error(
          `[@ZodSchemaReifier].[reify()] - reifying a zod function call which has more than 3 passed arguments is not supported yet.`
        );
      }
    } else if (Node.isObjectLiteralExpression(processedNode)) {
      // that for the object function case
      return this.reifyObjectLiteralExpression(processedNode);
    } else if (Node.isArrayLiteralExpression(processedNode)) {
      // that's for the tuple function case
      return this.reifyArrayLiteralExpression(processedNode);
    } else if (processedNode.print() == `${this.nameOfTheZodImport}`) {
      return z;
    } else if (Node.isBigIntLiteral(processedNode)) {
      return processedNode.print() // There I do not know what TypeScript type to return, sice Bigint is not supported by TypeScript // parseInt(processedNode.print())
    } else if (Node.isNumericLiteral(processedNode)) {
      try {
        return parseInt(processedNode.print())
      } catch (error) {
        try {
          return parseFloat(processedNode.print())
        } catch (error) {
          throw new Error(`[@ZodSchemaReifier].[reify()] - processedNode = [${processedNode.print()}] is a numeric literal, but it is neither a Float, nor an Integer, and not even a BigInt`)
        }
      }
    }  else if (Node.isStringLiteral(processedNode)) {
      return processedNode.print()
    } else if (Node.isFalseLiteral(processedNode)) {
      return false
    } /*else if (Node.isUnaryExpression(processedNode) && !Node.isTrueLiteral(processedNode) && !Node.isFalseLiteral(processedNode)) {
      // I am excluding UnaryExpression, because
      // an UnaryExpression can be many things  like an Array, 
      // cf. https://github.com/dsherret/ts-morph/blob/ccf1bd58a522e7b4df179eb89876b86f603afde7/packages/ts-morph/src/compiler/ast/common/Node.ts#L4158
      // 
      throw new Error(`[@ZodSchemaReifier].[reify()] - processedNode=[${processedNode.print()}] is an Unary Expression, zod reify does not yet support reifying Unary Expressions (but will in the future).`)
    } */else if (Node.isBinaryExpression(processedNode)) {
      throw new Error(`[@ZodSchemaReifier].[reify()] - processedNode=[${processedNode.print()}] is a Binary Expression, zod reify does not yet support reifying Binary Expressions (but will in the future).`)
    } /* else if (Node.isIdentifier(processedNode)) {
      // I am not sure about isIdentifier: IS the zod named import an Identifier ?
      throw new Error(`[@ZodSchemaReifier].[reify()] - processedNode=[${processedNode.print()}] is an identifier, zod reify does not support external dependencies inside the zod schema.`)
    } */else if (Node.isUndefinedKeyword(processedNode)) {
      return undefined
    } else if (Node.isNullLiteral(processedNode)) {
      return null
    } else if (Node.isTrueLiteral(processedNode)) {
      return true
    } else if (Node.isPropertyAccessExpression(processedNode)) {
      console.log(
        `[@ZodSchemaReifier].[reify()] - selected PropertyAccessExpression node [KindName=${processedNode.getKindName()}] is :[${processedNode.print()}]`
      );
      const childrenArray: Node<ts.Node>[] =
        processedNode.forEachChildAsArray();
      const childrenOfChildrensArray: Node<ts.Node>[] =
        childrenArray[0].forEachChildAsArray();


      console.log(
        `[@ZodSchemaReifier].[reify()] - case of Property Access Expression - processedNode children count is :[${childrenArray.length}]`
      );
      console.log(
        `[@ZodSchemaReifier].[reify()] - case of Property Access Expression - processedNode childrenOfChildrensArray count is :[${childrenOfChildrensArray.length}]`
      );

      const printedChildrenArray = childrenArray.map((node: Node<ts.Node>) => {
        return node.print();
      });
      const printedChildrenOfChildrensArray = childrenOfChildrensArray.map((node: Node<ts.Node>) => {
        return node.print();
      });
      console.log(
        `[@ZodSchemaReifier].[reify()] - case of Property Access Expression - processedNode printedChildrenArray is :[${JSON.stringify(
          {
            printedChildrenArray: printedChildrenArray,
          },
          null,
          2
        )}]`
      );
      console.log(
        `[@ZodSchemaReifier].[reify()] - case of Property Access Expression - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify(
          {
            printedChildrenOfChildrensArray: printedChildrenOfChildrensArray,
          },
          null,
          2
        )}]`
      );
      if (printedChildrenArray.length == 2) {
        console.log(
          `[@ZodSchemaReifier].[reify()] - case of Property Access Expression - processedNode childrenArray[0].print() is :[${childrenArray[0].print()}]`)
        console.log(
          `[@ZodSchemaReifier].[reify()] - case of Property Access Expression - processedNode childrenArray[1].print() is :[${childrenArray[1].print()}]`)
        
        if (`${childrenArray[0].print()}` == `${this.nameOfTheZodImport}` && `${childrenArray[1].print()}` == `coerce` ) {
          return z.coerce
        } else {
          throw new Error(`[@ZodSchemaReifier].[reify()] - case of Property Access Expression - this property access expression is not [z.coerce], it is not supported.`)
        }
      } else {
        throw new Error(`[@ZodSchemaReifier].[reify()] - case of Property Access Expression - this property access expression is not [z.coerce], it is not supported.`)
      }
      //throw new Error(`[@ZodSchemaReifier].[reify()] - case of Property Access Expression - implementation not completed yet.`)
    } else if (Node.isNewExpression(processedNode)) {
      console.log(
        `[@ZodSchemaReifier].[reify()] - selected NewExpression node [KindName=${processedNode.getKindName()}] is :[${processedNode.print()}]`
      );
      const childrenArray: Node<ts.Node>[] =
        processedNode.forEachChildAsArray();
      const childrenOfChildrensArray: Node<ts.Node>[] =
        childrenArray[0].forEachChildAsArray();


      console.log(
        `[@ZodSchemaReifier].[reify()] - case of NewExpression - processedNode children count is :[${childrenArray.length}]`
      );
      console.log(
        `[@ZodSchemaReifier].[reify()] - case of NewExpression - processedNode childrenOfChildrensArray count is :[${childrenOfChildrensArray.length}]`
      );

      const printedChildrenArray = childrenArray.map((node: Node<ts.Node>) => {
        return node.print();
      });
      const printedChildrenOfChildrensArray = childrenOfChildrensArray.map((node: Node<ts.Node>) => {
        return node.print();
      });
      console.log(
        `[@ZodSchemaReifier].[reify()] - case of NewExpression - processedNode printedChildrenArray is :[${JSON.stringify(
          {
            printedChildrenArray: printedChildrenArray,
          },
          null,
          2
        )}]`
      );
      console.log(
        `[@ZodSchemaReifier].[reify()] - case of NewExpression - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify(
          {
            printedChildrenOfChildrensArray: printedChildrenOfChildrensArray,
          },
          null,
          2
        )}]`
      );
      if (childrenArray.length == 1) { // e.g. new Date()
        this.reifyZodNewExpressionWithOneArg(`${childrenArray[0].print()}`)// .reifyZodFunctionCallWithOneArg
      }
      if (childrenArray.length == 2) { // e.g. new Date("1901-01-02")
        this.reifyZodNewExpressionWithOneArg(`${childrenArray[0].print()}`, this.reify(childrenArray[1]))// .reifyZodFunctionCallWithOneArg
      } else if (childrenArray.length == 3) {
        // this.reifyZodNewExpressionWithTwoArgs(`${childrenArray[0].print()}`, this.reify(childrenArray[1]), this.reify(childrenArray[2])) // .reifyZodFunctionCallWithTwoArg
        throw new Error(`[@ZodSchemaReifier].[reify()] - case of NewExpression - reifying a NewExpression for a builtin class  with a 2 arguments constructor is not supported yet. (class name = ${childrenArray[0].print()}) (constructor arg 1 = ${childrenArray[1].print()}) (constructor arg 2 = ${childrenArray[2].print()})`)
      }
      
      
    } else {
      throw new Error(
        `[@ZodSchemaReifier].[reify()] - processed node is not an ObjectLiteralExpression, not an ArrayLiteralExpression, not a CallExpression:  - processedNode.getKindName() : [${processedNode.getKindName()}] - processedNode is [${processedNode.print()}]`
      );
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

  private reifyZodNewExpressionWithOneArg(
    className: string,
    firstPassedArgument?: any, /* Node<ts.Node> */
  ): any {
    
    switch (
      className // reifyNoArgsZodFunctionCallsChain
    ) {
      case "Date": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodNewExpressionWithOneArg()] - Ok zod functionName is [${className}]`
        );
        if (firstPassedArgument) {
          return new Date(firstPassedArgument);
        } else {
          return new Date();
        }
        // break;
      }
      case "Set": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodNewExpressionWithOneArg()] - Ok zod functionName is [${className}]`
        );
        if (firstPassedArgument) {
          return new Set(firstPassedArgument);
        } else {
          return new Set();
        }
        // break;
      }
      case "Array": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodNewExpressionWithOneArg()] - Ok zod functionName is [${className}]`
        );
        if (firstPassedArgument) {
          return new Array(firstPassedArgument);
        } else {
          return new Array();
        }
        // break;
      }

      default: {
        throw new Error(
          `[@ZodSchemaReifier].[reifyZodNewExpressionWithOneArg(): any] - ERROR, could not reify the new expression for class [className=${className}]`
        );
        break;
      }

    }
    
  }

  private reifyZodFunctionCallWithTwoArgs(
    caller: any,
    calledFunctionName: string,
    firstPassedArgument: any, /* Node<ts.Node> */
    secondPassedArgument: any /* Node<ts.Node> */
  ): any {
    let toReturn = caller;
    switch (
      calledFunctionName // reifyNoArgsZodFunctionCallsChain
    ) {
      case "string": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [string]`
        );
        return caller.string(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "boolean": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [boolean]`
        );
        return caller.boolean(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "number": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [number]`
        );
        return caller.number(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "any": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [any]`
        );
        return caller.any(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "bigint": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [bigint]`
        );
        return caller.bigint(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "date": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [date]`
        );
        return caller.date(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "datetime": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [datetime]`
        );
        return caller.datetime(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "function": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [function]`
        );
        return caller.function(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "nan": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [nan]`
        );
        return caller.nan(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "never": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [never]`
        );
        return caller.never(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "null": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [null]`
        );
        return caller.null(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "oboolean": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [oboolean]`
        );
        return caller.oboolean(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "unknown": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [unknown]`
        );
        return caller.unknown(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "ostring": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [ostring]`
        );
        return caller.ostring(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "void": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [void]`
        );
        return caller.void(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "nullable": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [nullable]`
        );
        return caller.nullable(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "nullish": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [nullish]`
        );
        return caller.nullish(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "object": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [object]`
        );
        return caller.object(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "tuple": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [tuple]`
        );
        return caller.tuple(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "array": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [array]`
        );
        return caller.array(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "optional": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [optional]`
        );
        return caller.optional(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "required": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [required]`
        );
        return caller.required(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "passthrough": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [passthrough]`
        );
        return caller.passthrough(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "strict": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [strict]`
        );
        return caller.strict(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "strip": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [strip]`
        );
        return caller.strip(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "default": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [default]`
        );
        return caller.default(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "describe": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [describe]`
        );
        return caller.describe(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "promise": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [promise]`
        );
        return caller.promise(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "readonly": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [readonly]`
        );
        return caller.readonly(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "gt": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [gt]`
        );
        return caller.gt(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "gte": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [gte]`
        );
        return caller.gte(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "lt": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [lt]`
        );
        return caller.lt(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "lte": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [lte]`
        );
        return caller.lte(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "int": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [int]`
        );
        return caller.int(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "positive": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [positive]`
        );
        return caller.positive(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "nonnegative": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [nonnegative]`
        );
        return caller.nonnegative(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "negative": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [negative]`
        );
        return caller.negative(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "nonpositive": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [nonpositive]`
        );
        return caller.nonpositive(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "multipleOf": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [multipleOf]`
        );
        return caller.multipleOf(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "finite": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [finite]`
        );
        return caller.finite(firstPassedArgument, secondPassedArgument);
        // break;
      }
      case "safe": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs()] - Ok zod functionName is [safe]`
        );
        return caller.safe(firstPassedArgument, secondPassedArgument);
        // break;
      }

      default: {
        throw new Error(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithTwoArgs(): any] - ERROR, could not determine the zod function which matches [calledFunctionName=${calledFunctionName}]`
        );
        break;
      }

    }
    throw new Error("Method implementation not completed yet.");
  }
  
  private reifyArrayLiteralExpression(
    processedNode: ArrayLiteralExpression
  ): any {
    let reifiedArrayLiteralExpression: any[] = [];

    if (Node.isArrayLiteralExpression(processedNode)) {
      const elementsofTheArray = processedNode.getElements();
      for (let k = 0; k < elementsofTheArray.length; k++) {
        const elementOfTheArray = elementsofTheArray[k];
        console.log(
          `[@ZodSchemaReifier].[reifyArrayLiteralExpression()] - elementOfTheArray = [${elementOfTheArray.print()}]`
        );

        const childrenArray: Node<ts.Node>[] =
          processedNode.forEachChildAsArray();
        const childrenOfChildrensArray: Node<ts.Node>[] =
          childrenArray[0].forEachChildAsArray();

        const printedChildrenArray = childrenArray.map(
          (node: Node<ts.Node>) => {
            return node.print();
          }
        );
        const printedChildrenOfChildrensArray = childrenOfChildrensArray.map(
          (node: Node<ts.Node>) => {
            return node.print();
          }
        );
        console.log(
          `[@ZodSchemaReifier].[reifyArrayLiteralExpression()] - processedNode printedChildrenArray is :[${JSON.stringify(
            {
              printedChildrenArray: printedChildrenArray,
            },
            null,
            2
          )}]`
        );
        console.log(
          `[@ZodSchemaReifier].[reifyArrayLiteralExpression()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify(
            {
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray,
            },
            null,
            2
          )}]`
        );
        reifiedArrayLiteralExpression.push(
          this.reify(elementOfTheArray)
        );
        console.log(
          `[@ZodSchemaReifier].[reifyArrayLiteralExpression()] - reifiedArrayLiteralExpression is now :[${JSON.stringify(
            {
              reifiedArrayLiteralExpression: reifiedArrayLiteralExpression.map(
                (node) => {
                  return node.toString(); /*.print()*/
                }
              ),
            },
            null,
            2
          )}]`
        );
      } // end of for loop over Array literal elements
    } else {
      throw new Error(
        `[@ZodSchemaReifier].[reifyArrayLiteralExpression()] - provided processedNode should be an [ArrayLiteralExpression], but it is not.`
      );
    }
    return reifiedArrayLiteralExpression;
  }

  /**
   * Ok i could determine it is this function which has a bug, especially when a property is itself an object literal
   * @param processedNode
   * @returns
   */
  private reifyObjectLiteralExpression(
    processedNode: ObjectLiteralExpression
  ): any {
    let reifiedJsonObjectLiteralExpression: any = {};

    if (Node.isObjectLiteralExpression(processedNode)) {
      const propertiesOfTheObjLiteral = processedNode.getProperties();
      for (let k = 0; k < propertiesOfTheObjLiteral.length; k++) {
        const propertyOfTheObjLiteral = propertiesOfTheObjLiteral[k];
        console.log(
          `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral = [${propertyOfTheObjLiteral.print()}]`
        );

        const childrenArray: Node<ts.Node>[] =
          propertyOfTheObjLiteral.forEachChildAsArray(); // processedNode.forEachChildAsArray()
        const childrenOfChildrensArray: Node<ts.Node>[] =
          childrenArray[0].forEachChildAsArray();

        const printedChildrenArray = childrenArray.map(
          (node: Node<ts.Node>) => {
            return node.print();
          }
        );
        const printedChildrenOfChildrensArray = childrenOfChildrensArray.map(
          (node: Node<ts.Node>) => {
            return node.print();
          }
        );
        console.log(
          `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - processedNode printedChildrenArray is :[${JSON.stringify(
            {
              printedChildrenArray: printedChildrenArray,
            },
            null,
            2
          )}]`
        );
        console.log(
          `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - processedNode printedChildrenOfChildrensArray is :[${JSON.stringify(
            {
              printedChildrenOfChildrensArray: printedChildrenOfChildrensArray,
            },
            null,
            2
          )}]`
        );
        const propStructure = propertyOfTheObjLiteral.getStructure();
        if (propStructure.kind == StructureKind.PropertyAssignment) {
          console.log(
            `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - propStructure.name = [${propStructure.name}]`
          );
          console.log(
            `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - propStructure.initializer = [${propStructure.initializer}]`
          );

          console.log(
            `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - is a PropertyAssignement so it will be : reifiedJsonObjectLiteralExpression[${
              propStructure.name
            }] = this.reify(${childrenArray[1].print()})`
          );
          reifiedJsonObjectLiteralExpression[`${propStructure.name}`] =
            this.reify(childrenArray[1]); // this.reify(childrenOfChildrensArray[1])
        } else {
          console.log(
            `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - propertyOfTheObjLiteral - is NOT a PropertyAssignement so I don't know yet how to reify it: printedChildrenArray and printedChildrenOfChildrensArray are :[${JSON.stringify(
              {
                printedChildrenOfChildrensArray:
                  printedChildrenOfChildrensArray,
                printedChildrenArray: printedChildrenArray,
              },
              null,
              2
            )}]`
          );
        }
      } // end of for loop over Object literal properties
    } else {
      throw new Error(
        `[@ZodSchemaReifier].[reifyObjectLiteralExpression()] - provided objectLiteralNode should be an [ObjectLiteralExpression], but it is not.`
      );
    }
    return reifiedJsonObjectLiteralExpression;
  }
  private reifyZodFunctionCallWithOneArg(
    caller: any,
    calledFunctionName: string,
    passedArgument: any /* Node<ts.Node> */
  ): any {
    let toReturn = caller;
    switch (
      calledFunctionName // reifyNoArgsZodFunctionCallsChain
    ) {
      case "string": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [string]`
        );
        return caller.string(passedArgument);
        // break;
      }
      case "boolean": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [boolean]`
        );
        return caller.boolean(passedArgument);
        // break;
      }
      case "number": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [number]`
        );
        return caller.number(passedArgument);
        // break;
      }
      case "any": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [any]`
        );
        return caller.any(passedArgument);
        // break;
      }
      case "bigint": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [bigint]`
        );
        return caller.bigint(passedArgument);
        // break;
      }
      case "date": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [date]`
        );
        return caller.date(passedArgument);
        // break;
      }
      case "datetime": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [datetime]`
        );
        return caller.datetime(passedArgument);
        // break;
      }
      case "function": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [function]`
        );
        return caller.function(passedArgument);
        // break;
      }
      case "nan": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nan]`
        );
        return caller.nan(passedArgument);
        // break;
      }
      case "never": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [never]`
        );
        return caller.never(passedArgument);
        // break;
      }
      case "null": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [null]`
        );
        return caller.null(passedArgument);
        // break;
      }
      case "oboolean": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [oboolean]`
        );
        return caller.oboolean(passedArgument);
        // break;
      }
      case "unknown": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [unknown]`
        );
        return caller.unknown(passedArgument);
        // break;
      }
      case "ostring": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [ostring]`
        );
        return caller.ostring(passedArgument);
        // break;
      }
      case "void": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [void]`
        );
        return caller.void(passedArgument);
        // break;
      }
      case "nullable": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nullable]`
        );
        return caller.nullable(passedArgument);
        // break;
      }
      case "nullish": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nullish]`
        );
        return caller.nullish(passedArgument);
        // break;
      }
      case "object": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [object]`
        );
        return caller.object(passedArgument);
        // break;
      }
      case "tuple": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [tuple]`
        );
        return caller.tuple(passedArgument);
        // break;
      }
      case "array": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [array]`
        );
        return caller.array(passedArgument);
        // break;
      }
      case "optional": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [optional]`
        );
        return caller.optional(passedArgument);
        // break;
      }
      case "required": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [required]`
        );
        return caller.required(passedArgument);
        // break;
      }
      case "passthrough": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [passthrough]`
        );
        return caller.passthrough(passedArgument);
        // break;
      }
      case "strict": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [strict]`
        );
        return caller.strict(passedArgument);
        // break;
      }
      case "strip": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [strip]`
        );
        return caller.strip(passedArgument);
        // break;
      }
      case "default": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [default]`
        );
        return caller.default(passedArgument);
        // break;
      }
      case "describe": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [describe]`
        );
        return caller.describe(passedArgument);
        // break;
      }
      case "promise": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [promise]`
        );
        return caller.promise(passedArgument);
        // break;
      }
      case "readonly": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [readonly]`
        );
        return caller.readonly(passedArgument);
        // break;
      }
      case "gt": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [gt]`
        );
        return caller.gt(passedArgument);
        // break;
      }
      case "gte": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [gte]`
        );
        return caller.gte(passedArgument);
        // break;
      }
      case "lt": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [lt]`
        );
        return caller.lt(passedArgument);
        // break;
      }
      case "lte": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [lte]`
        );
        return caller.lte(passedArgument);
        // break;
      }
      case "int": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [int]`
        );
        return caller.int(passedArgument);
        // break;
      }
      case "positive": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [positive]`
        );
        return caller.positive(passedArgument);
        // break;
      }
      case "nonnegative": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nonnegative]`
        );
        return caller.nonnegative(passedArgument);
        // break;
      }
      case "negative": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [negative]`
        );
        return caller.negative(passedArgument);
        // break;
      }
      case "nonpositive": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [nonpositive]`
        );
        return caller.nonpositive(passedArgument);
        // break;
      }
      case "multipleOf": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [multipleOf]`
        );
        return caller.multipleOf(passedArgument);
        // break;
      }
      case "finite": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [finite]`
        );
        return caller.finite(passedArgument);
        // break;
      }
      case "safe": {
        console.log(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg()] - Ok zod functionName is [safe]`
        );
        return caller.safe(passedArgument);
        // break;
      }

      default: {
        throw new Error(
          `[@ZodSchemaReifier].[reifyZodFunctionCallWithOneArg(): any] - ERROR, could not determine the zod function which matches [calledFunctionName=${calledFunctionName}]`
        );
        break;
      }

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
  private reifyNoArgsZodFunctionCall(
    caller: any /*Node<ts.Node>*/,
    calledFunctionName: string
  ): any {
    let toReturn = caller;
    switch (
      calledFunctionName //
    ) {
      case "string": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [string], and caller is [${caller}]`
        );
        return caller.string();
        // break;
      }
      case "boolean": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [boolean]`
        );
        return caller.boolean();
        // break;
      }
      case "number": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [number]`
        );
        return caller.number();
        // break;
      }
      case "any": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [any]`
        );
        return caller.any();
        // break;
      }
      case "bigint": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [bigint]`
        );
        return caller.bigint();
        // break;
      }
      case "date": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [date]`
        );
        return caller.date();
        // break;
      }
      case "datetime": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [datetime]`
        );
        return caller.datetime();
        // break;
      }
      case "function": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [function]`
        );
        return caller.function();
        // break;
      }
      case "nan": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nan]`
        );
        return caller.nan();
        // break;
      }
      case "never": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [never]`
        );
        return caller.never();
        // break;
      }
      case "null": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [null]`
        );
        return caller.null();
        // break;
      }
      case "oboolean": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [oboolean]`
        );
        return caller.oboolean();
        // break;
      }
      case "unknown": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [unknown]`
        );
        return caller.unknown();
        // break;
      }
      case "ostring": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [ostring]`
        );
        return caller.ostring();
        // break;
      }
      case "void": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [void]`
        );
        return caller.void();
        // break;
      }
      case "nullable": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nullable]`
        );
        return caller.nullable();
        // break;
      }
      case "nullish": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nullish]`
        );
        return caller.nullish();
        // break;
      }
      case "object": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [object]`
        );
        return caller.object();
        // break;
      }
      case "tuple": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [tuple]`
        );
        return caller.tuple();
        // break;
      }
      case "array": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [array]`
        );
        return caller.array();
        // break;
      }
      case "optional": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [optional]`
        );
        return caller.optional();
        // break;
      }
      case "required": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [required]`
        );
        return caller.required();
        // break;
      }
      case "passthrough": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [passthrough]`
        );
        return caller.passthrough();
        // break;
      }
      case "strict": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [strict]`
        );
        return caller.strict();
        // break;
      }
      case "strip": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [strip]`
        );
        return caller.strip();
        // break;
      }
      case "default": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [default]`
        );
        return caller.default();
        // break;
      }
      case "describe": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [describe]`
        );
        return caller.describe();
        // break;
      }
      case "promise": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [promise]`
        );
        return caller.promise();
        // break;
      }
      case "readonly": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [readonly]`
        );
        return caller.readonly();
        // break;
      }
      case "gt": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [gt]`
        );
        return caller.gt();
        // break;
      }
      case "gte": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [gte]`
        );
        return caller.gte();
        // break;
      }
      case "lt": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [lt]`
        );
        return caller.lt();
        // break;
      }
      case "lte": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [lte]`
        );
        return caller.lte();
        // break;
      }
      case "int": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [int]`
        );
        return caller.int();
        // break;
      }
      case "positive": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [positive]`
        );
        return caller.positive();
        // break;
      }
      case "nonnegative": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nonnegative]`
        );
        return caller.nonnegative();
        // break;
      }
      case "negative": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [negative]`
        );
        return caller.negative();
        // break;
      }
      case "nonpositive": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [nonpositive]`
        );
        return caller.nonpositive();
        // break;
      }
      case "multipleOf": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [multipleOf]`
        );
        return caller.multipleOf();
        // break;
      }
      case "finite": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [finite]`
        );
        return caller.finite();
        // break;
      }
      case "safe": {
        console.log(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall()] - Ok zod functionName is [safe]`
        );
        return caller.safe();
        // break;
      }
      default:
        throw new Error(
          `[@ZodSchemaReifier].[reifyNoArgsZodFunctionCall(): any] - ERROR, could not determine the zod function which matches [calledFunctionName=${calledFunctionName}]`
        );
        break;
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

    const errors = diagnostics.filter(
      (diagnostic: { getCategory: () => any; getCode: () => number }) => {
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
      }
    );
    if (errors.length != 0) {
      console.error(
        `There is (are) compilation error(s) inside the Zod Schema you provided as string:`
      );
      errors.forEach(
        (errorDiagnostic: {
          getCode: () => any;
          getMessageText: () => any;
          getLineNumber: () => any;
          getStart: () => any;
        }) => {
          throw new Error(
            `Compilation error inside the Zod Schema you provided as string: code=[${errorDiagnostic.getCode()}] | message=[${errorDiagnostic.getMessageText()}] | lineNumber=[${errorDiagnostic.getLineNumber()}] | start=[${errorDiagnostic.getStart()}] | `/*,
            {
              errorExitCode: errorDiagnostic.getCode(),
              errorMsg: errorDiagnostic.getMessageText(),
              errorLineNumber: errorDiagnostic.getLineNumber(),
              errorStartPosition: errorDiagnostic.getStart(),
            }
            */
          );
        }
      );
      /*
        throw new Error(
                `There is (are) compilation error(s) inside the Zod Schema you provided as string`
              );
      */
    }
  }
}

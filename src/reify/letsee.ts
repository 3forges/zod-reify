interface IConstructor<T> {
  new (...args: any[]): T;

  // Or enforce default constructor
  // new (): T;
}

interface IActivatable {
  id: number;
  name: string;
}

class ClassA implements IActivatable {
  public id!: number;
  public name!: string;
  public address!: string;
}

class ClassB implements IActivatable {
  public id!: number;
  public name!: string;
  public age!: number;
}

function activator<T extends IActivatable>(type: IConstructor<T>): T {
  return new type();
}

const classA = activator(ClassA);

/**
 * /////////////////////////////////////
 */

export class InstanceLoader<T> {
  constructor(private context: Object) {}

  // getInstance(name: string, ...args: any[]) : T {
  /*
  
      getInstance(name: keyof typeof this.context, ...args: any[]) : T {
          //str: keyof typeof myObj
          var instance = Object.create(this.context[name].prototype);
          instance.constructor.apply(instance, args);
          return <T> instance;
      }
      */
  getInstance(name: string, ...args: any[]): T {
    //str: keyof typeof myObj
    var instance = Object.create(
      this.context[name as keyof typeof this.context].prototype
    );
    instance.constructor.apply(instance, args);
    return <T>instance;
  }
}

const myThing = {
  aLotOfThings: [
    {
      says: `blochain`,
      is: `bullsh*t`,
    },
  ],
};
// var loader = new InstanceLoader<IActivatable>(window);
var loader = new InstanceLoader<IActivatable>(myThing);

var example = loader.getInstance("ClassA");

/**
 * Now I also need to make clear how to develop annotations AOP
 * https://www.typescriptlang.org/docs/handbook/decorators.html
 */

/**
   * ---------------------------------------------------
   * / Below example requires 2 compiler options:
   * // "experimentalDecorators": true,
     // "emitDecoratorMetadata": true
   * 
   * ---------------------------------------------------
   */
/**
 *
 * @returns
 */
function first() {
  console.log("first(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called");
  };
}
/**
 *
 * @returns
 */
function second() {
  console.log("second(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}

/**
 * Now class decorators
 */

function reifiable(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
@reifiable
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

function reportableClassDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    reportingURL = "http://www...";
  };
}

@reportableClassDecorator
class OtherBugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport("Needs dark mode");
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"


/**
 * Now a more complex funny class decorator
 */
interface IReifiable<Y> {
    reify(): Y
}
// const what: Rocket = (someC as any).reify()

/**
 * nothing works there: https://dev.to/danywalls/decorators-in-typescript-with-example-part-1-m0f
 * https://blog.logrocket.com/practical-guide-typescript-decorators/
 */


  // prints 50

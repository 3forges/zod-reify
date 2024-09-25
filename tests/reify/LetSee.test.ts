/**
 * Now a more complex funny class decorator
 */
interface IReifiable<Y> {
    reify(): Y
}
interface ILastNamable {
    lastname: string
}
function ReifiableClassDecorator<T extends { new (...args: any[]): {} }>(
    
    constructor: T
  ) {
      return class extends constructor implements IReifiable<ILastNamable> {
          public reify(): ILastNamable {
              //return [``]
              return {
                lastname: `universe`
              }
              //throw new Error("Method [reify] not implemented.");
              
          }
              reportingURL = "http://www...";
              
              };
              /*
return function (constructor: Function) { 
    constructor.prototype.reify = (): T =>{
        throw new Error("Method not implemented.");
    }
    constructor.prototype.Iamlearning = true
}
*/
}
function LuckyNumber(limit: number) {
return function (constructor: Function) { 
    constructor.prototype.lucky = Math.floor(Math.random() * Math.floor(limit))
}
}
function BaseEntity(ctr: Function) {
    //ctr.prototype.id = Math.random();
    ctr.prototype.created = new Date().toLocaleString("es-ES");
}

class Rocket {
    constructor(readonly rocketType: string) {
    }
}
@BaseEntity
@LuckyNumber(5)
@ReifiableClassDecorator
class ClassC {
    public id!: number;
    public name!: string;
    public address!: string;
}

const someC = new ClassC();

// const what: Rocket = (someC as any).reify()

/**
 * pnpm exec jest -t 'TypeScript Decorators Test 1 successfully get n display the lucky number, and the created properties'
 */
describe("Tests of the {@ZodSchemaReifier} reify() method against the zod parse method", () => {
    // beforeEach((): void => {
    //   jest.setTimeout(60000);
    // });
    afterAll(() => {
      //jest.restoreAllMocks();
      // nothing to do
    });
  
    /**
     *
     */
    describe("TypeScript Decorators Test 1", () => {
      it(`successfully get n display the lucky number, and the created properties`, () => {
        console.log(
          ` >>>>>>> TEST CASE 1 [decorators]`
        );
        console.log(`created : ${(someC as any).created}`)
        console.log(`lucky is : ${(someC as any).lucky}`);
        console.log(`reify().lastname is : ${(someC as any).reify().lastname}`);
        
        console.log(`name is : ${(someC as any).name}`);
        expect((someC as any).lucky == 2).toBe(true)
      });
    });
  });
  
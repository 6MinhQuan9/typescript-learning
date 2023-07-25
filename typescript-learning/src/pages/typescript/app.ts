const exampleCode = () => {

   // type AddFn = (a: number, b: number) => number;

   interface AddFn {
      (a: number, b: number): number
   }

   let add: AddFn;

   add = (a, b) => {
      return a + b;
   }
   interface Named {
      readonly name: string;
   }
   // Lesson 16 create first interface

   interface Person {
      name: string;
      age: number;

      greet(phrase: string): void;
   }

   let user1: Person

   user1 = {
      name: 'Max',
      age: 30,

      greet(phrase: string) {
         console.log(phrase + ' ' + this.name);
      }
   }

   user1.greet('Hi there - I am');

   // Lesson 17 different between interface and type
   interface Hello extends Named {
      greet(phrase: string): void;
   }

   class Human implements Hello {
      name: string;
      age = 30

      constructor(name: string) {
         this.name = name;
      }

      greet(phrase: string): void {
         console.log(phrase + ' ' + this.name);
      }
   }

   let user2 = new Human('Max');

   console.log({ user1, user2 });




}

export default exampleCode
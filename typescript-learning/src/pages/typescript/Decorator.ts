function Logger(logString: string) {
   return function (constructor: Function) {
      console.log(logString);
      console.log(constructor);
   }
}

// @Logger('LOGGING')

function WithTemplate(template: string, hookId: string) {
   return function<T extends {new(...args: any[]): {name: string}}> (originalConstructor: T) {
      return class extends originalConstructor {
         constructor(..._: any[]) {
            super();

            const hookEl = document?.getElementById(hookId);
            if (hookEl) {
               hookEl.innerHTML = template;
               hookEl.querySelector('h1')!.textContent = this.name;
            }
         }
      }
   }
}

@WithTemplate('<h1>My Person Object</h1>', 'app')

class Person {
   name = 'Max';

   constructor() {
      console.log('Creating person object...');
   }
}

function Log(target: any, propertyName: string | Symbol) {
   console.log('Logging...');
   console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor): PropertyDescriptor {
   console.log('Logging2...');
   console.log(target, name);
   return {
      configurable: true
   }
}

function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
   console.log('Position...');
   console.log(target, name);
}


function Log4(target: any, name: string | Symbol, position: number) {
   console.log('Name...');
   console.log(target, name, position);
}

class Product {
   @Log
   title: string;
   _price: number;

   set price(val: number) {
      if (val > 0) {
         this._price = val
      } else {
         throw new Error('Invalid price - should be positive');
      }
   }

   constructor(t: string, p: number) {
      this.title = t
      this._price = p
   }

   @Log3
   getPriceWithTax(@Log4 inTax: number) {
      return inTax + this._price
   }
}

function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
   // return function (target: any, name: string, descriptor: PropertyDescriptor) {
   //    const originalMethod = descriptor.value;
   //    const adjDescriptor: PropertyDescriptor = {
   //       configurable: true,
   //       get() {
   //          const boundFn = originalMethod.bind(this);
   //          return boundFn;
   //       }
   //    }
   //    return adjDescriptor;
   // }
   
   const originalMethod = descriptor.value
   const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
         const boundFn = originalMethod.bind(this);
         return boundFn;
      }
   }

   return adjDescriptor
}

class Printer {
   message = 'This works'

   @AutoBind
   showMessage() {
      console.log(this.message);
   }
}

interface ValidatorConfig {
   [property: string] : {
      [validateProp: string]: string[]
   }
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
   registeredValidators[target.constructor.name] = {
      ...registeredValidators[target.constructor.name],
      [propName]:  [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required']
   }
}

function PositiveNumber(target: any, propName: string) {
   registeredValidators[target.constructor.name] = {
      ...registeredValidators[target.constructor.name],
      [propName]:  [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive']
   }
}

function validate(obj: any) {
   const objValidator = registeredValidators[obj.constructor.name];
   if (!objValidator) {
      return true
   }

   let isValid = true
   for (const prop in objValidator) {
      for (const validator of objValidator[prop]) {
         switch (validator) {
            case 'required':
               isValid = isValid && !!obj[prop];
               break
            case 'positive':
               isValid = isValid && obj[prop] > 0;
               break
         }
      }
   }

   return isValid
}

class Course {
   @Required
   title: string;
   @PositiveNumber
   price: number;

   constructor(t: string, p: number) {
      this.title = t;
      this.price = p
   }
}

const Decorator = () => {
   const person = new Person();
   console.log(person);

   const p1 = new Product('Book', 19);
   const p2 = new Product('Book 2', 29);

   const p = new Printer();

   const button = document.querySelector('button')!;
   button.addEventListener('click', () => {
      p.showMessage();
   })

   const courseForm = document.querySelector('form')!;
   
   courseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleEl = document.getElementById('title') as HTMLInputElement;
      const priceEl = document.getElementById('price') as HTMLInputElement;

      const title = titleEl.value;
      const price = +priceEl.value;
      
      const createdCourse = new Course(title, price);
      
      if(!validate(createdCourse)) {
         alert('Invalid input');
         return;
      }
   })
}

export default Decorator
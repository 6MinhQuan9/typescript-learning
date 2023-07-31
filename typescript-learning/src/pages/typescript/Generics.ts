const Generics = () => {
   const names: Array<string> = ['Max', 'Manuel'];

   const promise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
         resolve('Result');
      }, 2000);
   })

   promise.then(data => {
      data.split(' ')
   })

   function merge<T extends object, U extends object>(objA: T, objB: U) {
      return Object.assign(objA, objB);
   }

   const mergedObj = merge({ name: 'Max' }, { age: 30 });
   const mergedObj2 = merge({ name: 'Max', hobbies: ['Sports'] }, { age: 30 });
   
   interface Lengthy {
      length: number
   }

   function countAndPrint<T extends Lengthy>(element: T): [T, string] {
      let descriptionText = 'Got no value'
      if(element.length === 1) {
         descriptionText = 'Got 1 element'
      } else if (element.length > 1) {
         descriptionText = 'Got ' + element.length + ' elements'
      }
      return [element, descriptionText]
   }

   console.log('countAndPrint', countAndPrint('Hi there!'));
   
   function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U ) {
      return 'Value: ' + obj[key];
   }

   extractAndConvert({ name: 'Max' }, 'name');

   class Storage<T> {
      private data: T[] = [];

      addItem(item: T) {
         this.data.push(item);
      }

      removeItem(item: T) {
         this.data.splice(this.data.indexOf(item), 1);
      }

      getItem() {
         return [...this.data]
      }
   }

   const textStorage = new Storage<string>();
   textStorage.addItem(10);
}

export default Generics
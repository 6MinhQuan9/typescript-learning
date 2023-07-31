import { useEffect } from 'react';
import exampleCode from './app';
import IntersectionTypes from './IntersectionTypes';
import Generics from './Generics';
import Decorators from './Decorator';

const TypescriptIndex = () => {
   useEffect(() => {
      // exampleCode();
      // IntersectionTypes()
      // Generics()
      Decorators()
   },[])

   return (
      <>
         <button>click me</button>
         <form>
            <input type='text' placeholder='Course title' id='title' />
            <input type='text' placeholder='Course price' id='price' />
            <button type='submit'>Save</button>
         </form>
      </>
   )
}

export default TypescriptIndex
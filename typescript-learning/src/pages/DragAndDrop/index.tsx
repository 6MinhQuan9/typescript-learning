import { useEffect } from "react"
import AppTypescript from "./app"

const DragAndDrop = () => {
   
   useEffect(() => {
      AppTypescript()
   },[])

   return (
      <>
         <template id="project-input">
            <form>
               <div className='form-control'>
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" />
               </div>

               <div className='form-control'>
                  <label htmlFor="title">Description</label>
                  <textarea id="description" rows={3} />
               </div>

               <div className='form-control'>
                  <label htmlFor="people">People</label>
                  <input type="number" id="people" step={1} min={0} max={10} />
               </div>

               <button type="submit">Save</button>
            </form>
         </template>

         <template id="single-project">
            <li></li>
         </template>

         <template id="project-list">
            <section className="projects">
               <header>
                  <h2></h2>
               </header>
               <ul></ul>
            </section>
         </template>

         <div id="app"></div>
      </>
   )
}

export default DragAndDrop
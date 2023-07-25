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
}

export default Generics
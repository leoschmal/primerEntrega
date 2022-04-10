const express = require('express');

const fs= require('fs')

const app= express();
const PORT = 8080;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en puerto ${server.address().port}`)
});
server.on('error',(error) => console.log(`hubo un error ${error}`));

const routerProductos = express.Router()
const routerCarrito = express.Router()

routerProductos.use(express.urlencoded({ extended: true }))
routerCarrito.use(express.urlencoded({ extended: true }))
routerProductos.use(express.json())
routerCarrito.use(express.json())


//Routeo de Productos
routerProductos.get('/',(req,res) => {
    try{          
      function getProducts(){
        const contenido = fs.readFileSync('./productos.txt', 'utf-8')
        const json = JSON.parse(contenido.split(","))
        return json          }        
    }
    catch(err) {        
        console.log("contenido no leido",err)      
    } 
    res.send({products:getProducts()})
                              })

routerProductos.get('/:id',(req,res) => {
    try{     
        const contenido = fs.readFileSync('./productos.txt', 'utf-8');
        const json = JSON.parse(contenido.split(","));
        const id = req.params.id;
        let solicitado= json.filter((el)=> el.id === String(id))
        solicitado.length !==0 ? res.json(solicitado) : res.json({mensaje: "no existe el producto"})        
    }
    catch(err) {        
        console.log("contenido no leido",err)      
    }
})

routerProductos.post('/', (req, res)=>{  
    const contenido = fs.readFileSync('./productos.txt', 'utf-8');
    const json = JSON.parse(contenido.split(","));  
    let tamanio = json.length -1;    
    let id= parseInt(json[tamanio].id);
    let newProduct= req.query;
    newProduct.id = String(id +1);
    newProduct.timestamp = Date.now();
    json.push(newProduct);
    res.json(newProduct)
    fs.writeFileSync('./productos.txt', JSON.stringify(json),'utf-8')
})
routerProductos.put('/:id', (req, res)=>{
    const contenido = fs.readFileSync('./productos.txt', 'utf-8');
    const json = JSON.parse(contenido.split(",")); 
    const id = req.params.id;    
    //Dato a actualizar
    //json[id - 1] = req.query;
    json[id - 1] = req.query;
    json[id - 1].id = String(id);
    json[id - 1].timestamp = Date.now();
    //json.push(newProduct);
    res.json(json[id - 1]);
    fs.writeFileSync('./productos.txt', JSON.stringify(json),'utf-8')
})

routerProductos.delete('/:id', (req, res)=>{
    console.log('entre al delete')
    const contenido = fs.readFileSync('./productos.txt', 'utf-8');    
    const json = JSON.parse(contenido.split(",")); 
    const id = req.params.id;
    let buscado = json[id - 1];
    json.splice(id - 1, 1);   
    res.json(json);
    fs.writeFileSync('./productos.txt', JSON.stringify(json),'utf-8')
})
//Routeo de Carritos
routerCarrito.get('/',(req,res) => {
    try{          
      function getCarts(){
        const contenido = fs.readFileSync('./carrito.txt', 'utf-8')
        const json = JSON.parse(contenido.split(","))
        return json          }        
    }
    catch(err) {        
        console.log("contenido no leido",err)      
    } 
    res.send({carritos:getCarts()})
                              })

routerCarrito.delete('/:id', (req, res)=>{    
    const contenido = fs.readFileSync('./carrito.txt', 'utf-8');    
    const json = JSON.parse(contenido.split(",")); 
    const id = req.params.id;
    let buscado = json[id - 1];
    json.splice(id - 1, 1);   
    res.json(json);
    fs.writeFileSync('./carrito.txt', JSON.stringify(json),'utf-8')
})

routerCarrito.get('/:id',(req,res) => {
    try{     
        const contenido = fs.readFileSync('./carrito.txt', 'utf-8');
        const json = JSON.parse(contenido.split(","));
        const id = req.params.id;
        let solicitado= json.filter((el)=> el.id === String(id))
        solicitado.length !==0 ? res.json(solicitado) : res.json({mensaje: "no existe el carrito"})        
    }
    catch(err) {        
        console.log("contenido no leido",err)      
    }
})

routerCarrito.post('/', (req, res)=>{  
    const contenido = fs.readFileSync('./carrito.txt', 'utf-8');
    const json = JSON.parse(contenido.split(","));  
    let tamanio = json.length -1;    
    let id= parseInt(json[tamanio].id);
    let newCart= req.query;
    newCart.id = String(id +1);
    newCart.timestamp = Date.now();
    newCart.productos = [];
    json.push(newCart);
    res.json(newCart)
    fs.writeFileSync('./carrito.txt', JSON.stringify(json),'utf-8')
})
//GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
routerCarrito.get('/:id/productos',(req,res) => {
    try{     
        const contenido = fs.readFileSync('./carrito.txt', 'utf-8');
        const json = JSON.parse(contenido.split(","));
        const id = req.params.id;
        let solicitado= json.filter((el)=> el.id === String(id))[0].productos;
        solicitado.length !==0 ? res.json(solicitado) : res.json({mensaje: "carrito vacío"})        
    }
    catch(err) {        
        console.log("contenido no leido",err)      
    }
})


app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

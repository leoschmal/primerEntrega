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

let admin = true;


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
    admin ? res.send({products:getProducts()}) : res.send({mensaje:"ACCESO DENEGADO"})
                              })
//GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
routerProductos.get('/:id',(req,res) => {
    try{     
        const contenido = fs.readFileSync('./productos.txt', 'utf-8');
        const json = JSON.parse(contenido.split(","));
        const id = req.params.id;
        let solicitado= json.filter((el)=> el.id === String(id))
        solicitado.length !==0  ? res.json(solicitado) : res.json({mensaje: "No existe el Producto"})        
    }
    catch(err) {        
        console.log("contenido no leido",err)      
    }
})
//POST: '/' - Para incorporar productos al listado (disponible para administradores)
routerProductos.post('/', (req, res)=>{  
    if(admin){
        const contenido = fs.readFileSync('./productos.txt', 'utf-8');
        const json = JSON.parse(contenido.split(","));  
        let tamanio = json.length -1;    
        let id= parseInt(json[tamanio].id);
        let newProduct= req.query;
        newProduct.id = String(id +1);
        newProduct.timestamp = Date.now();
        json.push(newProduct);
        fs.writeFileSync('./productos.txt', JSON.stringify(json),'utf-8');
        res.json(newProduct)
    }else{
        res.json({mensaje:"ACCESO DENEGADO"})
    }    
})
//PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
routerProductos.put('/:id', (req, res)=>{
    if(admin){
        const contenido = fs.readFileSync('./productos.txt', 'utf-8');
        const json = JSON.parse(contenido.split(",")); 
        const id = req.params.id;    
        //Dato a actualizar        
        json[id - 1] = req.query;
        json[id - 1].id = String(id);
        json[id - 1].timestamp = Date.now();
        //json.push(newProduct);
        res.json(json[id - 1]);
        fs.writeFileSync('./productos.txt', JSON.stringify(json),'utf-8')
    }else{
        res.json({mensaje:"ACCESO DENEGADO"});
    }    
})
//DELETE: '/:id' - Borra un producto por su id (disponible para administradores)
routerProductos.delete('/:id', (req, res)=>{
    if(admin){        
        const contenido = fs.readFileSync('./productos.txt', 'utf-8');    
        const json = JSON.parse(contenido.split(",")); 
        const id = req.params.id;
        let buscado = json[id - 1];
        json.splice(id - 1, 1);   
        res.json(json);
        fs.writeFileSync('./productos.txt', JSON.stringify(json),'utf-8')
    }else{
        res.json({mensaje:"ACCESO DENEGADO"});
    }
    
})
//Routeo de Carritos
// Obtengo TODOS los carritos
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
//DELETE: '/:id' - Vacía un carrito y lo elimina.
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
//POST: '/' - Crea un carrito y devuelve su id.
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
    res.json(newCart.id)
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
//POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
routerCarrito.post('/:id/productos', (req, res)=>{
    const contenido = fs.readFileSync('./carrito.txt', 'utf-8');
    const json = JSON.parse(contenido.split(","));  
    const id = req.params.id;
    let solicitado= json.filter((el)=> el.id === String(id))[0];
    let producto = req.query;
    producto.timestamp = Date.now();
    solicitado.productos.push(producto);
    res.json(solicitado)
    fs.writeFileSync('./carrito.txt', JSON.stringify(json),'utf-8')    
})
//DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
routerCarrito.delete('/:id/productos/:id_prod', (req, res)=>{
    const contenido = fs.readFileSync('./carrito.txt', 'utf-8');
    const json = JSON.parse(contenido.split(","));  
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    let solicitado= json.filter((el)=> el.id === String(id))[0];
    let producto = solicitado.productos.filter((el)=> el.id === String(id_prod))[0];
    solicitado.productos.splice(solicitado.productos.indexOf(producto), 1);
    res.json(solicitado)
    fs.writeFileSync('./carrito.txt', JSON.stringify(json),'utf-8')
})



app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

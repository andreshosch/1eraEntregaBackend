const express = require("express");
const { Router } = express;
const app = express();
const routerProductos = Router();
const routerCarrito = Router();
const contenedor = require('./archivos')
const Archivos = new contenedor('productos.json')
const carrito=new contenedor('carrito.json')
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let administrador=true //VARIABLE QUE CONTROLA SI SE EJECUTA LAS PETICIONES O NO

const isAdmin=(req,res,next)=>{
    if (administrador){
        return next()
    }
    else{
          const response={
            error:-1,
            description: `Ruta ${req.path} y método ${req.method} no autorizados`
          } 
          res.status(401).json(response)
      }
    }


// ESCUCHANDO EN PUERTO 8080
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
});
server.on("error", error => console.log(`Error: ${error}`))

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

//TRAER TODOS LOS PRODUCTOS CON METODO GET
routerProductos.get("/", (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    Archivos.getAll()
        .then((products) => res.json(products))
})

//TRAER UN PRODUCTO POR ID
routerProductos.get("/:idProduct",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    const id = req.params.idProduct
    Archivos.getById(id)
        .then((products) => res.json(products))
})
//GUARDAR NUEVO PRODUCTO
routerProductos.post("/",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    Archivos.save(req.body)
        .then((products) => res.json(products))
})

//ACTUALIZAR PRODUCTO MEDIANTE ID
routerProductos.put("/:id",isAdmin, (req, res) => {
    Archivos.updateProduct(req.params.id, req.body)
        .then((product) => res.json(product))
})

//ELIMINAR PRODUCTO POR ID
routerProductos.delete("/:idProductos",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    Archivos.deleteById(req.params.idProductos)

    .then((products) => res.json(products))
})

//TRAER TODOS LOS PRODUCTOS CON METODO GET
routerCarrito.get("/", (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    carrito.getAll()
        .then((carrito) => res.json(carrito))
})

//CREAR NUEVO CARRITO
routerCarrito.post("/",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    carrito.saveCarrito()
        .then((products) => res.json(products))
})

//TRAER UN CARRO POR ID
routerCarrito.get("/:id",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    const id = req.params.id
    carrito.getById(id)
        .then((products) => res.json(products))
})

//ELIMINAR CARRITO POR ID
routerCarrito.delete("/:id",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    carrito.deleteById(req.params.id)

    .then((products) => res.json(products))
})

//GRABAR CARRITO POR ID
routerCarrito.post("/:idCarro/:id",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    const idCarro=req.params.idCarro
    Archivos.getById(req.params.id)
    .then((products) => carrito.saveProductsCarrito(products,idCarro))
})

//TRAER PRODUCTOS DE UN CARRO POR ID
routerCarrito.get("/:idCarro/",isAdmin, (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    const idCarro=req.params.idCarro
    carrito.getAll(req.params.idCarro)
    .then((products) => res.json(products))
})

//Elimina un producto indicado de un carro indicado
routerCarrito.delete("/:idCarro/:id",isAdmin, (req,res) => {
    carrito.eliminarProdDeCarro(req.params.idCarro, req.params.id)
    .then((products) => res.json(products))
})

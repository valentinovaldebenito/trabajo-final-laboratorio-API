const { User } = require("./models/User.model");
const { Product } = require("./models/Product.model");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const sequelize = require("./database/db"); // Importamos la conexión a la base de datos
const PORT = 4250;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Solo permite solicitudes desde el cliente
  })
);

//Sincronización con la base de datos
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Servidor corriendo en el puerto: " + PORT);
    });
  })
  .catch((error) => {
    console.log("Error al sincronizar el modelo de usuario: " + error);
  });

//CRUD Productos
app.get("/productos", (req, res) => {
  try {
    const products = Product.findAll({ attributes: ["marca", "descripcion", "valorUnidad", "stock", "activo"] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
});

//Create
app.post("/productos", async (req, res) => {
  const { marca, descripcion, valorUnidad, stock, activo } = req.body;

  // Validar activo
  if (activo !== "true" && activo !== "false") {
    return res.status(400).json({ message: "El valor de 'activo' debe ser 'true' o 'false'" });
  }

  try {
    const product = await Product.create({ marca, descripcion, valorUnidad, stock, activo });
    res.status(201).json({ message: "El producto fue cargado con éxito!", product: product },);
  } catch (error) {
    res.status(500).json({ message: "Ocurrió un error al cargar el producto, detalle del error: ", error });
  }
});

//"Delete" (en realidad es baja lógica)
app.put("/productos/delete/:id", async (req, res) => {
  const { id } = req.body;
});

//Update
app.put("/productos/update/:id", async (req, res) => {});

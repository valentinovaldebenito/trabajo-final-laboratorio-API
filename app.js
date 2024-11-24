const Product = require("./models/Product.model.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const sequelize = require("./database/db"); // Importamos la conexión a la base de datos
const PORT = 3000;

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
app.get("/products/getAll", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "marca", "descripcion", "valorUnidad", "stock", "activo"],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
    console.log(error);
  }
});

//Create
app.post("/product/upload", async (req, res) => {
  const { marca, descripcion, valorUnidad, stock, activo } = req.body;

  // Validar activo
  if (activo !== 1 && activo !== 0) {
    return res.status(400).json({ message: "El valor de 'activo' debe ser 1 o 0" });
  }

  try {
    const product = await Product.create({ marca, descripcion, valorUnidad, stock, activo });
    res.status(201).json({ message: "El producto fue cargado con éxito!", product: product },);
  } catch (error) {
    res.status(500).json({ message: "Ocurrió un error al cargar el producto, detalle del error: ", error });
  }
});

//"Delete" (en realidad es baja lógica)
app.put("/product/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Baja lógica: cambiamos el estado "activo" a 0
    await product.update({ activo: false });

    res.status(200).json({ message: "El producto fue desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Ocurrió un error al desactivar el producto", error });
  }
});

//"Activate" (activa el producto)
app.put("/product/activate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Baja lógica: cambiamos el estado "activo" a 0
    await product.update({ activo: true });
    
    res.status(200).json({ message: "El producto fue desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Ocurrió un error al desactivar el producto", error });
  }
});


//Update
app.put("/product/update/:id", async (req, res) => {
  const { id } = req.params;
  const { marca, descripcion, valorUnidad, stock, activo } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizamos los campos proporcionados
    await product.update({ marca, descripcion, valorUnidad, stock, activo });

    res.status(200).json({ message: "El producto fue actualizado correctamente", product });
  } catch (error) {
    res.status(500).json({ message: "Ocurrió un error al actualizar el producto", error });
  }
});


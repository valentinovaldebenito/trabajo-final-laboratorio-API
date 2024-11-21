const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Product = sequelize.define("Product", {
  //Marca del producto ej(Marolio, Cocacola)
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //La descripción del producto ej(Fideos, Gaseosa)
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //El valor unitario del producto
  valorUnidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  //Cantidad de unidades disponibles
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  //Si el producto sigue activo o ya no
  activo: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Product;

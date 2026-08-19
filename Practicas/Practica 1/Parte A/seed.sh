#!/bin/bash

echo "Sembrando la colección de pedidos..."
mongoimport --db tienda --collection pedidos --file "/home/jorge75/Universidad/Ingenieria en Sistemas/02_2026/COM600_MicroServicios/Practicas/Practica 1/pedidos.json" --jsonArray --drop

echo "Sembrando la colección de productos..."
mongoimport --db tienda --collection productos --file "/home/jorge75/Universidad/Ingenieria en Sistemas/02_2026/COM600_MicroServicios/Practicas/Practica 1/productos.json" --jsonArray --drop

echo "¡Base de datos sembrada con éxito a partir de los JSON!"

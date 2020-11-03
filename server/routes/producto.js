
const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

const _ = require('underscore');

// =========================
// Obtener productos
// =========================

app.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    // let limite = req.query.limite || 5;
    // limite = Number(limite);

    Producto.find({disponible: true})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(5)
        .exec((err, productos) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            });

        });
    // trae todos los productos
    // populate: usuario categoria
    // paginado
});

// =========================
// Obtener producto por ID
// =========================

app.get('/productos/:id', (req, res) => {  

    let id = req.params.id;

    Producto.findById(id, (err, producto) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!producto){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
        
    });
    // populate: usuario categoria
});

// =========================
// Buscar producto 
// =========================


app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });

            });

});







// =========================
// Crear producto 
// =========================

app.post('/productos', verificaToken, (req, res) => {  

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion ,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
    // grabar el usuario
    // grabar una categoria del listado
});

// =========================
// Actualizar producto 
// =========================

app.put('/productos/:id', verificaToken, (req, res) => {  

    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible
    }

      Producto.findByIdAndUpdate(id, descProducto, {new: true, runValidators: true} ,(err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });

      });
    // grabar el usuario
    // grabar una categoria del listado
});

// =========================
// Borrar producto 
// =========================

app.delete('/productos/:id', verificaToken, (req, res) => {  

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    
    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true} ,(err, productoBorrado) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });

    });
    // actualizar disponible a false
});



module.exports = app;
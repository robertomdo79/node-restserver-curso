const express = require('express');
let Categoria = require('../models/categoria');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

// ============================
// Mostrar todas las categorias
// ============================

app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

         if(err){
             return res.status(400).json({
                 ok: false,
                 err
             });
         }

         Categoria.count((err, conteo) => {

             res.json({
                 ok: true,
                 categorias,
                 cuantos: conteo
             });

         });

    });
});

// ============================
// Mostrar una categoria por ID
// ============================

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
        
    });

   // Categoria.findById();
});

// ============================
// Crear nueva categoria
// ============================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
    // regresa la nueva categoria
    // req.usuario_id
 });

 // ============================
 // Actualizar categoria
// ============================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

      Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true} ,(err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

      });
});

// ============================
// eliminar categoria
// ============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        
        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoria Borrada'
        });


    });

    // Categoria.findByIdAndRemove();
 });



module.exports = app;
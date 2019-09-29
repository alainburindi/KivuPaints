import express from 'express';
import { ensureAuthenticated } from '../config/auth';
let connection = require('../config/connection');
const router = express.Router();

const getUnities = 'SELECT * FROM Unities';
let unities = null;
connection.query(getUnities, (err, result) => {
  if (err) throw err;
  unities = result;
});

router.get('/', ensureAuthenticated, (req, res, next) => {
  const getProducts =
    'SELECT p.id, p.name, u.name as unity , p.price, p.detail FROM Products as p INNER JOIN Unities as u ON p.unity_id = u.id';
  connection.query(getProducts, (err, result) => {
    if (err) throw err;
    res.render('products/show', {
      products: result,
      user: req.user
    });
  });
});
router.get('/create', ensureAuthenticated, (req, res, next) => {
  res.render('products/create', {
    unities,
    user: req.user
  });
});

router.post('/', ensureAuthenticated, (req, res, next) => {
  const { name, unity, price, detail } = req.body;
  let errors = [];
  if (!name || !unity || !price || !detail) {
    errors.push({ msg: 'please fill in all fields' });
  }

  if (errors.length > 0) {
    res.render('products/create', {
      unities,
      errors,
      name,
      unity,
      price,
      detail,
      user: req.user
    });
  } else {
    const saveProduct =
      'INSERT INTO Products (name, unity_id, price, detail) VALUES (?, ?, ?, ?)';
    connection.query(
      saveProduct,
      [name, unity, price, detail],
      (err, result) => {
        if (err) throw err;
        req.flash('success_msg', 'Product saved corecly');
        res.redirect('/products');
      }
    );
  }
});

router.get('/:id/edit', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.redirect('/products');
  }
  const getOneProduct =
    'SELECT p.id, p.name, u.name as unity , p.price, p.detail FROM Products as p INNER JOIN Unities as u ON p.unity_id = u.id WHERE p.id = ?';

  connection.query(getOneProduct, [id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.render('products/edit', {
        product: result[0],
        unities,
        user: req.user
      });
    } else res.redirect('/products');
  });
});

router.post('/:id/update', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.redirect('/products');
  }
  const { name, unity, price, detail } = req.body;
  if (!name || !unity || !price || !detail) {
    req.flash('error_msg', 'please fill in all fields');
    res.redirect(`/products/{id}/edit`);
  } else {
    const updateProduct =
      'UPDATE Products SET name = ?, unity_id = ?, price = ?, detail = ? WHERE id = ?';
    connection.query(
      updateProduct,
      [name, unity, price, detail, id],
      (err, result) => {
        if (err) throw err;
        if (result.changedRows == 1) {
          req.flash('success_msg', 'Edited correctly');
        } else {
          req.flash('error_msg', 'Error while editing, try again later');
        }
        res.redirect('/products');
      }
    );
  }
});

router.post('/sale', ensureAuthenticated, (req, res, next) => {
  const { product, quantity } = req.body;

  if (!quantity || !product) {
    req.flash('error_msg', 'please fill in all fields');
    res.redirect(`/dashboard`);
  } else {
    const saveSale = 'INSERT INTO Sales (product_id, quantity) VALUES (?,?)';
    connection.query(saveSale, [product, quantity], (err, result) => {
      if (err) throw err;
      req.flash('success_msg', 'vente enregistree');
      res.redirect(`/dashboard`);
    });
  }
});

module.exports = router;

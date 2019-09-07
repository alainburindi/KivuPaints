const express = require('express')
import { ensureAuthenticated } from '../config/auth';
import connection from '../config/connection';
import moment from 'moment';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('welcome');
}).get('/dashboard', ensureAuthenticated, (req, res) => {
    const getSales = "SELECT s.quantity, s.created_at as date, p.name, p.price, u.name as unity FROM Sales as s INNER JOIN Products as p ON s.product_id = p.id INNER JOIN unities as u ON p.unity_id = u.id ORDER BY s.id DESC";
    connection.query(getSales, [], (err, sales, fields) => {
        if (err) throw err;
        const getProducts = "SELECT * FROM Products";
        connection.query(getProducts, [], (err, result) => {
            if (err) throw err;
            for (const sale of sales) {
                sale.date = moment(sale.date).format('MMMM Do YYYY, h:mm:ss a');
            }
            res.render('dashboard', {
                products : result,
                success_msg: `welcome ${req.user.name}`,
                user: req.user,
                sales
            });
        });
    });

});

module.exports = router;
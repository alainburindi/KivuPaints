import express from 'express';
import { ensureAuthenticated } from '../config/auth';
let connection = require('../config/connection');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
  const getExpenses = `SELECT e.id, e.requester, e.amount,e.reason, u.name as cashier
    FROM Expenses as e INNER JOIN Users as u ON e.user_id = u.id ORDER BY id DESC`;
  connection.query(getExpenses, (err, result) => {
    if (err) throw err;
    res.render('depenses/show', {
      depenses: result,
      user: req.user
    });
  });
});
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('depenses/create', { user: req.user });
});
router.post('/', ensureAuthenticated, (req, res) => {
  const { requester, amount, reason } = req.body;
  const { id: user_id } = req.user;
  const createExpense = `INSERT INTO Expenses (requester,
     amount, reason, user_id) VALUES (?, ?, ?, ?)`;
  connection.query(
    createExpense,
    [requester, amount, reason, user_id],
    (err, result) => {
      if (err) throw err;
      req.flash('success_msg', 'Expense created correctly');
      res.redirect('/expenses');
    }
  );
});

router.get('/:id/edit', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.redirect('/depenses');
  }
  const getOneProduct = `SELECT e.id, e.requester, e.amount,e.reason, u.name as cashier FROM
     Expenses as e INNER JOIN Users as u ON e.user_id = u.id WHERE e.id = ?`;

  connection.query(getOneProduct, [id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const { requester, amount, reason } = result[0];
      res.render('depenses/create', {
        requester,
        amount,
        reason,
        to: `/expenses/${id}/update`,
        user: req.user
      });
    } else res.redirect('/expenses');
  });
});

router.post('/:id/update', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.redirect('/expenses');
  }
  const { requester, amount, reason } = req.body;
  if (!requester || !amount || !reason) {
    req.flash('error_msg', 'please fill in all fields');
    return res.redirect(`/expenses/{id}/edit`);
  } else {
    const updateProduct =
      'UPDATE Expenses SET requester = ?, amount = ?, reason = ? WHERE id = ?';
    connection.query(
      updateProduct,
      [requester, amount, reason, id],
      (err, result) => {
        if (err) {
          return res.json(err);
        }
        if (result.affectedRows === 1) {
          req.flash('success_msg', 'Edited correctly');
        } else {
          req.flash('error_msg', 'Error while editing, try again later');
        }
        return res.redirect(`/expenses`);
      }
    );
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */

module.exports = (db) => {    //pool = db

  router.get('/', function (req, res, next) {
    db.query('SELECT * FROM bread ORDER BY id ASC', (err, data) => {     //pool = db
    if (err) return res.status(500).json({err})
      res.json(data.rows)
    })
  });

  // //ADD
  router.post('/', function (req, res, next) {
    // console.log(req.body.integer);
    // let value = [req.body.string, Number(req.body.integer), parseFloat(req.body.float), Date(req.body.date), Boolean(req.body.boolean)]
    // console.log(value);
    db.query('INSERT INTO bread (string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)', 
    [req.body.string, Number(req.body.integer), parseFloat(req.body.float), req.body.date, req.body.boolean], (err, data) => { 
    if (err) return res.status(500).json({err})
      res.json(data)
    })
  });

  //EDIT
  router.put('/:id', function (req, res, next) {
    db.query('UPDATE bread SET string=$1, integer=$2, float=$3, date=$4, boolean=$5 WHERE id=$6',
    [req.body.string, Number(req.body.integer), parseFloat(req.body.float), (req.body.date), req.body.boolean, Number(req.params.id)], (err, data) => {
    if (err) return res.status(500).json({err})
      res.json(data.rowCount)
    })
  });

  // //DELETE
  router.delete('/:id', function (req, res, next) {
    db.query('DELETE FROM bread WHERE id=$1',
    [Number(req.params.id)], (err, data) => {
    if (err) return res.status(500).json({err})
      res.json(data.rowCount)
    })
  });

  return router;
}
var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */

module.exports = (db) => {    //db = pool

  router.get('/', function (req, res, next) {

    let isSearch = false;
    const page = parseInt(req.query.page) || 1;
    const { id, string, integer, float, startDate, endDate, boolean, cId, cString, cInteger, cFloat, cDate, cBoolean } = req.query;
    let query = [];
    if (cId && id) {
      query.push(`id = '${id}'`);
      isSearch = true;
    }
    if (cString && string) {
      query.push(`string LIKE  '%${string}%'`);
      isSearch = true;
    }
    if (cInteger && integer) {
      query.push(`integer = ${integer}`);
      isSearch = true;
    }
    if (cFloat && float) {
      query.push(`float = ${float}`);
      isSearch = true;
    }
    if (cBoolean && boolean) {
      query.push(`boolean = '${boolean}'`);
      isSearch = true;
    }

    if (cDate && startDate && endDate) {
      query.push(`date BETWEEN '${startDate}' AND '${endDate}'`);
      isSearch = true;
    }

    let search = "";
    if (isSearch) {
      search += `WHERE ${query.join(' AND ')}`;
    }
    console.log(search);

    const limit = 4;
    const offset = (page - 1) * limit;

    let sqlPages = `SELECT COUNT (id) as total FROM bread ${search}`;
    db.query(sqlPages, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      }) 
      else if (data.rows[0].total == 0) {
        return res.send(`Not found`);
      }
      const totalData = parseInt(data.rows[0].total); 
      const pages = Math.ceil(totalData / limit);
     
      let sql = `SELECT * FROM bread ${search} ORDER BY id LIMIT $1 OFFSET $2`;
      db.query(sql, [limit, offset], (err, data) => {
        if (err) {
          return res.send(err);
        } else if (data.rows == 0) {
          return res.send(`Not found`);
        }
        else {
          res.status(200).json({
            data: data.rows,
            pages,
            page
          });
        }
      });
    })

  })

  // //ADD
  router.post('/', function (req, res, next) {
    db.query('INSERT INTO bread (string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)',
      [req.body.string, Number(req.body.integer), parseFloat(req.body.float), req.body.date, req.body.boolean], (err, data) => {
        if (err) return res.status(500).json({ err })
        res.json(data)
      })
  });

  //GET EDIT
  router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let sql = `SELECT * FROM bread WHERE id = ${id}`;

    db.query(sql, (err, data) => {
      if (err) {
        return res.send(err);
      } else if (data.rows == 0) {
        return res.send(`NO DATA`);
      }
      else {
        data.rows[0].date = moment(data.rows[0].datedata).format('YYYY-MM-DD')
        res.status(200).json({
          data: data.rows[0]

        })
      }
    })
  })

  //EDIT
  router.put('/:id', function (req, res, next) {
    db.query('UPDATE bread SET string=$1, integer=$2, float=$3, date=$4, boolean=$5 WHERE id=$6',
      [req.body.string, Number(req.body.integer), parseFloat(req.body.float), (req.body.date), req.body.boolean, Number(req.params.id)], (err, data) => {
        if (err) return res.status(500).json({ err })
        res.json(data.rowCount)
      })
  });

  // //DELETE
  router.delete('/:id', function (req, res, next) {
    db.query('DELETE FROM bread WHERE id=$1',
      [Number(req.params.id)], (err, data) => {
        if (err) return res.status(500).json({ err })
        res.json(data.rowCount)
      })
  });

  return router;
}

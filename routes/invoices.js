"use strict";

/** Routes about invoices. */

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");

/** GET /invoices
 *  Return info on invoices: {invoices: [{id, comp_code}, ...]}
*/

router.get("", async function (req, res, next) {
  const results = await db.query(
    `SELECT id, comp_code
        FROM invoices`
  );
  const invoices = results.rows;

  return res.json({ invoices });
});

/** GET/invoices/[id] - Return specific invoice as well as company info.
 *
 * Returns {invoice: {id, amt, paid, add_date, paid_date,
 * company: {code, name, description}}
 */

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  //TODO: currently also getting comp_code,
  //see if we could join the tables instead

  const iResults = await db.query(
    `SELECT id, amt, paid, add_date, paid_date, comp_code
        FROM invoices
        WHERE id = $1`, [id]);
  const invoice = iResults.rows[0];

  const cResults = await db.query(
    `SELECT code, name, description
        FROM companies
        WHERE code = $1`, [invoice.comp_code]);
  const company = cResults.rows[0];

  invoice.company = company;
  return res.json({ invoice });
});

/** POST /invoices -- Adds an invoice
 *  Accepts JSON: {comp_code, amt}
 *  Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 *  Returns 400 if request body empty
 */

router.post("", async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const { comp_code, amt } = req.body;

  const iResult = await db.query(
    `INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
    [comp_code, amt]
  );

  const invoice = iResult.rows[0];

  return res.status(201).json({ invoice });
});

module.exports = router;
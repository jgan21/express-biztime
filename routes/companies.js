"use strict";

/** Routes about companies. */

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");

/** GET / - returns `{companies: [name, description]}`*/

router.get("", async function (req, res, next) {
  const results = await db.query("SELECT code, name, description FROM companies");
  const companies = results.rows;

  return res.json({ companies });
});

/** GET /:code - return specific company. */

router.get("/:code", async function (req, res, next) {
  const code = await req.params.code;
  const results = await db.query(
    `SELECT code, name, description FROM companies WHERE id = $1`, [code]);
  const company = results.rows[0];

  if (company === undefined) throw new NotFoundError(
    `No matching company: ${code}`);

  return res.json({ company });
});

/** POST /companies - Create a new company
 *  Accepts JSON: {code, name, description}
 *  Returns obj of new company: {company: {code, name, description}}
 *  Returns 400 if no body data provided
 */

router.post("", async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const { code, name, description } = req.body;

  const results = await db.query(
    `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING code, name, description
  `, [code, name, description]);

  const company = results.rows[0];

  return res.status(201).json({ company });
});

/** PUT /companies/[code] - Edit existing company.
 *  Accepts JSON: {name, description}
 *  Returns updated company object: {company: {code, name, description}}
 *  Returns 404 if company not found
 *  Returns 400 if no body data provided
 */

router.put("/:code", async function (req, res, next) {
  if (req.body === undefined || "code" in req.body) throw new BadRequestError();

  const { name, description } = req.body;
  const code = req.params.code;

  const result = await db.query(
    `UPDATE companies
        SET name=$1
            description=$2
        WHERE code=$3
        RETURNING code, name, description`,
    [name, description, code]
  );

  const company = result.rows[0];

  if (!company) throw new NotFoundError(`${code}: Not Found`);

  return res.json({ company });
});


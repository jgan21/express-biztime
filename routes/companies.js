"use strict";

/** Routes about companies. */

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");

/** GET / - returns `{companies: [name, description]}`*/

router.get("", async function(req, res, next){
  const results = await db.query("SELECT code, name, description FROM companies");
  const companies = results.rows;

  return res.json({ companies });
});

/** GET /:code - return specific company. */

router.get("/:code", async function(req, res, next){
  const code = await req.params.code;
  const results = await db.query(
    `SELECT code, name, description FROM companies WHERE id = $1`, [code]);
  const company = results.rows[0];

  if (company === undefined) throw new NotFoundError(
    `No matching company: ${code}`);

  return res.json({ company });
});


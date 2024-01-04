"use strict";

/** Routes about invoices. */

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");

/** GET /invoices
 *  Return info on invoices: {invoices: [{id, comp_code}, ...]}
*/

router.get("",)
"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCompany, testCompany2 ;
let testInvoice1, testInvoice2, testInvoice3 , testInvoice4;

beforeEach(async function(){
  await db.query("DELETE FROM companies")
  await db.query("DELETE FROM invoices")

const cResults = await db.query(
  `INSERT INTO companies (code, name, description)
   VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
          ('ibm', 'IBM', 'Big blue.')
   RETURNING code, name, description`);
   testCompany = cResults.rows[0];
   testCompany2 = cResults.rows[1];

const iResults = await db.query(`
    INSERT INTO invoices (comp_code, amt, paid, paid_date)
    VALUES ('apple', 100, FALSE, NULL),
           ('apple', 200, FALSE, NULL),
           ('apple', 300, TRUE, '2018-01-01'),
           ('ibm', 400, FALSE, NULL);
    RETURNING comp_code, amt, paid, paid_date`);
  testInvoice1 = iResults.rows[0];
  testInvoice2 = iResults.rows[1];
  testInvoice3 = iResults.rows[2];
  testInvoice4 = iResults.rows[3];

});
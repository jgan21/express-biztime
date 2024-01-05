"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCompany, testCompany2;
let testInvoice1, testInvoice2, testInvoice3, testInvoice4;

beforeEach(async function () {
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM invoices");

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
           ('ibm', 400, FALSE, NULL)
    RETURNING id, comp_code, amt, paid, paid_date`);
  testInvoice1 = iResults.rows[0];
  testInvoice2 = iResults.rows[1];
  testInvoice3 = iResults.rows[2];
  testInvoice4 = iResults.rows[3];

});

describe("GET /companies", function () {
  test("Get all companies", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.body).toEqual({ companies: [testCompany, testCompany2] });
    expect(resp.status).toEqual(200);
  });
});

describe("GET /companies/:id Tests", function () {
  test("Return correct company object", async function () {
    console.log("testCompany in GET /companies/:id", testCompany);
    console.log("testInvoice1 in GET /companies/:id", testInvoice1);
    console.log("testInvoice2 in GET /companies/:id", testInvoice2);
    console.log("testInvoice3 in GET /companies/:id", testInvoice3);

    const resp = await request(app).get(`/companies/${testCompany.code}`);
    expect(resp.body).toEqual({
      company: {
        code: testCompany["code"],
        name: testCompany["name"],
        description: testCompany["description"],
        invoices: [testInvoice1.id, testInvoice2.id, testInvoice3.id]
      }
    });
  });

  test("Throw a 404 error for invalid company code", async function () {
    const resp = await request(app).get("/companies/warbler");
    expect(resp.status).toEqual(404);
  });
});

afterAll(async function () {
  await db.end();
});
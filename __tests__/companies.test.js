"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createData } = require("../__tests__/_test-setup");


beforeEach(createData);

afterAll(async function () {
  await db.end();
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


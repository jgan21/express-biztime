"use strict";

/** Tests for invoices. */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-setup");
const db = require("../db");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /invoices Tests", function () {

  test("Respond with array of invoices", async function () {
    const response = await request(app).get("/invoices");
    expect(response.body).toEqual({
      invoices: [
        { id: 1, comp_code: "apple" },
        { id: 2, comp_code: "apple" },
        { id: 3, comp_code: "ibm" },
      ]
    });
  });
});

describe("GET /invoices/:id", function () {
  test("Return invoice info", async function () {
    const response = await request(app).get("/invoices/1");
    expect(response.body).toEqual(
      {
        invoice: {
          id: 1,
          amt: '100.00',
          add_date: '2018-01-01T07:00:00.000Z',
          paid: false,
          paid_date: null,
          company: {
            code: 'apple',
            name: 'Apple',
            description: 'Maker of OSX.',
          }
        }
      });
  });

  test("Return 404 for no-such-invoice", async function () {
    const response = await request(app).get("/invoices/999");
    expect(response.status).toEqual(404);
  });
});

describe("POST /invoices Test", function () {

  test("Should add invoice", async function () {
    const response = await request(app)
      .post("/invoices")
      .send({ amt: 400, comp_code: 'ibm' });

    expect(response.body).toEqual(
      {
        invoice: {
          id: 4,
          comp_code: "ibm",
          amt: '400.00',
          add_date: expect.any(String),
          paid: false,
          paid_date: null,
        }
      });
  });

  test("Return 400 for empty request body", async function () {
    const response = await request(app)
      .post("/invoices")
      .send();

    expect(response.status).toEqual(400);
  });
});

describe("PUT /invoices/:id Test", function () {

  test("It should update an invoice", async function () {
    const response = await request(app)
      .put("/invoices/1")
      .send({ amt: 1000, paid: false });

    expect(response.body).toEqual(
      {
        invoice: {
          id: 1,
          comp_code: 'apple',
          paid: false,
          amt: '1000.00',
          add_date: expect.any(String),
          paid_date: null,
        }
      });
  });

  test("It should return 400 for empty request body", async function () {
    const response = await request(app)
      .put("/invoices/1")
      .send();

    expect(response.status).toEqual(400);
  });

  test("It should return 404 for no-such-invoice", async function () {
    const response = await request(app)
      .put("/invoices/9999")
      .send({ amt: '1000.00' });

    expect(response.status).toEqual(404);
  });

  test("It should return 500 for missing data", async function () {
    const response = await request(app)
      .put("/invoices/1")
      .send({});

    expect(response.status).toEqual(500);
  });
});


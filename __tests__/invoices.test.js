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

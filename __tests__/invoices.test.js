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

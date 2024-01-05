"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createData } = require("../_test-setup");


beforeEach(createData);

afterAll(async function () {
  await db.end();
});

describe("GET /companies", function () {
  test("Respond with array of companies", async function () {
    const response = await request(app).get("/companies");
    expect(response.body).toEqual({
      companies: [
        { code: "apple", name: "Apple", description: "Maker of OSX." },
        { code: "ibm", name: "IBM", description: "Big blue." },
      ],
    });
  });
});

describe("GET /companies/:id Tests", function () {
  test("Return company info", async function () {
    const response = await request(app).get("/companies/apple");
    expect(response.body).toEqual(
      {
        company: {
          code: "apple",
          name: "Apple",
          description: "Maker of OSX.",
          invoices: [1, 2],
        },
      });
  });

  test("Return 404 for no-such-company", async function () {
    const response = await request(app).get("/companies/blargh");
    expect(response.status).toEqual(404);
  });
});

test("Throw a 404 error for invalid company code", async function () {
  const resp = await request(app).get("/companies/warbler");
  expect(resp.status).toEqual(404);
});


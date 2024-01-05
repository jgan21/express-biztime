"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createData } = require("../_test-setup");


beforeEach(createData);

afterAll(async function () {
  await db.end();
});

describe("GET /companies Tests", function () {
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

  test("Throw a 404 error for invalid company code", async function () {
    const resp = await request(app).get("/companies/warbler");
    expect(resp.status).toEqual(404);
  });
});

describe("PUT /companies/:id Tests", function () {

  test("Update company", async function () {
    const response = await request(app)
      .put("/companies/apple")
      .send({ name: "AppleEdit", description: "NewDescrip" });

    expect(response.body).toEqual(
      {
        company: {
          code: "apple",
          name: "AppleEdit",
          description: "NewDescrip",
        },
      });
  });

  test("Return 400 for empty request body", async function () {
    const response = await request(app)
      .put("/companies/apple")
      .send();

    expect(response.status).toEqual(400);
  });

  test("Return 404 for no-such-comp", async function () {
    const response = await request(app)
      .put("/companies/blargh")
      .send({ name: "Blargh" });

    expect(response.status).toEqual(404);
  });

  test("Return 500 for missing data", async function () {
    const response = await request(app)
      .put("/companies/apple")
      .send({});

    expect(response.status).toEqual(500);
  });
});

describe("DELETE /", function () {

  test("Delete company", async function () {
    const response = await request(app)
      .delete("/companies/apple");

    expect(response.body).toEqual({ "status": "deleted" });
  });

  test("Return 404 for no-such-comp", async function () {
    const response = await request(app)
      .delete("/companies/blargh");

    expect(response.status).toEqual(404);
  });
});
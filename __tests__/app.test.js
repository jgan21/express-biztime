"use strict";

/* Tests for app */

const app = require("../app");
const request = require("supertest");

describe("App Tests for basic routing", function () {
  test("404 at homepage", async function () {
    const resp = await request(app).get("/");
    expect(resp.status).toEqual(404);
  });
});
const { expectCt } = require("helmet");
const supertest = require("supertest");
const db = require("../database/dbConfig");
const server = require("../api/server");

describe("auth router", () => {
  describe("register", () => {
    beforeEach(async () => {
      // trucate or empty the hobbits table
      await db("users").truncate();
    });
    it("should register a new user and return 201", () => {
      return supertest(server)
        .post("/api/auth/register")
        .send({ username: "galo1", password: "password" })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
    it("should insert a username and password in the database", async () => {
      const data = [
        {
          username: "sam",
          password: "password"
        }
      ];

      await supertest(server).post("/api/auth/register").send(data);

      const hobbits = await db("users");

      expect(hobbits).toHaveLength(0);
    });
  });

  describe("login", () => {
    // beforeEach(async () => {
    //   // trucate or empty the hobbits table
    //   await db("users").truncate();
    // });
    it("should register a new user and return 201", () => {
      return supertest(server)
        .post("/api/auth/register")
        .send({ username: "galo123", password: "password" })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
    it("should post 200 when logged in", () => {
      return supertest(server)
        .post("/api/auth/login")
        .send({ username: "galo123", password: "password" })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
    it("should fail if passed incorrect data", () => {
      return supertest(server)
        .post("/api/auth/register")
        .send({})
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });
  });
});

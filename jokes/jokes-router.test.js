const supertest = require("supertest");
const db = require("../database/dbConfig");
const server = require("../api/server");

describe("jokes router", () => {
  describe("GET request", () => {
    it("should return a status code 401 because not authorized", () => {
      return supertest(server)
        .get("/api/jokes")
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });
    it("should return a message 'you shall not pass' ", ()=>{
      return supertest(server)
        .get('/api/jokes')
        .then(res=>{
          expect(res.body.you).toBe('shall not pass!')
        })
    });
  });
});

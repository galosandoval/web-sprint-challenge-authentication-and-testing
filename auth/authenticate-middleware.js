/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
module.exports = {
  authenticate,
  isValid,
  add,
  findBy,
};
const db = require("../database/dbConfig");
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // add code here to verify users are logged in

  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        // something wrong with the token
        res.status(401).json({ you: "can't touch this!" });
      } else {
        // token is good and we can see data inside the decodedToken
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ you: "shall not pass!" });
  }
}

function isValid(user) {
  return Boolean(
    user.username && user.password && typeof user.password === "string"
  );
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id");

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById(id) {
  return db("users").where({ id }).first();
}

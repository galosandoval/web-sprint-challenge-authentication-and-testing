const router = require("express").Router();
const Users = require("./authenticate-middleware");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken"); // install library

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (Users.isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    // save the user to the database
    Users.add(credentials)
      .then((user) => {
        const token = makeJwt(user);

        res.status(201).json({ data: user, token }); // if you want to log someone in after they register
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (Users.isValid(req.body)) {
    console.log({ username, password })
    Users.findBy({ username })
      .then(([user]) => {
        console.log([user]);
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);

          res.status(200).json({ message: "Welsome to our API", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

function makeJwt(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  const options = {
    expiresIn: "8h",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;

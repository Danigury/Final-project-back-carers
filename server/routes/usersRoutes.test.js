const mongoose = require("mongoose");
const supertest = require("supertest");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const debug = require("debug")("carers:supertest");
const User = require("../../database/models/user");
const { connectDB } = require("../../database/index");
const { app, initializeServer } = require("..");

dotenv.config();

const request = supertest(app);
jest.setTimeout(10000);

let server;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYTI3MDBmZDZiZjJmOWFiM2M4MDMyZCIsImlhdCI6MTYzODAzNTQ4MywiZXhwIjoxNjM4MjA4MjgzfQ.e6akP4uR8e9fBGFTDPpIDiPNmKESE5HS49CZfQX9_XA";

beforeAll(async () => {
  await connectDB(process.env.MONGODB_STRING_TEST);
  await User.deleteMany({});
  server = await initializeServer(5000);
  await User.create({
    username: "usertest",
    password: await bcrypt.hash("usertest", 10),
    admin: true,
    agenda: [],
  });
});

afterAll((done) => {
  server.close(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    debug(chalk.red("Server conection finished"));
    done();
  });
});

beforeEach(async () => {
  await User.create({
    username: "danitest",
    password: await bcrypt.hash("danitest", 10),
    admin: true,
    agenda: [],
  });
});

describe("Given a /login endpoint", () => {
  describe("When it receives a POST request with a correct username and password", () => {
    test("Then it should respond with a 200 code", async () => {
      await request
        .post("/user/login")
        .send({ username: "usertest", password: "usertest" })

        .expect(200);
    });
  });

  describe("When it receives a POST request with an incorrect username and password", () => {
    test("Then it should respond with a 401 error code", async () => {
      await request
        .post("/user/login")
        .send({ username: "as", password: "as" })
        .expect(401);
    });
  });
});

describe("Given a /register endpoint", () => {
  describe("When it receives a POST request with incorrect parameters", () => {
    test("Then it should respond with a 400 error", async () => {
      await request
        .post("/user/register")
        .send({
          username: "danitest",
          password: await bcrypt.hash("danitest", 10),
          admin: true,
          myfavourites: [],
        })
        .expect(400);
    });
  });

  describe("When it receives a POST request with the correct parameters", () => {
    test("Then it should respond with a 200 status", async () => {
      const userTest = {
        username: "adssd",
        password: await bcrypt.hash("asdd", 10),
        admin: true,
        agenda: [],
      };
      await request.post("/user/register").send(userTest).expect(200);
    });
  });
});

describe("Given a /agenda endpoint", () => {
  describe("When it receives a GET request without being authorized", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.get("/user/agenda").expect(401);
    });
  });
  describe("When it receives a GET request with the user authorized", () => {
    test("Then it should respond with a 200 status", async () => {
      const expectedTestUser = {
        username: "usertest",
        password: "usertest",
        admin: true,
        agenda: [],
      };
      const { body } = await request
        .get("/user/agenda")
        .send({ username: "usertest", password: "usertest" })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toMatchObject(expectedTestUser);
    });
  });

  describe("When it receives a GET request with an invalid token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .get("/user/agenda")
        .set("Authorization", `Bearer a`)
        .expect(401);
    });
  });
});

describe("Given a /agenda endpoint", () => {
  describe("When it receives a PUT request with the user authorized", () => {
    test("Then it should respond with a 200 status", async () => {
      await request
        .put("/user/agenda")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "usertestB",
          admin: true,
          agenda: [],
        })
        .expect(200);
    });
  });
  describe("When it receives a PUT request without being authorized", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.put("/user/agenda").expect(401);
    });
  });
  describe("When it receives a PUT request with an invalid request", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .put("/user/agenda/update")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
});

const mongoose = require("mongoose");
const supertest = require("supertest");
const { app, initializeServer } = require("..");
const { connectDB } = require("../../database/index");
const Location = require("../../database/models/location");

const request = supertest(app);

let server;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOWY1YTA5YWQ2NjhjZGE2ZTQzMTM2OSIsImlhdCI6MTYzNzg0NDc3OSwiZXhwIjoxNjM4MDE3NTc5fQ.alUnDxKtrt_6o0yybzjTw_Txl6Zda3HfhHiypxK1g1c";
let testLocationA;
let testLocationB;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_STRING);
  server = await initializeServer(process.env.SERVER_PORT);
  await Location.deleteMany();
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

beforeEach(async () => {
  testLocationA = await Location.create({
    address: {
      coordinates: {
        longitude: 40123,
        latitude: 401654,
      },
      street: "Carrer Murcia 14",
      postcode: 78998,
    },
    name: "Comedor social",
    gender: true,
    type: "Comedor",
    phonenumber: "665278965",
    capacity: 40,
    timetable: [
      {
        day: "Jueves",
        time: 45,
        id: "619ea2fe3209b112d404571c",
      },
    ],
    id: "619ea2fe3209b112d404571b",
  });
  testLocationB = await Location.create({
    address: {
      coordinates: {
        longitude: 40123,
        latitude: 401654,
      },
      street: "Carrer Murcia 145",
      postcode: 78998,
    },
    name: "Comedor social B",
    gender: true,
    type: "Comedor",
    phonenumber: "665278965",
    capacity: 40,
    timetable: [
      {
        day: "Jueves",
        time: 45,
        id: "619ea2fe3209b112d404572c",
      },
    ],
    id: "619ea2fe3209b112d404572c",
  });
});

afterEach(async () => {
  await Location.deleteMany();
});

describe("Given a /location route", () => {
  describe("When it receives a get request", () => {
    test("Then it should respond with a list of location", async () => {
      const response = await request
        .get("/location")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body[0]).toHaveProperty("name", testLocationA.name);
      expect(response.body[1]).toHaveProperty("name", testLocationB.name);
    });
  });
});

describe("Given a /location/:id", () => {
  describe("When it receives a get request", () => {
    test("Then it should respond with a location", async () => {
      const response = await request
        .get(`/location/${testLocationA.id}`)
        .expect(200)
        .set("Authorization", `Bearer ${token}`);

      expect(response.body).toHaveProperty("name", testLocationA.name);
    });
  });
});

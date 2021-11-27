const mongoose = require("mongoose");
const supertest = require("supertest");
const { app, initializeServer } = require("..");
const { connectDB } = require("../../database/index");
const Location = require("../../database/models/location");

const request = supertest(app);

let server;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOWY1YTA5YWQ2NjhjZGE2ZTQzMTM2OSIsImlhdCI6MTYzODAzMzQ3OCwiZXhwIjoxNjM4MjA2Mjc4fQ.3jWYvdCy80p1kI3CEuCKtxcaPv1uUmE3CaFVBwWd0Vs";
let testLocationA;
let testLocationB;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_STRING_TEST);
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
  await Location.deleteMany();
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
    woman: true,
    type: "Comedor",
    phonenumber: "665278965",
    capacity: 40,
    timetable: [
      {
        day: "Jueves",
        time: "45",
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
    woman: true,
    type: "Comedor",
    phonenumber: "665278965",
    capacity: 40,
    timetable: [
      {
        day: "Jueves",
        time: "45",
        id: "619ea2fe3209b112d404545v",
      },
    ],
    id: "619ea2fe3209b112d404572c",
  });
});

afterEach(async () => {});

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

describe("Given a /location/create route", () => {
  describe("When it receives a post request", () => {
    test("Then it should respond with a new location", async () => {
      const testLocation = {
        address: {
          coordinates: {
            longitude: 40123,
            latitude: 401654,
          },
          street: "Carrer Murcia 14",
          postcode: 78998,
        },
        name: "Comedor social",
        woman: true,
        type: "Comedor",
        phonenumber: "665278965",
        capacity: 40,
        timetable: [
          {
            day: "Jueves",
            time: "45",
            id: "619ea2fe3209b112d404571c",
          },
        ],
        id: "619ea2fe3209b112d404571b",
      };
      const response = await request
        .post("/location/create")
        .set("Authorization", `Bearer ${token}`)
        .send(testLocation)
        .expect(200);

      expect(response.body).toHaveProperty("name", testLocationA.name);
    });
  });
});

describe("Given a /location/update/:id route", () => {
  describe("When it receives a put request", () => {
    test("Then it should respond with a location updated", async () => {
      const testLocationPut = {
        address: {
          coordinates: {
            longitude: 40123,
            latitude: 401654,
          },
          street: "Carrer Murcia 145",
          postcode: 78998,
        },
        name: "Comedor social Bok",
        woman: true,
        type: "Comedor",
        phonenumber: "665278965",
        capacity: 40,
        timetable: [
          {
            day: "Jueves",
            time: "45",
            id: "619ea2fe3209b112d404545v",
          },
        ],
      };

      const response = await request
        .put(`/location/${testLocationB.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(testLocationPut)
        .expect(200);
      expect(response.body.name).toBe(testLocationPut.name);
    });
  });
});

describe("Given a /location/delete/:id", () => {
  describe("When it receives a delete request with a location id", () => {
    test("Then it should respond with the deleted location", async () => {
      const response = await request
        .delete(`/location/${testLocationA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.name).toBe(testLocationA.name);
    });
  });

  describe("When it receives a delete request with a location without id", () => {
    test("Then it should respond with an error", async () => {
      const response = await request
        .delete("/location/asda")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Bad request");
    });
  });
  describe("When it receives a delete request with a wrong location id", () => {
    test("Then it should respond with an error", async () => {
      const response = await request
        .delete("/location/delete/618d661e120687524fd0ab11")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty("error", "Page not found");
    });
  });
});

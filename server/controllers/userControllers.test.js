require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const {
  userLogin,
  userSignUp,
  getMyLocations,
  updateUserAgenda,
} = require("./userControllers");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a userLogin function", () => {
  describe("When it receives a request with an incorrect username", () => {
    test("Then it should invoke the next function with an error", async () => {
      const exampleUsername = "Dani";

      const req = {
        body: {
          username: exampleUsername,
        },
      };
      const res = {};

      User.findOne = jest.fn().mockResolvedValue(false);
      const error = new Error("Wrong credentials");
      error.code = 401;
      const next = jest.fn();

      await userLogin(req, res, next);
      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a request with a correct username but incorrect password", () => {
    test("Then it should invoke the next function with an error", async () => {
      const req = {
        body: {
          username: "Dani",
          password: "Wrong credentials",
        },
      };
      const res = {};
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue({
        username: "Dani",
        password: "randomWord",
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const error = new Error("Wrong credentials");
      error.code = 401;

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it receives a request with a correct username and password", () => {
    test("Then it should invoke res.json with an object with a token", async () => {
      const req = {
        body: {
          username: "Dani",
          password: "randomWord",
        },
      };

      const res = {
        json: jest.fn(),
      };

      User.findOne = jest.fn().mockResolvedValue({
        username: "Dani",
        password: "randomWord",
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedToken = "expectedToken";
      jwt.sign = jest.fn().mockReturnValue(expectedToken);

      const expectedResponse = {
        token: expectedToken,
      };

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given a userSignUp function", () => {
  describe("When it receives a request with an existing username", () => {
    test("Then it should invoke next function with an error", async () => {
      const exampleUsername = "Dani";

      const req = {
        body: {
          username: exampleUsername,
        },
      };

      const res = {};

      User.findOne = jest.fn().mockResolvedValue(true);
      const error = new Error("Username already exists");
      error.code = 400;
      const next = jest.fn();

      await userSignUp(req, res, next);
      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a request with a new username", () => {
    test("Then it should response with a status 200", async () => {
      const exampleUser = {
        name: "Dani",
        username: "dani",
        password: "mypassword",
      };

      const req = {
        body: exampleUser,
      };

      const res = mockResponse();

      User.findOne = jest.fn().mockResolvedValue(false);

      await userSignUp(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

describe("Given a getMyLocations function", () => {
  describe("When it receives request with a userId 1 a response and the next function", () => {
    test("Then it should call User.findById with a number 1", async () => {
      const userId = 1;

      const req = {
        params: {
          userId,
        },
      };

      const res = {
        json: () => {},
      };

      const next = () => {};
      User.findByid = jest.fn().mockResolvedValue({});
      await getMyLocations(req, res, next);
      expect(User.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("When User.findById rejects", () => {
    test("Then it should call function next with an error 400", async () => {
      const error = {
        code: 400,
        message: "Bad Request",
      };

      const req = {
        params: {
          userId: 10,
        },
      };
      const res = {};
      const next = jest.fn();

      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockRejectedValue(error) });
      await getMyLocations(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });

  describe("When User.findById returns undefined", () => {
    test("Then it should call next with an error", async () => {
      const error = new Error("User not found");
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(undefined) });
      const req = {
        params: {
          userId: 1,
        },
      };

      const res = {};
      const next = jest.fn();

      await getMyLocations(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a updateUserAgenda function", () => {
  describe("When it receives an object req with a body and an object res", () => {
    test("Then it should invoke the method json of res and call the User.findByIdAndUpdate", async () => {
      const req = {
        params: {
          userId: 4,
        },
        body: {
          idLocation: 1,
        },
      };

      User.findOneAndUpdate = jest.fn();
      const res = {
        json: jest.fn(),
      };

      const next = () => {};
      await updateUserAgenda(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an object res and an invalid object req", () => {
    test("Then it should invoke next with an error", async () => {
      const req = {
        params: {
          userId: 4,
        },
        body: {
          idLocation: 1,
        },
      };
      const error = {};

      User.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      const res = {
        json: jest.fn(),
      };

      const next = jest.fn();
      await updateUserAgenda(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

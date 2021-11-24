const jwt = require("jsonwebtoken");
const auth = require("./auth");

jest.mock("jsonwebtoken");
// jest.mock("jsonwebtoken", () => ({
//   verify: jest.fn().mockRejectedValue(),
// }));

describe("Given an auth middleware", () => {
  describe("When it receives a request without a correct Authorization header", () => {
    test("Then it should send an error with a message 'You're not authorized' and status 401", () => {
      const req = {
        header: jest.fn(),
      };

      const res = {};
      const next = jest.fn();
      const expectedError = new Error("You're not authorized");

      auth(req, res, next);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an Authorization header without token", () => {
    test("Then it should send an error with a message 'Missing token...' and status 401", () => {
      const authHeader = "carer";
      const req = {
        header: jest.fn().mockReturnValue(authHeader),
      };
      const res = {};
      const next = jest.fn();
      const expectedError = new Error("Missing token...");

      auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a Authorization but without a correct token", () => {
    test("Then it should send an error with a message 'Invalid token' and status 401", () => {
      jwt.verify = jest.fn().mockRejectedValue();
      const req = {
        json: jest.fn(),
        header: jest.fn().mockReturnValue("Bearer Token"),
      };

      const next = jest.fn();
      const errorToken = new Error("Invalid token");
      errorToken.code = 401;

      const res = {};
      const error = new Error();

      jwt.verify = jest.fn().mockRejectedValue(error);
      auth(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it gets a request with a Authorization header and it validates", () => {
    test("Then it should add userId and userName to req and call next", async () => {
      const req = {
        json: jest.fn(),
        header: jest.fn().mockReturnValue("Bearer token"),
      };

      const next = jest.fn();

      const res = {};

      jwt.verify = jest.fn().mockReturnValue("lorem");
      await auth(req, res, next);

      expect(req).toHaveProperty("userId");
      expect(req).toHaveProperty("userName");
      expect(next).toHaveBeenCalled();
    });
  });
});

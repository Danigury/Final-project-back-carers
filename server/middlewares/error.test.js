const { ValidationError } = require("express-validation");
const { notFoundErrorHandler, errorHandler } = require("./error");

const mockReponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a notFoundErrorHandler middleware", () => {
  describe("When it gets a request", () => {
    test("Then it should response with 'Page not found'", () => {
      const res = mockReponse();
      const expectedError = { error: "Page not found" };
      const req = {};

      notFoundErrorHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given an errorHandler middleware", () => {
  describe("When it receives a request an error and an error code", () => {
    test("Then it should send a response with 'General error!' and an error code 500", () => {
      const res = mockReponse();
      const error = { error: "General error!" };
      const req = {};
      const next = () => {};

      errorHandler(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request and a Validation error", () => {
    test("Then it should send a response with the message 'Bad request' and a status code 400", () => {
      const res = mockReponse();
      const error = new ValidationError("details", {
        error: new Error(),
        statusCode: 400,
      });

      const req = {};
      const next = () => {};

      errorHandler(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Bad request" });
    });
  });
});

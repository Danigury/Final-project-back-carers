const Location = require("../../database/models/location");
const {
  getLocations,
  getLocationById,
  getLocationByType,
  createLocation,
  isAuthorized,
  updateLocation,
  deleteLocation,
} = require("./locationControllers");

jest.mock("../../database/models/location");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a getLocation function", () => {
  describe("When it receives an object res", () => {
    test("Then it should invoke the json method and call Location.find function", async () => {
      const locations = [
        {
          id: 1,
          name: "Menjador Social Gregal",
          gender: true,
          type: "Comedor",
        },
        {
          id: 2,
          name: "Menjador Social Gregal",
          gender: true,
          type: "Comedor",
        },
      ];

      Location.find = jest.fn().mockResolvedValue(locations);
      const res = {
        json: jest.fn(),
      };

      await getLocations(null, res);

      expect(res.json).toHaveBeenCalledWith(locations);
    });
  });
});

describe("Given a getLocationById function", () => {
  describe("When it receives a request with a locationId 1 a response and the next function", () => {
    test("Then it should call Location.findById with a number 1", async () => {
      const idLocation = 1;
      const req = {
        params: {
          idLocation,
        },
      };

      const res = {
        json: () => {},
      };

      const next = () => {};
      Location.findById = jest.fn().mockResolvedValue({});
      await getLocationById(req, res, next);
      expect(Location.findById).toHaveBeenCalledWith(idLocation);
    });
  });

  describe("When Location.findById rejects", () => {
    test("Then it should call function next with an error 400", async () => {
      const error = {};
      Location.findById = jest.fn().mockRejectedValue(error);
      const req = {
        params: {
          id: 10,
        },
      };

      const res = {};

      const next = jest.fn();

      await getLocationById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });

  describe("And Location.findById returns undefined", () => {
    test("Then it should call next with an error", async () => {
      const error = new Error("Location not found");
      Location.findById = jest.fn().mockResolvedValue(undefined);
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {};
      const next = jest.fn();

      await getLocationById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getLocationByType", () => {
  describe("When it receives a request with a locationType 'Albergue' a response and a next function", () => {
    test("Then it should call Location.findOne with 'Albergue'", async () => {
      const typeLocation = "Albergue";
      const req = {
        params: {
          typeLocation,
        },
      };

      const res = {
        json: () => {},
      };

      const next = () => {};
      Location.findOne = jest.fn().mockResolvedValue({});
      await getLocationByType(req, res, next);
      expect(Location.findOne).toHaveBeenCalledWith(typeLocation);
    });
  });

  describe("When Location.findOne rejects", () => {
    test("Then it should call function next with an error 400", async () => {
      const error = {};
      Location.findOne = jest.fn().mockRejectedValue(error);
      const req = {
        params: {
          type: "Albergue",
        },
      };

      const res = {};
      const next = jest.fn();

      await getLocationByType(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });

  describe("And Location.findOne returns undefined", () => {
    test("Then it should call next with an error", async () => {
      const error = new Error("Location not found");
      Location.findOne = jest.fn().mockResolvedValue(undefined);
      const req = {
        params: {
          type: "Casa",
        },
      };
      const res = {};
      const next = jest.fn();

      await getLocationByType(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createLocation function", () => {
  describe("When it receives a res object and a req object with a body", () => {
    test("Then it should invoke the json method of res and call Location.create function", async () => {
      const location = {
        id: 1,
        name: "Menjador Social Gregal",
        gender: true,
        type: "Comedor",
      };

      const req = {
        body: location,
      };

      Location.create = jest.fn().mockResolvedValue(location);
      const res = {
        json: jest.fn(),
      };

      const next = () => {};
      await createLocation(req, res, next);

      expect(Location.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(location);
    });
  });

  describe("When it receives an object res and an invalid object req", () => {
    test("Then it should invoke next with an error", async () => {
      const req = {};
      const error = {};

      Location.create = jest.fn().mockRejectedValue(error);

      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await createLocation(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a isAuthorized function", () => {
  describe("When it receives an object req with a correct token", () => {
    test("Then it should invoke the function next", async () => {
      const req = {
        query: {
          token: process.env.TOKEN,
        },
      };

      const res = {};

      const next = jest.fn();

      await isAuthorized(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives an object req with an incorrect token", () => {
    test("Then it should respond with an error", async () => {
      const req = {
        query: {
          token: "Unauthorised",
        },
      };

      const res = mockResponse();

      const next = jest.fn();

      await isAuthorized(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
    });
  });
});

describe("Given an updateLocation function", () => {
  describe("When it receives an object res and an object req with a body", () => {
    test("Then it should invoke method json of res and call the Location.findByIdAndUpdate function", async () => {
      const req = {
        params: {
          idLocation: 4,
        },
      };

      Location.findByIdAndUpdate = jest.fn();
      const res = {
        json: jest.fn(),
      };
      const next = () => {};

      await updateLocation(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an object res and an invalid object req", () => {
    test("Then it should invoke next with an error", async () => {
      const req = {};
      const error = {};

      Location.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await updateLocation(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a deleteLocation function", () => {
  describe("When it receives a request with a locationId 1 a response and the next function", () => {
    test("Then it should call Location.findByIdAndDelete with a number 1", async () => {
      const idLocation = 1;
      const req = {
        params: {
          idLocation,
        },
      };

      const res = {
        json: jest.fn(),
      };

      const next = () => {};
      Location.findByIdAndDelete = jest.fn().mockResolvedValue({});
      await deleteLocation(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });
  describe("When Location.findByIdAndDelete rejects", () => {
    test("Then it should call function next with an error 400", async () => {
      const error = {};
      Location.findByIdAndDelete = jest.fn().mockRejectedValue(error);
      const req = {
        params: {
          id: 10,
        },
      };

      const res = {};

      const next = jest.fn();
      await deleteLocation(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });

  describe("And Location.findByIdAndDelete return undefined", () => {
    test("Then it should call next with an error", async () => {
      const error = new Error("Location not found");
      Location.findByIdAndDelete = jest.fn().mockResolvedValue(undefined);
      const req = {
        params: {
          id: 1,
        },
      };

      const res = {};
      const next = jest.fn();

      await deleteLocation(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

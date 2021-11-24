const Location = require("../../database/models/location");
const {
  getLocations,
  getLocationById,
  getLocationByType,
} = require("./locationControllers");

jest.mock("../../database/models/location");

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

      expect(Location.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(locations);
    });
  });
});

describe("Given a getLocationById function", () => {
  describe("When it receives a request with an locationId 1 a response and the next function", () => {
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

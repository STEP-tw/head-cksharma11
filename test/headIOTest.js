const assert = require("assert");
const { parseInputs } = require("../src/headIO.js");

describe("parseInputs", () => {
  describe("should categorize inputs and return object", () => {
    it("with option as -n", () => {
      const userArgs = ["-n5", "file1"];
      const expectedOutput = {
        option: "-n",
        value: 5,
        fileNames: ["file1"]
      };

      assert.deepEqual(parseInputs(userArgs), expectedOutput);
    });

    it("with option as -c", () => {
      const userArgs = ["-c5", "file1"];
      const expectedOutput = {
        option: "-c",
        value: 5,
        fileNames: ["file1"]
      };

      assert.deepEqual(parseInputs(userArgs), expectedOutput);
    });

    it("with default values", () => {
      const userArgs = ["file1"];
      const expectedOutput = {
        option: "-n",
        value: 10,
        fileNames: ["file1"]
      };

      assert.deepEqual(parseInputs(userArgs), expectedOutput);
    });

    it("without passing option i.e. -11", () => {
      const userArgs = ["-11", "file1"];
      const expectedOutput = {
        option: "-n",
        value: 11,
        fileNames: ["file1"]
      };

      assert.deepEqual(parseInputs(userArgs), expectedOutput);
    });

    it("with case -n 5", () => {
      const userArgs = ["-n", "5", "file1"];
      const expectedOutput = {
        option: "-n",
        value: 5,
        fileNames: ["file1"]
      };

      assert.deepEqual(parseInputs(userArgs), expectedOutput);
    });

    it("with invalid option", () => {
      const userArgs = ["-v5", "file1"];
      const expectedOutput = {
        option: "-v",
        value: 5,
        fileNames: ["file1"]
      };

      assert.deepEqual(parseInputs(userArgs), expectedOutput);
    });

    it("with string as value", () => {
      const userArgs = ["-n", "five", "file1"];
      const expectedOutput = {
        option: "-n",
        value: "five",
        fileNames: ["file1"]
      };

      assert.deepEqual(parseInputs(userArgs), expectedOutput);
    });
  });
});

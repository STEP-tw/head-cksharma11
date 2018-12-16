const assert = require("assert");
const {
  getLinesFromHead,
  getCharsFromHead,
  head,
  tail,
  addHeader,
  fileNotFoundLog,
  organizeHead,
  getFileContents,
  getLinesFromTail,
  getCharsFromTail,
  organizeTail
} = require("../src/lib.js");

describe("getLinesFromHead", function() {
  const fileContents = [
    "This is test file",
    "This is line 2",
    "This is line 3",
    "This is line 4",
    "This is line 5",
    "This is line 6",
    "This is line 7",
    "This is line 8",
    "This is line 9",
    "This is line 10",
    "This is line 11",
    "This is line 12\n"
  ].join("\n");

  it("should return empty string with input 0", function() {
    assert.equal(getLinesFromHead(fileContents, 0), "");
  });

  it("should return 1 line with input 1", function() {
    assert.equal(getLinesFromHead(fileContents, 1), "This is test file");
  });

  it("should return 10 line as default", function() {
    const expectedOutput = [
      "This is test file",
      "This is line 2",
      "This is line 3",
      "This is line 4",
      "This is line 5",
      "This is line 6",
      "This is line 7",
      "This is line 8",
      "This is line 9",
      "This is line 10"
    ].join("\n");

    assert.equal(getLinesFromHead(fileContents), expectedOutput);
  });
});

describe("getCharsFromHead", function() {
  const fileContents = "This is a test file.";

  it("should return empty string with n = 0", function() {
    assert.equal(getCharsFromHead(fileContents, 0), "");
  });

  it("should return first 5 characters of contents with n = 5", function() {
    assert.equal(getCharsFromHead(fileContents, 5), "This ");
  });
});

describe("head", function() {
  it("should return default 10 lines for single file", function() {
    const file = [
      "Line 1",
      "Line 2",
      "Line 3",
      "Line 4",
      "Line 5",
      "Line 6",
      "Line 7",
      "Line 8",
      "Line 9",
      "Line 10"
    ].join("\n");

    assert.deepEqual(head([file], "-n", 10, ["file"]), [file]);
  });

  it("should return number of input lines with 2 files", function() {
    const file1 = [
      "Line 1",
      "Line 2",
      "Line 3",
      "Line 4",
      "Line 5",
      "Line 6",
      "Line 7",
      "Line 8",
      "Line 9",
      "Line 10"
    ].join("\n");
    const file2 = [
      "File2 line 1",
      "File2 line 2",
      "File2 line 3",
      "File2 line 4",
      "File2 line 5",
      "File2 line 6"
    ].join("\n");

    const expectedOutput = [
      `==> file1 <==
Line 1
Line 2
Line 3`,
      `==> file2 <==
File2 line 1
File2 line 2
File2 line 3`
    ];

    const actualOutput = head([file1, file2], "-n", 3, ["file1", "file2"]);
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return empty when no files passed", function() {
    const actualOutput = head([], "-n", 1, []);
    assert.equal(actualOutput, "");
  });

  it("should return file not found log for single null file", function() {
    const nullFile = null;
    const expectedOutput = "head: nullFile: No such file or directory";
    const actualOutput = head([nullFile], "-n", 1, ["nullFile"]);
    assert.equal(actualOutput, expectedOutput);
  });

  it("should return file not found log when one file exists", function() {
    const nullFile = null;
    const fileWithContent = "File with content";
    const expectedOutput = [
      "head: nullFile: No such file or directory",
      "==> fileWithContent <==\nFile with content"
    ];
    const actualOutput = head([nullFile, fileWithContent], "-n", 1, [
      "nullFile",
      "fileWithContent"
    ]);

    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("addHeader", function() {
  it("should add header with passed contents", function() {
    const content = "This is sample file";
    const fileName = "Test.js";
    const expectedOutput = "==> Test.js <==\nThis is sample file";
    const actualOutput = addHeader(fileName, content);

    assert.equal(actualOutput, expectedOutput);
  });
});

describe("fileNotFoundLog", function() {
  it("should return log when file not found (head)", function() {
    const fileName = "Test";
    const expectedOutput = "head: " + fileName + ": No such file or directory";
    const actualOutput = fileNotFoundLog(fileName, "head");

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return log when file not found (tail)", function() {
    const fileName = "Test";
    const expectedOutput = "tail: " + fileName + ": No such file or directory";
    const actualOutput = fileNotFoundLog(fileName, "tail");

    assert.equal(actualOutput, expectedOutput);
  });
});

const readFileSync = function(fileName) {
  let fileContents = {
    names: "A\nB\nC\nD\nE",
    numbers: "1\n2\n3\n4\n5"
  };
  return fileContents[fileName];
};

const existsSync = function(fileName) {
  let fileNames = ["names", "numbers"];
  return fileNames.includes(fileName);
};

const fs = { readFileSync, existsSync };

describe("organizeHead", function() {
  it("should return list of names when file name is names", function() {
    const expectedOutput = "A\nB";
    const actualOutput = organizeHead(fs, {
      option: "-n",
      value: 2,
      fileNames: ["names"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return list of numbers when file name is numbers", function() {
    const expectedOutput = "1\n2";
    const actualOutput = organizeHead(fs, {
      option: "-n",
      value: 2,
      fileNames: ["numbers"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return list of numbers and names when both files passed", function() {
    const expectedOutput = "==> names <==\nA\nB\n\n==> numbers <==\n1\n2";
    const actualOutput = organizeHead(fs, {
      option: "-n",
      value: 2,
      fileNames: ["names", "numbers"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return error when option value is 0", function() {
    const expectedOutput = "head: illegal line count -- 0";
    const actualOutput = organizeHead(fs, {
      option: "-n",
      value: 0,
      fileNames: ["numbers"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return error when option negative value passed", function() {
    const expectedOutput = "head: illegal line count -- -1";
    const actualOutput = organizeHead(fs, {
      option: "-n",
      value: -1,
      fileNames: ["numbers"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return error when length of fileNames is 0", function() {
    const expectedOutput =
      "head: option requires an argument -- n\n" +
      "usage: head [-n lines | -c bytes] [file ...]";
    const actualOutput = organizeHead(fs, {
      option: "-n",
      value: 1,
      fileNames: []
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return n number of lines when single file is passed", function() {
    const expectedOutput = "1\n2";
    const actualOutput = organizeHead(fs, {
      option: "-n",
      value: 2,
      fileNames: ["numbers"]
    });

    assert.equal(actualOutput, expectedOutput);
  });
});

describe("getFileContents", function() {
  it("should return null when file not found", function() {
    const expectedOutput = [null];
    const actualOutput = getFileContents(fs, ["badFile"]);

    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return contents of one file", function() {
    const expectedOutput = [[1, 2, 3, 4, 5].join("\n")];
    const actualOutput = getFileContents(fs, ["numbers"]);

    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return contents of two files", function() {
    const expectedOutput = ["1\n2\n3\n4\n5", "A\nB\nC\nD\nE"];
    const actualOutput = getFileContents(fs, ["numbers", "names"]);

    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("getLinesFromTail", function() {
  it("should return last line of content for 1 input", function() {
    const testFile = ["A", "B", "C", "D"].join("\n");
    const actualOutput = getLinesFromTail(testFile, 1);

    assert.equal(actualOutput, "D");
  });

  it("should retrun last two line of content for 2 input", function() {
    const testFile = ["A", "B", "C", "D"].join("\n");
    const actualOutput = getLinesFromTail(testFile, 2);

    assert.equal(actualOutput, "C\nD");
  });

  it("should return back file with input 0", function() {
    const testFile = ["A", "B", "C", "D"].join("\n");
    const actualOutput = getLinesFromTail(testFile, 0);

    assert.equal(actualOutput, testFile);
  });
});

describe("getCharsFromTail", function() {
  it("should return last character of when input is 1", function() {
    const testFile = "abcd";
    const actualOutput = getCharsFromTail(testFile, 1);

    assert.equal(actualOutput, "d");
  });

  it("should last 2 characters when input is 2", function() {
    const testFile = "1234\n5678";
    const actualOutput = getCharsFromTail(testFile, 2);

    assert.equal(actualOutput, "78");
  });

  it("should return back file with input 0", function() {
    const testFile = "abcd";
    const actualOutput = getCharsFromTail(testFile, 0);

    assert.equal(actualOutput, testFile);
  });
});

describe("organizeTail", function() {
  it("should return list of names when file name is names", function() {
    const expectedOutput = "D\nE";
    const actualOutput = organizeTail(fs, {
      option: "-n",
      value: 2,
      fileNames: ["names"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return list of numbers when file name is numbers", function() {
    const expectedOutput = "4\n5";
    const actualOutput = organizeTail(fs, {
      option: "-n",
      value: 2,
      fileNames: ["numbers"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return list of numbers and names when both files passed", function() {
    const expectedOutput = "==> names <==\nD\nE\n\n==> numbers <==\n4\n5";
    const actualOutput = organizeTail(fs, {
      option: "-n",
      value: 2,
      fileNames: ["names", "numbers"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return file not found log when file not found", function() {
    const expectedOutput = "tail: abc: No such file or directory";
    const actualOutput = organizeTail(fs, {
      option: "-n",
      value: 2,
      fileNames: ["abc"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return error message when invalid argument passed", function() {
    const expectedOutput =
      "tail: illegal option -- -v\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
    const actualOutput = organizeTail(fs, {
      option: "-v",
      value: 2,
      fileNames: ["abc"]
    });

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return empty string for count 0", function() {
    const expectedOutput = "";
    const actualOutput = organizeTail(fs, {
      option: "-n",
      value: 0,
      fileNames: ["names"]
    });

    assert.equal(actualOutput, expectedOutput);
  });
});

describe("tail", function() {
  it("should return default 10 lines for single file", function() {
    const file = [
      "Line 1",
      "Line 2",
      "Line 3",
      "Line 4",
      "Line 5",
      "Line 6",
      "Line 7",
      "Line 8",
      "Line 9",
      "Line 10"
    ].join("\n");

    const actualOutput = tail([file], "-n", 10, ["file"]);

    assert.deepEqual(actualOutput, [file]);
  });

  it("should return number of input lines from tail with 2 files", function() {
    const file1 = [
      "Line 1",
      "Line 2",
      "Line 3",
      "Line 4",
      "Line 5",
      "Line 6",
      "Line 7",
      "Line 8",
      "Line 9",
      "Line 10"
    ].join("\n");
    const file2 = [
      "File2 line 1",
      "File2 line 2",
      "File2 line 3",
      "File2 line 4",
      "File2 line 5",
      "File2 line 6"
    ].join("\n");

    const expectedOutput = [
      "==> file1 <==\nLine 8\nLine 9\nLine 10",
      "==> file2 <==\nFile2 line 4\nFile2 line 5\nFile2 line 6"
    ];

    const actualOutput = tail([file1, file2], "-n", 3, ["file1", "file2"]);

    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return empty when no files passed", function() {
    const actualOutput = tail([], "-n", 1, []);
    assert.equal(actualOutput, "");
  });

  it("should return file not found log for single null file", function() {
    const nullFile = null;
    const expectedOutput = "tail: nullFile: No such file or directory";
    const actualOutput = tail([nullFile], "-n", 1, ["nullFile"]);

    assert.equal(actualOutput, expectedOutput);
  });

  it("should return file not found log when one file exists", function() {
    const nullFile = null;
    const fileWithContent = "File with content";
    const expectedOutput = [
      "tail: nullFile: No such file or directory",
      "==> fileWithContent <==\nFile with content"
    ];

    const actualOutput = tail([nullFile, fileWithContent], "-n", 1, [
      "nullFile",
      "fileWithContent"
    ]);

    assert.deepEqual(actualOutput, expectedOutput);
  });
});

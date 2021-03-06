const mockReader = function(expectedFiles) {
  return function(actualPath) {
    return expectedFiles[actualPath];
  };
};

const mockValidator = function(expectedFiles) {
  return function(actualPath) {
    if (expectedFiles[actualPath]) {
      return true;
    }
    return false;
  };
};

module.exports = { mockReader, mockValidator };

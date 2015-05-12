var Response = function (category, request, statuscode) {

  var values = {};

  this.addValue = function (key, value) {
    values[key] = value;
  };

  this.getMessage = function () {
    return {
      category: category,
      request: request,
      statuscode: statuscode,
      values: values
    };
  };
};

module.exports = Response;

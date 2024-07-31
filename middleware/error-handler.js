const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again",
  };

  console.log(err.name, err.code);

  if (err?.code === 11000) {
    customError = {
      statusCode: StatusCodes.BAD_REQUEST,
      msg: `Duplicate value entered for ${Object.keys(err.keyValue)}`,
    };
  }

  if (err?.name === "ValidationError") {
    customError = {
      statusCode: StatusCodes.CONFLICT,
      msg: Object.values(err.errors)
        .map((item) => item.message)
        .join(", "),
    };
  }

  if (err?.name === "CastError") {
    customError = {
      statusCode: StatusCodes.NOT_FOUND,
      msg: `No item found with id : ${err.value}`,
    };
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;

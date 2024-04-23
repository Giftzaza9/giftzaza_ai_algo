const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { errorLogService } = require('../services');

const getErrorLog = catchAsync(async (req, res) => {
  const errorLog = await errorLogService.getErrorLogById(req.params.id);
  if (!errorLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ErrorLog not found');
  }
  res.send(errorLog);
});

const getErrorLogs = catchAsync(async (req, res) => {
  const result = await errorLogService.queryErrorLogs(req.query);
  res.send(result);
});

const createErrorLog = catchAsync(async (req, res) => {
  req.body.user = req.user._id;
  const errorLog = await errorLogService.createErrorLog(req.body);
  res.status(httpStatus.CREATED).send(errorLog);
});

const deleteErrorLog = catchAsync(async (req, res) => {
  await errorLogService.deleteErrorLogById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getErrorLog,
  getErrorLogs,
  createErrorLog,
  deleteErrorLog,
};

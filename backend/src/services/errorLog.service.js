const httpStatus = require('http-status');
const { ErrorLog } = require('../models');
const ApiError = require('../utils/ApiError');
const axiosInstance = require('../utils/axiosInstance');
const { errorPlatforms } = require('../config/errorLog');

/**
 * Get errorLog by id
 * @param {ObjectId} id
 * @returns {Promise<ErrorLog>}
 */
const getErrorLogById = async (id) => {
  const errorLog = await ErrorLog.findById(id).populate('user');
  if (!errorLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ErrorLog not found');
  }
  return errorLog;
};

const queryErrorLogs = async (queryObject) => {
  const { sort, page = 1, limit = 12, platform = '' } = queryObject;
  let filterObject = {};
  const optionsObject = { page, limit, sort: { createdAt: -1 } };

  if (sort) {
    switch (sort) {
      case 'latest':
        optionsObject.sort = { createdAt: -1 };
        break;
      case 'oldest':
        optionsObject.sort = { createdAt: 1 };
        break;
      default:
        optionsObject.sort = { createdAt: -1 };
    }
  }

  if (Object.values(errorPlatforms).includes(platform)) {
    filterObject.platform = platform;
  }

  const [total, error_logs] = await Promise.all([
    ErrorLog.count(filterObject),
    ErrorLog.aggregate([
      {
        $match: filterObject,
      },
      // {
      //   $lookup: {
      //     from: 'users',
      //     localField: 'user',
      //     foreignField: '_id',
      //     as: 'user_details',
      //   },
      // },
      // {
      //   $unwind: '$user_details',
      // },
      // {
      //   $project: {
      //     'user_details.password': 0,
      //     'user_details.__v': 0,
      //     'user_details.createdAt': 0,
      //     'user_details.updatedAt': 0,
      //     __v: 0,
      //   },
      // },
      {
        $sort: optionsObject.sort,
      },
      {
        $skip: (optionsObject.page - 1) * optionsObject.limit,
      },
      {
        $limit: optionsObject.limit,
      },
    ]).collation({ locale: 'en', strength: 2 }),
  ]);
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  return { hasNextPage, totalDocs: total, page, limit, docs: error_logs };
};

/**
 * Create a errorLog
 * @param {Object} errorLogBody
 * @returns {Promise<ErrorLog>}
 */
const createErrorLog = async (errorLogBody) => {
  return await ErrorLog.create(errorLogBody);
};

/**
 * Delete errorLog by id
 * @param {ObjectId} errorLogId
 * @returns {Promise<ErrorLog>}
 */
const deleteErrorLogById = async (errorLogId) => {
  const errorLog = await ErrorLog.findById(errorLogId);
  if (!errorLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ErrorLog not found');
  }
  await errorLog.remove();
  return errorLog;
};

module.exports = {
  getErrorLogById,
  queryErrorLogs,
  createErrorLog,
  deleteErrorLogById,
};

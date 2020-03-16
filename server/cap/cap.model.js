const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Cap Schema
 */
const CapSchema = new mongoose.Schema({
  productId: { type: String, required: false},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  alcohol: { type: Number, required: true },
  userId: { type: String, required: true },
  consumedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
CapSchema.method({
});

/**
 * Statics
 */
CapSchema.statics = {
  /**
   * Get cap
   * @param {ObjectId} id - The objectId of cap.
   * @returns {Promise<Cap, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((cap) => {
        if (cap) {
          return cap;
        }
        const err = new APIError('No such cap exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Caps in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of Caps to be skipped.
   * @param {number} limit - Limit number of Caps to be returned.
   * @returns {Promise<Cap[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Cap
 */
module.exports = mongoose.model('Cap', CapSchema);

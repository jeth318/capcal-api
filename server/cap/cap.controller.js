const Cap = require('./cap.model');

/**
 * Load cap and append to req.
 */
function load(req, res, next, id) {
  Cap.get(id)
    .then((cap) => {
      req.cap = cap; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get cap
 * @returns {Cap}
 */
function get(req, res) {
  return res.json(req.cap);
}

/**
 * Create new cap
 * @property {string} req.body.userId - The userId of the user whom consumed beverage.
 * @property {string} req.body.name - The name of the consumed beverage.
 * @property {string} req.body.productId - The systembolags-id of the consumed beverage.
 * @property {number} req.body.price - The listing price of the consumed beverage.
 * @property {number} req.body.alcohol - The alcohole percentage of the consumed beverage.
 * @property {date} req.body.consumedAt - The date and time for consuming the beverage.
 * @returns {Cap}
 */

 function buildCap(req) {
     return new Cap({
        userId: req.body.userId,
        name: req.body.name,
        productId: req.body.productId,
        price: req.body.price,
        alcohol: req.body.alcohol,
        consumedAt: req.body.consumedAt
      });
 }

function create(req, res, next) {
    console.log(req.body);
  const count = req.body.count || 1;
  let promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(buildCap(req).save());
    }

    return Promise.all(promises)
        .then(data => res.json(data[0]))
        .catch(error => res.json(error));
}

/**
 * Update existing cap
 * @property {string} req.body.userId - The user id of whom consumed beverage.
 * @property {string} req.body.name - The name of the consumed beverage.
 * @property {string} req.body.productId - The systembolags-id of the consumed beverage.
 * @property {number} req.body.price - The listing price of the consumed beverage.
 * @property {number} req.body.alcohol - The alcohole percentage of the consumed beverage.
 * @property {date} req.body.consumedAt - The date and time for consuming the beverage.
 * @returns {Cap}
 */
function update(req, res, next) {
  const cap = req.cap;
  cap.userId = req.body.userId,
  cap.name = req.body.name,
  cap.price = req.body.price,
  cap.productId = req.body.productId,
  cap.alcohol = req.body.alcohol

  cap.save()
    .then(savedCap => res.json(savedCap))
    .catch(e => next(e));
}

/**
 * Get cap list.
 * @property {number} req.query.skip - Number of caps to be skipped.
 * @property {number} req.query.limit - Limit number of caps to be returned.
 * @returns {Cap[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Cap.list({ limit, skip })
    .then(caps => res.json(caps))
    .catch(e => next(e));
}

/**
 * Delete cap.
 * @returns {Cap}
 */
function remove(req, res, next) {
  const cap = req.cap;
  cap.remove()
    .then(deletedCap => res.json(deletedCap))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };

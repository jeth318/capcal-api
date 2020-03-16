const express = require('express');
const capCtrl = require('./cap.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/caps - Get list of caps */
  .get(capCtrl.list)

  /** POST /api/caps - Create new cap */
  .post(capCtrl.create);

router.route('/:capId')
  /** GET /api/caps/:capId - Get cap */
  .get(capCtrl.get)

  /** PUT /api/caps/:capId - Update cap */
  .put(capCtrl.update)

  /** DELETE /api/caps/:capId - Delete cap */
  .delete(capCtrl.remove);

/** Load cap when API with capId route parameter is hit */
router.param('capId', capCtrl.load);

module.exports = router;

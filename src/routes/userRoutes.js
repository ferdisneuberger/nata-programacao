const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.js');

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/:userId', UserController.getById);
router.patch('/:userId', UserController.updateById);
router.delete('/:userId', UserController.delete);

module.exports = router;



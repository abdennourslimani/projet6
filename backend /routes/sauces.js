const express = require('express');
const auth = require('..//middleware/auth.js')
const multer = require('../middleware/multer-config');


const router = express.Router();
const saucesCtrl = require('../controllers/sauces');

router.post('/', auth, multer, saucesCtrl.createSauce);

router.get('/:id', auth, saucesCtrl.getOneSauce);

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.delete('/:id', auth, saucesCtrl.deleteSauce);

router.get('/', auth, saucesCtrl.getAllSauces);


module.exports = router;
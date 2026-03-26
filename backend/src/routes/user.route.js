const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validation.middleware');
const { registerSchema, loginSchema } = require('../middlewares/user.validation');
const { registerUser, loginUser, logoutUser, updateBudget } = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.middleware'); 

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/logout', logoutUser);
router.patch('/update-budget', verifyToken, updateBudget);

module.exports = router;
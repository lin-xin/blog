const router = require('koa-router')(),
    User = require('../controllers/user.js');

router.post('/register', User.register);
router.post('/login', User.login);
router.get('/info', User.userinfo);
router.patch('/avatar', User.avatar);
router.get('/aa', async (ctx) => {
    
})

module.exports = router;
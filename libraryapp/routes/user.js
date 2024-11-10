import { Router } from 'express';
const router = Router();
import { authenticate } from 'passport';

import { userLogin, renderLogin, userLogout, renderProfile, renderRegister, userRegister } from '../regulator/user/userRender';

router.get('/profile', renderProfile);
router.get('/login', renderLogin);
router.post('/login', authenticate('local', {failureRedirect: 'user/login'}), userLogin);
router.get('/register', renderRegister);
router.post('/register', userRegister);
router.get('/logout', userLogout);

export default router;
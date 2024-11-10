import { Router } from 'express';
import { authenticate } from 'passport';

const router = Router();

import { userLogin, userRegister, userProfile } from '../../regulator/user/userApi';

router.get('/profile', userProfile);
router.post('/login', authenticate('local', { failureMessage: 'Неправильный логин или пароль' }), userLogin);
router.post('/signup', userRegister);

export default router;
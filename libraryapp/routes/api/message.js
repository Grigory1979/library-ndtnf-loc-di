import { Router } from 'express';
const router = Router();

import { sendMessage, getMessage } from '../../regulator/message/messageApi';

router.get(':id', getMessage);
router.post('/', sendMessage);

export default router;
import { Router } from 'express';
import path from 'path';

const router = Router();

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', '..', '..', 'views', 'index.html');
    res.sendFile(filePath);
});

export default router;


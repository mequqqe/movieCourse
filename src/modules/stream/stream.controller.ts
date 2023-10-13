import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.status(200).json({ 
         hello: 'world'
    })
 })


 export default router
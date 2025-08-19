import express from 'express';
const router = express.Router();

import { addMachine, allMachine, getMachine, updateMachine, deleteMachine } from '../controllers/machine.js';

router.post('/', addMachine);          
router.get('/', allMachine);           
router.get('/:id', getMachine);      
router.patch('/:id', updateMachine); 
router.delete('/:id', deleteMachine);  

export default router;

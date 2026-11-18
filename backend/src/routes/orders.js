const express = require('express');
const { transitionOrder } = require('../services/orderStateMachine');

const router = express.Router();

router.patch('/:id/status', async (req, res) => {
    const order = await transitionOrder(req.params.id, req.body.status, req.body.note);
    res.json(order);
});

module.exports = router;
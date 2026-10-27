const Order = require('../models/Order');
const VALID_TRANSITIONS = {
    PLACED: ['ACCEPTED' , 'CANCELLED'],
    ACCEPTED: ['PREPARING' , 'CANCELLED'],
    PREPARING: ['PICKED_UP' , 'CANCELLED'],
    PICKED_UP: ['IN_TRANSIT'],
    IN_TRANSIT: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: []
};

function isValidTransition(currentStatus, nextStatus) {
    return VALID_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
}

async function transitionOrder(orderId, nextStatus, note = '') {
    const order = await Order.findById(orderId);
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }
    if (!isValidTransition(order.status, nextStatus)) {
        const err = new Error(`Invalid transition: ${order.status} -> ${nextStatus}`);
        err.statusCode = 400;
        throw err;
    }
    order.status = nextStatus;
    order.statusHistory.push({ status: nextStatus, note });
    await order.save();
    return order;
}



module.exports = { isValidTransition, transitionOrder, VALID_TRANSITIONS };
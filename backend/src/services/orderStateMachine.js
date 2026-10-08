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

module.exports = { isValidTransition, VALID_TRANSITIONS };
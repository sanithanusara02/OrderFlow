const mongoose = require('mongoose');

// Single source of truth for every valid order status. Referenced by both
// the schema below (for validation) and attached to the exported model so
// the state machine service can reuse the same list without duplicating it.
const ORDER_STATUSES = [
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
    'CANCELLED',
];

// Embedded sub schema for one status history entry. Defined separately (rather than inline)
// so we can pass { _id: false } history entries have no identity of their own
// and are never queried directly, only ever read as part of their parent order.
const statusHistorySchema = new mongoose.Schema(
    {
        status: { type: String, enum: ORDER_STATUSES, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }, // optional context, e.g. "auto-assigned rider"
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema({
    // References (ObjectId + ref), not embedded copies customer,
    // restaurant, and rider are independent entities with their own
    // lifecycle. We only ever need to look up their current state via
    // .populate(), not freeze a copy of their data at order creation time.
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    // No rider assigned when an order is first placed — matching happens
    // later (Slice 3), so this starts out empty rather than required.
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider',
        default: null,
    },
    // Restricted to the 7 known lifecycle states via enum prevents
    // saving an invalid string like "banana". Actual transition rules
    // (which status can follow which) are enforced in the state machine
    // service, not here this only guarantees the value is a real status.
    status: {
        type: String,
        enum: ORDER_STATUSES,
        default: 'PLACED',
        required: true,
    },
    // Full audit trail of every transition this order has been through.
    // Embedded array, not a separate collection.
    statusHistory: {
        type: [statusHistorySchema],
        default: [],
    },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 }, // 0 items makes no sense
        }
    ],
    // Deliberately embedded, NOT a reference to customer.savedAddress.
    // This is a snapshot of where the order should go at the moment it
    // was placed. If the customer later changes their saved address, past
    // orders must not silently change where they say they were delivered.
    deliveryLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },

}, { timestamps: true }); // adds createdAt/updatedAt automatically

const Order = mongoose.model('Order', orderSchema);
// Attached here (not redefined elsewhere) so any file that imports Order
// also has access to the canonical status list.
Order.ORDER_STATUSES = ORDER_STATUSES;

module.exports = Order;
const { isValidTransition } = require('../src/services/orderStateMachine');

const legalTransitions = [
    ['PLACED', 'ACCEPTED'],
    ['PLACED', 'CANCELLED'],
    ['ACCEPTED', 'PREPARING'],
    ['ACCEPTED', 'CANCELLED'],
    ['PREPARING', 'PICKED_UP'],
    ['PREPARING', 'CANCELLED'],
    ['PICKED_UP', 'IN_TRANSIT'],
    ['IN_TRANSIT', 'DELIVERED']
];

const illegalTransitions = [
    ['PLACED', 'PICKED_UP'],
    ['PREPARING', 'ACCEPTED'],
    ['IN_TRANSIT', 'CANCELLED'],
    ['DELIVERED', 'PLACED'],
    ['CANCELLED', 'PLACED'],
    ['BANANA', 'PLACED'],
    ['PLACED', 'BANANA']
];

describe('isValidTransition', () => {

    legalTransitions.forEach(([from, to]) => {
        test(`allows ${from} -> ${to}`, () => {
            expect(isValidTransition(from, to)).toBe(true);
        });
    });

    illegalTransitions.forEach(([from, to]) => {
        test(`rejects ${from} -> ${to}`, () => {
            expect(isValidTransition(from, to)).toBe(false);
        });
    });
    

});
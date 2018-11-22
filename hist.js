// import { Machine } from 'xstate';
// import { interpret } from 'xstate/lib/interpreter';
const { Machine } = require('xstate');
const { interpret } = require('xstate/lib/interpreter');

const paymentMachine = Machine({
  id: 'payment',
  initial: 'method',
  states: {
    method: {
      initial: 'cash',
      states: {
        cash: { on: { SWITCH_CHECK: 'check' } },
        check: { on: { SWITCH_CASH: 'cash' } },
        hist: { type: 'history' },
      },
      on: { NEXT: 'review' },
    },
    review: {
      on: { PREVIOUS: 'method.hist' },
    },
  },
});

const checkState = paymentMachine.transition('method.cash', 'SWITCH_CHECK');
const i = checkState.value;
i;
// => State {
//   value: { method: 'check' },
//   history: State { ... }
// }

const reviewState = paymentMachine.transition(checkState, 'NEXT');
const j = reviewState.value;
j;
// => State {
//   value: 'review',
//   history: State { ... }
// }

const previousState = paymentMachine.transition(reviewState, 'PREVIOUS').value;
previousState;

const paymentService = interpret(paymentMachine).onTransition(state =>
  console.log(state.value),
);

paymentService.start();
paymentService.send('NEXT');

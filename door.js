import { Machine, actions } from 'xstate';
import { interpret } from 'xstate/lib/interpreter';
const { assign } = actions;

const doorMachine = Machine({
  id: 'door',
  initial: 'closed',
  context: {
    isAdmin: false,
  },
  states: {
    closed: {
      initial: 'idle',
      states: {
        idle: {},
        error: {},
      },
      on: {
        SET_ADMIN: assign({ isAdmin: true }),
        OPEN: [
          { target: 'opened', cond: ctx => ctx.isAdmin },
          { target: 'closed.error' },
        ],
      },
    },
    opened: {
      on: {
        CLOSE: 'closed',
      },
    },
  },
});

const doorService = interpret(doorMachine)
  .onTransition(state => console.log(state.value))
  .start();
// => { closed: 'idle' }

doorService.send('OPEN');
// => { closed: 'error' }

doorService.send('SET_ADMIN');
// => { closed: 'error' }
// (state does not change, but context changes)

doorService.send('OPEN');
// => 'opened'
// (since ctx.isAdmin === true)

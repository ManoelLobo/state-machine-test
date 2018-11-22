const { Machine, actions } = require('xstate');
const { assign } = actions;

const pedestrianStates = {
  initial: 'walk',
  states: {
    walk: {
      on: {
        PED_TIMER: 'wait',
      },
    },
    wait: {
      on: {
        PED_TIMER: 'stop',
      },
    },
    stop: {},
  },
};

const lightMachine = Machine({
  id: 'light',
  initial: 'green',
  context: { canCross: false },
  states: {
    green: {
      on: {
        TIMER: 'yellow',
      },
    },
    yellow: {
      on: {
        TIMER: 'red',
      },
    },
    red: {
      on: {
        TIMER: 'green',
      },
      ...pedestrianStates,
    },
  },
});

const v = lightMachine.transition('red.walk', 'TIMER').value;


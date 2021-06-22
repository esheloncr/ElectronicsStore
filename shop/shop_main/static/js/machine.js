const states = {
	INITIAL: 'idle',
	LOADING: 'loading',
	SUCCESS: 'success',
	FAILURE: 'failure' 
}

const transitions = {
	[states.INITIAL]: {
		fetch: () =>
	},

	[states.LOADING]: {},

	[states.SUCCESS]: {
		reload: () =>,
		clear: () =>
	},

	[states.FAILURE]: {
		retry: () =>,
		clear: () =>
	}
}


class Machine{
	constructor({initial, states, transitions, data=null}){
		this.transitions = transitions
		this.states = states
		this.state = initial
		this.data = data
	}

	stateOf(){
		return this.state
	}

	_updateState(newState, data=null){
		this.state = newState
		this.data = data
	}
}
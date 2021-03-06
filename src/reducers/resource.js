const defaultState = {
  isFetching: false,
  items: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false,
  fetched: false
};

const resourceReducer = actions => (state = defaultState, action) => {
  let index;
  switch (action.type) {
    case actions.listRequest:
      return {
        ...state,
        isFetching: true
      };
    case actions.listSuccess:
      return {
        ...state,
        isFetching: false,
        items: action.result.items,
        fetched: true
      };
    case actions.listFailure:
      return {
        ...state,
        isFetching: false
      };
    case actions.readRequest:
      return {
        ...state,
        isReading: true
      };
    case actions.readSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result.metadata.name);
      if (index >= 0) {
        return {
          ...state,
          isReading: false,
          items: [...state.items.slice(0, index), action.result, ...state.items.slice(index + 1)]
        };
      }
      return {
        ...state,
        isReading: false,
        items: [...state.items, action.result]
      };
    case actions.readFailure:
      return {
        ...state,
        isReading: false
      };
    case actions.createRequest:
      return {
        ...state,
        isCreating: true
      };
    case actions.createSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result.metadata.name);
      return {
        ...state,
        isCreating: false,
        items: index >= 0 ? state.items : [...state.items, action.result]
      };
    case actions.createFailure:
      return {
        ...state,
        isCreating: false
      };
    case actions.updateRequest:
      return {
        ...state,
        isUpdating: true,
        updateError: false
      };
    case actions.updateSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result.metadata.name);
      return {
        ...state,
        isUpdating: false,
        updateError: false,
        items:
          index >= 0 ? [...state.items.slice(0, index), action.result, ...state.items.slice(index + 1)] : state.items
      };
    case actions.updateFailure:
      return {
        ...state,
        isUpdating: false,
        updateError: action.error
      };
    case actions.deleteRequest:
      return {
        ...state,
        isDeleting: true
      };
    case actions.deleteSuccess: {
      const name = action.result.metadata.name || action.result.details.name;
      index = state.items.findIndex(item => item.metadata.name === name);
      return {
        ...state,
        isDeleting: false,
        items: index >= 0 ? [...state.items.slice(0, index), ...state.items.slice(index + 1)] : state.items
      };
    }
    case actions.deleteFailure:
      return {
        ...state,
        isDeleting: false
      };
    case actions.actionRequest:
      return {
        ...state,
        isActioning: true
      };
    case actions.actionSuccess:
      return {
        ...state,
        isActioning: false
      };
    case actions.actionFailure:
      return {
        ...state,
        isActioning: false
      };
    default:
      return state;
  }
};

export default resourceReducer;

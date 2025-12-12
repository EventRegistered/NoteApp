import React, { createContext, useContext, useEffect, useReducer } from "react";

const NotesStateContext = createContext();
const NotesDispatchContext = createContext();

const initialState = {
  notes: [],
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "init":
      return { ...state, notes: action.payload };

    case "add":
      return { ...state, notes: [action.payload, ...state.notes] };

    case "update":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? action.payload : n
        ),
      };

    case "delete":
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      };

    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const raw = localStorage.getItem("notes_v1");
    if (raw) {
      dispatch({ type: "init", payload: JSON.parse(raw) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes_v1", JSON.stringify(state.notes));
  }, [state.notes]);

  return (
    <NotesStateContext.Provider value={state}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesStateContext.Provider>
  );
}

export const useNotesState = () => useContext(NotesStateContext);
export const useNotesDispatch = () => useContext(NotesDispatchContext);

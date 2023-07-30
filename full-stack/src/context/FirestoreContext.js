import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import Firestore from "../handlers/firestore";

const { readDocs } = Firestore;

export const Context = createContext();
const photos = [];

const initialState = {
  items: photos,
  placeholder: photos,
  count: photos.length,
  inputs: { title: null, file: null, path: null },
  isCollapsed: false,
};
const handleOnChange = (state, e) => {
  if (e.target.name === "file") {
    return {
      ...state.inputs,
      file: e.target.files[0],
      path: URL.createObjectURL(e.target.files[0]),
    };
  } else {
    return { ...state.inputs, title: e.target.value };
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "setItem":
      return {
        ...state,
        items: [state.inputs, ...state.items],
        placeholder: [state.inputs, ...state.items],
        count: state.items.length + 1,
        inputs: { title: null, file: null, path: null },
      };
    case "filterItems":
      return {
        ...state,
        items: action.payload.results,
        placeholder: action.payload.results,
      };
    case "setItems":
      return {
        ...state,
        items: action.payload.items,
      };
    case "setInputs":
      return {
        ...state,
        inputs: handleOnChange(state, action.payload.value),
      };
    case "collapse":
      return {
        ...state,
        isCollapsed: action.payload.bool,
      };
    default:
      return state;
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const read = useCallback(async () => {
    const items = await readDocs("stocks");
    dispatch({ type: "setItems", payload: { items } });
  }, []);

  const filterItems = useCallback(
    (input) => {
      if (input === "" || !!input) {
        dispatch({ type: "setItems", payload: { items: state.placeholder } });
      }
      let list = state.placeholder.flat();
      let results = list.filter((item) => {
        const name = item.title.toLowerCase();
        const searchInput = input.toLowerCase();
        return name.indexOf(searchInput) > -1;
      });

      dispatch({ type: "filterItems", payload: { results } });
    },
    [state.placeholder]
  );

  const value = useMemo(() => {
    return {
      state,
      dispatch,
      read,
      filterItems,
    };
  }, [state, read, filterItems]);

  // Call the read function on component mount to fetch initial data
  useEffect(() => {
    read();
  }, [read]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useFirestoreContext = () => {
  return useContext(Context);
};

export default Provider;

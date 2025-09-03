import { ThemeContextProvider, ThemeContext } from "./Theme.context";

const ContextProvider = (props) => {
  return <ThemeContextProvider>{props.children}</ThemeContextProvider>;
};

export {
  ContextProvider,
  ThemeContextProvider,
  ThemeContext,
};

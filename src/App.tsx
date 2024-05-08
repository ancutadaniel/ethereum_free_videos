import Button from "./components/UI/Button";
import useTheme from "./hooks/useTheme";
import useBlockchain from "./hooks/useBlockchain";

const App = () => {
  const { theme, toggleTheme, themeIcon } = useTheme();
  const { provider, contract } = useBlockchain();

  console.log({ provider, contract });

  return (
    <div className={`h-screen bg-white dark:bg-slate-500`}>
      <Button onClick={toggleTheme} theme={theme}>
        {themeIcon}
      </Button>
    </div>
  );
};

export default App;

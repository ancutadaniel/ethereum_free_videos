import Button from "./components/UI/Button";
import useTheme from "./hooks/useTheme";
import useBlockchain from "./hooks/useBlockchain";
import Wallet from "./components/wallet/Wallet";

const App = () => {
  const { theme, toggleTheme, themeIcon } = useTheme();
  const { provider, contract } = useBlockchain();

  console.log({ provider, contract, themeIcon });

  return (
    <main>
      <div className={`h-screen bg-white dark:bg-slate-500`}>
        <Button onClick={toggleTheme} theme={theme}>
          {themeIcon}
        </Button>
        <Wallet />
      </div>
    </main>
  );
};

export default App;

import { MantineProvider } from "@mantine/core";
import "./App.scss";
import AppShell from "./components/AppShell/AppShell";
function App() {
  return (
    <>
      <MantineProvider forceColorScheme="light">
        <AppShell />
      </MantineProvider>
    </>
  );
}

export default App;

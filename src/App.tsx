import { MantineProvider } from "@mantine/core";
import Vacanciespage from "./pages/Vacanciespage/Vacanciespage";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import NotFoundpage from "./pages/NotFoundpage/NotFoundpage";
import Homepage from "./pages/Homepage/Homepage";
import Vacancypage from "./pages/Vacancypage/Vacancypage";
import "@mantine/core/styles.css";
function App() {
  return (
    <>
      <MantineProvider defaultColorScheme="light">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="vacancies" element={<Vacanciespage />} />
            <Route path="vacancies/:id" element={<Vacancypage />} />
            <Route path="*" element={<NotFoundpage />} />
          </Route>
        </Routes>
      </MantineProvider>
    </>
  );
}

export default App;

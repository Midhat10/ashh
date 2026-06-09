import { MantineProvider } from "@mantine/core";
import Vacanciespage from "./pages/Vacanciespage/Vacanciespage";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Vacancypage from "./pages/Vacancypage/Vacancypage";
import "@mantine/core/styles.css";
import ShowOfListOfVacancies from "./components/ShowOfListOfVacancies/ShowOfListOfVacancies";
import Errorpage from "./pages/Errorpage/Errorpage";
import Aboutpage from "./pages/Aboutpage/Aboutpage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Errorpage />}>
      <Route index element={<Navigate to="vacancies/moscow" replace />} />
      <Route path="vacancies" element={<Navigate to="moscow" replace />} />
      <Route path="vacancies" element={<Vacanciespage />}>
        <Route path="moscow" element={<ShowOfListOfVacancies />} />
        <Route path="petersburg" element={<ShowOfListOfVacancies />} />
      </Route>
      <Route path="vacancies/:id" element={<Vacancypage />} />
      <Route path="about" element={<Aboutpage />} />
      {/* <Route path="*" element={<NotFoundpage />} /> */}
    </Route>,
  ),
  { basename: "/ashh" },
);

function App() {
  return (
    <>
      <MantineProvider defaultColorScheme="light">
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </MantineProvider>
    </>
  );
}

export default App;

import {
  Container,
  Grid,
  AppShell as MAppShell,
  Paper,
  Select,
} from "@mantine/core";

import Header from "../Header/Header";
import Search from "../Search/Search";
import ListOfVacancies from "../ListOfVacations/ListOfVacancies";
import KeySkills from "../KeySkills/KeySkills";
import { useTypedDispatch, useTypedSelector } from "../../hooks/redux";
import { useEffect } from "react";
import { fetchVacancies } from "../../reducers/VacancyThunk";
import { setArea } from "../../reducers/VacancySlice";

function AppShell() {
  const dispatch = useTypedDispatch();
  const { text, area, skill_set, isLoading, error } = useTypedSelector(
    (state) => state.vacancies,
  );
  useEffect(() => {
    dispatch(fetchVacancies({ text, area, skill_set }));
  }, [dispatch, area, skill_set, text]);
  return (
    <MAppShell header={{ height: 60 }}>
      <Header />
      <MAppShell.Main>
        <Container size="70vw" p={0}>
          <Search />
          <Grid gap="24px">
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Paper>
                <KeySkills />
              </Paper>
              <Paper pt="xl">
                <Select
                  placeholder="Все города"
                  data={["Все города", "Москва", "Санкт-Петербург"]}
                  onChange={(e) => {
                    dispatch(setArea(e || "Все города"));
                  }}
                />
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
              {isLoading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}
              {!error && <ListOfVacancies />}
              {error && (
                <>
                  <p>An error ocurred:{error}</p>
                  <button
                    onClick={() =>
                      dispatch(fetchVacancies({ text, area, skill_set }))
                    }
                  >
                    Повторить загрузку
                  </button>
                </>
              )}
            </Grid.Col>
          </Grid>
        </Container>
      </MAppShell.Main>
    </MAppShell>
  );
}

export default AppShell;

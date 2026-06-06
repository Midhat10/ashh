import {
  Container,
  Grid,
  AppShell as MAppShell,
  Paper,
  Select,
} from "@mantine/core";

import Search from "../../components/Search/Search";
import ListOfVacancies from "../../components/ListOfVacations/ListOfVacancies";
import KeySkills from "../../components/KeySkills/KeySkills";
import { useTypedDispatch, useTypedSelector } from "../../hooks/redux";
import { useEffect } from "react";
import { fetchVacancies } from "../../reducers/VacancyThunk";
import { useSearchParams } from "react-router-dom";

type AllowedAreas = "Все города" | "Москва" | "Санкт-Петербург";

function Vacanciespage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const vacancy: string = searchParams.get("vacancy") || "";
  const area = (searchParams.get("area") || "") as AllowedAreas;
  const skillset: string = searchParams.get("skillset") || "";

  const dispatch = useTypedDispatch();
  const { isLoading, error } = useTypedSelector((state) => state.vacancies);
  useEffect(() => {
    const skill_set: string[] = skillset ? skillset.split(",") : [];

    dispatch(fetchVacancies({ text: vacancy, area, skill_set }));
  }, [vacancy, area, skillset, dispatch]);

  const updateSearchParams = (key: string, value: string | null) => {
    const currentParams: Record<string, string> = Object.fromEntries(
      searchParams.entries(),
    );
    if (value) {
      currentParams[key] = value;
    } else {
      delete currentParams[key];
    }
    setSearchParams(currentParams);
  };

  return (
    <MAppShell header={{ height: 60 }}>
      <MAppShell.Main>
        <Container size="70vw" p={0}>
          <Search
            area={area}
            vacancy={vacancy}
            skillset={skillset}
            setSearchParams={setSearchParams}
          />
          <Grid gap="24px">
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Paper>
                <KeySkills
                  skillset={skillset}
                  setSearchParams={setSearchParams}
                />
              </Paper>
              <Paper pt="xl">
                <Select
                  placeholder="Все города"
                  data={["Все города", "Москва", "Санкт-Петербург"]}
                  value={area}
                  onChange={(value) => {
                    updateSearchParams(
                      "area",
                      value === "Все города" ? "" : value,
                    );
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
                    onClick={() => {
                      const skill_set = skillset ? skillset.split(",") : [];
                      dispatch(
                        fetchVacancies({ text: vacancy, area, skill_set }),
                      );
                    }}
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

export default Vacanciespage;

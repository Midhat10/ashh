import { Container, Grid, AppShell as MAppShell, Paper } from "@mantine/core";

import Search from "../../components/Search/Search";

import KeySkills from "../../components/KeySkills/KeySkills";
import { useTypedDispatch } from "../../hooks/redux";
import { useEffect, useMemo, type PropsWithChildren } from "react";
import { fetchVacancies } from "../../reducers/VacancyThunk";
import { useLocation, useSearchParams } from "react-router-dom";
import TabsVacancy from "../../components/Tabs/Tabs";
import { ContextVacancy } from "../../components/Context/Context";

function VacanciespageWithChildren({ children }: PropsWithChildren) {
  const [searchParams, setSearchParams] = useSearchParams();

  const vacancy: string = searchParams.get("vacancy") || "";
  const location = useLocation();

  const skillset: string = searchParams.get("skillset") || "";
  const area =
    useLocation()
      .pathname.split("/")
      .filter((string) => string.length > 0)[1] === "moscow"
      ? "Москва"
      : "Санкт-Петербург";

  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (location.state && location.state.search) {
      setSearchParams(location.state.search);
    }
  }, [location.state, setSearchParams]);
  useEffect(() => {
    const skill_set: string[] = skillset ? skillset.split(",") : [];

    dispatch(fetchVacancies({ text: vacancy, area, skill_set }));
  }, [vacancy, area, skillset, dispatch]);

  const value = useMemo(
    () => ({ searchParams, setSearchParams, vacancy, area, skillset }),
    [searchParams, setSearchParams, vacancy, skillset, area],
  );

  return (
    <ContextVacancy.Provider value={value}>{children}</ContextVacancy.Provider>
  );
}

function Vacanciespage() {
  return (
    <VacanciespageWithChildren>
      <MAppShell header={{ height: 60 }}>
        <MAppShell.Main>
          <Container size="70vw" p={0}>
            <Search />
            <Grid gap="24px">
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                <Paper>
                  <KeySkills />
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                <TabsVacancy />
              </Grid.Col>
            </Grid>
          </Container>
        </MAppShell.Main>
      </MAppShell>
    </VacanciespageWithChildren>
  );
}

export default Vacanciespage;

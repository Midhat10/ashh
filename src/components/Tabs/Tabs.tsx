import { Tabs } from "@mantine/core";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ContextVacancy } from "../Context/Context";

function TabsVacancy() {
  const context = useContext(ContextVacancy);
  if (!context) {
    throw new Error("Where is the context?");
  }

  const navigate = useNavigate();

  const { searchParams, area } = context;

  const currentTab = area === "Санкт-Петербург" ? "petersburg" : "moscow";

  const handleTabChange = (value: string | null) => {
    if (!value) return;

    const navigationState = {
      search: searchParams.toString(),
    };

    navigate(`/vacancies/${value}?${searchParams.toString()}`, {
      state: navigationState,
    });
  };

  return (
    <>
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="moscow">Москва</Tabs.Tab>
          <Tabs.Tab value="petersburg">Санкт-Петербург</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Outlet />
    </>
  );
}

export default TabsVacancy;

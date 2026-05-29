import {
  Button,
  Text,
  Group,
  AppShell as MAppShell,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useTypedDispatch } from "../../hooks/redux";
import { setText } from "../../reducers/VacancySlice";
import type { SetURLSearchParams } from "react-router-dom";

type SearchType = {
  setSearchParams: SetURLSearchParams;
  queryVacancy: string;
  areaVacancy: string;
  skillSetVacancy?: string;
};

function Search({
  setSearchParams,
  queryVacancy,
  areaVacancy,
  skillSetVacancy,
}: SearchType) {
  const [searchText, setSearchText] = useState(queryVacancy);
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setText(searchText));
    const form = e.currentTarget;
    const query = form.search.value;
    const params: {
      vacancy?: string;
      area?: string;
      skillset?: string;
    } = {};

    if (query.length) params.vacancy = query;
    if (areaVacancy) params.area = areaVacancy;
    if (skillSetVacancy) params.skillset = skillSetVacancy;
    setSearchParams(params);
  };
  const dispatch = useTypedDispatch();
  return (
    <MAppShell.Section mt={24}>
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Title order={2}>Список вакансий</Title>
          <Text c="dimmed">по профессии Frontend-разработчик</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Group gap="xs">
            <TextInput
              value={searchText}
              name="search"
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Должность или название компании"
              leftSection={<IconSearch size={16} />}
              w={350}
            />
            <Button type="submit" variant="filled" color="indigo">
              Найти
            </Button>
          </Group>
        </form>
      </Group>
    </MAppShell.Section>
  );
}

export default Search;

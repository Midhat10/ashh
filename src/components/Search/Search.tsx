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
import { useContext, useState } from "react";
import { ContextVacancy } from "../Context/Context";

function Search() {
  const context = useContext(ContextVacancy);
  if (!context) {
    throw new Error("useVacancyContext must be used within a Context.Provider");
  }

  const { setSearchParams, vacancy, skillset } = context;
  const [searchText, setSearchText] = useState(vacancy);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: Record<string, string> = {};

    if (searchText.trim()) params.vacancy = searchText.trim();
    if (skillset) params.skillset = skillset;
    setSearchParams(params);
  };

  return (
    <MAppShell.Section mt={24}>
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Title order={2}>Список вакансий</Title>
          <Text c="dimmed">по профессии Frontend-разработчик</Text>
        </Stack>

        <form onSubmit={handleSubmit} key={vacancy}>
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

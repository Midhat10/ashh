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

function Search() {
  const [searchText, setSearchText] = useState("");
  const dispatch = useTypedDispatch();
  return (
    <MAppShell.Section mt={24}>
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Title order={2}>Список вакансий</Title>
          <Text c="dimmed">по профессии Frontend-разработчик</Text>
        </Stack>

        <Group gap="xs">
          <TextInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Должность или название компании"
            leftSection={<IconSearch size={16} />}
            w={350}
          />
          <Button
            variant="filled"
            color="indigo"
            onClick={() => dispatch(setText(searchText))}
          >
            Найти
          </Button>
        </Group>
      </Group>
    </MAppShell.Section>
  );
}

export default Search;

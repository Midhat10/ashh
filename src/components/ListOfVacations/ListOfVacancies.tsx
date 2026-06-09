import {
  Stack,
  Paper,
  Group,
  Pagination,
  Center,
  Title,
  Text,
} from "@mantine/core";
import { useTypedSelector } from "../../hooks/redux";
import Vacancy from "../Vacancy/Vacancy";
import { useMemo, useState } from "react";

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

function ListOfVacancies() {
  const [activePage, setPage] = useState(1);
  const { items } = useTypedSelector((state) => state.vacancies);
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setPage(1);
  }

  const data = useMemo(() => chunk(items, 5), [items]);

  if (!items || items.length === 0) {
    return (
      <Center my={40}>
        <Stack align="center" gap="xs">
          <Title order={3} fw={500} c="dimmed">
            Ничего не найдено
          </Title>
          <Text c="dimmed" size="sm">
            Попробуйте изменить параметры поиска или ключевые навыки
          </Text>
        </Stack>
      </Center>
    );
  }

  const currentPaginatedItems = data[activePage - 1] || [];

  const items1 = currentPaginatedItems?.map((item) => (
    <Paper key={item.id} withBorder p="lg" radius="md" shadow="sm">
      <Vacancy vacancy={item} />
    </Paper>
  ));
  return (
    <>
      <Stack gap="md">
        {items1}

        {data.length > 1 && (
          <Group justify="center" mt="xl" mb="xl">
            <Pagination
              total={data.length}
              value={activePage}
              onChange={setPage}
              mt="sm"
              color="indigo"
            />
          </Group>
        )}
      </Stack>
    </>
  );
}

export default ListOfVacancies;

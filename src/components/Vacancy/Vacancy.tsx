import {
  Stack,
  Title,
  Group,
  Badge,
  Button,
  Anchor,
  Text,
} from "@mantine/core";
import type { VacancyItem } from "../../vite-env";

function Vacancy({ vacancy }: { vacancy: VacancyItem }) {
  return (
    <>
      <Stack gap={10}>
        <Stack gap={4}>
          <Title order={3} fz="lg" c="indigo">
            {vacancy.name}
          </Title>
          <Group>
            <Text fw={400} fz="xl">
              {vacancy.salary_range?.from}{" "}
              {vacancy.salary_range?.to ? "- " + vacancy.salary_range?.to : ""}{" "}
              Р
            </Text>
            <Text fw={400} fz="md" style={{ color: "gray" }}>
              {vacancy.experience.name}
            </Text>
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text size="sm" c="dimmed">
            {vacancy.employer.name}
          </Text>
          <Badge color="indigo" variant="filled" fw={500} radius={5} size="sm">
            {vacancy.schedule.name}
          </Badge>
          <Text size="md" fw={400}>
            {vacancy.address?.city}
          </Text>
        </Stack>

        <Group justify="space-between">
          <Group gap="sm">
            <Button variant="filled" color="var(--mantine-color-black)">
              Смотреть вакансию
            </Button>
            <Button variant="light" color="gray">
              <Anchor
                href="https://hh.ru/"
                target="_blank"
                underline="never"
                c="var(--mantine-color-black)"
              >
                Откликнуться
              </Anchor>
            </Button>
          </Group>
        </Group>
      </Stack>
    </>
  );
}

export default Vacancy;

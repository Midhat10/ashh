import { useNavigate, useParams } from "react-router-dom";
import { useTypedSelector } from "../../hooks/redux";
import { Paper, Stack, Text } from "@mantine/core";
import Vacancy from "../../components/Vacancy/Vacancy";

function Vacancypage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { items } = useTypedSelector((state) => state.vacancies);
  const item = items.find((item) => item.id === id);
  if (!item) {
    return (
      <Text p="lg" color="red">
        Вакансия не найдена или загружается...
      </Text>
    );
  }

  const formatHtmlText = (text?: string) => {
    if (!text) return "";
    return text
      .replace(
        /<highlighttext>/g,
        "<mark style='background-color: #ffeb3b; padding: 0 2px; borderRadius: 2px;'>",
      )
      .replace(/<\/highlighttext>/g, "</mark>");
  };
  return (
    <>
      <main className="container">
        <Stack>
          <Paper key={item.id} withBorder p="lg" radius="md" shadow="sm">
            <Vacancy vacancy={item} isFullPage />
          </Paper>
          <Paper withBorder p="lg" radius="md" shadow="sm">
            <Stack>
              <Text>Требования:</Text>
              <span
                dangerouslySetInnerHTML={{
                  __html: formatHtmlText(item?.snippet.requirement),
                }}
              />
              <Text>Отвественность:</Text>
              <span
                dangerouslySetInnerHTML={{
                  __html: item?.snippet.responsibility,
                }}
              />
            </Stack>
          </Paper>
          <button onClick={() => navigate(-1)}>Назад</button>
        </Stack>
      </main>
    </>
  );
}

export default Vacancypage;

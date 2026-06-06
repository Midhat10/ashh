import { useNavigate, useParams } from "react-router-dom";
import { useTypedDispatch, useTypedSelector } from "../../hooks/redux";
import { Paper, Stack, Text } from "@mantine/core";
import Vacancy from "../../components/Vacancy/Vacancy";
import { useEffect } from "react";
import { fetchVacancyById } from "../../reducers/VacancyThunk";

function Vacancypage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useTypedDispatch();

  const { isLoading, error, currentVacancy } = useTypedSelector(
    (state) => state.vacancies,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchVacancyById(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return <h2 style={{ textAlign: "center" }}>Загрузка вакансии...</h2>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>Ошибка: {error}</p>;
  }

  if (!currentVacancy) {
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
          <Paper
            key={currentVacancy.id}
            withBorder
            p="lg"
            radius="md"
            shadow="sm"
          >
            <Vacancy vacancy={currentVacancy} isFullPage />
          </Paper>
          <Paper withBorder p="lg" radius="md" shadow="sm">
            <Stack>
              <Text>Требования:</Text>
              <span
                dangerouslySetInnerHTML={{
                  __html: formatHtmlText(currentVacancy?.snippet.requirement),
                }}
              />
              <Text>Ответственность:</Text>
              <span
                dangerouslySetInnerHTML={{
                  __html: currentVacancy?.snippet.responsibility,
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

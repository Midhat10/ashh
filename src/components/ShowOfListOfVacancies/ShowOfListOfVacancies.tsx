import { useContext } from "react";
import { useTypedDispatch, useTypedSelector } from "../../hooks/redux";
import { fetchVacancies } from "../../reducers/VacancyThunk";
import ListOfVacancies from "../ListOfVacations/ListOfVacancies";
import { ContextVacancy } from "../Context/Context";

type AllowedAreas = "Все города" | "Москва" | "Санкт-Петербург";

function ShowOfListOfVacancies() {
  const context = useContext(ContextVacancy);

  if (!context) {
    throw new Error("Without context");
  }

  const { skillset, vacancy } = context;

  const area = context.area as AllowedAreas;

  const { isLoading, error } = useTypedSelector((state) => state.vacancies);
  const dispatch = useTypedDispatch();

  return (
    <div>
      {isLoading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}
      {!error && <ListOfVacancies />}
      {error && (
        <>
          <p>An error ocurred:{error}</p>
          <button
            onClick={() => {
              const skill_set = skillset ? skillset.split(",") : [];
              dispatch(fetchVacancies({ text: vacancy, area, skill_set }));
            }}
          >
            Повторить загрузку
          </button>
        </>
      )}
    </div>
  );
}

export default ShowOfListOfVacancies;

import { PillsInput, Badge, PillGroup, Pill, CloseButton } from "@mantine/core";
import { useState } from "react";
import { useTypedDispatch, useTypedSelector } from "../../hooks/redux";
import { addSkill, removeSkill } from "../../reducers/VacancySlice";
import type { SetURLSearchParams } from "react-router-dom";

type SearchType = {
  setSearchParams: SetURLSearchParams;
  queryVacancy: string;
  areaVacancy: string;
  skillSetVacancy?: string;
};

function KeySkills({ setSearchParams, queryVacancy, areaVacancy }: SearchType) {
  const [skillText, setSkillText] = useState("");
  const dispath = useTypedDispatch();
  const { skill_set } = useTypedSelector((state) => state.vacancies);
  const handleAdd = () => {
    const params: {
      vacancy?: string;
      area?: string;
      skillset?: string;
    } = {};

    if (queryVacancy.length) params.vacancy = queryVacancy;
    if (areaVacancy) params.area = areaVacancy;
    if (!skill_set.join().includes(skillText))
      params.skillset = skill_set.join() + `,${skillText}`;
    setSearchParams(params);
    dispath(addSkill(skillText));
    setSkillText("");
  };
  const handleRemove = (text: string) => {
    const params: {
      vacancy?: string;
      area?: string;
      skillset?: string;
    } = {};

    if (queryVacancy.length) params.vacancy = queryVacancy;
    if (areaVacancy) params.area = areaVacancy;
    const data = skill_set.filter((skill) => skill !== text);
    if (data.length) params.skillset = data.join();
    setSearchParams(params);

    dispath(removeSkill(text));
    setSkillText("");
  };
  return (
    <>
      <PillsInput
        label="Ключевые навыки"
        rightSection={
          <Badge fz="35px" p={0} h={30} w={30} radius="md">
            <div onClick={handleAdd} style={{ height: "25px" }}>
              +
            </div>
          </Badge>
        }
      >
        <PillsInput.Field
          placeholder="Навык"
          value={skillText}
          onChange={(e) => setSkillText(e.target.value)}
        />
      </PillsInput>

      <PillGroup>
        {skill_set.map((skill) => (
          <Pill key={skill}>
            {skill}
            <CloseButton size="sm" onClick={() => handleRemove(skill)} />
          </Pill>
        ))}
      </PillGroup>
    </>
  );
}

export default KeySkills;

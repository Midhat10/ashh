import { PillsInput, Badge, PillGroup, Pill, CloseButton } from "@mantine/core";
import { useState } from "react";
import { useTypedDispatch, useTypedSelector } from "../../hooks/redux";
import { addSkill, removeSkill } from "../../reducers/VacationSlice";

function KeySkills() {
  const [skillText, setSkillText] = useState("");
  const dispath = useTypedDispatch();
  const { skill_set } = useTypedSelector((state) => state.vacations);
  const handleAdd = () => {
    dispath(addSkill(skillText));
    setSkillText("");
  };
  const handleRemove = (text: string) => {
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

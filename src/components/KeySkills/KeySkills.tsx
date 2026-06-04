import { PillsInput, Badge, PillGroup, Pill, CloseButton } from "@mantine/core";
import { useState } from "react";
import { useSearchParams, type URLSearchParamsInit } from "react-router-dom";
interface KeySkillsProps {
  setSearchParams: (
    nextInit: URLSearchParamsInit,
    navigateOptions?: { replace?: boolean; state?: unknown },
  ) => void;
  skillset: string;
}

function KeySkills({ setSearchParams, skillset }: KeySkillsProps) {
  const [skillText, setSkillText] = useState("");
  const [searchParams] = useSearchParams();

  const currentSkills = skillset ? skillset.split(",") : [];

  const updateUrlWithSkills = (skillsArray: string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (skillsArray.length > 0) {
      newParams.set("skillset", skillsArray.join(","));
    } else {
      newParams.delete("skillset");
    }

    setSearchParams(newParams);
  };

  const handleAdd = () => {
    const trimmedSkill = skillText.trim();
    if (!trimmedSkill) return;

    if (!currentSkills.includes(trimmedSkill)) {
      const updatedSkills = [...currentSkills, trimmedSkill];
      updateUrlWithSkills(updatedSkills);
    }

    setSkillText("");
  };

  const handleRemove = (text: string) => {
    const updatedSkills = currentSkills.filter((skill) => skill !== text);
    updateUrlWithSkills(updatedSkills);
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
      </PillsInput>

      <PillGroup mt="sm">
        {currentSkills.map((skill) => (
          <Pill key={skill}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span>{skill}</span>
              <CloseButton
                size="xs"
                variant="transparent"
                onClick={() => handleRemove(skill)}
              />
            </div>
          </Pill>
        ))}
      </PillGroup>
    </>
  );
}

export default KeySkills;

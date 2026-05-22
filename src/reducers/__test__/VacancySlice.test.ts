import reducer, { initialState } from "../VacancySlice";

describe("check VacancySlice", () => {
  it("check initialState", () => {
    const initialStateCheck = reducer(undefined, { type: "unknown" });
    expect(initialStateCheck).toEqual(initialState);
  });
  it("check setText", () => {
    const setTextState = reducer(initialState, {
      type: "vacancies/setText",
      payload: "hello",
    });
    expect(initialState.text).toBe("");
    expect(setTextState.text).toBe("hello");
  });
  it("check setArea", () => {
    const setAreaState = reducer(initialState, {
      type: "vacancies/setArea",
      payload: "Москва",
    });
    expect(initialState.area).toBe("Все города");
    expect(setAreaState.area).toBe("Москва");
  });
  it("check addSkill", () => {
    let addSkillState = reducer(initialState, {
      type: "vacancies/addSkill",
      payload: "TypeScript",
    });
    expect(initialState.skill_set).toHaveLength(3);
    expect(addSkillState.skill_set).toHaveLength(3);
    addSkillState = reducer(addSkillState, {
      type: "vacancies/addSkill",
      payload: "HTML",
    });
    expect(addSkillState.skill_set).toHaveLength(4);
  });
  it("check removeSkill", () => {
    let addSkillState = reducer(initialState, {
      type: "vacancies/addSkill",
      payload: "TypeScript",
    });
    expect(initialState.skill_set).toHaveLength(3);
    expect(addSkillState.skill_set).toHaveLength(3);
    addSkillState = reducer(addSkillState, {
      type: "vacancies/addSkill",
      payload: "HTML",
    });
    expect(addSkillState.skill_set).toHaveLength(4);

    let removeSkillState = reducer(addSkillState, {
      type: "vacancies/removeSkill",
      payload: "TypeScript",
    });
    expect(removeSkillState.skill_set).toHaveLength(3);
    removeSkillState = reducer(removeSkillState, {
      type: "vacancies/removeSkill",
      payload: "React",
    });
    expect(removeSkillState.skill_set).toHaveLength(2);
  });
});

import { Button, Group, Image, Paper, Stack } from "@mantine/core";

import image from "../../assets/image.png";
import { useNavigate } from "react-router-dom";

function NotFoundpage() {
  const navigate = useNavigate();
  const goHome = () => navigate("/vacancies", { replace: true });
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Paper
        withBorder
        p="lg"
        radius="md"
        shadow="sm"
        w="100%"
        maw={707}
        mx="auto"
      >
        <Group justify="center">
          <Stack w="70%">
            <h2>Упс! Такой страницы не существует</h2>
            <p>Давайте перейдём к началу</p>
          </Stack>
          <Button onClick={goHome}>На главную</Button>
          <Image src={image} radius="md" h={300} w="auto" fit="contain" />
        </Group>
      </Paper>
    </div>
  );
}

export default NotFoundpage;

import {
  AppShell as MAppShell,
  Group,
  Image,
  Title,
  Anchor,
  Avatar,
} from "@mantine/core";
import logo from "../../assets/logo.png";
function Header() {
  return (
    <MAppShell.Header p="md">
      <Group justify="space-between" h="100%" wrap="nowrap">
        <Group gap={10} style={{ flex: 1 }}>
          <Image src={logo} alt="Logo of HH" h={30} w="auto" />
          <Title order={2} fz={16} fw={600} ff="Montserrat">
            .FrontEnd
          </Title>
        </Group>

        <Group gap="xl">
          <Anchor
            fz="sm"
            fw={500}
            style={{
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
            }}
          >
            <span>Вакансии FE</span>
            <span
              style={{
                fontSize: "30px",
                color: "blue",
                position: "relative",
                top: "-2px",
              }}
            >
              {" "}
              •
            </span>
          </Anchor>
          <Group gap={8} wrap="nowrap">
            <Avatar size="sm" radius="xl" color="indigo" />
            <Anchor fz="sm" fw={500}>
              Обо мне
            </Anchor>
          </Group>
        </Group>

        <div style={{ flex: 1 }} />
      </Group>
    </MAppShell.Header>
  );
}

export default Header;

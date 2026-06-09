import {
  AppShell as MAppShell,
  Group,
  Image,
  Title,
  Avatar,
} from "@mantine/core";
import logo from "../../assets/logo.png";
import { Link, NavLink, Outlet } from "react-router-dom";
import style from "./Layout.module.css";

function Layout() {
  return (
    <MAppShell header={{ height: 60 }} padding="md">
      <MAppShell.Header p="md">
        <Group justify="space-between" h="100%" wrap="nowrap">
          <Group gap={10} style={{ flex: 1 }}>
            <Image src={logo} alt="Logo of HH" h={30} w="auto" />
            <Title order={2} fz={16} fw={600} ff="Montserrat">
              <Link className={style.link} to="/">
                .FrontEnd
              </Link>
            </Title>
          </Group>

          <Group gap="xl">
            <NavLink className={style.link} to="/vacancies">
              Вакансии FE
            </NavLink>

            <Group gap={8} wrap="nowrap">
              <Avatar size="sm" radius="xl" color="indigo" />
              <NavLink className={style.link} to="/about">
                Обо мне
              </NavLink>
            </Group>
          </Group>

          <div style={{ flex: 1 }} />
        </Group>
      </MAppShell.Header>

      <MAppShell.Main>
        <Outlet />
      </MAppShell.Main>
    </MAppShell>
  );
}

export default Layout;

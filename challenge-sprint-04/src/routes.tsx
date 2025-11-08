import type { RouteObject } from "react-router-dom";
import { Home } from "./pages/Home";
import { Chat } from "./pages/Chat";
import { Resultados } from "./pages/Resultados";
import { LoginFancy } from "./pages/LoginFancy";
import { Agendar } from "./pages/Agendar";   
import { Contato } from "./pages/Contato";   
import { FAQ } from "./pages/FAQ";
import { Integrantes } from "./pages/Integrantes";  

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/chat", element: <Chat /> },
  { path: "/resultados", element: <Resultados /> },
  { path: "/login", element: <LoginFancy /> },
  { path: "/agendar", element: <Agendar /> },
  { path: "/contato", element: <Contato /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/integrantes", element: <Integrantes /> },
];

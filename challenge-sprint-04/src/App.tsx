import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import "./index.css";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const element = useRoutes(routes);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-10 to-white">
      <Header />
      <main>
        {ready ? (
          element
        ) : (
          <p className="text-center text-gray-500">Carregando...</p>
        )}
      </main>
     <Footer />
    </div>
  );
}

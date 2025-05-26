import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-2 py-6 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

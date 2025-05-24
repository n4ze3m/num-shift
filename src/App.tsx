import { GameProvider } from "./context/GameContext";
import { Header } from "./components/Header";
import { GameBoard } from "./components/GameBoard";
import { HowToPlay } from "./components/HowToPlay";
function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-2 py-6 md:py-12 flex flex-col items-center justify-center">
          <GameBoard />
          <HowToPlay />
        </main>
      </div>
    </GameProvider>
  );
}

export default App;

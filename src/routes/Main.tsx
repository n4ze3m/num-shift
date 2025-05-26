import { GameProvider } from "../context/GameContext";
import { GameBoard } from "../components/GameBoard";
import { HowToPlay } from "../components/HowToPlay";
function App() {
  return (
    <GameProvider>
      <GameBoard />
      <HowToPlay />
    </GameProvider>
  );
}

export default App;

import RandomNumberGenerator from "./components/RandomNumberGenerator"
import { useEffect } from "react";
import { initializeDiscord } from "./discordSdk";
function App() {
  

  useEffect(() => {
initializeDiscord();
}, []);
  return (
 <>
 <RandomNumberGenerator/>
 </>
  )
}

export default App

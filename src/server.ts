import randomSeed from "random-seed";
import { WebSocketServer } from "ws";
import { DemoEvent } from "./shared/events.js"; // ← extension .js après build

const PORT = 4000;
const wss = new WebSocketServer({ port: PORT });
console.log(`🚀 Native WS ready on :${PORT}`);

wss.on("connection", () => {
  console.log("🔌 client connected");
  if (wss.clients.size === 1) startDemo(); // lance une fois à la 1re connexion
});

/* Génère la “classe fantôme” */
function startDemo(seed = "42") {
  const rng = randomSeed.create(seed);

  // 10 joins
  [...Array(10).keys()].forEach((i) =>
    setTimeout(() => broadcast({ type: "join", userId: `stu${i}` }), i * 500)
  );

  // speeches
  let t = 3_000;
  while (t <= 60_000) {
    setTimeout(() => {
      broadcast({
        type: "speech",
        userId: `stu${rng.intBetween(0, 9)}`,
        text: "Pouvez-vous préciser ?",
      });
    }, t);
    t += 3_000 + rng.intBetween(0, 3_000);
  }

  // finish
  setTimeout(() => broadcast({ type: "finish" }), 65_000);
}

/* Envoie à tous les navigateurs connectés */
function broadcast(ev: DemoEvent) {
  const msg = JSON.stringify(ev);
  wss.clients.forEach((c) => c.readyState === c.OPEN && c.send(msg));
}

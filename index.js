require("./server.js");

if (
  typeof process !== "undefined" &&
  !process.browser &&
  process.platform !== "browser" &&
  parseInt(process.versions.node.split(".")[0]) < 18
) {
  console.error("Your node version is currently", process.versions.node);
  console.error(
    "Please update it to a version >= 22.x.x from https://nodejs.org/",
  );
  process.exit(1);
}

const mineflayer = require("./lib/loader.js");
const { GoalNear } = require("mineflayer-pathfinder").goals;

// Configuration - adjust these if your server details change
const BOT_CONFIG = {
  host: "og-svp-smp.aternos.me", // Replace with your Aternos IP if changed
  port: 46823, // Replace with your Aternos Port
  username: "BroisUp",
  auth: "offline",
  version: false, // Match your server version
};

function startBot() {
  console.log("Connecting Mineflayer bot...");
  const bot = mineflayer.createBot(BOT_CONFIG);

  try {
    bot.loadPlugin(require("mineflayer-pathfinder").pathfinder);
  } catch (e) {
    console.log(
      "[INFO] mineflayer-pathfinder plugin not loaded, basic movement will be used.",
    );
  }

  bot.on("login", () => {
    console.log(
      `[BOT] ${bot.username} has logged into the server successfully.`,
    );
  });

  bot.on("spawn", () => {
    console.log("[BOT] Bot spawned in the world.");

    const originalPosition = bot.entity ? bot.entity.position.clone() : null;

    // Anti-AFK jump, head movement, and periodic walk/return routine (every 30 seconds)
    setInterval(() => {
      if (!bot.entity) return;

      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 500);

      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);

      if (bot.pathfinder && originalPosition) {
        const randomOffsetX = (Math.random() - 0.5) * 6;
        const randomOffsetZ = (Math.random() - 0.5) * 6;
        const wanderTarget = originalPosition.offset(
          randomOffsetX,
          0,
          randomOffsetZ,
        );

        bot.pathfinder.setGoal(
          new GoalNear(wanderTarget.x, wanderTarget.y, wanderTarget.z, 1),
        );

        setTimeout(() => {
          if (bot.pathfinder && originalPosition) {
            bot.pathfinder.setGoal(
              new GoalNear(
                originalPosition.x,
                originalPosition.y,
                originalPosition.z,
                1,
              ),
            );
          }
        }, 6000);
      }
    }, 30000);
  });

  // Chat command listener
  bot.on("chat", async (username, message) => {
    if (username === bot.username) return;
    console.log(`[CHAT] <${username}> ${message}`);

    // Public commands: Anyone can use $sleep and$unsleep
    if (message === "$sleep") {
      try {
        const bedBlock = bot.findBlock({
          matching: (block) => bot.isABed(block),
          maxDistance: 6,
        });

        if (bedBlock) {
          await bot.sleep(bedBlock);
          bot.chat("Good night!");
        } else {
          bot.chat("No bed nearby for me to sleep on!");
        }
      } catch (err) {
        console.error("Failed to sleep:", err);
        bot.chat("I could not go to sleep right now.");
      }
    } else if (message === "$unsleep") {
      try {
        await bot.wake();
        bot.chat("Good morning!");
      } catch (err) {
        console.error("Failed to wake up:", err);
        bot.chat("I am not currently sleeping.");
      }
    }

    // Restricted command: Only xyZgamerBSL can use $chat <message>
    if (username === "xyZgamerBSL") {
      if (message.startsWith("$chat ")) {
        const textToSend = message.slice(6).trim();
        if (textToSend.length > 0) {
          bot.chat(textToSend);
        }
      }
    }
  });

  bot.on("kicked", (reason) => {
    console.log(`[BOT KICKED] Reason: ${reason}`);
  });

  bot.on("end", (reason) => {
    console.log(
      `[BOT DISCONNECTED] Reason: ${reason}. Reconnecting in 15 seconds...`,
    );
    setTimeout(startBot, 15000);
  });

  bot.on("error", (err) => {
    console.error("[BOT ERROR]", err);
  });
}

startBot();
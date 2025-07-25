const { getRandomTopicAndSubtopic } = require("../utils/topic");
const { createRoom, getLeaderboard, deleteRoom } = require("./raceManager");

function schedulePublicRaces(io) {
    setInterval(async () => {
        const { topic, subtopic, text } = await getRandomTopicAndSubtopic();

        const { roomId } = await createRoom({ topic, subtopic, text: text || "Dynamic wiki text (frontend)" });

        io.to("public-race").emit("race-start", {
            roomId,
            topic,
            subtopic,
            text,
            startTime: Date.now() + 5000
        });

        setTimeout(async () => {
            const leaderboard = await getLeaderboard(roomId);
            io.to("public-race").emit("race-end", { leaderboard });
            await deleteRoom(roomId);
        }, 2 * 60 * 1000);
    }, 10 * 60 * 1000);
}

module.exports = { schedulePublicRaces };

const {
    createRoom,
    joinRoom,
    updateProgress,
    finishRace,
    getLeaderboard,
    deleteRoom
} = require("../services/raceManager");
const { schedulePublicRaces } = require("../services/raceScheduler");

function initSocket(io) {
    schedulePublicRaces(io);

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("create-room", async ({ topic, subtopic, text, username }) => {
            if (!username) return socket.emit("error", "Unauthorized");

            const { roomId } = await createRoom({ topic, subtopic, text });
            socket.join(roomId);
            io.to(roomId).emit("room-created", { roomId, topic, subtopic, text });
        });

        socket.on("join-room", async ({ roomId, username }) => {
            if (!username) return socket.emit("error", "Unauthorized");
            const room = await joinRoom(roomId, username, socket.id);
            if (!room) return socket.emit("error", "Room not found");

            socket.join(roomId);
            io.to(roomId).emit("user-joined", { username });
        });

        socket.on("start-race", ({ roomId }) => {
            io.to(roomId).emit("race-start", { startTime: Date.now() + 5000 });
        });

        socket.on("update-progress", async ({ roomId, username, progress }) => {
            await updateProgress(roomId, username, progress);
            io.to(roomId).emit("progress-update", { username, progress });
        });

        socket.on("finish", async ({ roomId, username, wpm }) => {
            await finishRace(roomId, username, wpm);
            const leaderboard = await getLeaderboard(roomId);
            io.to(roomId).emit("race-finished", leaderboard);
            await deleteRoom(roomId);
        });

        socket.on("join-public", ({ username }) => {
            if (!username) return socket.emit("error", "Unauthorized");
            socket.join("public-race");
            io.to("public-race").emit("user-joined", { username });
        });

        socket.on("disconnect", () => console.log(`User disconnected: ${socket.id}`));
    });
}

module.exports = initSocket;

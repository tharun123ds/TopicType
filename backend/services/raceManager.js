const redis = require("../config/redis");
const { generateRoomId } = require("../utils/generateRoomId");

const ACTIVE_ROOMS = "active_rooms";

async function createRoom({ topic, subtopic, text }) {
    const roomId = generateRoomId();
    const roomData = { topic, subtopic, text, participants: [] };
    await redis.hset(ACTIVE_ROOMS, roomId, JSON.stringify(roomData));
    return { roomId, topic, subtopic, text };
}

async function joinRoom(roomId, username, socketId) {
    const roomData = await redis.hget(ACTIVE_ROOMS, roomId);
    if (!roomData) return null;

    const room = JSON.parse(roomData);
    if (!room.participants.some(p => p.username === username)) {
        room.participants.push({ username, socketId, progress: 0, wpm: null });
        await redis.hset(ACTIVE_ROOMS, roomId, JSON.stringify(room));
    }
    return room;
}

async function updateProgress(roomId, username, progress) {
    const roomData = await redis.hget(ACTIVE_ROOMS, roomId);
    if (!roomData) return;
    const room = JSON.parse(roomData);

    const player = room.participants.find(p => p.username === username);
    if (player) player.progress = progress;

    await redis.hset(ACTIVE_ROOMS, roomId, JSON.stringify(room));
}

async function finishRace(roomId, username, wpm) {
    const roomData = await redis.hget(ACTIVE_ROOMS, roomId);
    if (!roomData) return;
    const room = JSON.parse(roomData);

    const player = room.participants.find(p => p.username === username);
    if (player) player.wpm = wpm;

    await redis.hset(ACTIVE_ROOMS, roomId, JSON.stringify(room));
}

async function getLeaderboard(roomId) {
    const roomData = await redis.hget(ACTIVE_ROOMS, roomId);
    if (!roomData) return [];
    const room = JSON.parse(roomData);

    const sorted = room.participants
        .filter(p => p.wpm !== null)
        .sort((a, b) => b.wpm - a.wpm);

    return {
        topic: room.topic,
        subtopic: room.subtopic,
        text: room.text,
        top3: sorted.slice(0, 3)
    };
}

async function deleteRoom(roomId) {
    await redis.hdel(ACTIVE_ROOMS, roomId);
}

module.exports = {
    createRoom,
    joinRoom,
    updateProgress,
    finishRace,
    getLeaderboard,
    deleteRoom
};

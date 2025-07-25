const Topic = require("../models/Topic");
const Subtopic = require("../models/Subtopic");

async function getRandomTopicAndSubtopic() {
    const topicCount = await Topic.countDocuments();
    if (!topicCount) return { topic: "Default", subtopic: "General", text: "Default text" };

    const randomTopic = await Topic.findOne().skip(Math.floor(Math.random() * topicCount));
    const subtopics = await Subtopic.find({ topic: randomTopic._id });

    if (!subtopics.length)
        return { topic: randomTopic.name, subtopic: "General", text: "Default text" };

    const randomSubtopic = subtopics[Math.floor(Math.random() * subtopics.length)];

    return {
        topic: randomTopic.name,
        subtopic: randomSubtopic.name,
        text: randomSubtopic.text || `Typing about ${randomSubtopic.name}`
    };
}

module.exports = { getRandomTopicAndSubtopic };

const Subtopic = require('../models/subtopic');
const Topic = require('../models/topic');

const createSubtopic = async (topicName, name) => {
    if (!name) throw { status: 400, message: 'Subtopic name is required.' };

    const topic = await Topic.findOne({ name: topicName });
    if (!topic) throw { status: 404, message: 'Parent topic not found.' };

    const subtopic = await Subtopic.create({ topic: topic._id, name });
    await subtopic.populate('topic', 'name');
    return subtopic;
};

const getSubtopicsByTopic = async (topicName) => {
    const topic = await Topic.findOne({ name: topicName });
    if (!topic) throw { status: 404, message: 'Topic not found.' };

    return await Subtopic.find({ topic: topic._id })
        .populate('topic', 'name')
        .sort('name');
};

const updateSubtopic = async (topicName, id, name) => {
    if (!name) throw { status: 400, message: 'Subtopic name is required.' };

    const topic = await Topic.findOne({ name: topicName });
    if (!topic) throw { status: 404, message: 'Topic not found.' };

    const sub = await Subtopic.findOneAndUpdate(
        { _id: id, topic: topic._id },
        { name },
        { new: true, runValidators: true }
    ).populate('topic', 'name');

    if (!sub) throw { status: 404, message: 'Subtopic not found.' };
    return sub;
};

const deleteSubtopic = async (topicName, id) => {
    const topic = await Topic.findOne({ name: topicName });
    if (!topic) throw { status: 404, message: 'Topic not found.' };

    const sub = await Subtopic.findOneAndDelete({ _id: id, topic: topic._id });
    if (!sub) throw { status: 404, message: 'Subtopic not found.' };
};

module.exports = {
    createSubtopic,
    getSubtopicsByTopic,
    updateSubtopic,
    deleteSubtopic
};

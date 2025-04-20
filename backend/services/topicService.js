const Topic = require('../models/topic');

const createTopic = async (name) => {
    if (!name) throw { status: 400, message: 'Topic name is required.' };
    const existing = await Topic.findOne({ name });
    if (existing) throw { status: 409, message: 'Topic already exists.' };
    return await Topic.create({ name });
};

const getAllTopics = async () => {
    return await Topic.find().sort('name');
};

const getTopicById = async (id) => {
    const topic = await Topic.findById(id);
    if (!topic) throw { status: 404, message: 'Topic not found.' };
    return topic;
};

const updateTopic = async (id, name) => {
    if (!name) throw { status: 400, message: 'Topic name is required.' };
    const topic = await Topic.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
    );
    if (!topic) throw { status: 404, message: 'Topic not found.' };
    return topic;
};

const deleteTopic = async (id) => {
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) throw { status: 404, message: 'Topic not found.' };
    return;
};

module.exports = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic
};

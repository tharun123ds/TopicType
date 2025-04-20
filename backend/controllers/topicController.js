const topicService = require('../services/topicService');

exports.createTopic = async (req, res, next) => {
    try {
        const topic = await topicService.createTopic(req.body.name);
        res.status(201).json(topic);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Topic name already exists. Please choose a different name.',
            });
        }
        next(err);
    }
};

exports.getAllTopics = async (req, res, next) => {
    try {
        const topics = await topicService.getAllTopics();
        res.json(topics);
    } catch (err) {
        next(err);
    }
};

exports.getTopic = async (req, res, next) => {
    try {
        const topic = await topicService.getTopicById(req.params.id);
        res.json(topic);
    } catch (err) {
        next(err);
    }
};

exports.updateTopic = async (req, res, next) => {
    try {
        const topic = await topicService.updateTopic(req.params.id, req.body.name);
        res.json(topic);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Topic name already exists. Please choose a different name.',
            });
        }
        next(err);
    }
};

exports.deleteTopic = async (req, res, next) => {
    try {
        await topicService.deleteTopic(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

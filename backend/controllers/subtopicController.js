const subService = require('../services/subtopicService');

exports.createSubtopic = async (req, res, next) => {
    try {
        const sub = await subService.createSubtopic(req.params.topicName, req.body.name);
        res.status(201).json(sub);
    } catch (err) {
        next(err);
    }
};

exports.getSubtopics = async (req, res, next) => {
    try {
        const subs = await subService.getSubtopicsByTopic(req.params.topicName);
        res.json(subs);
    } catch (err) {
        next(err);
    }
};

exports.updateSubtopic = async (req, res, next) => {
    try {
        const sub = await subService.updateSubtopic(
            req.params.topicName,
            req.params.subtopicId,
            req.body.name
        );
        res.json(sub);
    } catch (err) {
        next(err);
    }
};

exports.deleteSubtopic = async (req, res, next) => {
    try {
        await subService.deleteSubtopic(req.params.topicName, req.params.subtopicId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

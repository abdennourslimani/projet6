const SaucesModel = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new SaucesModel({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};



exports.getOneSauce = (req, res, next) => {
    SaucesModel.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
}


exports.modifySauce = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    SaucesModel.updateOne({ _id: req.params.id }, {...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};



exports.deleteSauce = (req, res, next) => {
    SaucesModel.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    SaucesModel.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
}
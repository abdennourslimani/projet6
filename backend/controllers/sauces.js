const Sauce = require('../models/sauces');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,


    });
    console.log(sauce)
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};



exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
}


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};



exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
}




exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    console.log(sauce)
                    if (sauce.usersLiked.includes[req.body.userId]) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId }
                            })
                            .then(() => res.status(201).json({ message: 'like retiré ' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes[req.body.userId]) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId }
                            })
                            .then(() => res.status(201).json({ message: 'dislike retiré ' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(404).json({ error }));



        case 1:

            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId }
                })
                .then(() => res.status(200).json({ message: 'like ajouté !' }))
                .catch(error => res.status(400).json({ error }));

        case -1:
            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 },
                    $push: { usersDisliked: req.body.userId }
                })
                .then(() => res.status(200).json({ message: 'dislike ajouté' }))
                .catch(error => res.status(400).json({ error }));
    }
};
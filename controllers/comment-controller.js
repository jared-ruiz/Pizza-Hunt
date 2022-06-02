const { Pizza, Comment } = require('../models');

const commentController = {
    //add comment to pizza
    addComment({ params, body}, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: { comments: _id } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' })
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    //remove comment
    removeComment({ params }, res) {
        //findoneanddelete deletes and returns the document so we use that to find pizza
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                res.status(404).json({ message: 'No comment with this id!' });
                return;
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with that id!' });
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err));
    }
}

module.exports = commentController;
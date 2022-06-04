//express router
const router = require('express').Router();

//import methods from comment controller
const { 
    addComment, 
    removeComment, 
    addReply, 
    removeReply 
} = require('../../controllers/comment-controller');

//api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

//api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId').delete(removeComment);

//api/comments/<pizzaId>/<commentId>
//put route since we are technically updated a comment with replies, not making a new comment
router.route('/:pizzaId/:commentId').put(addReply);

//uses replyId to remove from array within comment object
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;
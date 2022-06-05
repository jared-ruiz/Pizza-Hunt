const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const replySchema = new Schema({
    //set custom id to avoid confusion with parent comment_id
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    replyBody: {
        type: String,
        required: true,
        trim: true
    },
    writtenBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        //getter
        get: createdAt => dateFormat(createdAt)
    }
},
{
    toJSON: {
        getters: true
    }
})

const commentSchema = new Schema({
    writtenBy: {
        type: String,
        required: true
    },
    commentBody: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAt => dateFormat(createdAt)
    },
    replies: [replySchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})

//virtual to retrieve reply count
commentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
})

const Comment = model('Comment', commentSchema);

module.exports = Comment; 
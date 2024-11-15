import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    userId: { 
        type: String, 
        required : true 
    },
    desc : { 
        type: String, 
        required : true 
    },
    image : { 
        type: String, 
        required : true 
    },
},
{
    timestamps : true
});

var PostModel = mongoose.model('Posts', postSchema)

export default PostModel
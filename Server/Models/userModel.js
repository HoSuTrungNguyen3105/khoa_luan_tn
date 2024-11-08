import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
     isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    livein : String,
    workAt : String,
    relationship : String,
    followers : [],
    following : [] 
},
{timestamps : true}
)

const UserModel = mongoose.model('User', userSchema);
export default UserModel
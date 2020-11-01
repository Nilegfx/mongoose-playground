const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var PostSchema = new mongoose.Schema(
  {
    name: String
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.userOwnsPost = doc.currentUser == doc.name;
        return ret;
      }
    }
  }
);
PostSchema.statics.findWithCurrentUser = async function (currentUser) {
  let data = await this.find();
  data.forEach(post => {
    post.currentUser = currentUser;
  });
  return data;
};

const Post = mongoose.model('Post', PostSchema);

// write 3 posts (run it first time only)
// new Post({ name: "ahmed" }).save();
// new Post({ name: "Saif" }).save();
// new Post({ name: "Abdallah" }).save();

Post.findWithCurrentUser('ahmed').then(data => {
  console.log(JSON.stringify(data));
});

Template.postItem.helpers({
  commentsCount: function() {
    return Comments.find({postId:this._id}).count();
  }
});
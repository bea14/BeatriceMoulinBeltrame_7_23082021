//Creation de la class Posts qui a les mêmes proprietes que la table topics
const Post = function(post) {
  this.title = post.title;
  this.content = post.content;
  this.media_url = post.media_url;
  this.author = post.author;
  this.creationdate = post.creationdate;
  this.updatedate = post.updatedate;
  this.tag = post.tag;
}
  
module.exports = Post;
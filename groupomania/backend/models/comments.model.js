//Creation de la class Comments qui a les mêmes proprietes que la table comments
const Comment = function(comment) {
    this.author = comment.author;
    this.topic = comment.topic;
    this.content = comment.content;
    this.creationdate = comment.creationdate;
    this.updatedate = comment.updatedate;
    this.isreported = comment.isreported;
    this.isreporteddate = comment.isreporteddate;
}
    
module.exports = Comment;
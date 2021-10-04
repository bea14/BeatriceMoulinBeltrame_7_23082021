//Creation de la class User qui a les mêmes proprietes que la table user
const Vote = function(vote) {
      this.likedislike = vote.likedislike;
      this.user = vote.user;      
      this.topic = vote.topic;
  };

  module.exports = Vote;
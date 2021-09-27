//Creation de la class User qui a les mêmes proprietes que la table user
const User = function(user) {
      this.lastname = user.lastname;
      this.firstname = user.firstname;
      this.pseudo = user.pseudo;
      this.email = user.email;
      this.password = user.password;      
      this.sexe = user.sexe;
      this.avatar = user.avatar;      
      this.birthdate = user.bithdate;      
      this.bio = user.bio;
      this.creationdate = user.creationdate;      
      this.updatedate = user.updatedate;
      this.role = user.role;
  };

  module.exports = User;
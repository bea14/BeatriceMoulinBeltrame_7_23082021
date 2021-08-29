//Creation de la class User qui a les mêmes proprietes que la table user
const User = function(user) {
    /*constructor(id,user.name,user.firstname,user.pseudo,user.email,user.password,
        user.sexe,user.avatar,user.bithdate,user.bio,user.creationdate,user.updatedate,
        user.groupe,user.isdeleted,user.isdeleteddate,user.isreported,user.isreporteddate){*/
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
      this.isdeleted = user.isdeleted;      
      this.isdeleteddate = user.isdeleteddate;      
      this.isreported = user.isreported;      
      this.isreporteddate = user.isreporteddate;
    /*}*/
  };

  module.exports = User;
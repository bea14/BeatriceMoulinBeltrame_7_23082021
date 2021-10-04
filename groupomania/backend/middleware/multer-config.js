//middleware permettant de gérer les fichiers entrants dans les requêtes http
const multer = require('multer');

//types de fichiers acceptés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png' : 'png',
    'image/gif' : 'gif',
    'video/mp4' : 'mp4',    
    'video/mpeg' : 'mpeg',
    'audio/x-wav' : 'wav',
};

//indique à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({ 
     //indique d'enregistrer les fichiers dans le dossier upload
    destination: (req, file, callback) => {
        callback(null, 'upload');
    },
    //indique d'utiliser le nom d'origine, de remplacer les espaces par des _, et d'ajouter un timestamp
    filename: (req, file, callback) => { 
        const name = file.originalname.split(' ').join('_'); //utilise le nom d'origine, remplace les espaces vides par des _
        const extension = '.' + MIME_TYPES[file.mimetype]; //constante de type MIME pour résoudre l'extension de fichier appropriée
        const properName = name.split(extension)[0];
        callback(null, properName + Date.now() + extension); //ajoute un timestamp comme nom de fichier
    }
});

module.exports = multer({storage: storage}).single('media'); //exporte l'élément multer et passe la constante storage
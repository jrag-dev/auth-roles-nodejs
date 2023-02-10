import fs from "fs"
import multer from "multer"
import shortid from "shortid"
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//TODO: configuraciones para multer 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const url = req.baseUrl.split('/')[2];
    const dirPath = path.join(__dirname, `../../uploads/${url}`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, function (err) {
        if (err) {
          console.log(err)
        } else {
          cb(null, dirPath)
        }
      })
    } else {
      cb(null, dirPath)
    }
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
      cb(null, `${file.originalname}-${shortid.generate()}.${extension}`);
  },
  fileFilter(req, file, cb) {
    if ( file.mimetype === 'image/jpeg' ||  file.mimetype ==='image/png' ) {
        cb(null, true);
    } else {
        cb(new Error('Formato No válido'))
    }
}
})



// pasar la configuración y el campo
const upload = multer({ storage: storage }).single('imgURL');


// Subier un archivo
export const subirArchivo = (req, res, next) => {
   upload(req, res, function(error) {
      if (error) {
         res.json({mensaje: error})
      }
      return next();
   })
}
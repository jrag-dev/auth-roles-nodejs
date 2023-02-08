import fs from 'fs'
import path from 'node:path';


const deleteFile = (dirname, file) => {
  fs.unlink(path.join(dirname, file), (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Archivo eliminado correctamente')
    }
  })
}

export default deleteFile;
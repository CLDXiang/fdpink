// from https://github.com/expressjs/multer/issues/248
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import * as mkdirp from 'mkdirp';

function getFilename(req, file, cb) {
  crypto.pseudoRandomBytes(16, (err, raw) => {
    cb(err, err ? undefined : raw.toString('hex'));
  });
}

function getDestination(req, file, cb) {
  cb(null, os.tmpdir());
}

function DiskStorage(opts) {
  this.getFilename = opts.filename || getFilename;

  if (typeof opts.destination === 'string') {
    mkdirp.sync(opts.destination);
    this.getDestination = ($0, $1, cb) => {
      cb(null, opts.destination);
    };
  } else {
    if (opts.destination) {
      this.getDestination = opts.destination;
    } else {
      this.getDestination = getDestination;
    }
  }
}

DiskStorage.prototype._handleFile = function (req, file, cb) {
  const hash = crypto.createHash('md5');
  this.getDestination(req, file, (err, destination) => {
    if (err) {
      return cb(err);
    }

    this.getFilename(req, file, (err2, filename) => {
      if (err2) {
        return cb(err2);
      }

      let finalPath = path.join(destination, filename);
      const outStream = fs.createWriteStream(finalPath);

      file.stream.pipe(outStream);
      outStream.on('error', cb);
      file.stream.on('data', (chunk) => {
        hash.update(chunk);
      });
      outStream.on('finish', () => {
        const fileMd5 = hash.digest('hex').toLowerCase();
        const md5 = crypto.createHash('md5').update(`${req.user.id}${fileMd5}`).digest('hex');
        const oldPath = finalPath;
        finalPath = path.join(destination, md5);

        // 计算完成了md5，把文件重命名
        fs.rename(oldPath, finalPath, () => {
          cb(null, {
            destination,
            filename: md5,
            path: finalPath,
            size: outStream.bytesWritten,
          });
        });
      });
    });
  });
};

DiskStorage.prototype._removeFile = (req, file, cb) => {
  const filePath = file.path;

  delete file.destination;
  delete file.filename;
  delete file.path;

  fs.unlink(filePath, cb);
};

export default function (opts) {
  return new DiskStorage(opts);
}

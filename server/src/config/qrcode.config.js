const qrcode = require('qrcode');

function generateQRCodeURL(data) {
    return new Promise((resolve, reject) => {
        qrcode.toDataURL(data, (err, url) => {
            if (err) {
                reject(err);
            }
            resolve(url);
        });
    });
}

module.exports = {
    generateQRCodeURL,
};

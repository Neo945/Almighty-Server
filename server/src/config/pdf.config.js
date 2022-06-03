const pdfCreator = require('pdf-creator-node');
const fs = require('fs');

function createPDF(path, code, data) {
    const html = fs.readFileSync(path, code);
    const options = {
        format: 'A3',
        orientation: 'portrait',
        border: '10mm',
        header: {
            height: '45mm',
            contents: '<div style="text-align: center;">Author: Shreesh</div>',
        },
        footer: {
            height: '28mm',
        },
    };

    return new Promise((resolve, reject) => {
        pdfCreator
            .create(
                {
                    html,
                    data,
                    type: 'buffer',
                },
                options
            )
            .then(resolve)
            .catch(reject);
    });
}

module.exports = {
    createPDF,
};


const fs = require('fs');
const path = require('path');
const {isBuffer} = require('util');

async function PDF(dataBuffer, options) {

    const {
        version = 'v2.0.550',
        max = 0,
        pagerender = render_page,
    } = options || {};

    //PDFJS should be dynamically required
    const PDFJS = require('./pdf.js/v2.0.550/build/pdf.js');

    //make sure data is a buffer
    if (!isBuffer(dataBuffer)) {
        throw new Error('Data is not a buffer');
    }

    //will be returned
    const ret = {
        numpages: 0,
        numrender: 0,
        info: null,
        metadata: null,
        text: '',
        version: ''
    };

    ret.version = PDFJS.version;

    //load PDF from buffer
    const doc = await PDFJS.getDocument(dataBuffer).promise;
    ret.numpages = doc.numPages;

    const metaData = await doc.getMetadata().catch(() => null);

    ret.info = metaData?.info || null;
    ret.metadata = metaData?.metadata || null;

    let counter = max <= 0 ? ret.numpages : max;
    counter = counter > ret.numpages ? ret.numpages : counter;

    ret.numrender = counter;

    for (let i = 1; i <= counter; i++) {
        const pageText = await doc.getPage(i)
            .then(pageData => pagerender(pageData, options))
            .catch((err) => {
                // todo: better error handling
                console.error(err);
                return '';
            });

        ret.text += pageText;
    }

    return ret;
};


async function render_page(pageData, {
    normalizeWhitespace = true,
    disableCombineTextItems = false,
}) {
    const render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems,
    }

    let pageText = '';

    try {
        const textContent = await pageData.getTextContent(render_options);

        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY){
                text += item.str;
            } else {
                text += '\n' + item.str;
            }
            lastY = item.transform[5];
        }

        pageText = text;
    } catch(e) {
        console.error(e);
    }

    return pageText;
}


module.exports = PDF;

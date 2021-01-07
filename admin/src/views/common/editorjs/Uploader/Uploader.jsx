// import request from 'request';
//
// const formidable = require('formidable');
// const fs = require('fs');
// /**
//  * Handles uploading by file
//  * @param request
//  * @param response
//  */
//
// /**
//  * Accepts post form data
//  * @param request
//  * @return {Promise<{files: object, fields: object}>}
//  */
// function getForm(request) {
//     return new Promise((resolve, reject) => {
//         const form = new formidable.IncomingForm();
//
//         form.uploadDir = this.uploadDir;
//         form.keepExtensions = true;
//
//         form.parse(request, (err, fields, files) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 console.log('fields', fields);
//                 console.log('files', files);
//                 resolve({files, fields});
//             }
//         });
//     });
// }
//
// /**
//  * Download image by Url
//  * @param {string} uri - endpoint
//  * @param {string} filename - path for file saving
//  * @return {Promise<string>} - filename
//  */
// function downloadImage(uri, filename) {
//     return new Promise((resolve, reject) => {
//         request.head(uri, function (err, res, body) {
//             request(uri).pipe(fs.createWriteStream(filename).on('erorr', reject))
//                 .on('close', () => {
//                     resolve(filename);
//                 });
//         });
//     });
// }
//
// /**
//  * Generates md5 hash for string
//  * @param string
//  * @return {string}
//  */
// function md5(string) {
//     return crypto.createHash('md5').update(string).digest('hex');
// }
//
// export const uploadByFile = (request, response) => {
//     let responseJson = {
//         success: 0
//     };
//
//     getForm(request)
//         .then(({files}) => {
//             let image = files[this.fieldName] || {};
//
//             responseJson.success = 1;
//             responseJson.file = {
//                 url: image.path,
//                 name: image.name,
//                 size: image.size
//             };
//         })
//         .catch((error) => {
//             console.log('Uploading error', error);
//         })
//         .finally(() => {
//             response.writeHead(200, {'Content-Type': 'application/json'});
//             response.end(JSON.stringify(responseJson));
//         });
// }
//
// /**
//  * Handles uploading by URL
//  * @param request
//  * @param response
//  */
// export const uploadByUrl = (request, response) => {
//     let responseJson = {
//         success: 0
//     };
//
//     getForm(request)
//         .then(({files, fields}) => {
//             let url = fields.url;
//
//             let filename = this.uploadDir + '/' + md5(url) + '.png';
//
//             return downloadImage(url, filename)
//                 .then((path) => {
//                     responseJson.success = 1;
//                     responseJson.file = {
//                         url: path
//                     };
//                 });
//         })
//         .catch((error) => {
//             console.log('Uploading error', error);
//         })
//         .finally(() => {
//             response.writeHead(200, {'Content-Type': 'application/json'});
//             response.end(JSON.stringify(responseJson));
//         });
// }

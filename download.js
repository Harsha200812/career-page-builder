const https = require('https');
const fs = require('fs');

const url = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2VkODM3ZjlkNThiMzQ0NzE4MDBmZjUzODI0NDUzMTRmEgsSBxDgsIG8yhMYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDMyNzExMjc2MTczODc4NTU2&filename=&opi=89354086';

https.get(url, (res) => {
    const file = fs.createWriteStream('e:/Project/Career-Page-Builder/index.html');
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Download completed.');
    });
}).on('error', (err) => {
    console.error('Error downloading file:', err.message);
});

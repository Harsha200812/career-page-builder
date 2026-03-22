const https = require('https');
const fs = require('fs');

const downloads = [
  {
    name: 'e:/Project/Career-Page-Builder/recruiter-dashboard.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNkNTJiN2YwNGUwNTQ2NmNhM2NkNmY2ZGQwN2Q4NGMyEgsSBxDgsIG8yhMYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDMyNzExMjc2MTczODc4NTU2&filename=&opi=89354086'
  },
  {
    name: 'e:/Project/Career-Page-Builder/recruiter-login.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2I0MjNjODMxMzIwYTRhMmZiNzRlMmJkYTk0MWJmMzdhEgsSBxDgsIG8yhMYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDMyNzExMjc2MTczODc4NTU2&filename=&opi=89354086'
  }
];

downloads.forEach(d => {
  https.get(d.url, (res) => {
      const file = fs.createWriteStream(d.name);
      res.pipe(file);
      file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${d.name}`);
      });
  }).on('error', (err) => {
      console.error(`Error downloading ${d.name}:`, err.message);
  });
});

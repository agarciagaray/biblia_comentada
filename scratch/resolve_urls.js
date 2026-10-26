const https = require('https');

const urls = [
  'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEw8mnbzbMFjpOBLG4MGc6-zTReUqDFBkGx2vNqJgpGk1aTkfZPpzh0rCbemyqSyWxww18-88Acbm9xR1hRupATCq9Tre1-lNWQUEZF_Q3XB884pHfyKNCA6T6tvwkclYXSpBX1bs5ahiE3cxWMUb1awp6j',
  'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG5anlKmB-nPvt5CwoIX9R5nG5Uw5PamtkYZ9Qyvf0uV_Xlg0dXBuGGWDhc6eENExosrZarZRcCfogs_KwO748ycVgpw2gz7n7Qfr1o5YVX3VkGrYRg5IAqWJ5FKbRwDM3QlKFaGxX18yr_KlMPG5Eem5WpYTXBd9DsJHl0ec32sUmrgmDJ',
  'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEApzRLLFu87_k9bkyU533tvIApCtrTGhNrLicg-cAbCccARZ3UWof1_36C1pycN7NVVHWAiZH9Xhkre2UXxNcmewN49J7-XvWH5rftLdQ0tsCZpUx07YBusqhJHMhS1HmEFb6U8CuoRElFaYrn',
  'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF1hGKimxny0cBwRzuueToutf4PPAT3Q0J9jo4j2iThj1-F-oaSbO6Fs3zmzqIvWhG8JfJpCbgFgIObzFTNexjfV5iVuYG35phWpWBT6IDa8OTZfqSR5IUvtUpYkvARxJgbKyjgcfXd19ECzSM='
];

async function check(u) {
  return new Promise((resolve) => {
    https.get(u, (res) => {
      resolve(res.headers.location || 'no location, code ' + res.statusCode);
    }).on('error', e => resolve(e.message));
  });
}

async function run() {
  for (const u of urls) {
    const loc = await check(u);
    console.log('Target:', loc);
  }
}
run();

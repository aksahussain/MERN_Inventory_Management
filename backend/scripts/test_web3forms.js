const https = require('https');
const querystring = require('querystring');
require('dotenv').config();

const testWeb3Forms = async () => {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    console.log("Using Access Key:", accessKey);

    const postData = querystring.stringify({
        access_key: accessKey,
        subject: "Test via Form - IMS Pro",
        from_name: "IMS Pro System",
        message: "This is a test message to confirm Web3Forms integration via pure form submission."
    });

    const options = {
        hostname: 'api.web3forms.com',
        port: 443,
        path: '/submit',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    console.log("Attempting to send test via pure form-urlencoded...");

    const req = https.request(options, (res) => {
        let body = '';
        console.log('Status code:', res.statusCode);
        res.on('data', d => body += d);
        res.on('end', () => {
            console.log('Raw body:', body);
        });
    });

    req.on('error', e => console.error('Error:', e));
    req.write(postData);
    req.end();
};

testWeb3Forms();

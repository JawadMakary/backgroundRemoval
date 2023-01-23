var request = require('request');
var fs = require('fs');

if (!fs.existsSync('./updated')) {
    fs.mkdirSync('./updated');
}
fs.readdir('./default', (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach((file) => {
        if (file.endsWith('.jpg') || file.endsWith('.png')) {
            var image = fs.readFileSync(`./default/${file}`);
            request.post({
                url: 'https://api.remove.bg/v1.0/removebg',
                formData: {
                    image_file: {
                        value: image,
                        options: {
                            filename: file,
                            contentType: 'image/jpeg'
                        }
                    },
                    size: 'auto',
                },
                headers: {
                    'X-Api-Key': 'Enter your own api key'
                },
                encoding: null
            }, function (error, response, body) {
                if (error) return console.error('Request Failed Because Invalid URL or file:', error);
                if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
                fs.writeFileSync(`./updated/${file}`, body);
                console.log(`${file} was processed and saved to the updated folder.`);
            });
        }
    });
});

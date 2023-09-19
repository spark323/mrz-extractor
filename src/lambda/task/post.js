const AWS = require('aws-sdk');
AWS.config.update({
    region: "ap-northeast-2"
});
const { handleHttpRequest } = require('slsberry');
var Base64 = require('js-base64').Base64;
const apiSpec = {
    category: 'http',
    event: [
        {
            type: 'REST',
            method: 'Post',
        },
    ],
    desc: 'Post Template',
    parameters: {
        image: { req: true, type: 'string', desc: 'Base64 encoded image' },
    },
    errors: {
        unexpected_error: { status_code: 500, reason: '알 수 없는 에러' },
    },
    responses: {
        description: '',
        content: 'application/json',
        schema: {
            type: 'object',
            properties: {
                hashKey: { type: 'String', desc: 'hash_key' },
            },
        },
    },
};
exports.apiSpec = apiSpec;
async function handler(inputObject, event) {
    const { image } = inputObject;
    const client = new AWS.Textract({ region: "ap-northeast-2" });

    try {

        const result = await client.analyzeID({
            DocumentPages: [{
                Bytes: Buffer.from(image, 'base64')
            }]
        }).promise();
        return {
            status: 200,
            response: {
                rep: JSON.stringify(result)
            }
        };
    }
    catch (e) {
        console.log(e);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }

}
exports.handler = async (event, context) => {
    return await handleHttpRequest(event, context, apiSpec, handler);
};
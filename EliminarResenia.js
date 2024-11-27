const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const REVIEWS_TABLE = process.env.REVIEWS_TABLE;

exports.handler = async (event) => {
    try {
        const { reseña_id, user_id } = event.pathParameters;

        if (!reseña_id || !user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'reseña_id y user_id son obligatorios' })
            };
        }

        // Eliminar la reseña de DynamoDB
        const params = {
            TableName: REVIEWS_TABLE,
            Key: {
                id_resenia: reseña_id,
                id_usuario: user_id  // Asegurarse de que el usuario esté autorizado a eliminar la rdsdsdeseña
            }
        };

        await dynamodb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Reseña eliminada con éxito' })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al eliminar la reseña', error: error.message })
        };
    }
};

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const REVIEWS_TABLE = process.env.REVIEWS_TABLE;

exports.handler = async (event) => {
    try {
        const { id_vuelo } = JSON.parse(event.body);

        if (!id_vuelo) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El ID del vuelo es obligatorio' })
            };
        }

        // Consulta utilizando el GSI para obtener reseñas por id_vuelo
        const result = await dynamodb.query({
            TableName: REVIEWS_TABLE,
            IndexName: 'VueloIndex',  // Aquí usamos el índice GSI
            KeyConditionExpression: 'id_vuelo = :id_vuelo',
            ExpressionAttributeValues: {
                ':id_vuelo': id_vuelo
            }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ reviews: result.Items })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al obtener las reseñas', error: error.message })
        };
    }
};

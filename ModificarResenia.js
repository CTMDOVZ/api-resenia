const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const REVIEWS_TABLE = process.env.REVIEWS_TABLE;

exports.handler = async (event) => {
    try {
        const { id_resenia, user_id, calificacion, comentario } = JSON.parse(event.body);

        if (!id_resenia || !user_id || !calificacion || !comentario) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'id_resenia, user_id, calificacion y comentario son obligatorios' })
            };
        }

        // Actualizar la reseña en DynamoDB
        const params = {
            TableName: REVIEWS_TABLE,
            Key: {
                id_usuario: user_id, // Clave de partición
                id_resenia: id_resenia // Clave de ordenamiento
            },
            UpdateExpression: 'SET calificacion = :cal, comentario = :com',
            ExpressionAttributeValues: {
                ':cal': calificacion,
                ':com': comentario
            },
            ReturnValues: 'UPDATED_NEW'
        };

        const result = await dynamodb.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Reseña actualizada con éxito',
                data: result.Attributes // Devuelve los nuevos valores
            })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al actualizar la reseña', error: error.message })
        };
    }
};

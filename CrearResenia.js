const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid'); // Para generar IDs únicos

const REVIEWS_TABLE = process.env.REVIEWS_TABLE;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

        // Validar que los datos esenciales estén presentes
        if (!body.id_vuelo || !body.calificacion || !body.comentario || !body.user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'id_vuelo, calificacion, comentario y user_id son obligatorios' })
            };
        }

        // Crear el id de la reseña si no se proporciona
        const id_resenia = uuid.v4();

        // Crear el ítem de la reseña
        const item = {
            id_usuario: body.user_id, // ID del usuario
            id_resenia: id_resenia,
            id_vuelo: body.id_vuelo,
            calificacion: body.calificacion,
            comentario: body.comentario,
            fecha_resena: new Date().toISOString()  // Fecha estándar en formato ISO
        };

        // Guardar la reseña en DynamoDB
        await dynamodb.put({
            TableName: REVIEWS_TABLE,
            Item: item
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Reseña creada con éxito', resenia: item })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al crear la reseña', error: error.message })
        };
    }
};

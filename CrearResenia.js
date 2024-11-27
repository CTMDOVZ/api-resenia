const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { DateTime } = require('luxon');  // Usando Luxon para manejar las fechas

const REVIEWS_TABLE = process.env.REVIEWS_TABLE;

exports.handler = async (event) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const body = JSON.parse(event.body);

        // Validar que los datos requeridos estén presentes
        if (!body.id_vuelo || !body.calificacion || !body.comentario || !body.user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'id_vuelo, cantidad_boletos, precio_total y user_id son obligatorios' })
            };
        }

        // Generar el id de la reseña de forma única (sin uuid)
        const id_resenia = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const item = {
            id_resenia: id_resenia,  // ID generado manualmente
            user_id: body.user_id,   // ID del usuario
            id_vuelo: body.id_vuelo, // ID del vuelo
            calificacion: body.calificacion,  // Calificación de la reseña
            comentario: body.comentario,      // Comentario de la reseña
            fecha_resena: DateTime.now().toISO()  // Fecha de la reseña usando Luxon
        };

        // Guardar la reseña en DynamoDB
        const params = {
            TableName: REVIEWS_TABLE,
            Item: item
        };

        // Intentar poner el ítem en DynamoDB
        await dynamodb.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Reseña creada con éxito', resenia: item })
        };
    } catch (error) {
        console.error('Error al crear la reseña:', error);

        // Manejo de errores
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Ocurrió un error al crear la reseña.',
                error: error.message || 'Error desconocido'
            })
        };
    }
};

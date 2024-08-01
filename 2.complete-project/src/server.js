import Fastify from 'fastify';
import { connect, seedDb } from './db.js'
const PORT = 8080;

const app = Fastify({ logger: true });
const _db = await connect()
await seedDb(_db)

let counter = 0
app.get('/students', async (request, reply) => {

    ++counter;
    if (counter === 1) {
        const students = await _db('students').select('*')
        for (const student of students) {
            const course = await _db('courses').select('*').where({ id: student.courseId }).first()
            student.course = course.name
            delete student.courseId
        }

        const payload = {
            students,
            message: "this is from the really bad response"
        }

        return reply
            .status(202)
            .send(payload);
    }

    if (counter === 2) {

        const students = await _db('students')
            .select('students.id', 'students.name', 'courses.name as course')
            .innerJoin('courses', 'courses.id', 'students.courseId');
        const payload = {
            students,
            message: 'this is the best response'
        }

        return reply.send(payload)
    }

    counter = 0
    return reply.status(401).send({ message: 'just responding with a different code!' })
});

const address = await app.listen({ port: PORT })
console.log(`Server is running on ${address}`);


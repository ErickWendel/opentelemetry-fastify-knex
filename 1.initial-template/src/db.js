import knex from 'knex'

export async function connect() {
    const db = knex({
        client: 'pg',
        connection: 'postgres://erickwendel:erick@localhost:5432/ewacademy',
        searchPath: ['knex', 'public'],
    })

    await db.raw('SELECT 1 as result')
    return db
}

export async function seedDb(db) {
    await db.schema.dropTableIfExists('students');
    await db.schema.dropTableIfExists('courses');

    await db.schema.createTable('courses', function (table) {
        table.increments('id').primary();
        table.string('name');
    });

    await db.schema
        .createTable('students', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.integer('courseId');

            table
                .foreign('courseId')
                .references('courses.id')
                .withKeyName('fk_fkey_courses');
        })

    await db('courses')
        .insert([
            { name: 'Método TAJS' },
            { name: 'Formação JavaScript Expert' }

        ]);
    await db('students')
        .insert([
            { name: 'Zezin', courseId: 1 },

        ]);
    const [courses, students] = await Promise.all(
        [
            db('courses').select('*'),
            db('students').select('*'),
        ]
    )

    console.log({ courses, students })
}
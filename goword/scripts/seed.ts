import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

import * as schema from "../db/schema"



const sql = neon(process.env.DATABASE_URL!)
//@ts-ignore

const db = drizzle(sql, { schema })

const main = async () => {
    try {
        console.log("seeding database");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengesOptions);
        await db.delete(schema.challengesProgress);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Spanish",
                imageSrc: "ES - Spain.svg"
            },
            {
                id: 2,
                title: "English",
                imageSrc: "US - United States.svg"
            },

        ]);

        await db.insert(schema.units).values([
            {
                id: 1,
                coursedId: 1,
                title: "Unit 1",
                description: "Learn the basics of Spanish",
                order: 1,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,
                order: 1,
                title: "Nouns",
            },

            {
                id: 2,
                unitId: 1,
                order: 2,
                title: "Verbs",
            },

            {
                id: 3,
                unitId: 1,
                order: 3,
                title: "Verbs",
            },

            {
                id: 4,
                unitId: 1,
                order: 4,
                title: "Verbs",
            },

            {
                id: 5,
                unitId: 1,
                order: 5,
                title: "Verbs",
            },

        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1, //nouns
                type: "SELECT",
                order: 1,
                question: 'Which one of these is the "the man"?',
            },
            {
                id: 2,
                lessonId: 1, //nouns
                type: "ASSIST",
                order: 2,
                question: '"the man"',
            },
            {
                id: 3,
                lessonId: 1, //nouns
                type: "SELECT",
                order: 3,
                question: 'Which one of these is the "the robot"?',
            },

        ])

        await db.insert(schema.challengesOptions).values([
            {

                challengesId: 1,
                imageSrc: "man.svg",
                correct: true,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },

            {

                challengesId: 1,
                imageSrc: "woman.svg",
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },

            {

                challengesId: 1,
                imageSrc: "robot.svg",
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },

        ])

        await db.insert(schema.challengesOptions).values([
            {

                challengesId: 2, // The man
                imageSrc: "man.svg",
                correct: true,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },

            {

                challengesId: 2,
                imageSrc: "woman.svg",
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },

            {

                challengesId: 2,
                imageSrc: "robot.svg",
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },

        ])

        await db.insert(schema.challengesOptions).values([
            {

                challengesId: 3,
                imageSrc: "man.svg",
                correct: false,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },

            {
                // removio el id deberia ir en 9
                challengesId: 3,
                imageSrc: "woman.svg",
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },

            {

                challengesId: 3,
                imageSrc: "robot.svg",
                correct: true,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },

        ])



        console.log("Seeding finished");

    } catch (error) {
        console.log(error);
        throw new Error("Failed to seed the database")
    }
}

main();
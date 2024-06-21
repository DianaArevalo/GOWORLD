
import { cache } from "react"
import db from "./drizzle"
import { auth } from "@clerk/nextjs/server";
import { userProgress, courses, units, lessons, challengesProgress } from "./schema";
import { eq } from "drizzle-orm";



// export const getUserProgress = cache(async () => {
//     const { userId } = await auth();

//     if (!userId || !userProgress?.activeCourseId) {
//         return null
//     }

//     const data = await db.query.userProgress.findFirst({
//         where: eq(userProgress.userId, userId),
//         with: {
//             activeCourse: true
//         }
//     })

//     return data
// });



export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true
        }
    });

    if (!data) {
        return null;
    }

    // Convertir la instancia de clase en un objeto plano
    const plainUserProgress = {
        ...data,
        activeCourse: {
            ...data.activeCourse,
        }
    };

    return plainUserProgress;
});

export const getUnits = cache(async () => {
    const userProgress = await getUserProgress();
    const { userId } = await auth();

    if (!userId || !userProgress?.activeCourseId) {
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.coursedId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengesProgress: {
                                where: eq(
                                    challengesProgress.userId,
                                    userId
                                )
                            }
                        }
                    }
                }
            }
        }
    });

    // Convertir los datos a objetos planos
    const normalizedData = data.map((unit) => {
        const lessonsWithCompleteStatus = unit.lessons.map((lesson) => {
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengesProgress
                    && challenge.challengesProgress.length > 0
                    && challenge.challengesProgress.every((progress) => progress.completed);
            });

            return { ...lesson, completed: allCompletedChallenges };
        });
        return { ...unit, lessons: lessonsWithCompleteStatus };
    });

    console.log(normalizedData);

    return normalizedData;
});


export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();

    return data;
})

export const getCoursesById = cache(async (couseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, couseId),
        //TODO: Populate units and lessons
    })

    return data

})


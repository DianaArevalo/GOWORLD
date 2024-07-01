import { metadata } from './../app/layout';

import { cache } from "react"
import db from "./drizzle"
import { auth } from "@clerk/nextjs/server";
import { userProgress, courses, units, lessons, challengesProgress, challenges } from "./schema";
import { eq } from "drizzle-orm";



export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId,),
        with: {
            activeCourse: true,
        },

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
            if (lesson.challenges.length === 0) {
                return { ...lesson, completed: false }
            }

            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengesProgress
                    && challenge.challengesProgress.length > 0
                    && challenge.challengesProgress.every((badges) => badges.completed);
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

});

export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId) {
        return null
    }

    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.coursedId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengesProgress: {
                                where: eq(challengesProgress.userId, userId)
                            }
                        }
                    }
                }
            }
        }
    })


    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap((unit) => unit.lessons)
        .find((lesson) => {
            return lesson.challenges.some((challenge) => {
                return !challenge.challengesProgress
                    || challenge.challengesProgress.length === 0
                    || challenge.challengesProgress.some((badges) => badges.completed === false)
            })
        });

    return {
        activeLesson: firstUncompletedLesson,
        activelessonId: firstUncompletedLesson?.id
    }
});


export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if (!userId) {
        return null
    }

    const courseProgress = await getCourseProgress()

    const lessonId = id || courseProgress?.activelessonId;

    if (!lessonId) {
        return null
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengesOptions: true,
                    challengesProgress: {
                        where: eq(challengesProgress.userId, userId),

                    },
                },
            },
        },
    });

    if (!data || !data.challenges) {
        return null
    }

    const normalizedChallenges = data.challenges.map((challenge: any) => {
        const completed = challenge.challengesProgress
            && challenge.challengesProgress.length > 0
            && challenge.challengesProgress.every((progress: any) => progress.completed)

        return { ...challenge, completed }
    })

    console.log(normalizedChallenges);


    return { ...data, challenges: normalizedChallenges }
});


export const getLessonPercentage = cache(async () => {
    const courseProgress = await getCourseProgress();

    if (!courseProgress?.activelessonId) {
        return 0;
    }

    const lesson = await getLesson(courseProgress.activelessonId)

    if (!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
    const percentage = Math.round(
        (completedChallenges.length / lesson.challenges.length) * 100);

    return percentage;
})


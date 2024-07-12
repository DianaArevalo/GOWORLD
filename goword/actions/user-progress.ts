"use server";
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";


import db from "@/db/drizzle"
import { getCoursesById, getUserProgress } from "@/db/queries";
import { challenges, challengesProgress, userProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";


export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth()
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized")
    }

    const course = await getCoursesById(courseId);

    if (!course) {
        throw new Error("Course not found")
    }


    const existingUsersProgress = await getUserProgress();

    if (existingUsersProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/logo-goworld.svg"
        });

        revalidatePath("/courses");
        revalidatePath("/learn")
        redirect("/learn")

    };


    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/logo-goworld.svg"
    });


    revalidatePath("/courses");
    revalidatePath("/learn")
    redirect("/learn")
};


export const addProgress = async (challengeId: number) => {
    const { userId } = await auth();


    if (!userId) {
        throw new Error("Unauthorized")
    }

    const currentUserProgress = await getUserProgress();
    //TODO: get user subscription

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });

    if (!challenge) {
        throw new Error("challenge not found")
    }

    const lessonId = challenge.lessonId

    const existingChallengeProgress = await db.query.challengesProgress.findFirst({
        where: and(
            eq(challengesProgress.userId, userId),
            eq(challengesProgress.challengesId, challengeId),
        )
    });

    const isPractice = !!existingChallengeProgress;

    if (isPractice) {
        return { error: "practice" }
    }

    if (!currentUserProgress) {
        throw new Error("User progress not found")
    }


    //handle subscription

    await db.update(userProgress).set({
        progress: Math.min(currentUserProgress.progress + 1, 3)
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
}



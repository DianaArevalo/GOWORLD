"use server"

import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import db from "@/db/drizzle";
import { getLessonPercentage, getUserProgress } from "@/db/queries";
import { challenges, challengesProgress, userProgress } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("user progress not found");
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });

    if (!challenge) {
        throw new Error("challenge not found");
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengesProgress.findFirst({
        where: and(
            eq(challengesProgress.userId, userId),
            eq(challengesProgress.challengesId, challengeId)
        )
    });

    const isPractice = !!existingChallengeProgress;

    //Not if the user has a subscription
    if (currentUserProgress.progress === 0 && !isPractice) {
        return { error: "progress" };
    }

    if (isPractice) {
        await db.update(challengesProgress).set({
            completed: true
        }).where(
            eq(challengesProgress.id, existingChallengeProgress.id)
        );

        await db.update(userProgress).set({
            progress: currentUserProgress.progress + 1,
        }).where(eq(userProgress.userId, userId));

        await revalidatePaths(lessonId);

        return { success: true };
    }

    await db.insert(challengesProgress).values({
        challengesId: challengeId,
        userId,
        completed: true,
    });

    await db.update(userProgress).set({
        progress: currentUserProgress.progress + 1,
    }).where(eq(userProgress.userId, userId));

    await revalidatePaths(lessonId);

    return { success: true };
};

const revalidatePaths = async (lessonId: number) => {
    const paths = [
        "/learn",
        "/lesson",
        "/quests",
        "/leaderboard",
        `/lesson/${lessonId}`,
    ];

    for (const path of paths) {
        await revalidatePath(path);
    }
};
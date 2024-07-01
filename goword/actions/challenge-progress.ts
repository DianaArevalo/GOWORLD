
"use server"

import { auth } from "@clerk/nextjs/server"
import { eq, and } from "drizzle-orm";

import db from '@/db/drizzle';
import { getUserProgress } from "@/db/queries";
import { challenges, challengesProgress, userProgress } from "@/db/schema";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { mutate } from "swr";

export const upsetChallengeProgress = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("user progress not found")
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });

    if (!challenge) {
        throw new Error("Challenge not found")
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengesProgress.findFirst({
        where: and(
            eq(challengesProgress.userId, userId),
            eq(challengesProgress.challengesId, challengeId),
        ),
    });

    const isPractice = !!existingChallengeProgress;

    // Allow progress regardless of practice or new attempt 


    if (isPractice) {
        await db.update(challengesProgress).set({
            completed: true,
        }).where(
            eq(challengesProgress.id, existingChallengeProgress ? existingChallengeProgress.id : 0)
        );

        const newProgress = currentUserProgress.progress + 1;

        if (newProgress <= 20) {
            await db.update(userProgress).set({
                progress: newProgress
            }).where(
                eq(userProgress.userId, userId)
            );

            const pathsToRevalidate = [
                "/learn",
                "/lesson",
                "/quests",
                "/leaderboard",
                `/lesson/${lessonId}`
            ];

            // Assuming you have access to mutate from SWRConfig or another context
            pathsToRevalidate.forEach(path => {
                revalidatePath(path); // Replace with mutate(path) if using SWR
            });

            return;



        } else {
            return { error: "Blocked, you need to unlock more challenges" };
        }


    }

    await db.insert(challengesProgress).values({
        userId,
        challengesId: challengeId,
        completed: true
    });

}
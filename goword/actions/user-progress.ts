"use server";
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

import db from "@/db/drizzle"
import { getCoursesById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";


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

    // if (!course.units.length || !course.unit[0].lessons.length) {
    //     throw new Error("Course is empty")
    // }

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

    }


    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/logo-goworld.svg"
    });


    revalidatePath("/courses");
    revalidatePath("/learn")
    redirect("/learn")




}

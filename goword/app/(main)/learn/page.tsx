// Define los tipos


// learn/page.tsx
import { StickyWrapper } from "@/components/sticky-wrapper";

import { lessons, units as unitsSchema } from "@/db/schema";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";

import {
    getUserProgress,
    getUnits,
    getLessonPercentage,
    getCourseProgress
} from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { title } from "process";




const LearnPage = async () => {

    const userProgressData = getUserProgress();
    const courseProgressData = getCourseProgress();
    const lessonPercentageData = getLessonPercentage()
    const unitsData = getUnits();

    const [
        userProgress,
        units,
        courseProgress,
        lessonPercentage
    ] = await Promise.all([
        userProgressData,
        unitsData,
        courseProgressData,
        lessonPercentageData
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        return redirect("/courses");
    }

    if (!courseProgress) {
        redirect("/courses")
    }



    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress?.activeCourse}
                    progress={userProgress.progress}
                    badges={5}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title || ""} />
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            activeLesson={courseProgress.activeLesson as typeof lessons & {
                                unit: typeof unitsSchema.$inferSelect;
                            } | undefined}
                            activeLessonPercentage={lessonPercentage}
                        />
                    </div>
                ))}

            </FeedWrapper>
        </div>
    );
};

export default LearnPage;
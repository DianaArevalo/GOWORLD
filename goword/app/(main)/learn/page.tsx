import { StickyWrapper } from "@/components/sticky-wrapper"
import { FeedWrapper } from "@/components/feed-wrapper"
import { Header } from "./header"
import { UserProgress } from "@/components/user-progress"
import { getUserProgress } from "@/db/queries"
import { redirect } from "next/navigation"

const LearnPage = async () => {
    const userProgressData = getUserProgress()

    const [
        userProgress
    ] = await Promise.all([
        userProgressData
    ])

    if (!userProgress || !userProgress.activeCourse) {
        return redirect("/courses")
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    progress={userProgress.progress}
                    badges={5}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title} />
            </FeedWrapper>

        </div>
    )
}

export default LearnPage
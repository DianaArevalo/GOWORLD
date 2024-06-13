import { StickyWrapper } from "@/components/sticky-wrapper"
import { FeedWrapper } from "@/components/feed-wrapper"
import { Header } from "./header"
import { UserProgress } from "@/components/user-progress"

const LearnPage = () => {
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={{ title: "Spanish", imageSrc: "/ES - Spain.svg" }}
                    progress={5}
                    badges={100}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title="Spanish" />
            </FeedWrapper>

        </div>
    )
}

export default LearnPage
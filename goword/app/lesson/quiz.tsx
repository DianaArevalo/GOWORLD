"use client"

import { useState } from "react";
import { challengesOptions, challenges } from "@/db/schema";

import { Header } from "./header";
import { Footer } from "./footer";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";


type Props = {
    initialPercentage: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengesOptions.$inferSelect[]
    })[];
    userSubscription: any;
};






export const Quiz = ({
    initialPercentage,
    initialLessonId,
    initialLessonChallenges,
    userSubscription
}: Props) => {

    console.log("initialLessonChallenges", initialLessonChallenges);

    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges, setChallenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")

    const challenge = challenges[activeIndex];
    const options = challenge?.challengesOptions || [];

    const onNext = () => {
        serActiveIndex((current) => current + 1)
    }

    const onSelect = (id: number) => {
        if (status !== "none") return;

        setSelectedOption(id)

    }

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option: any) => option.correct);

        if (!correctOption) {
            return
        }

        if (correctOption.id === selectedOption) {
            console.log("correct option!");

        } else {
            console.log("Incorrect option!");

        }
    }

    const title = challenge?.type === "ASSIST"
        ? "Select the correct meaning"
        : challenge?.question;

    return (
        <>
            <Header
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        {challenge?.type === "ASSIST" && (
                            <QuestionBubble question={challenge.question} />
                        )}
                        <Challenge
                            options={options}
                            onSelect={onSelect}
                            status={status}
                            selectedOption={selectedOption}
                            disabled={false}
                            type={challenge?.type}
                        />
                    </div>
                </div>
            </div>
            <Footer
                disabled={!selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};
"use client"


import { toast } from "sonner";
import { useAudio } from "react-use";
import { useState, useTransition } from "react";

import { challengesOptions, challenges, challengesProgress } from "@/db/schema";
// import { upsertUserProgress } from "@/actions/user-progress";
import { addProgress } from "@/actions/user-progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { error } from "console";



type Props = {
    initialPercentage: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengesOptions: typeof challengesOptions.$inferSelect[];
    })[];
    userSubscription: any;
};

export const Quiz = ({
    initialPercentage,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: "/correct.mp3" });

    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: "/incorrect.mp3" });

    console.log("initialLessonChallenges", initialLessonChallenges);

    const [pending, startTransition] = useTransition();
    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges, setChallenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const challenge = challenges[activeIndex];
    const options = challenge?.challengesOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1)

    };

    const onSelect = (id: number) => {
        if (status !== "none") return;

        setSelectedOption(id);
    };

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none")
            setSelectedOption(undefined)
            return;
        }


        const correctOption = options.find((option) => option.correct);


        if (correctOption && correctOption.id === selectedOption) {

            startTransition(() => {
                addProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "progress" || initialPercentage === 0) {
                            correctControls.play();
                            setStatus("correct");
                            setPercentage((prev) => prev + 100 / challenges.length);
                            setPercentage((prev) => Math.min(prev + 1))
                            onNext()
                            console.error("Adding your progress");

                            return
                        } else {
                            incorrectControls.play()
                            setStatus("wrong")
                            console.log("Please try again");
                        }

                    }).catch(() => toast.error("Something went wrong. Please try again"))

            });
        } else {
            setStatus("wrong");
            console.log("Incorrect option!");
        }

        startTransition(() => {
            upsertChallengeProgress(challenge.id).then((res) => {
                if (res?.error === "continue") {
                    setChallenges(
                        (prev) =>
                            prev.map((ch) =>
                                ch.id === challenge.id ? { ...ch, completed: true } : ch
                            )
                    );

                }
            }).catch(() => toast.error("Something went wrong. Please try again"))
        })

    };


    const title = challenge?.type === "ASSIST"
        ? "Select the correct meaning"
        : challenge?.question;

    return (
        <>

            {incorrectAudio}
            {correctAudio}
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
                            disabled={pending}
                            type={challenge?.type}
                        // completed={challenge?.completed}
                        />
                    </div>
                </div>
            </div>
            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};

// upsertUserProgress(challenge.id)
//     .then((res) => {
//         if (res) {
//             console.log("correct option!");
//             // Actualizar el progreso del desafío en el frontend


//         } else {
//             toast.error("Failed to update progress. Please try again.");
//         }

//         setStatus("correct");
//



//     }).catch(() => toast.error("Something went wrong. Please try again"));
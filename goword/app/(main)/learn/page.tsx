import { useEffect, useState } from "react";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUnits } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";

const LearnPage: React.FC = () => {
    const [userProgress, setUserProgress] = useState<any>(null); // Ajusta el tipo según la estructura de tus datos
    const [units, setUnits] = useState<any[]>([]); // Ajusta el tipo según la estructura de tus datos

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProgressData = await getUserProgress();
                setUserProgress(userProgressData);

                if (!userProgressData || !userProgressData.activeCourse) {
                    redirect("/courses");
                    return;
                }

                const unitsData = await getUnits();
                setUnits(unitsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Manejar errores de manera apropiada, por ejemplo, redirigiendo a una página de error
            }
        };

        fetchData();
    }, []);

    if (!userProgress || !userProgress.activeCourse) {
        return <div>Redirecting...</div>; // Ajusta esto según tu lógica de redirección
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
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            activeLesson={undefined}
                            activeLessonPercentage={0}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;
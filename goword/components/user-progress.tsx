import Link from "next/link";
import Image from "next/image";
import { InfinityIcon } from "lucide-react";

import { courses } from "@/db/schema";
import { Button } from "./ui/button";



type Props = {
    activeCourse: typeof courses.$inferSelect;
    badges: number;
    progress: number;
    hasActiveSubscription: boolean;
};

export const UserProgress = ({
    activeCourse,
    progress,
    badges,
    hasActiveSubscription
}: Props) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Link href="/courses">
                <Button variant="ghost">
                    <Image
                        src={activeCourse.imageSrc}
                        alt={activeCourse.title}
                        className="rounded-md border"
                        width={32}
                        height={32}
                    />
                </Button>
            </Link>
            <Link href="/shop">
                <Button variant="ghost" className="text-orange-500">
                    <Image src="/progress.svg" height={28} width={28} alt="Progress" className="mr-2" />
                    {progress}
                </Button>
            </Link>
            <Link href="/shop">
                <Button variant="ghost" className="text-rose-500">
                    <Image src="/leaderboard.svg" height={28} width={28} alt="Badges" className="mr-2" />
                    {hasActiveSubscription ? (
                        <InfinityIcon className="h-4 w-4 stroke-[3]" />
                    ) : (
                        badges
                    )}
                </Button>
            </Link>
        </div>
    );
};
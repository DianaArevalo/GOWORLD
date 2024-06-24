import { challenges } from "@/db/schema";

type Props = {

    id: number;
    text: string;
    imageSrc: string | null;
    audioSrc: string | null;
    shortcut: string
    selected?: boolean
    onClick: () => void
    status?: "correct" | "wrong" | "none";
    disabled?: boolean
    type: typeof challenges.$inferSelect["type"]
}

export const Card = () => {
    return (
        <div>
            No me lee el id del challenge revisarlo
        </div>
    )
}


import { X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useExitModal } from "@/store/use-exit-modal";


type Props = {
    percentage: number;
    hasActiveSubscription: boolean;
}

export const Header = ({
    percentage,
    hasActiveSubscription
}: Props) => {

    const { open } = useExitModal()
    return (
        <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
            <X
                onClick={open}
                className="text-slate-500 hover:opacity-75 transition cursor-pointer"
            />

            <Progress value={percentage} />
            <div>
                {/* cuando termine % de progresso iniciar el siguiente y unos cuantos desafios conectar con whatsapp */}
                {percentage}
            </div>
        </header>
    )
}
import { Button } from "@/components/ui/button"
import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex flex-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/ES - Spain.svg"
                        alt="Spain"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md" />
                    Spanish
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/US - United States.svg"
                        alt="UnitedStates"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md" />
                    English
                </Button>
            </div>
        </footer>
    )
}
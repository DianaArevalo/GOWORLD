import Image from "next/image"
import { ClerkLoaded, ClerkLoading, SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Header = () => {
    return (
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image
                        src="/logo-goworld.svg"
                        height={80}
                        width={80}
                        alt="World"
                    />
                    <h1 className="text-2xl font-extrabold text-emerald-700 tracking-wide">GoWorld!</h1>
                </div>
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton
                            mode="modal"
                        // afterSignInUrl="/learn"
                        // afterSignUpUrl="/learn"
                        //No funcionan averiguar porque
                        >
                            <Button size="lg" variant="ghost">
                                Log In!
                            </Button>
                        </SignInButton>
                    </SignedOut>

                </ClerkLoaded>
            </div>
        </header>
    )
}

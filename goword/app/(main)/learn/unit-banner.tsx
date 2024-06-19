

type Props = {
    title: string;
    description: string;
}

export const UnitBanner = ({ title, description }: Props) => {
    return (
        <div className="w-full rounded-xl bg-green-500 p-5 text-white items-center justify-between">
            <div className="space-y-2 5">
                <h1>{title}</h1>
                <p>
                    {description}
                </p>
            </div>
        </div>
    )
}
import { Nav } from "./nav"

export const Header = () => {
    return (
        <header className="flex justify-between items-center gap-x-10 px-40 py-4">
            <h1 className="font-black text-lg">ARXXIII</h1>
            <Nav />
        </header>
    )
}
import Link from "next/link"

import { links } from "@/constants"

export const Nav = () => {
    return (
        <nav className="flex gap-x-10">

            {links.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    className="text-white"
                >
                    {link.label}
                </Link>
            ))}

        </nav>
    )
}
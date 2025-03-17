import type { Metadata } from "next"
import { Header } from "@/components/header/header"
import { Montserrat } from 'next/font/google'
import "./globals.css"

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic-ext'] })

export const metadata: Metadata = {
    title: "Crypto by ARXXIII",
    description: "Frontend test",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${montserrat.className} antialiased min-h-screen`} suppressHydrationWarning>
                <Header />
                {children}
            </body>
        </html>
    )
}

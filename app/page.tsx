import Link from 'next/link'

const Home = () => {
    return (
        <main className='p-3 space-y-8'>
            <div className='flex flex-col gap-y-3 justify-center items-center text-white'>
                <h1 className='font-black text-3xl'>Frontend. Тестовое задание v2</h1>
                <h2 className='text-3xl italic'>for <span className='font-medium not-italic'>Crypto</span> by ARXXIII</h2>
            </div>
            <div className='flex justify-center items-center gap-x-3'>
                <Link href='/treemap' className='px-4 py-2 text-lg rounded-xl'>TreeMap</Link>
            </div>
        </main>
    )
}

export default Home

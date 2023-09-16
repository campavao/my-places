import Card from "./card";

import { dummies } from "./dummyData";

export default function Home() {
  return (
    <main className='bg-gradient-to-b from-beige to-tan flex flex-col items-center justify-between p-2 pt-10 pb-40 w-full'>
      <h1 className='w-full mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-center'>
        {"Andrea's Places"}
      </h1>
      <div className='flex flex-col gap-4'>
        {dummies.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
      <button className='flex justify-center items-center fixed right-10 bottom-10 rounded-full text-black bg-shrek w-20 h-20 size-20 hover:bg-green shadow-lg '>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </button>
    </main>
  );
}

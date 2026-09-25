import LoginPage from "./login/page";
import Image from 'next/image';

export default function Home() {
  return (   
    <>
    <div className="relative w-full h-[110vh] overflow-hidden">
      <Image src="/assets/images/wordmarked.png" className='absolute left-18 top-15' alt="Tau Logo" width={100} height={60}/>
      <img src="/assets/images/hero_home.png" alt=""/>
      <a href="https://tau-fincorp.vercel.app/login" className="bottom-89 left-20 px-10 py-3 absolute homeEffect ">Track now</a>
    </div>  
    </>
  );
}

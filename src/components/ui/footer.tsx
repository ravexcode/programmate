function CustomLi(props: any){
  return (
    <li>
      <a href={props.link}
       className="cursor-pointer duration-200 hover:text-main">
        {props.children}
      </a>
    </li>
  )
}

export default function Footer(){
  return (
    <footer
    className="bg-black flex flex-col justify-center items-center px-4 py-3 z-100 text-text bottom relative">
      <img src="/logos/large_white.svg" alt="Logo made by RavexCode"
      className="h-7 mb-5"/>
      
      <div
      className="flex gap-10 md:gap-30 flex-wrap justify-center items-start">
        <ul className="flex flex-col justify-center items-start">
          <h3 className="font-bold text-lg">About</h3>
          <CustomLi link="/about"> More info </CustomLi>
          <CustomLi link="/"> Home </CustomLi>
          <CustomLi link="/about#startup"> Startup </CustomLi>
          <CustomLi link="/#pricing"> Pricing </CustomLi>
        </ul>

        
        <ul className="flex flex-col justify-center items-start">
          <h3 className="font-bold text-lg">Application</h3>
          <CustomLi link="/app"> More info </CustomLi>
          <CustomLi link="/blog"> Home </CustomLi>
          <CustomLi link="/app#download"> Startup </CustomLi>
        </ul>

        
        <ul className="flex flex-col justify-center items-start">
          <h3 className="font-bold text-lg">Developers</h3>
          <CustomLi link="/devs"> More info </CustomLi>
          <CustomLi link="/devs/about"> Technologies </CustomLi>
          <CustomLi link="/devs/docs"> Docs </CustomLi>
          <CustomLi link="/devs/repo"> Repository </CustomLi>
        </ul>

        
        <ul className="flex flex-col justify-center items-start">
          <h3 className="font-bold text-lg">Social media</h3>
          <CustomLi link="/"> Youtube </CustomLi>
          <CustomLi link="/"> X (Twittter) </CustomLi>
          <CustomLi link="/"> Reddit </CustomLi>
          <CustomLi link="/"> Facebook </CustomLi>
        </ul>
      </div>

      <p
      className="pt-8">
        Powered by <a href="https://github.com/RDev00" className="text-main duration-200 hover:text-ultramarine-100 hover:underline animate-pulse">RavexCode</a>
      </p>
    </footer>
  )
}
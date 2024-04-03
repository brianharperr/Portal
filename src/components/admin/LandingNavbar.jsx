import { Link } from 'react-scroll';

import MenuIcon from '../../assets/icons/menu';

export default function LandingNavbar({ toggleNav, openLogin, openRegister })
{
    return (
        <>
            {/* Header */}
            <div className='flex justify-between w-full h-[50px] px-6 sm:px-16 transition-all duration-200'>
                {/* Logo / Name */}
                <div className='w-[120px] p-2 transition-all duration-200'>
                    <img className='max-w-full max-h-full' src="https://familylynk.s3.us-east-2.amazonaws.com/meta/logo_150x58.svg" alt=""/>
                </div>
                {/* Links */}
                <div className='md:hidden flex items-center justify-center'>
                    <button className='hover:bg-gray-200 rounded p-1 transition-all duration-200' onClick={toggleNav}><MenuIcon width={"2rem"}/></button>
                </div>
                <div className='hidden md:flex'>
                <ul id="fl-9d8a" className='mt-[2px] flex items-center justify-center h-full'>
                    <li><Link id='fl-2139' to="About" spy={true} smooth={true} duration={200}>About</Link></li>
                    <li><Link id='fl-2139' to="Services" spy={true} smooth={true} duration={200}>Services</Link></li>
                    <li><Link id='fl-2139' to="Pricing" spy={true} smooth={true} duration={200}>Pricing</Link></li>
                    <li><Link id='fl-2139' to="Contact" spy={true} smooth={true} duration={200}>Contact</Link></li>
                </ul>
                {/* Buttons */}
                <div className='ml-16 gap-4 flex items-center justify-center h-full'>
                    <button id="fl-1237" onClick={openLogin}>Log In</button>
                    <button id="fl-1238" onClick={openRegister}>Sign Up</button>
                </div>
                </div>
            </div>
        </>
    )
}
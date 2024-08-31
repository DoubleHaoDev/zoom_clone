import React from 'react';
import Link from "next/link";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";

const Navbar = () => {
    return (
        <nav className="flex-between flexed z-50 w-full bf-dark-1 px-6 py-4 lg:px-10">
            <Link href="/" className="flex items-center gap-1">
            <Image
                src="/icons/logo.svg"
                alt="Yoom logo"
                width={32}
                height={32}
                className="max-sm:size-10"
            />
                <p className="text-[26px] font-extrabold text-white max-sm:hidden">Yoom</p>
            </Link>
            <div className="flex-between gap-5">
                <MobileNav/>
            </div>
        </nav>
    );
};

export default Navbar;

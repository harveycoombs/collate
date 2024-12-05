import { useState, useEffect } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import Button from "@/app/components/ui/button";
import Popup from "@/app/components/ui/popup";

export default function Header() {
    let [user, setUser] = useState<any>(null);
    let [settingsPopupIsVisible, setSettingsPopupVisibility] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            let response = await fetch("/api/users/sessions");

            if (!response.ok) return;

            let data = await response.json();
            setUser(data.user);
        })();
    }, []);

    return (
        <header className="p-3 select-none bg-white sticky top-0 border-b border-b-slate-300 flex justify-between items-center z-30">
            <Link href="/" className="font-bold duration-100 hover:opacity-85 active:opacity-70">Congruence <span className="text-blue-600">AI</span></Link>
            <nav className="text-sm leading-none font-medium max-[700px]:hidden">
                <HeaderNavigationOption text="About" url="/about" />
                <HeaderNavigationOption text="Privacy" url="/privacy" />
                <HeaderNavigationOption text="Pricing" url="/pricing" />
                <HeaderNavigationOption text="Developers" url="/developers" />
                <HeaderNavigationOption text="Support" url="/support" />
            </nav>
            <div>{
                    user ? <>
                        <div className="inline-block align-middle cursor-pointer duration-150 text-slate-400/60 hover:text-slate-400 active:text-slate-500" onClick={() => setSettingsPopupVisibility(true)}><FontAwesomeIcon icon={faGear} /></div>
                        <div className="inline-grid align-middle place-items-center bg-blue-100 text-blue-600 text-[0.8rem] leading-none select-none font-medium w-8 h-8 rounded-full ml-3">{(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}</div>
                    </> : <>
                        <Button url="/login" classes="inline-block align-middle">Sign In</Button>
                        <Button url="/register" classes="inline-block align-middle ml-1.5" transparent={true}>Register</Button>
                    </>
                }</div>{settingsPopupIsVisible ? <Popup title="Settings" onClose={() => setSettingsPopupVisibility(false)}>
                    <div className="w-650 flex"></div>
                </Popup> : null}
        </header>
    );
}

function HeaderNavigationOption({ text, url }: any) {
    return <Link href={url} className="mx-4 duration-100 hover:text-slate-400">{text}</Link>;
}
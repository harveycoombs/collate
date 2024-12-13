import { useState } from "react";  

import Popup from "@/app/components/common/popup";
import Menu from "../common/menu";

interface Properties {
    user: any;
    onClose: any;
}

export default function SettingsPopup({ user, onClose }: Properties) {
    let models = [
        { value: "deepseek-v2:lite", label: "DeepSeek-V2-Lite (15.7B)" },
        { value: "llama3.1", label: "Llama 3.1 (8B)" },
        { value: "qwq", label: "QwQ (32B)" }
    ];

    let [sectionTitle, setSectionTitle] = useState<string>("General");
    let [sectionContent, setSectionContent] = useState<React.JSX.Element>(<div>
        <FieldContainer title="Preferred Model">
            <Menu type="select" choices={models} />
        </FieldContainer>
    </div>);

    return (
        <Popup title="Settings" onClose={onClose}>
            <div className="w-650 flex gap-3">
                <div className="w-44 py-3 pr-3 border-r border-r-slate-300 shrink-0">
                    <div>
                        <div className="inline-grid align-middle place-items-center bg-sky-100 text-sky-500 text-sm leading-none select-none font-medium w-9 h-9 rounded-full">{(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}</div>
                        <div className="inline-block align-middle mx-2">
                            <strong className="text-sm font-bold">{user.first_name} {user.last_name}</strong>
                            <div className="text-xs font-medium text-slate-400/80">Joined {new Date(user.creation_date).toLocaleString(undefined, { year: "numeric", month: "short" })}</div>
                        </div>
                        <div className="mt-2">
                            <SettingsMenuItem title="General" />
                            <SettingsMenuItem title="Account" />
                            <SettingsMenuItem title="Privacy & Security" />
                            <div className= "p-2 rounded-md leading-none text-[0.81rem] text-red-500 font-medium mt-1 cursor-pointer duration-100 hover:bg-red-50 active:bg-red-100/80">Log Out</div>
                        </div>
                    </div>
                </div>
                <div className="py-3 w-full min-h-96">
                    <strong className="block text-sm leading-none font-semibold mb-2">{sectionTitle}</strong>
                    <div className="text-slate-400/80">{sectionContent}</div>
                </div>
            </div>
        </Popup>
    );
}

function SettingsMenuItem({ title }: any) {
    return <div className="p-2 rounded-md leading-none text-[0.81rem] text-slate-400/60 font-medium mt-1 cursor-pointer duration-100 hover:bg-slate-50 active:bg-slate-100/80">{title}</div>;
}

function FieldContainer({ title, children }: any) {
    return (
        <div>
            <div className="text-[0.81rem]">{title}</div>
            <div>{children}</div>
        </div>
    );
}
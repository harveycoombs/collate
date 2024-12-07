import { useEffect, useState, useRef } from "react";

import Popup from "@/app/components/ui/popup";
import Button from "@/app/components/ui/button";
import Field from "@/app/components/ui/field";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faClockRotateLeft, faDownload, faEllipsis } from "@fortawesome/free-solid-svg-icons";

interface Properties {
    onClose: any;
}

export default function ChatPopup({ onClose }: Properties) {
    let [prompt, setPrompt] = useState<string>("");
    let [messages, setMessages] = useState<any[]>([]);

    let [isLoading, setLoading] = useState<boolean>(false);

    let chatArea = useRef<HTMLDivElement>(null);
    let promptField = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isLoading) return;

        (async () => {
            let response = await fetch("/api/chat", {
                method: "POST",
                body: new URLSearchParams({ messages: JSON.stringify(messages) })
            });

            let data = await response.json();

            if (!response.ok) return;

            setMessages([...messages, {
                content: data.text,
                you: false,
                timestamp: new Date()
            }]);

            chatArea.current?.scrollTo(0, chatArea?.current?.scrollHeight ?? 0);

            setLoading(false);
        })();
    }, [isLoading]);

    function startNewConversation() {
        setMessages([]);
    }

    function sendMessage() {
        setMessages([...messages, {
            content: prompt,
            you: true,
            timestamp: new Date()
        }]);

        if (promptField?.current) {
            promptField.current.blur();
            promptField.current.value = "";
        }

        setLoading(true);
    }

    return (
        <Popup title="Chat" onClose={onClose}>
            <div className="w-1300 mt-2">
                <div className="flex justify-between items-center text-sm mb-2">
                    <div className="text-slate-400/60">Model: <strong className="font-bold text-slate-600">DeepSeek V2 Lite &#40;15.7B&#41;</strong></div>
                    <div>
                        <ChatOption icon={faPlus} title="New Conversation" onClick={startNewConversation} />
                        <ChatOption icon={faClockRotateLeft} title="View Conversation History" />
                        <ChatOption icon={faDownload} title="Download Conversation Transcript" />
                    </div>
                </div>
                <div className={`h-1/2-screen overflow-auto ${messages.length ? "" : "grid place-items-center pointer-events-none"}`} ref={chatArea}>{
                    messages.length ? messages.map((message, index) => <ChatMessage key={index} message={message} />)
                    : <div className="text-center"><strong className="text-xl text-slate-400/60 font-semibold">Welcome to Chat</strong><div className="text-xs text-slate-400 mt-1.5">Start a conversation by typing a message below</div></div>
                }
                {isLoading ? <div className="px-3 py-0.5 mt-4 text-lg max-w-23/50 rounded-lg bg-blue-400 text-white w-fit"><FontAwesomeIcon icon={faEllipsis} className="animate-pulse" /></div> : null}
                </div>
                <div className="flex gap-3 mt-3.5">
                    <Field classes="w-full" onInput={(e: any) => setPrompt(e.target.value)} ref={promptField} />
                    <Button onClick={sendMessage} disabled={isLoading}>Send</Button>
                </div>
            </div>
        </Popup>
    );
}

function ChatMessage({ message, ...rest }: any) {
    return (
        <div className={`w-5/12 mt-4 ${message.you ? "ml-auto" : "mr-auto"}`}>
            <div className={`px-3 py-2 text-sm max-w-23/50 rounded-lg ${message.you ? "bg-slate-100 text-slate-400" : "bg-blue-400 text-white"}`} {...rest}>{message.content}</div>
            <div className="text-xs text-slate-400 mt-1">{message.timestamp.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
    );
}

function ChatOption({ icon, ...rest }: any) {
    return <div className="inline-block align-middle ml-3.5 text-base cursor-pointer duration-100 text-slate-400/60 hover:text-slate-400 active:text-slate-500" {...rest}><FontAwesomeIcon icon={icon} /></div>
}
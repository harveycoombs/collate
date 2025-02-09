import Link from "next/link";
import PasswordResetForm from "./form";

import Logo from "@/app/components/common/logo";

export default function ResetPassword() {
    return (
        <main className="min-h-[calc(100vh-55px)] grid place-items-center">
            <section className="text-center">
                <Link href="/" className="block w-fit mx-auto mb-2 duration-100 hover:opacity-85 active:opacity-70" title="Collate AI"><Logo width={157} height={36} /></Link>
                <strong className="block text-sm font-medium select-none text-slate-400/60">Reset Password</strong>
                <PasswordResetForm />
                <div className="text-[0.825rem] font-medium text-slate-400 mt-3 text-center select-none">
                    <Link href="mailto:issues@collate.harveycoombs.com" className="hover:underline">Report An Issue</Link>
                </div>
            </section>
        </main>
    );
}
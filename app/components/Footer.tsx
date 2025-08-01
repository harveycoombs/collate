import Link from "next/link";
import { faDiscord, faReddit } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import packageJson from "@/package.json";

export default function Footer() {
    return (
        <footer className="p-4 flex justify-between items-center border-t border-t-gray-300 text-sm font-medium select-none">
            <div>&copy; 2024 &ndash; {new Date().getFullYear()} Dark Tensor {packageJson.version} &middot; <Link href="https://harveycoombs.com/" target="_blank" rel="noopener" className="hover:underline">Harvey Coombs</Link></div>
            <div>
                <FooterIcon icon={faReddit} title="Reddit" url="https://www.reddit.com/r/darktensorai" />
                <FooterIcon icon={faDiscord} title="Discord" url="https://discord.gg/rguH98UY" />
            </div>
        </footer>
    );
}

function FooterIcon({ icon, title, url }: any) {
    return <Link href={url} title={title} className="inline-block align-middle text-lg leading-none text-gray-400/60 duration-200 ml-4 hover:text-gray-400 active:text-gray-500"><FontAwesomeIcon icon={icon} /></Link>;
}
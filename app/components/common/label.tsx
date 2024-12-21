interface Properties {
    children: React.ReactNode;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    required?: boolean;
}

export default function Label({ children, classes, error, warning, required, ...rest }: Properties) {
    let color = error ? "text-red-500" : warning ? "text-amber-500" : "text-slate-400";

    return <label className={`text-[0.78rem] font-medium select-none ${color} text-left block mb-0.5${classes?.length ? " " + classes : ""}`} {...rest}>{children}{required ? <span>&#42;</span> : null}</label>;
}
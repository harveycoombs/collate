interface Properties {
    type?: string;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    [key: string]: any;
}

export default function Menu({ choices, classes, ...rest }: Properties) {
    const classList = `px-3.5 py-2 box-border rounded-md text-[0.8rem] border border-slate-300 bg-transparent text-slate-600 font-medium leading-none duration-100 select-none focus:outline-none focus:border-sky-500 focus:shadow-md ${classes?.length ? " " + classes : ""}`;
    return <select className={classList} {...rest}>{choices.map((choice: any, index: number) => <option key={index} value={choice.value}>{choice.label}</option>)}</select>;
}
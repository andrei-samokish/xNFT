import { PropsWithChildren } from "react";

interface ProrgessBarProps {
  stage: string;
}

export default function ProgressBar(props: ProrgessBarProps) {
  return (
    <div className="w-full h-2 bg-grey -z-10 rounded-3xl mt-16">
      <div className={`w-${props.stage} bg-secondary h-full rounded-3xl`}></div>
    </div>
  );
}

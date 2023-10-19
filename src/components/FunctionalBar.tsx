import { ThreeDots } from "react-loader-spinner";

export default function FunctionalBar() {
  return (
    <div className="mt-12">
      <div className="w-full flex flex-col items-start mb-8 max-[1235px]:items-center">
        <div className="flex items-center flex-col w-1/3 gap-8">
          <svg
            width="34"
            height="45"
            viewBox="0 0 34 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 0C16.296 0 15.72 0.579413 15.72 1.28341V40.912L2.15202 29.264C1.64002 28.816 0.808017 28.88 0.360017 29.392C-0.0879833 29.904 -0.0239829 30.736 0.488017 31.184L16.168 44.624C16.424 44.816 16.68 44.944 17 44.944C17.32 44.944 17.576 44.816 17.832 44.624L33.512 31.184C34.024 30.736 34.088 29.904 33.64 29.392C33.192 28.88 32.36 28.816 31.848 29.264L18.28 40.912V1.28341C18.28 0.579413 17.704 0 17 0Z"
              fill="#BB86FC"
            />
          </svg>
          <p className="font-bold text-3xl text-secondary max-[1235px]:invisible max-[1235px]:h-0">
            Verify for mint
          </p>
        </div>
      </div>
      <div className="w-full flex flex-row gap-3 justify-evenly">
        {/** buttons */}
        <span className="w-full h-14 bg-secondary rounded-xl font-medium flex justify-center items-center text-primary text-2xl">
          Verify
        </span>
        <div className="w-full flex justify-between flex-col items-center">
          <p className="text-white text-xs font-semibold">
            Verification is in progress
          </p>
          <ThreeDots
            height="40"
            width="80"
            radius="9"
            color="#BB86FC"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
        <span className="w-full h-14 bg-secondary rounded-xl font-medium flex justify-center items-center text-primary text-2xl">
          Mint
        </span>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <div className="flex flex-row justify-between xl:mr-9">
      <div className=" bg-secondary w-2 h-2">
        <button className="w-full">
          <img src="/static/arrow-right.svg" />
        </button>
      </div>
      <div className="bg-secondary w-2 h-2"></div>
    </div>
  );
}

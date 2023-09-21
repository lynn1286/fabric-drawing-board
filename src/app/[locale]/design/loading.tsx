const Loading = () => {
  return (
    <div className="h-screen w-full animate-pulse">
      <div className="h-12 w-full bg-slate-200"></div>
      <div className="grid flex-1 grid-cols-4 content-start gap-x-4 overflow-y-auto px-6 pt-4">
        {[...Array(5).keys()].map((item) => {
          return <div className="col-span-4 mb-6 h-24 rounded bg-slate-300" key={item}></div>;
        })}
      </div>
    </div>
  );
};

export default Loading;

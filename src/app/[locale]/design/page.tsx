import LeftBar from '@/app/components/laftBar';
import Main from '@/app/components/Main';
import RightBar from '@/app/components/rightBar';

const Design = () => {
  return (
    <div className="flex h-[calc(100%-44px)] overflow-hidden">
      <LeftBar />
      <Main />
      <RightBar />
    </div>
  );
};

export default Design;

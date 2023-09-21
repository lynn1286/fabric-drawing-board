import Image from 'next/image';
import Logo from '/public/next.svg';

const Header = () => {
  return (
    <div className="flex h-11 items-center border border-b border-gray-300 px-3">
      <span className="relative mr-3 inline-block h-8 w-8 text-center align-middle">
        <Image src={Logo} fill alt="logo" className="absolute left-0 top-0" />
      </span>
    </div>
  );
};

export default Header;

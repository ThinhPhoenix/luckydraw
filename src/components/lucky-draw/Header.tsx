import { Typography } from 'antd';
import '@/styles/lucky-draw.css';
import Assets from '@/assets';

const { Title } = Typography;

export function Header() {
  return (
    <header className="relative z-10 w-full py-6 text-center">
      <div className="flex flex-col items-center justify-center">
        <Title
          level={1}
          className="!mb-0 !text-5xl font-dancing font-bold uppercase tracking-wider !text-tet-gold drop-shadow-lg md:!text-7xl"
        >
          {/* <span className="text-gold-gradient">D-JOY</span> */}
          <img src={Assets.Logo} alt="Logo" className="w-24 h-24" />
        </Title>
        <Title
          level={2}
          className="!mt-2 !text-2xl font-playfair font-semibold !text-white opacity-90 md:!text-3xl tracking-wide"
        >
          Xuân Bính Ngọ 2026
        </Title>
      </div>

      {/* Decorative lines */}
      <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-tet-gold to-transparent opacity-80" />
    </header>
  );
}

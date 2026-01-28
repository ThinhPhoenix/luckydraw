import { Typography } from 'antd';
import '@/styles/lucky-draw.css';
import Assets from '@/assets';

const { Title } = Typography;

export function Header() {
  return (
    <header className="relative z-10 w-full py-3 text-center">
      <div className="flex flex-col items-center justify-center">
        <Title
          level={1}
          className="!mb-0 !text-4xl font-dancing font-bold uppercase tracking-wider !text-tet-gold drop-shadow-lg md:!text-5xl"
        >
          {/* <span className="text-gold-gradient">D-JOY</span> */}
          <div className="inline-block p-2 rounded-3xl bg-white/90 shadow-[0_0_20px_rgba(255,215,0,0.3)] backdrop-blur-sm border-2 border-white/50 mb-2">
            <img
              src={Assets.Logo}
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
        </Title>
        <Title
          level={2}
          className="!mt-2 !text-xl font-playfair font-semibold !text-white opacity-90 md:!text-2xl tracking-wide"
        >
          Xuân Bính Ngọ 2026
        </Title>
      </div>

      {/* Decorative lines */}
      <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-tet-gold to-transparent opacity-80" />
    </header>
  );
}

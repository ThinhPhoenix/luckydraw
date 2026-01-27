import { motion } from 'framer-motion';

interface Props {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
}

export function SpinButton({ onClick, disabled, loading }: Props) {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        group relative flex h-32 w-32 items-center justify-center rounded-full 
        bg-gradient-to-br from-red-600 to-red-800 shadow-[0_0_20px_rgba(255,0,0,0.5)] 
        transition-all duration-300
        ${disabled ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer hover:shadow-[0_0_40px_rgba(255,215,0,0.6)]'}
      `}
        >
            {/* Paddle Handle Look (Stylized) */}
            <div className="absolute -bottom-8 h-16 w-8 rounded-b-lg bg-gray-800 shadow-md" />

            {/* Paddle Face */}
            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-200 shadow-inner">
                {/* Inner Text/Icon */}
                <span className={`text-xl font-bold text-red-700 ${loading ? 'animate-spin' : ''}`}>
                    {loading ? 'Wait...' : 'QUAY'}
                </span>
            </div>

            {/* Decorative Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500 opacity-50 group-hover:animate-ping" />
        </motion.button>
    );
}

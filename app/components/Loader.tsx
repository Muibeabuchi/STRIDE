import { useTheme } from "next-themes";

export function Loader() {
  return (
    <div className="flex h-full">
      <div className="m-auto border-gray-300 h-20 max-h-full aspect-square animate-spin rounded-full border-8 border-t-slate-900" />
    </div>
  );
}

export function LogoLoader() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center h-screen w-full animate-pulse">
      {theme === "light" ? (
        <img
          src="/public/ChatGPT Image May 26, 2025, 01_40_32 AM.png"
          width={270}
          height={270}
        />
      ) : (
        <img src="/stride_dark_mode_512x512.png" width={270} height={270} />
      )}
    </div>
  );
}

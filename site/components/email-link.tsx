"use client";

// Obfuscated email to prevent bot harvesting
export function EmailLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = "mai" + "lto:" + "ricardo" + "@" + "deazuadesign.com";
      }}
    >
      {children}
    </a>
  );
}

import Image from "next/image"

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/verizon-asurion-logo.png"
      alt="Verizon and Asurion"
      width={180}
      height={40}
      priority
      className={className}
    />
  )
}

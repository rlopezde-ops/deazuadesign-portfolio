import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TERMS_URL =
  'https://assets.ctfassets.net/by1tgtd3v7z1/3xFKCGORuGbSyc1uEX3ogQ/6f5428a9a0615d2c6fe009e7601683db/VHDP_Wireless_Terms_digital_Final_12_25.pdf'

export const ELECTRONIC_COMMUNICATIONS_URL =
  'https://assets.ctfassets.net/by1tgtd3v7z1/5lgLHql7IilRlScUjVDDgu/a37379cbac1ff3a7a8566b7c39cb49cb/Electronic_Communications_Agreement_for_VHDP.pdf'

export const PRIVACY_NOTICE_URL = 'https://www.asurion.com/legal/privacy-notice/'

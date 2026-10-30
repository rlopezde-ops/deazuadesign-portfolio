export type CoveredCategory = {
  id: string
  title: string
  devices: string[]
  note?: string
}

export const COVERED_CATEGORIES: CoveredCategory[] = [
  {
    id: "home-entertainment",
    title: "Home entertainment",
    devices: [
      "Televisions",
      "Gaming systems",
      "Handheld gaming devices",
      "Audio headsets",
      "DVD and Blu-Ray players",
      "Home theater system in a box",
      "Speakers",
      "Streaming devices*",
      "Sound bars",
      "Augmented reality (AR) glasses",
      "Gaming controllers",
      "VR headsets",
    ],
    note: "*Excludes Verizon-branded or provided routers and audio/video streaming devices supported by Verizon.",
  },
  {
    id: "computers-office",
    title: "Computers & office",
    devices: [
      "Desktop computers (OS restrictions)",
      "Laptops (OS restrictions)",
      "Tablets",
      "E-Reader tablets",
      "External monitors",
      "Printers",
      "External hard drives",
      "Routers and modems*",
      "Mice",
      "Keyboards",
    ],
    note: "*Excludes Verizon-branded or provided routers and audio/video streaming devices supported by Verizon.",
  },
  {
    id: "smart-home",
    title: "Smart home",
    devices: [
      "Smart device hubs",
      "Smart thermostats",
      "Smart door locks",
      "Smart video doorbells",
      "Smart smoke and carbon monoxide detectors",
      "Smart light dimmers",
      "Smart vacuum",
      "Robotic mops",
    ],
  },
  {
    id: "smart-home-security",
    title: "Smart home security",
    devices: [
      "Smart home security cameras",
      "Smart alarm keypads",
      "Smart alarm panic buttons",
      "Smart alarm contact sensors",
      "Smart alarm flood and freeze sensors",
      "Smart alarm glassbreak sensors",
      "Smart alarm motion detectors",
      "Smart alarm range extenders",
    ],
  },
  {
    id: "healthcare-wearables",
    title: "Healthcare tech and wearables",
    devices: [
      "Smart watches",
      "Health and fitness bands",
      "Smart blood pressure monitors",
      "Smart pulse oximeters",
      "Smart personal home-use EKG monitors",
    ],
  },
  {
    id: "pet-tech",
    title: "Pet tech",
    devices: ["Smart collars", "Smart auto-fetch machines", "Smart pet food dispensers"],
  },
]

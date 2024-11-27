export interface iInfo {
   features?: {
      title: string
      description: string
   }[]
   description?: {
      title: string
      description: string
   }
   profile?: iProfile[]
}

export interface iProfile {
   img: string
   name: string
   description: [string, string]
   time?: {
      text: string
      satus: "good" | "warning" | "late"
   }
   link?: string
}
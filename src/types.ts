export type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  image: string
  content: {
    type: 'text' | 'image' | 'video'
    data: string
  }[]
  colSpan?: number
  rowSpan?: number
  borderColor?: string
  repoUrl: string
  collaborators?: string[]
  isFeatured?: boolean
  projectLink?: string
}

export type Experience = {
  id: number
  company: string
  role: string
  period: string
  description: string
  location?: string
}

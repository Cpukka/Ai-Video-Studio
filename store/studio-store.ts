import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StudioState {
  script: string
  voiceId: string
  voiceName: string
  avatarId: string
  avatarUrl: string
  projectId: string | null
  isGenerating: boolean
  generationProgress: number
  settings: {
    background: string
    subtitles: boolean
    resolution: '720p' | '1080p' | '4k'
  }
  
  setScript: (script: string) => void
  setVoice: (voiceId: string, voiceName: string) => void
  setAvatar: (avatarId: string, avatarUrl: string) => void
  setProjectId: (projectId: string) => void
  setSetting: <K extends keyof StudioState['settings']>(
    key: K,
    value: StudioState['settings'][K]
  ) => void
  resetStudio: () => void
  setGenerating: (isGenerating: boolean) => void
  setProgress: (progress: number) => void
}

// Create the store
const studioStore = create<StudioState>()(
  persist(
    (set) => ({
      script: '',
      voiceId: '',
      voiceName: '',
      avatarId: '',
      avatarUrl: '',
      projectId: null,
      isGenerating: false,
      generationProgress: 0,
      settings: {
        background: 'default',
        subtitles: true,
        resolution: '1080p',
      },
      
      setScript: (script) => set({ script }),
      
      setVoice: (voiceId, voiceName) => set({ voiceId, voiceName }),
      
      setAvatar: (avatarId, avatarUrl) => set({ avatarId, avatarUrl }),
      
      setProjectId: (projectId) => set({ projectId }),
      
      setSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      
      resetStudio: () =>
        set({
          script: '',
          voiceId: '',
          voiceName: '',
          avatarId: '',
          avatarUrl: '',
          projectId: null,
          isGenerating: false,
          generationProgress: 0,
          settings: {
            background: 'default',
            subtitles: true,
            resolution: '1080p',
          },
        }),
      
      setGenerating: (isGenerating) => set({ isGenerating }),
      
      setProgress: (generationProgress) => set({ generationProgress }),
    }),
    {
      name: 'studio-storage',
    }
  )
)

// Export both the selector hook and the direct hook
export const useStudioStore = <T>(selector: (state: StudioState) => T) => {
  const store = studioStore
  return store(selector)
}

// Add a direct hook for components that want to destructure
export const useStudioState = () => {
  const store = studioStore
  return store.getState()
}

// For components that need to subscribe to all state changes
export const useStudio = () => {
  const store = studioStore
  return store
}
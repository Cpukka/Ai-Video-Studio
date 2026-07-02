import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { useStore } from 'zustand'

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

const studioStore = createStore<StudioState>()(
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

export const useStudioStore = <T>(selector: (state: StudioState) => T) => useStore(studioStore, selector)
import { useEffect, useRef, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { ResumeData } from '../types/resume'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

// Photo is stored in localStorage (avoids Firestore's 1MB doc limit)
function savePhotoLocally(uid: string, photo: string) {
  try { localStorage.setItem(`resume_photo_${uid}`, photo) } catch {}
}
function loadPhotoLocally(uid: string): string {
  try { return localStorage.getItem(`resume_photo_${uid}`) ?? '' } catch { return '' }
}

export function useResumeSync(
  uid: string | null,
  data: ResumeData,
  setData: (d: ResumeData) => void,
  onStatus: (s: SaveStatus) => void,
  onReady: () => void,       // always fires when load completes (hides spinner)
  onRestored: () => void     // fires only when saved data was found (shows toast)
) {
  const loadedUid = useRef<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestData = useRef(data)

  useEffect(() => { latestData.current = data })

  const saveNow = useCallback(async (uidToSave: string, payload: ResumeData) => {
    try {
      onStatus('saving')
      // Strip photo from Firestore payload — stored separately in localStorage
      const { personalInfo, ...rest } = payload
      const { photo, ...personalInfoWithoutPhoto } = personalInfo
      const firestorePayload = { ...rest, personalInfo: personalInfoWithoutPhoto }

      if (photo) savePhotoLocally(uidToSave, photo)

      await setDoc(doc(db, 'resumes', uidToSave), firestorePayload)
      onStatus('saved')
    } catch (e) {
      console.error('Firestore save failed:', e)
      onStatus('error')
    }
  }, [onStatus])

  // Load from Firestore on login
  useEffect(() => {
    if (!uid) {
      loadedUid.current = null
      return
    }

    loadedUid.current = null

    getDoc(doc(db, 'resumes', uid))
      .then(snap => {
        if (snap.exists()) {
          const saved = snap.data() as ResumeData
          const photo = loadPhotoLocally(uid)
          setData({
            ...saved,
            personalInfo: { ...saved.personalInfo, photo },
          })
          onRestored()
        }
        loadedUid.current = uid
        onStatus('idle')
        onReady()
      })
      .catch(e => {
        console.error('Firestore load failed:', e)
        loadedUid.current = uid
        onStatus('error')
        onReady() // unblock UI even on error
      })
  }, [uid])

  // Debounced auto-save (800ms) — only after load completes
  useEffect(() => {
    if (!uid || loadedUid.current !== uid) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveNow(uid, latestData.current)
    }, 800)

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [uid, data, saveNow])

  // Force-save on tab close
  useEffect(() => {
    if (!uid) return
    const flush = () => {
      if (loadedUid.current !== uid) return
      if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null }
      const { personalInfo, ...rest } = latestData.current
      const { photo, ...personalInfoWithoutPhoto } = personalInfo
      if (photo) savePhotoLocally(uid, photo)
      setDoc(doc(db, 'resumes', uid), { ...rest, personalInfo: personalInfoWithoutPhoto }).catch(() => {})
    }
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [uid])
}

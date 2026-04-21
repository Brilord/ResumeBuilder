import { useEffect, useRef, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { ResumeData } from '../types/resume'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const GUEST_KEY = 'guest_resume'

function savePhotoLocally(key: string, photo: string) {
  try { localStorage.setItem(`resume_photo_${key}`, photo) } catch {}
}
function loadPhotoLocally(key: string): string {
  try { return localStorage.getItem(`resume_photo_${key}`) ?? '' } catch { return '' }
}
function saveGuestData(data: ResumeData) {
  try {
    const { personalInfo, ...rest } = data
    const { photo, ...infoWithoutPhoto } = personalInfo
    localStorage.setItem(GUEST_KEY, JSON.stringify({ ...rest, personalInfo: infoWithoutPhoto }))
    if (photo) savePhotoLocally('guest', photo)
  } catch {}
}
function loadGuestData(): ResumeData | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as ResumeData
    const photo = loadPhotoLocally('guest')
    return { ...saved, personalInfo: { ...saved.personalInfo, photo } }
  } catch { return null }
}

export function useResumeSync(
  uid: string | null,
  isGuest: boolean,
  data: ResumeData,
  setData: (d: ResumeData) => void,
  onStatus: (s: SaveStatus) => void,
  onReady: () => void,
  onRestored: () => void
) {
  const loadedUid = useRef<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestData = useRef(data)
  const isGuestRef = useRef(isGuest)

  useEffect(() => { latestData.current = data })
  useEffect(() => { isGuestRef.current = isGuest })

  // ── Guest mode: load from localStorage ──────────────────────────
  useEffect(() => {
    if (!isGuest) return
    const saved = loadGuestData()
    if (saved) { setData(saved); onRestored() }
    loadedUid.current = 'guest'
    onStatus('idle')
    onReady()
  }, [isGuest])

  // ── Logged-in: load from Firestore ──────────────────────────────
  const saveNow = useCallback(async (uidToSave: string, payload: ResumeData) => {
    if (!db) return
    try {
      onStatus('saving')
      const { personalInfo, ...rest } = payload
      const { photo, ...infoWithoutPhoto } = personalInfo
      if (photo) savePhotoLocally(uidToSave, photo)
      await setDoc(doc(db, 'resumes', uidToSave), { ...rest, personalInfo: infoWithoutPhoto })
      onStatus('saved')
    } catch (e) {
      console.error('Firestore save failed:', e)
      onStatus('error')
    }
  }, [onStatus])

  useEffect(() => {
    if (!uid) { loadedUid.current = null; return }
    if (!db) { loadedUid.current = uid; onStatus('idle'); onReady(); return }
    loadedUid.current = null
    getDoc(doc(db, 'resumes', uid))
      .then(snap => {
        if (snap.exists()) {
          const saved = snap.data() as ResumeData
          const photo = loadPhotoLocally(uid)
          setData({ ...saved, personalInfo: { ...saved.personalInfo, photo } })
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
        onReady()
      })
  }, [uid])

  // ── Auto-save (debounced 800ms) ──────────────────────────────────
  useEffect(() => {
    const activeKey = isGuest ? 'guest' : uid
    if (!activeKey || loadedUid.current !== (isGuest ? 'guest' : uid)) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (isGuestRef.current) {
        saveGuestData(latestData.current)
        onStatus('saved')
      } else if (uid) {
        saveNow(uid, latestData.current)
      }
    }, 800)

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [uid, isGuest, data, saveNow])

  // ── Force-save on tab close ──────────────────────────────────────
  useEffect(() => {
    const flush = () => {
      if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null }
      if (isGuestRef.current) {
        saveGuestData(latestData.current)
      } else if (db && uid && loadedUid.current === uid) {
        const { personalInfo, ...rest } = latestData.current
        const { photo, ...infoWithoutPhoto } = personalInfo
        if (photo) savePhotoLocally(uid, photo)
        setDoc(doc(db, 'resumes', uid), { ...rest, personalInfo: infoWithoutPhoto }).catch(() => {})
      }
    }
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [uid])
}

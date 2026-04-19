import { useEffect, useRef, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { ResumeData } from '../types/resume'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useResumeSync(
  uid: string | null,
  data: ResumeData,
  setData: (d: ResumeData) => void,
  onStatus: (s: SaveStatus) => void
) {
  // Track which uid's data is currently loaded — saves only fire after load
  const loadedUid = useRef<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestData = useRef(data)

  // Always keep a ref to latest data for use in event handlers
  useEffect(() => {
    latestData.current = data
  })

  const saveNow = useCallback(async (uidToSave: string, payload: ResumeData) => {
    try {
      onStatus('saving')
      await setDoc(doc(db, 'resumes', uidToSave), payload)
      onStatus('saved')
    } catch (e) {
      console.error('Firestore save failed:', e)
      onStatus('error')
    }
  }, [onStatus])

  // Load from Firestore whenever uid changes (login)
  useEffect(() => {
    if (!uid) {
      loadedUid.current = null
      return
    }

    loadedUid.current = null // block saves during load

    getDoc(doc(db, 'resumes', uid)).then(snap => {
      if (snap.exists()) {
        setData(snap.data() as ResumeData)
      }
      // Mark as ready to save only after load completes
      loadedUid.current = uid
      onStatus('idle')
    }).catch(e => {
      console.error('Firestore load failed:', e)
      loadedUid.current = uid // allow saves even if load failed
      onStatus('error')
    })
  }, [uid])

  // Debounced auto-save on every data change (800ms)
  useEffect(() => {
    // Don't save if not loaded yet, or uid mismatch
    if (!uid || loadedUid.current !== uid) return

    if (saveTimer.current) clearTimeout(saveTimer.current)

    saveTimer.current = setTimeout(() => {
      saveNow(uid, latestData.current)
    }, 800)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [uid, data, saveNow])

  // Force-save on tab close / refresh — fires pending save immediately
  useEffect(() => {
    if (!uid) return

    const handleUnload = () => {
      if (loadedUid.current !== uid) return
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
        saveTimer.current = null
      }
      // Fire-and-forget — browser may not wait but Firebase queues the write
      setDoc(doc(db, 'resumes', uid), latestData.current).catch(() => {})
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [uid])
}

import { useEffect, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { ResumeData } from '../types/resume'

export function useResumeSync(
  uid: string | null,
  data: ResumeData,
  setData: (d: ResumeData) => void
) {
  const initialized = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from Firestore when user logs in
  useEffect(() => {
    if (!uid) {
      initialized.current = false
      return
    }
    const load = async () => {
      const ref = doc(db, 'resumes', uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setData(snap.data() as ResumeData)
      }
      initialized.current = true
    }
    load()
  }, [uid])

  // Auto-save with 1.5s debounce after init
  useEffect(() => {
    if (!uid || !initialized.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await setDoc(doc(db, 'resumes', uid), data)
    }, 1500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [uid, data])
}

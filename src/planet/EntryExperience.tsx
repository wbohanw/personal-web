import { useEffect, useRef } from 'react'

export default function EntryExperience({ onEnter }: { onEnter: (withMusic: boolean) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    return () => element?.close()
  }, [])

  const enter = (withMusic: boolean) => {
    dialog.current?.close()
    onEnter(withMusic)
  }

  return <dialog ref={dialog} className="experience-dialog" aria-labelledby="experience-title" aria-describedby="experience-description" onCancel={event => { event.preventDefault(); enter(false) }}>
    <div className="experience-content">
      <h2 id="experience-title">Welcome to My Portfolio</h2>
      <p id="experience-description">Enjoy an immersive experience with music,<br /> or explore at your own pace without sound.</p>
      <div className="experience-actions">
        <button className="experience-enter" onClick={() => enter(true)}>Enter with Music</button>
        <button className="experience-enter is-quiet" onClick={() => enter(false)}>Enter without Music</button>
      </div>
    </div>
  </dialog>
}

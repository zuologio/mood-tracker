type Props = { onInstall: () => void }
export default function InstallPill({ onInstall }: Props) {
  return (
    <div className="installPill">
      <span>Tip: Add to Home Screen for a native feel.</span>
      <button className="primary" onClick={onInstall}>Install</button>
    </div>
  )
}


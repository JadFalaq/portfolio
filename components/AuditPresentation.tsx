import PresentationViewer from './PresentationViewer'
import { akwaPresentation } from '../data/akwa'

export default function AuditPresentation({ compact = false }: { compact?: boolean }) {
  return <PresentationViewer presentation={akwaPresentation} compact={compact} />
}

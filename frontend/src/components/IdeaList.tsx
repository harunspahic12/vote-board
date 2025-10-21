import { Idea } from '../types'
import IdeaCard from './IdeaCard'
import './IdeaList.css'

interface IdeaListProps {
  ideas: Idea[]
  loading: boolean
  onVote: (id: number) => void
  onDelete: (id: number) => void
}

export default function IdeaList({ ideas, loading, onVote, onDelete }: IdeaListProps) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading ideas...</p>
      </div>
    )
  }

  if (ideas.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💭</div>
        <h3>No ideas yet</h3>
        <p>Be the first to share an idea!</p>
      </div>
    )
  }

  return (
    <div className="idea-list">
      {ideas.map((idea) => (
        <IdeaCard 
          key={idea.id} 
          idea={idea} 
          onVote={onVote}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}


import { Idea } from '../types'
import './IdeaCard.css'

interface IdeaCardProps {
  idea: Idea
  onVote: (id: number) => void
  onDelete: (id: number) => void
}

export default function IdeaCard({ idea, onVote, onDelete }: IdeaCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="idea-card">
      <div className="vote-section">
        <button 
          className="vote-button"
          onClick={() => onVote(idea.id)}
          aria-label="Upvote"
        >
          ▲
        </button>
        <span className="vote-count">{idea.votes}</span>
      </div>

      <div className="idea-content">
        <h3 className="idea-title">{idea.title}</h3>
        {idea.description && (
          <p className="idea-description">{idea.description}</p>
        )}
        <div className="idea-meta">
          <span className="idea-date">{formatDate(idea.created_at)}</span>
        </div>
      </div>

      <div className="idea-actions">
        <button 
          className="delete-button"
          onClick={() => {
            if (confirm('Are you sure you want to delete this idea?')) {
              onDelete(idea.id)
            }
          }}
          aria-label="Delete idea"
          title="Delete idea"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}


import { useState, FormEvent } from 'react'
import './IdeaForm.css'

interface IdeaFormProps {
  onSubmit: (title: string, description: string) => Promise<void>
}

export default function IdeaForm({ onSubmit }: IdeaFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(title, description)
      setTitle('')
      setDescription('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="idea-form-container">
      <h2>✨ Submit Your Idea</h2>
      <form onSubmit={handleSubmit} className="idea-form">
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your idea title"
            required
            disabled={submitting}
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details (optional)"
            disabled={submitting}
            rows={4}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={submitting || !title.trim()}
        >
          {submitting ? '📤 Submitting...' : '🚀 Submit Idea'}
        </button>
      </form>
    </div>
  )
}


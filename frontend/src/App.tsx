import { useState, useEffect } from 'react'
import './App.css'
import IdeaList from './components/IdeaList'
import IdeaForm from './components/IdeaForm'
import SearchBar from './components/SearchBar'
import { Idea } from './types'

function App() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchIdeas = async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const url = search 
        ? `/api/ideas?search=${encodeURIComponent(search)}`
        : '/api/ideas'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch ideas')
      }
      
      const data = await response.json()
      setIdeas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas(searchTerm)
  }, [searchTerm])

  const handleCreateIdea = async (title: string, description: string) => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        throw new Error('Failed to create idea')
      }

      await fetchIdeas(searchTerm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create idea')
    }
  }

  const handleVote = async (ideaId: number) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      // Update the idea in the local state
      setIdeas(prevIdeas => {
        const updatedIdeas = prevIdeas.map(idea =>
          idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
        )
        // Re-sort by votes (desc) then by created_at (desc)
        return updatedIdeas.sort((a, b) => {
          if (b.votes !== a.votes) {
            return b.votes - a.votes
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote')
    }
  }

  const handleDelete = async (ideaId: number) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete idea')
      }

      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete idea')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💡 Vote Board</h1>
        <p>Share your ideas and vote for your favorites!</p>
      </header>

      <div className="app-content">
        <IdeaForm onSubmit={handleCreateIdea} />
        
        <div className="ideas-section">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <IdeaList 
            ideas={ideas} 
            loading={loading}
            onVote={handleVote}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default App


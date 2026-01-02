'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

  // Crée le projet
    console.log('User ID:', session.user.id)
    console.log('Données:', { name, description, user_id: session.user.id })

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        user_id: session.user.id,
      })
      .select()
      .single()

    console.log('Réponse Supabase:', { project, error })

    if (error || !project) {
      console.error('Erreur création projet:', error)
      alert('Erreur: ' + (error?.message || 'Projet non créé'))
      setLoading(false)
      return
    }

    // Crée les blocs par défaut
    await supabase.from('blocks').insert([
      { project_id: project.id, tab: 'objectifs', type: 'problem', content: '', order: 1 },
      { project_id: project.id, tab: 'objectifs', type: 'solution', content: '', order: 2 },
      { project_id: project.id, tab: 'objectifs', type: 'kpis', content: '', order: 3 },
      { project_id: project.id, tab: 'architecture', type: 'stack', content: '', order: 1 },
    ])

    router.push(`/project/${project.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
        </div>
      </header>

      {/* Formulaire */}
      <main className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Nouveau projet</h1>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du projet
            </label>
            <Input
              type="text"
              placeholder="Ex: Hub, COCKPIT, App Mobile..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              type="text"
              placeholder="Une courte description du projet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer le projet'}
          </Button>
        </form>
      </main>
    </div>
  )
}
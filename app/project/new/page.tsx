'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

const PROJECT_TYPES = [
  { value: 'plateforme', label: 'Plateforme', description: 'App avec plusieurs modules' },
  { value: 'landing', label: 'Landing Page', description: 'Page unique, souvent A/B test' },
  { value: 'dashboard', label: 'Dashboard', description: 'Visualisation de données' },
  { value: 'outil', label: 'Outil interne', description: 'App métier spécifique' },
  { value: 'integration', label: 'Intégration', description: 'Connecteur, API, automatisation' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('outil')
  const [hasModules, setHasModules] = useState(false)
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
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        type,
        has_modules: hasModules,
        user_id: session.user.id,
      })
      .select()
      .single()

    if (error || !project) {
      console.error('Erreur création projet:', error)
      alert('Erreur: ' + (error?.message || 'Projet non créé'))
      setLoading(false)
      return
    }

    // Si pas de modules, crée les blocs par défaut sur le projet
    if (!hasModules) {
      await supabase.from('blocks').insert([
        { project_id: project.id, tab: 'objectifs', type: 'problem', content: '', order: 1 },
        { project_id: project.id, tab: 'objectifs', type: 'solution', content: '', order: 2 },
        { project_id: project.id, tab: 'objectifs', type: 'kpis', content: '', order: 3 },
        { project_id: project.id, tab: 'architecture', type: 'stack', content: '', order: 1 },
      ])
    }

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
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du projet
            </label>
            <Input
              type="text"
              placeholder="Ex: Hub, COCKPIT, LP Mode..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12"
            />
          </div>

          {/* Description */}
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

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de projet
            </label>
            <div className="grid gap-2">
              {PROJECT_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    type === t.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={type === t.value}
                    onChange={(e) => setType(e.target.value)}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{t.label}</div>
                    <div className="text-sm text-gray-500">{t.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Avec modules */}
          <div>
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
              <div>
                <div className="font-medium text-gray-900">Avec modules</div>
                <div className="text-sm text-gray-500">Le projet contient plusieurs sous-parties</div>
              </div>
              <input
                type="checkbox"
                checked={hasModules}
                onChange={(e) => setHasModules(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>
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
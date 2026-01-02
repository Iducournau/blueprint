'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

type Project = {
  id: string
  name: string
  description: string
}

export default function HomePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  // Vérifie l'auth + charge les projets
  useEffect(() => {
    const checkAuthAndLoadProjects = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUserEmail(session.user.email || '')

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setProjects(data || [])
      setLoading(false)
    }

    checkAuthAndLoadProjects()
  }, [router])

  // Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Supprimer un projet
  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return

    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter(p => p.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 
            className="text-2xl text-gray-900"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Cockpit.
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Mes projets</h2>
          <Button onClick={() => router.push('/project/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </Button>
        </div>

        {/* Liste des projets */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucun projet pour l'instant</p>
            <Button onClick={() => router.push('/project/new')}>
              Créer mon premier projet
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(project.id)
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
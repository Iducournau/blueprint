'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ArrowLeft } from 'lucide-react'

type Project = {
  id: string
  name: string
  description: string
}

type Block = {
  id: string
  project_id: string
  tab: string
  type: string
  content: string
  order: number
}

const blockLabels: Record<string, string> = {
  problem: 'Problème',
  solution: 'Solution',
  kpis: 'KPIs',
  stack: 'Stack technique',
}

export default function ProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  // Drawer state
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  // Charge le projet et les blocs
  useEffect(() => {
    const loadProject = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      // Charge le projet
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (!projectData) {
        router.push('/')
        return
      }

      setProject(projectData)

      // Charge les blocs
      const { data: blocksData } = await supabase
        .from('blocks')
        .select('*')
        .eq('project_id', projectId)
        .order('order', { ascending: true })

      setBlocks(blocksData || [])
      setLoading(false)
    }

    loadProject()
  }, [projectId, router])

  // Ouvre le drawer
  const openDrawer = (block: Block) => {
    setEditingBlock(block)
    setEditContent(block.content)
  }

  // Ferme le drawer
  const closeDrawer = () => {
    setEditingBlock(null)
    setEditContent('')
  }

  // Sauvegarde le bloc
  const saveBlock = async () => {
    if (!editingBlock) return

    setSaving(true)

    await supabase
      .from('blocks')
      .update({ content: editContent })
      .eq('id', editingBlock.id)

    // Met à jour localement
    setBlocks(blocks.map(b => 
      b.id === editingBlock.id ? { ...b, content: editContent } : b
    ))

    setSaving(false)
    closeDrawer()
  }

  // Filtre les blocs par onglet
  const getBlocksByTab = (tab: string) => {
    return blocks.filter(b => b.tab === tab)
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
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 
                className="text-xl text-gray-900"
                style={{ fontFamily: 'var(--font-dm-serif)' }}
              >
                {project?.name}
              </h1>
              <p className="text-sm text-gray-500">{project?.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu avec onglets */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="objectifs">
          <TabsList className="mb-6">
            <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="objectifs">
            <div className="grid gap-4">
              {getBlocksByTab('objectifs').map((block) => (
                <Card 
                  key={block.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openDrawer(block)}
                >
                  <CardContent className="p-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {blockLabels[block.type] || block.type}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {block.content || 'Cliquez pour éditer...'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="architecture">
            <div className="grid gap-4">
              {getBlocksByTab('architecture').map((block) => (
                <Card 
                  key={block.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openDrawer(block)}
                >
                  <CardContent className="p-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {blockLabels[block.type] || block.type}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {block.content || 'Cliquez pour éditer...'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

{/* Drawer d'édition */}
<Sheet open={!!editingBlock} onOpenChange={(open) => !open && closeDrawer()}>
  <SheetContent className="w-[400px] sm:w-[540px] p-0">
    <div className="p-6 border-b border-gray-100">
      <SheetHeader>
        <SheetTitle>
          {editingBlock ? blockLabels[editingBlock.type] || editingBlock.type : ''}
        </SheetTitle>
      </SheetHeader>
    </div>
    
    <div className="p-6 space-y-6">
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        placeholder="Écris ici..."
        className="w-full h-72 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
      />
      
      <div className="flex gap-3">
        <Button 
          onClick={saveBlock} 
          disabled={saving}
          className="flex-1"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button 
          variant="outline" 
          onClick={closeDrawer}
        >
          Annuler
        </Button>
      </div>
    </div>
  </SheetContent>
</Sheet>
    </div>
  )
}
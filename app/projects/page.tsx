'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
}

type FilterStatus = 'all' | 'cadrage' | 'conception' | 'dev' | 'recette' | 'live' | 'pause' | 'abandoned';

const PROJECT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  cadrage: { label: 'Cadrage', color: 'bg-yellow-100 text-yellow-800' },
  conception: { label: 'Conception', color: 'bg-blue-100 text-blue-800' },
  dev: { label: 'Développement', color: 'bg-orange-100 text-orange-800' },
  recette: { label: 'Recette', color: 'bg-purple-100 text-purple-800' },
  live: { label: 'Live', color: 'bg-green-100 text-green-800' },
  pause: { label: 'En pause', color: 'bg-muted text-muted-foreground' },
  abandoned: { label: 'Abandonné', color: 'bg-muted text-muted-foreground' },
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  plateforme: 'Plateforme',
  landing: 'Landing Page',
  dashboard: 'Dashboard',
  outil: 'Outil interne',
  integration: 'Intégration',
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } else {
      setProjects(data || []);
    }
    
    setLoading(false);
  }

  // Filtrer les projets selon le statut sélectionné
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  // Compter les projets par statut
  const counts = {
    all: projects.length,
    cadrage: projects.filter(p => p.status === 'cadrage').length,
    conception: projects.filter(p => p.status === 'conception').length,
    dev: projects.filter(p => p.status === 'dev').length,
    recette: projects.filter(p => p.status === 'recette').length,
    live: projects.filter(p => p.status === 'live').length,
  };

  const tabs = [
    { value: 'all', label: 'Tous', count: counts.all },
    { value: 'cadrage', label: 'Cadrage', count: counts.cadrage },
    { value: 'conception', label: 'Conception', count: counts.conception },
    { value: 'dev', label: 'Dev', count: counts.dev },
    { value: 'recette', label: 'Recette', count: counts.recette },
    { value: 'live', label: 'Live', count: counts.live },
  ];

  return (
    <div className="p-8">
      {/* Header avec titre et actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-dm-serif text-3xl text-foreground">Projets</h1>
          <p className="text-muted-foreground mt-1">Ce qu'on construit</p>
        </div>
        <Button onClick={() => router.push('/projects/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {/* Tabs inline */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as FilterStatus)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              filter === tab.value
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            <span className={cn(
              'ml-2 px-1.5 py-0.5 rounded-full text-xs',
              filter === tab.value
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}>
              {tab.count}
            </span>
            {filter === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Liste des projets */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {filter === 'all' 
              ? 'Aucun projet pour le moment' 
              : `Aucun projet "${PROJECT_STATUS_CONFIG[filter]?.label || filter}"`
            }
          </p>
          <Button variant="outline" onClick={() => router.push('/projects/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Créer le premier projet
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => {
            const statusConfig = PROJECT_STATUS_CONFIG[project.status] || { label: project.status, color: 'bg-muted text-muted-foreground' };
            return (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusConfig.color)}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <CardDescription>
                    {PROJECT_TYPE_LABELS[project.type] || project.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || 'Aucune description'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Rocket, Plus, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalBriefs: number;
  pendingBriefs: number;
  totalProjects: number;
  activeProjects: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBriefs: 0,
    pendingBriefs: 0,
    totalProjects: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    // Fetch briefs
    const { data: briefs } = await supabase.from('briefs').select('status');
    const totalBriefs = briefs?.length || 0;
    const pendingBriefs = briefs?.filter(b => b.status === 'pending_analysis').length || 0;

    // Fetch projects
    const { data: projects } = await supabase.from('projects').select('status');
    const totalProjects = projects?.length || 0;
    const activeProjects = projects?.filter(p => 
      ['cadrage', 'conception', 'dev', 'recette'].includes(p.status)
    ).length || 0;

    setStats({ totalBriefs, pendingBriefs, totalProjects, activeProjects });
    setLoading(false);
  }

  return (
    <div className="p-8">
      {/* Header avec titre et actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-dm-serif text-3xl text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de vos projets Blueprint</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/briefs/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau brief
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Briefs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Briefs
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBriefs}</div>
          </CardContent>
        </Card>

        {/* Pending Briefs */}
        <Card className={stats.pendingBriefs > 0 ? 'border-primary/50 bg-primary/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente d'analyse
            </CardTitle>
            <Clock className={`h-4 w-4 ${stats.pendingBriefs > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.pendingBriefs > 0 ? 'text-primary' : ''}`}>
              {stats.pendingBriefs}
            </div>
            {stats.pendingBriefs > 0 && (
              <Link href="/briefs?status=pending_analysis" className="text-sm text-primary hover:underline">
                Voir les briefs →
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Total Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projets
            </CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projets actifs
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            {stats.activeProjects > 0 && (
              <Link href="/projects" className="text-sm text-primary hover:underline">
                Voir les projets →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Activité récente</h2>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            L'historique d'activité sera disponible prochainement.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

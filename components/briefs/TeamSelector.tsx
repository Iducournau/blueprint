'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'

// Configuration des tags — tous au même niveau, ordre alphabétique
const TEAMS = [
  { value: 'apprenants', label: 'Apprenants' },
  { value: 'coachs', label: 'Coachs' },
  { value: 'cm', label: 'CM' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'conseillers', label: "Conseillers d'Admissions" },
  { value: 'developpeurs', label: 'Développeurs' },
  { value: 'direction', label: 'Direction' },
  { value: 'integrateurs', label: 'Intégrateurs' },
  { value: 'it', label: 'IT' },
  { value: 'pedagogique', label: 'Pédagogique' },
  { value: 'plateforme', label: 'Plateforme' },
  { value: 'produit', label: 'Produit' },
  { value: 'recouvrement', label: 'Recouvrement' },
  { value: 'sea', label: 'SEA' },
  { value: 'seo', label: 'SEO' },
  { value: 'ux', label: 'UX' },
  { value: 'webmarketing', label: 'Webmarketing' },
]

// Relations parent → enfants (logique backend)
export const TEAM_HIERARCHY: Record<string, string[]> = {
  commerce: ['conseillers', 'recouvrement'],
  it: ['developpeurs', 'integrateurs'],
  plateforme: ['coachs', 'produit'],
  webmarketing: ['cm', 'sea', 'seo', 'ux'],
}

interface TeamSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export default function TeamSelector({
  value,
  onChange,
  placeholder = 'Rechercher une équipe...',
}: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus sur l'input à l'ouverture
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const toggle = (teamValue: string) => {
    if (value.includes(teamValue)) {
      onChange(value.filter((v) => v !== teamValue))
    } else {
      onChange([...value, teamValue])
    }
  }

  const remove = (teamValue: string) => {
    onChange(value.filter((v) => v !== teamValue))
  }

  const getLabel = (teamValue: string) => {
    return TEAMS.find((t) => t.value === teamValue)?.label || teamValue
  }

  const filteredTeams = TEAMS.filter((team) =>
    team.label.toLowerCase().includes(search.toLowerCase())
  )

  const availableTeams = filteredTeams.filter((team) => !value.includes(team.value))

  return (
    <div ref={containerRef} className="relative">
      {/* Zone des tags + input */}
      <div
        className={`min-h-[48px] p-2 bg-white border rounded-lg flex flex-wrap gap-2 items-center cursor-text transition-colors ${
          isOpen ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
        }`}
        onClick={() => setIsOpen(true)}
      >
        {/* Tags sélectionnés */}
        {value.map((teamValue) => (
          <span
            key={teamValue}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
          >
            {getLabel(teamValue)}
            <button
              onClick={(e) => {
                e.stopPropagation()
                remove(teamValue)
              }}
              className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input de recherche */}
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={value.length === 0 ? placeholder : 'Ajouter...'}
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
            onClick={(e) => e.stopPropagation()}
          />
        ) : value.length === 0 ? (
          <span className="text-gray-400 text-sm px-1">{placeholder}</span>
        ) : null}

        {/* Chevron */}
        <div className="ml-auto pl-2">
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto p-1">
            {availableTeams.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                {search ? 'Aucun résultat' : 'Toutes les équipes sont sélectionnées'}
              </div>
            ) : (
              availableTeams.map((team) => (
                <button
                  key={team.value}
                  onClick={() => {
                    toggle(team.value)
                    setSearch('')
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-900">{team.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PERIODS } from '../../services/period/periodService';
import { GET_PROJECTS } from '../../services/proyect/ProyectService';

type DocumentFilterProps = {
  filters: {
    periodYear: string;
    periodSemester: string;
    documentType: string;
    searchTerm: string;
    projectName: string;
  };
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const allowedTypes = [
  'Presupuesto',
  'Lista de participantes',
  'Fotos',
  'Memorando de gestión',
  'Artes gráficos de difusión',
];

const DocumentFilter: React.FC<DocumentFilterProps> = ({ filters, onFilterChange }) => {
  const { data: periodData, loading: periodLoading } = useQuery(GET_PERIODS);
  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECTS);

  if (periodLoading || projectLoading) {
    return <div>Loading...</div>;
  }

  // Extraemos los años y semestres y eliminamos duplicados usando Set
  const years = Array.from(new Set(periodData.listPeriods.items.map((item: { year: string }) => item.year))).map(String);
  const semesters = periodData.listPeriods.items.map((item: { semester: string }) => item.semester);
  const projects = projectData.listProyects.items.map((item: { name: string }) => item.name);

  return (
    <div className="flex gap-4 mb-4 pt-4">
      <select
        name="periodYear"
        value={filters.periodYear}
        onChange={onFilterChange}
        className="border p-2 rounded bg-light"
      >
        {years.map((year: string) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        name="periodSemester"
        value={filters.periodSemester}
        onChange={onFilterChange}
        className="border p-2 rounded bg-light"
      >
        {semesters.map((semester: string) => (
          <option key={semester} value={semester}>
            {semester === '1' ? 'Semestre 1' : 'Semestre 2'}
          </option>
        ))}
      </select>

      <select
        name="documentType"
        value={filters.documentType}
        onChange={onFilterChange}
        className="border p-2 rounded bg-light"
      >
        <option value="">Todos los tipos</option>
        {allowedTypes.map((type: string) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        name="projectName"
        value={filters.projectName}
        onChange={onFilterChange}
        className="border p-2 rounded bg-light"
      >
        <option value="">Todos los proyectos</option>
        {projects.map((project: string) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="searchTerm"
        value={filters.searchTerm}
        onChange={onFilterChange}
        placeholder="Buscar por nombre o tags"
        className="border p-2 rounded w-60 bg-light"
      />
    </div>
  );
};

export default DocumentFilter;

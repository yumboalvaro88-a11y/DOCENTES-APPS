import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Search,
  Edit2,
  Trash2,
  Mail,
  CreditCard,
  Download,
} from 'lucide-react';
import { Course, Student } from '../types.ts';
import { ExcelImportModal } from './ExcelImportModal.tsx';
import { downloadStudentTemplate } from '../utils/excelParser.ts';

interface StudentsManagerProps {
  course: Course;
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'courseId' | 'orderIndex'>) => void;
  onImportBatchStudents: (students: Omit<Student, 'id' | 'courseId' | 'orderIndex'>[]) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  course,
  students,
  onAddStudent,
  onImportBatchStudents,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Student Form
  const [idNumber, setIdNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter(
      s =>
        s.lastName.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.idNumber.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q))
    );
  }, [students, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanId = idNumber.trim();
    if (!cleanId || !lastName.trim() || !firstName.trim()) {
      setFormError('Por favor completa todos los campos requeridos.');
      return;
    }

    // Check duplicate ID in course
    const exists = students.some(
      s => s.idNumber.toLowerCase() === cleanId.toLowerCase()
    );
    if (exists) {
      setFormError(`La cédula "${cleanId}" ya está registrada en este curso.`);
      return;
    }

    onAddStudent({
      idNumber: cleanId,
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      email: email.trim() || undefined,
    });

    setIdNumber('');
    setLastName('');
    setFirstName('');
    setEmail('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Nómina de Estudiantes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Curso: <strong>{course.name}</strong> • Total matriculados: <strong>{students.length}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadStudentTemplate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Descargar Plantilla Excel</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Importar Nómina (.xlsx)</span>
          </button>

          <button
            onClick={() => {
              setFormError(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar Manual</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar estudiante por apellidos, nombres o cédula..."
          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 w-12 text-center">N.º</th>
                <th className="px-4 py-3">Cédula / Documento</th>
                <th className="px-4 py-3">Apellidos y Nombres</th>
                <th className="px-4 py-3">Correo Electrónico</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron estudiantes. Agrega alumnos o importa desde Excel.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{student.idNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {student.lastName} {student.firstName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {student.email ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{student.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No registrado</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingStudent(student)}
                          title="Editar estudiante"
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar al estudiante ${student.lastName} ${student.firstName} y todas sus calificaciones?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          title="Eliminar estudiante"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Registrar Nuevo Estudiante
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ingresa los datos personales del estudiante para matricularlo en {course.name}.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cédula o Documento de Identidad *
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  placeholder="Ej: 1718293041"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Apellidos Completos *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Ej: Pérez Rodríguez"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres Completos *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Ej: Juan Andrés"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="juan.perez@colegio.edu"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Guardar Estudiante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Editar Datos del Estudiante
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Modifica la cédula, nombres o correo electrónico.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cédula / Documento
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.idNumber}
                  onChange={e => setEditingStudent({ ...editingStudent, idNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Apellidos
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.lastName}
                  onChange={e => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.firstName}
                  onChange={e => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={editingStudent.email || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      <ExcelImportModal
        course={course}
        existingStudents={students}
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onConfirmImport={onImportBatchStudents}
      />
    </div>
  );
};

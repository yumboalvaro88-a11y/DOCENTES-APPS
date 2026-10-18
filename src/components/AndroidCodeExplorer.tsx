import React, { useState } from 'react';
import {
  Smartphone,
  FolderTree,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  BookOpen,
  Code2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_FILES, AndroidFile } from '../data/androidProjectFiles.ts';

export const AndroidCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Create root README.md
      zip.file(
        'README.md',
        `# Registro de Calificaciones - Android App

Aplicación completa para docentes desarrollada con:
- Kotlin 2.0
- Jetpack Compose + Material 3
- Room Database (6 entidades, claves foráneas, índices)
- Dagger Hilt para Inyección de Dependencias
- Apache POI para lectura de archivos Excel (.xlsx y .xls)
- Storage Access Framework (SAF) para acceso a archivos sin permisos intrusivos
- Arquitectura limpia MVVM + Repositorio + StateFlow reactivo

## Pasos para compilar en Android Studio
1. Descomprime esta carpeta.
2. Abre Android Studio Ladybug (o superior).
3. Selecciona 'Open' y elige esta carpeta.
4. Espera a que Gradle sincronice las dependencias ('Sync Project with Gradle Files').
5. Conecta un dispositivo físico o inicia un emulador Android (API 24 o superior).
6. Presiona el botón verde 'Run' (Shift + F10) o ejecuta en terminal:
   \`\`\`bash
   ./gradlew assembleDebug
   \`\`\`
7. El APK generado se encontrará en:
   \`app/build/outputs/apk/debug/app-debug.apk\`
`
      );

      // Add each file in appropriate path
      ANDROID_FILES.forEach(file => {
        let fullZipPath = file.path;
        if (file.path.startsWith('build.gradle.kts (Project)')) {
          fullZipPath = 'build.gradle.kts';
        }
        zip.file(fullZipPath, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RegistroCalificaciones_Android_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Todos los archivos' },
    { id: 'screen', label: 'Pantallas Compose' },
    { id: 'entity', label: 'Entidades Room' },
    { id: 'dao', label: 'DAOs Room' },
    { id: 'excel', label: 'Importador Excel (POI)' },
    { id: 'logic', label: 'Cálculo y Lógica' },
    { id: 'repository', label: 'Repositorio' },
    { id: 'viewmodel', label: 'ViewModels Hilt' },
    { id: 'config', label: 'Gradle & Config' },
    { id: 'manifest', label: 'Manifest' },
  ];

  const filteredFiles = ANDROID_FILES.filter(
    f => activeCategory === 'all' || f.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-3.5 h-3.5" />
              Arquitectura Android Senior
            </span>
            <span className="text-xs text-slate-400">Kotlin • Jetpack Compose Material 3 • Room • Hilt</span>
          </div>
          <h2 className="text-xl font-bold">
            Código Fuente Completo para Android Studio
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Explora el código fuente real, sin omisiones ni partes incompletas. Puedes inspeccionar cada archivo, copiarlo o descargar el proyecto completo empaquetado en .zip.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Empaquetando ZIP...' : 'Descargar Proyecto Android (.zip)'}</span>
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main File Explorer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: File List (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col h-[650px]">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-blue-500" />
              <span>Archivos ({filteredFiles.length})</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredFiles.map(file => {
              const isSelected = file.path === selectedFile.path;

              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                        {file.path}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Code Viewer & Actions (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col h-[650px]">
          {/* Header of code viewer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate block">
                {selectedFile.path}
              </span>
              <span className="text-[11px] text-slate-500 truncate block">
                {selectedFile.description}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-300 dark:border-slate-600 shrink-0 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Archivo'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs text-slate-200 leading-relaxed">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Step-by-Step Android Studio Build Guide */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Terminal className="w-5 h-5 text-blue-600" />
          <span>Guía Paso a Paso para Compilar y Generar el APK en Android Studio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center mb-2">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Abrir y Sincronizar
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              Descarga el .zip del proyecto con el botón superior, descomprímelo y en Android Studio selecciona <strong>File &gt; Open</strong>. Permite que Gradle descargue las dependencias (Room, Compose, Hilt, Apache POI).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center mb-2">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Compilar y Probar
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              Conecta tu teléfono Android con depuración USB activada o inicia un Emulador con API 24 o superior. Presiona el botón verde <strong>Run (Shift + F10)</strong> para instalarlo directamente.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center mb-2">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Generar APK Final
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              En el menú superior selecciona <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>, o ejecuta en la pestaña Terminal:
              <code className="block mt-1 font-mono text-[11px] p-1.5 rounded bg-slate-200 dark:bg-slate-900 text-blue-700 dark:text-blue-300">
                ./gradlew assembleRelease
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

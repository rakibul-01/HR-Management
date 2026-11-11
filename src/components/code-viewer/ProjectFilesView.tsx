import React, { useState } from 'react';
import { PHP_PROJECT_FILES, ProjectFile } from '../../data/phpProjectFiles';
import { useHR } from '../../context/HRContext';
import { FileCode, Copy, Check, Download, Folder } from 'lucide-react';
import JSZip from 'jszip';

export const ProjectFilesView: React.FC = () => {
  const { showToast } = useHR();
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PHP_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    showToast(`Copied ${selectedFile.name} to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder('hr-dashboard');

      PHP_PROJECT_FILES.forEach(file => {
        folder?.file(file.path, file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hr-dashboard-php-mysql.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Downloaded hr-dashboard-php-mysql.zip successfully.');
    } catch (e) {
      console.error(e);
      showToast('Failed to create ZIP file.', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  const categories = Array.from(new Set(PHP_PROJECT_FILES.map(f => f.category)));

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-500" />
            PHP 8+ & MySQL Deliverables Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, copy, or download all generated PHP, SQL, CSS, JS, and documentation files configured for local deployment with XAMPP or PHP built-in server.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Packaging ZIP...' : 'Download Project ZIP'}</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* File Tree Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs overflow-y-auto max-h-[640px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Project Architecture
          </h3>

          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Folder className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{cat}</span>
                </div>
                <div className="pl-2 space-y-0.5">
                  {PHP_PROJECT_FILES.filter(f => f.category === cat).map(file => {
                    const isSelected = selectedFile.path === file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between
                          ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        <span className="truncate">{file.path}</span>
                        <span className="text-[10px] uppercase opacity-60 ml-2">{file.language}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Content Column */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col max-h-[640px]">
          {/* Code Header */}
          <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-xs text-slate-300 font-medium ml-2">
                hr-dashboard/{selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-900 selection:bg-indigo-600">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

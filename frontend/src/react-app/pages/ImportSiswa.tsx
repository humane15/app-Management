import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Upload, 
  Download,
  CheckCircle,
  AlertTriangle,
  Users,
  Eye,
  Trash2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

// Institution settings for Import
const INSTITUTION_SETTINGS = {
  useNIS: false, // Can be configured per institution
  pembangunanStages: 3
};

interface StudentImport {
  name: string;
  nis?: string; // Optional depending on institution
  category: 'Menetap' | 'Sekolah';
  class: string;
  monthlyFee: number;
  pembangunan1Fee: number;
  pembangunan2Fee: number;
  pembangunan3Fee: number;
  cateringFee: number;
  seragamFee: number;
  bukuFee: number;
  status?: 'valid' | 'warning' | 'error';
  errors?: string[];
}

const SAMPLE_IMPORT_DATA: StudentImport[] = [
  {
    name: 'Ahmad Fauzi',
    ...(INSTITUTION_SETTINGS.useNIS && { nis: 'NIS0001' }),
    category: 'Menetap',
    class: 'Tgk Ibnu',
    monthlyFee: 250000,
    pembangunan1Fee: 500000,
    pembangunan2Fee: 750000,
    pembangunan3Fee: 300000,
    cateringFee: 150000,
    seragamFee: 200000,
    bukuFee: 100000,
    status: 'valid'
  },
  {
    name: 'Siti Aisyah',
    ...(INSTITUTION_SETTINGS.useNIS && { nis: 'NIS0002' }),
    category: 'Sekolah',
    class: 'Tgk Ahmad',
    monthlyFee: 250000,
    pembangunan1Fee: 500000,
    pembangunan2Fee: 750000,
    pembangunan3Fee: 300000,
    cateringFee: 150000,
    seragamFee: 200000,
    bukuFee: 100000,
    status: 'valid'
  },
  {
    name: 'Muhammad Ali',
    ...(INSTITUTION_SETTINGS.useNIS && { nis: '' }),
    category: 'Menetap',
    class: 'Tgk Yusuf',
    monthlyFee: 250000,
    pembangunan1Fee: 500000,
    pembangunan2Fee: 750000,
    pembangunan3Fee: 300000,
    cateringFee: 150000,
    seragamFee: 200000,
    bukuFee: 100000,
    status: 'error',
    errors: INSTITUTION_SETTINGS.useNIS ? ['NIS tidak boleh kosong'] : []
  },
  {
    name: 'Fatimah Zahra',
    ...(INSTITUTION_SETTINGS.useNIS && { nis: 'NIS0001' }),
    category: 'Sekolah',
    class: 'Tgk Ali',
    monthlyFee: 250000,
    pembangunan1Fee: 500000,
    pembangunan2Fee: 750000,
    pembangunan3Fee: 300000,
    cateringFee: 150000,
    seragamFee: 200000,
    bukuFee: 100000,
    status: 'warning',
    errors: INSTITUTION_SETTINGS.useNIS ? ['NIS sudah ada dalam sistem'] : ['Data duplikat ditemukan']
  }
];

export default function ImportSiswa() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'success'>('upload');
  const [importData, setImportData] = useState<StudentImport[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFileSelect = () => {
    // Simulate CSV parsing - in real app, parse the actual CSV
    setTimeout(() => {
      setImportData(SAMPLE_IMPORT_DATA);
      setStep('preview');
    }, 1000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileSelect();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect();
    }
  };

  const downloadTemplate = () => {
    const headers = INSTITUTION_SETTINGS.useNIS 
      ? 'name,nis,category,class,monthlyFee,pembangunan1Fee,pembangunan2Fee,pembangunan3Fee,cateringFee,seragamFee,bukuFee'
      : 'name,category,class,monthlyFee,pembangunan1Fee,pembangunan2Fee,pembangunan3Fee,cateringFee,seragamFee,bukuFee';
    
    const sampleRows = INSTITUTION_SETTINGS.useNIS
      ? `Ahmad Fauzi,NIS0001,Menetap,Tgk Ibnu,250000,500000,750000,300000,150000,200000,100000
Siti Aisyah,NIS0002,Sekolah,Tgk Ahmad,250000,500000,750000,300000,150000,200000,100000`
      : `Ahmad Fauzi,Menetap,Tgk Ibnu,250000,500000,750000,300000,150000,200000,100000
Siti Aisyah,Sekolah,Tgk Ahmad,250000,500000,750000,300000,150000,200000,100000`;
    
    const csvContent = `${headers}
${sampleRows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'template_import_siswa.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const startImport = async () => {
    setStep('importing');
    setImportProgress(0);
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetImport = () => {
    setStep('upload');
    setImportData([]);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusStats = () => {
    const valid = importData.filter(item => item.status === 'valid').length;
    const warning = importData.filter(item => item.status === 'warning').length;
    const error = importData.filter(item => item.status === 'error').length;
    return { valid, warning, error, total: importData.length };
  };

  const stats = getStatusStats();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div>
                <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Import Data Siswa
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Upload dan kelola data siswa dari file CSV
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${step === 'upload' ? 'bg-brand-600' : 'bg-slate-300'}`}></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Upload</span>
              </div>
              <div className="w-8 h-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${step === 'preview' ? 'bg-brand-600' : 'bg-slate-300'}`}></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Preview</span>
              </div>
              <div className="w-8 h-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${step === 'importing' || step === 'success' ? 'bg-brand-600' : 'bg-slate-300'}`}></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Import</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Step */}
        {step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            {/* Instructions */}
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm mb-6">
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Panduan Import
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">1</span>
                  </div>
                  <p>Download template CSV untuk melihat format yang benar</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">2</span>
                  </div>
                  <p>Isi data siswa sesuai kolom: Nama, {INSTITUTION_SETTINGS.useNIS ? 'NIS, ' : ''}Kategori (Menetap/Sekolah), Kelas, SPP Bulanan, Uang Pembangunan (1-3), Uang Catering, Seragam, Buku</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">3</span>
                  </div>
                  <p>Upload file CSV untuk preview dan validasi sebelum import</p>
                </div>
              </div>
            </div>

            {/* Download Template */}
            <div className="mb-6">
              <button
                onClick={downloadTemplate}
                className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download Template CSV</span>
              </button>
            </div>

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragOver
                  ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-brand-300 dark:hover:border-brand-600'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Upload File CSV
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Drag & drop file CSV Anda di sini, atau klik untuk memilih file
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Maksimal ukuran file: 10MB • Format: .csv
              </div>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-dark-border p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Data</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-dark-border p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">{stats.valid}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Valid</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-dark-border p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                  <div>
                    <div className="text-2xl font-bold text-amber-600">{stats.warning}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Warning</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-dark-border p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                  <div>
                    <div className="text-2xl font-bold text-rose-600">{stats.error}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Error</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-dark-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Preview Data Import
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{showPreview ? 'Sembunyikan' : 'Tampilkan'} Detail</span>
                    </button>
                    <button
                      onClick={resetImport}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>

              {showPreview && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama</th>
                        {INSTITUTION_SETTINGS.useNIS && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">NIS</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kelas</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SPP</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-surface divide-y divide-slate-200 dark:divide-dark-border">
                      {importData.map((item, index) => (
                        <tr key={index} className={`${item.status === 'error' ? 'bg-rose-50 dark:bg-rose-900/10' : item.status === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.status === 'valid' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                            {item.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                            {item.status === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.name}
                          </td>
                          {INSTITUTION_SETTINGS.useNIS && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                              {item.nis || '-'}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              item.category === 'Menetap' 
                                ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                : 'bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400'
                            }`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                            {item.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 text-right">
                            {formatCurrency(item.monthlyFee)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {item.errors?.join(', ') || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 border-t border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between items-center">
                  <button
                    onClick={resetImport}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Upload Ulang</span>
                  </button>
                  
                  <div className="flex space-x-3">
                    {stats.error > 0 ? (
                      <div className="flex items-center space-x-2 text-rose-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Perbaiki error terlebih dahulu</span>
                      </div>
                    ) : (
                      <button
                        onClick={startImport}
                        className="flex items-center space-x-2 bg-gradient-brand text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-180 hover:-translate-y-0.5"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Import {stats.valid + stats.warning} Data</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Importing Step */}
        {step === 'importing' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              </div>
              
              <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Sedang Mengimpor Data...
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Mohon tunggu, data sedang diproses dan disimpan ke sistem
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-brand h-3 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {importProgress}% selesai
              </div>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              
              <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Import Berhasil!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {stats.valid + stats.warning} data siswa telah berhasil diimpor ke sistem
              </p>
              
              {/* Summary */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">Data Valid</div>
                    <div className="text-emerald-600">{stats.valid} siswa</div>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">Warning</div>
                    <div className="text-amber-600">{stats.warning} siswa</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={resetImport}
                  className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span>Import Lagi</span>
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 bg-gradient-brand text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-180 hover:-translate-y-0.5"
                >
                  <span>Kembali ke Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

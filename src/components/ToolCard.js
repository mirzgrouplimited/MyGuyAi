import { Link } from 'react-router-dom';
import { Minimize2, Maximize2, RefreshCw, FileImage, Combine, Crop, FileText, ArrowRight } from 'lucide-react';

const iconMap = {
  'compress-image': Minimize2,
  'resize-image': Maximize2,
  'jpg-to-png': RefreshCw,
  'png-to-jpg': RefreshCw,
  'image-to-pdf': FileImage,
  'compress-pdf': Minimize2,
  'merge-pdf': Combine,
  'crop-image': Crop
};

const colorMap = {
  'image-tools': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'hover:border-blue-300' },
  'pdf-tools': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'hover:border-orange-300' },
  'file-conversion-tools': { bg: 'bg-green-100', text: 'text-green-600', border: 'hover:border-green-300' }
};

export const ToolCard = ({ tool, compact = false }) => {
  const Icon = iconMap[tool.id] || FileText;
  const colors = colorMap[tool.category] || colorMap['image-tools'];

  if (compact) {
    return (
      <Link to={`/${tool.slug}`} data-testid={`tool-card-${tool.id}`}>
        <div className={`group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md ${colors.border} transition-all`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              <Icon size={20} className={colors.text} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm truncate">{tool.name}</h4>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/${tool.slug}`} data-testid={`tool-card-${tool.id}`}>
      <div className={`group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg ${colors.border} hover:-translate-y-1 transition-all`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Icon size={24} className={colors.text} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{tool.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ToolCategory = ({ category }) => {
  const colors = colorMap[category.id] || colorMap['image-tools'];

  return (
    <div className="mb-12" data-testid={`category-${category.id}`}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.tools?.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

import { Link } from 'react-router-dom';
import { ArrowRight, Minimize2, Maximize2, RefreshCw, FileImage, Combine, Crop, User } from 'lucide-react';

const TOOL_INFO = {
  'compress-image': { name: 'Compress Image', icon: Minimize2 },
  'resize-image': { name: 'Resize Image', icon: Maximize2 },
  'crop-image': { name: 'Crop Image', icon: Crop },
  'passport-photo': { name: 'Passport Photo Maker', icon: User },
  'jpg-to-png': { name: 'JPG to PNG', icon: RefreshCw },
  'png-to-jpg': { name: 'PNG to JPG', icon: RefreshCw },
  'image-to-pdf': { name: 'Image to PDF', icon: FileImage },
  'compress-pdf': { name: 'Compress PDF', icon: Minimize2 },
  'merge-pdf': { name: 'Merge PDF', icon: Combine },
};

export const RelatedTools = ({ tools, title = "Related Tools" }) => {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="mt-16" data-testid="related-tools">
      <h2 className="text-xl font-bold text-slate-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((toolId) => {
          const tool = TOOL_INFO[toolId];
          if (!tool) return null;
          const Icon = tool.icon;
          
          return (
            <Link
              key={toolId}
              to={`/${toolId}`}
              className="group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Icon className="text-blue-600" size={20} />
              </div>
              <span className="font-medium text-slate-900 flex-1">{tool.name}</span>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

import { formatDate, getStatusColor } from '../../utils/formatters';
import Card from '../common/Card';

const RFPList = ({ rfps, onSelectRFP }) => {
  if (!rfps || rfps.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">No RFPs found. Create your first RFP!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rfps.map((rfp) => (
        <div
          key={rfp.id}
          onClick={(e) => {
            e.stopPropagation();
            console.log('RFP clicked:', rfp.id);
            onSelectRFP && onSelectRFP(rfp);
          }}
          className="cursor-pointer"
        >
        <Card 
          className="hover:shadow-xl hover:border-indigo-300 border-2 border-transparent transition-all duration-200 active:scale-[0.99]"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{rfp.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{rfp.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Created: {formatDate(rfp.created_at)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rfp.status)}`}>
                  {rfp.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-center gap-2">
              <span className="text-3xl">📝</span>
              <span className="text-xs text-indigo-600 font-semibold">Click to Send</span>
            </div>
          </div>
        </Card>
        </div>
      ))}
    </div>
  );
};

export default RFPList;

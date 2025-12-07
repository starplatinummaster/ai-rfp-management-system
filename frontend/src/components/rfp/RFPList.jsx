import { formatDate, getStatusColor } from '../../utils/formatters';
import Card from '../common/Card';
import Button from '../common/Button';

const RFPList = ({ rfps, onSelectRFP, onEdit }) => {
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
        <Card 
          key={rfp.id}
          className="hover:shadow-lg border-2 border-transparent transition-all duration-200"
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
              <div className="mt-3 flex gap-2">
                {onEdit && (
                  <Button
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); onEdit(rfp); }}
                    className="text-xs py-1 px-3"
                  >
                    Edit & Resend
                  </Button>
                )}
                {onSelectRFP && (
                  <Button
                    onClick={(e) => { e.stopPropagation(); onSelectRFP(rfp); }}
                    className="text-xs py-1 px-3"
                  >
                    📧 Send to Vendors
                  </Button>
                )}
              </div>
            </div>
            <div className="text-right flex flex-col items-center gap-2">
              <span className="text-3xl">📝</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RFPList;

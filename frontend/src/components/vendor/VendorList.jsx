import { formatPhone } from '../../utils/formatters';
import Card from '../common/Card';
import Button from '../common/Button';

const VendorList = ({ vendors, onSelectVendor, selectedVendors = [], sentVendorIds = [], onEdit, onDelete }) => {
  if (!vendors || vendors.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">No vendors found. Add your first vendor!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map((vendor) => {
        const isSelected = selectedVendors.includes(vendor.id);
        const alreadySent = sentVendorIds.includes(vendor.id);
        
        return (
          <Card
            key={vendor.id}
            className={`cursor-pointer transition duration-200 ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
            onClick={() => onSelectVendor && onSelectVendor(vendor.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
                {alreadySent && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                    ✓ Already Sent
                  </span>
                )}
              </div>
              {isSelected && <span className="text-blue-500 text-xl">✓</span>}
            </div>
            
            {(onEdit || onDelete) && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                {onEdit && (
                  <Button
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); onEdit(vendor); }}
                    className="text-xs py-1 px-3"
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); onDelete(vendor); }}
                    className="text-xs py-1 px-3 bg-red-100 hover:bg-red-200 text-red-700"
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>{vendor.email}</span>
              </div>
              
              {vendor.phone && (
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>{formatPhone(vendor.phone)}</span>
                </div>
              )}
              
              {vendor.category && (
                <div className="mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {vendor.category}
                  </span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default VendorList;

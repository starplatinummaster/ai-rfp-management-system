import { formatPhone } from '../../utils/formatters';
import Card from '../common/Card';

const VendorList = ({ vendors, onSelectVendor, selectedVendors = [] }) => {
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
        
        return (
          <Card
            key={vendor.id}
            className={`cursor-pointer transition duration-200 ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
            onClick={() => onSelectVendor && onSelectVendor(vendor.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
              {isSelected && <span className="text-blue-500 text-xl">✓</span>}
            </div>
            
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

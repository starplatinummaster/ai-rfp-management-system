import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../common/Card';

const ComparisonTable = ({ proposals, comparison }) => {
  if (!proposals || proposals.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">No proposals to compare yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation */}
      {comparison && (
        <Card className="bg-blue-50 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-3">🤖 AI Recommendation</h3>
          <p className="text-gray-700 mb-2"><strong>Summary:</strong> {comparison.summary}</p>
          <p className="text-gray-700">
            <strong>Recommended Vendor:</strong> Vendor #{comparison.recommendation?.vendor_id} - {comparison.recommendation?.reason}
          </p>
        </Card>
      )}

      {/* Proposals Table */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Proposal Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pricing</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Delivery</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Terms</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proposals.map((proposal) => {
                const structured = typeof proposal.structured_proposal === 'string' 
                  ? JSON.parse(proposal.structured_proposal) 
                  : proposal.structured_proposal;
                
                const scores = typeof proposal.ai_scores === 'string'
                  ? JSON.parse(proposal.ai_scores)
                  : proposal.ai_scores;

                return (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{proposal.vendor_name || `Vendor #${proposal.vendor_id}`}</div>
                      <div className="text-sm text-gray-500">{proposal.vendor_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">
                        {formatCurrency(structured?.pricing?.total)}
                      </div>
                      {structured?.pricing?.per_unit && (
                        <div className="text-sm text-gray-500">
                          {formatCurrency(structured.pricing.per_unit)} per unit
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {structured?.timeline?.delivery_date 
                        ? formatDate(structured.timeline.delivery_date)
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">
                        {structured?.terms?.payment || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {structured?.terms?.warranty || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-blue-600">
                          {scores?.overall_score?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">/10</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ComparisonTable;

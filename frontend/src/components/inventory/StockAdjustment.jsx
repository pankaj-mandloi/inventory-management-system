import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { FiPlus, FiMinus } from 'react-icons/fi';

const StockAdjustment = ({ product, onConfirm, onCancel }) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('increase');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (action === 'decrease' && formData.quantity > product.quantity) {
      newErrors.quantity = `Cannot reduce more than current stock (${product.quantity})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onConfirm({
        ...formData,
        quantity: parseInt(formData.quantity),
        action,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">Current Stock: {product.quantity}</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setAction('increase')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            action === 'increase'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FiPlus className="w-4 h-4" />
            Increase
          </div>
        </button>
        <button
          type="button"
          onClick={() => setAction('decrease')}
          disabled={product.quantity === 0}
          className={`flex-1 py-2 rounded-lg transition-all ${
            product.quantity === 0
              ? 'opacity-50 cursor-not-allowed'
              : action === 'decrease'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FiMinus className="w-4 h-4" />
            Decrease
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => {
            setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 });
            if (errors.quantity) setErrors({ ...errors, quantity: '' });
          }}
          error={errors.quantity}
          placeholder="Enter quantity"
          min="1"
          required
        />

        <Input
          label="Note (Optional)"
          name="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Add a note for this transaction..."
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant={action === 'increase' ? 'success' : 'danger'}
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            {action === 'increase' ? 'Add Stock' : 'Remove Stock'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StockAdjustment;
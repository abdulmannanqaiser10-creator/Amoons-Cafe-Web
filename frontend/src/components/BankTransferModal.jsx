import { useMemo, useState } from 'react';
import { formatPrice } from '../data/menu';

const BANK = {
  name: 'Meezan Bank',
  title: 'AMOONS',
  accountNumber: '01050114994547',
  iban: 'PK94MEZN0001050114994547',
};

function BankTransferModal({ open, total, onClose, onConfirm, submitting }) {
  const [receipt, setReceipt] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const amountLabel = useMemo(() => formatPrice(total), [total]);

  if (!open) return null;

  const copyText = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(''), 1600);
    } catch {
      setError('Could not copy. Please copy the details manually.');
    }
  };

  const onFile = (event) => {
    const file = event.target.files?.[0];
    setError('');
    if (!file) {
      setReceipt('');
      setReceiptName('');
      return;
    }
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Please upload an image or PDF receipt.');
      return;
    }
    if (file.size > 1_800_000) {
      setError('Receipt must be under 1.8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceipt(String(reader.result || ''));
      setReceiptName(file.name);
    };
    reader.onerror = () => setError('Could not read the receipt file.');
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setError('');
    if (!receipt) {
      setError('Please upload your payment receipt to continue.');
      return;
    }
    await onConfirm({ paymentReceipt: receipt });
  };

  return (
    <div className="ot-overlay pay-overlay" role="dialog" aria-modal="true">
      <div className="pay-modal">
        <header className="pay-head">
          <p className="ot-brand-mark font-serif">AMOONS</p>
          <h2>Complete your bank transfer</h2>
          <p>
            Transfer <strong>{amountLabel}</strong> to the account below, then
            upload your receipt for verification.
          </p>
        </header>

        <div className="pay-amount">
          <span>Order total</span>
          <strong>{amountLabel}</strong>
        </div>

        <dl className="pay-details">
          <div>
            <dt>Bank</dt>
            <dd>{BANK.name}</dd>
          </div>
          <div>
            <dt>Account Title</dt>
            <dd>{BANK.title}</dd>
          </div>
          <div>
            <dt>Account Number</dt>
            <dd>
              <span>{BANK.accountNumber}</span>
              <button
                type="button"
                className="pay-copy"
                onClick={() => copyText(BANK.accountNumber, 'account')}
              >
                {copied === 'account' ? 'Copied' : 'Copy Account Number'}
              </button>
            </dd>
          </div>
          <div>
            <dt>IBAN</dt>
            <dd>
              <span>{BANK.iban}</span>
              <button
                type="button"
                className="pay-copy"
                onClick={() => copyText(BANK.iban, 'iban')}
              >
                {copied === 'iban' ? 'Copied' : 'Copy IBAN'}
              </button>
            </dd>
          </div>
        </dl>

        <div className="pay-instructions">
          <p>1. Transfer the exact order total using Meezan Bank.</p>
          <p>2. Upload a clear screenshot or PDF of your payment receipt.</p>
          <p>3. Submit for verification — your order stays pending until confirmed.</p>
        </div>

        <label className="pay-upload">
          <span>Upload payment receipt *</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={onFile}
          />
          {receiptName ? (
            <em className="pay-upload-name">{receiptName}</em>
          ) : (
            <em>Image or PDF, max 1.8 MB</em>
          )}
        </label>

        {error ? (
          <p className="ot-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="pay-actions">
          <button
            type="button"
            className="hero-btn hero-btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="hero-btn hero-btn-primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BankTransferModal;

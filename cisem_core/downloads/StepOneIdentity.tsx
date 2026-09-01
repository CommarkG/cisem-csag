/**
 * CISEM B2B ERP — Onboarding Wizard Step One (Identity & Domain Selection)
 * Component: src/components/onboarding/StepOneIdentity.tsx
 * Ratified Plan: A5 Onboarding Wizard Step One (2026-09-01)
 * Theme: Enterprise Slate & Steel Blue
 */

'use client';

import React, { useState, useEffect } from 'react';

export interface DomainOption {
  code: string;
  label: string;
  default_service_models: string[];
  description: string;
}

export interface StepOnePayload {
  account_type: 'company' | 'private';
  company_name: string;
  tax_id: string;
  primary_email: string;
  cell_number: string;
  domain_code: string;
  country_code: string;
  currency_code: string;
}

interface StepOneIdentityProps {
  initialEmail?: string;
  onComplete?: (result: { tenant_id: string; payload: StepOnePayload }) => void;
  onSkip?: () => void;
}

export const StepOneIdentity: React.FC<StepOneIdentityProps> = ({
  initialEmail = '',
  onComplete,
  onSkip
}) => {
  const [accountType, setAccountType] = useState<'company' | 'private'>('company');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState(initialEmail);
  const [cellNumber, setCellNumber] = useState('');
  const [domainCode, setDomainCode] = useState('construction_contractor');
  const [countryCode, setCountryCode] = useState('IL');
  const [currencyCode, setCurrencyCode] = useState('ILS');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Platform Business Domains
  const domains: DomainOption[] = [
    {
      code: 'construction_contractor',
      label: 'Construction Contractor & Site Work',
      default_service_models: ['SRV', 'MTO'],
      description: 'Field contracting, installation, site services & custom fabrication.'
    },
    {
      code: 'custom_manufacturer',
      label: 'Custom Engraver & Manufacturer',
      default_service_models: ['MTO', 'STK'],
      description: 'Custom manufacturing, job shop production & inventory sales.'
    },
    {
      code: 'retail_wholesaler',
      label: 'Retail Wholesaler & Distributor',
      default_service_models: ['STK'],
      description: 'Warehouse inventory holding, B2B distribution & stock sales.'
    },
    {
      code: 'digital_agency',
      label: 'Software & Digital Service Delivery',
      default_service_models: ['DIG', 'SRV'],
      description: 'Software licensing, digital assets & remote digital services.'
    },
    {
      code: 'general_trade',
      label: 'General Trade & Commercial Contracting',
      default_service_models: ['STK', 'SRV'],
      description: 'General commercial trading, supply & field maintenance.'
    }
  ];

  const selectedDomain = domains.find(d => d.code === domainCode) || domains[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError(accountType === 'company' ? 'Company Legal Name is required.' : 'Full Legal Name is required.');
      return;
    }
    if (!primaryEmail.trim()) {
      setError('Primary Email is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload: StepOnePayload = {
      account_type: accountType,
      company_name: companyName.trim(),
      tax_id: taxId.trim(),
      primary_email: primaryEmail.trim(),
      cell_number: cellNumber.trim(),
      domain_code: domainCode,
      country_code: countryCode,
      currency_code: currencyCode
    };

    try {
      const res = await fetch('/api/provision_tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to complete tenant onboarding step 1.');
      }

      if (onComplete) {
        onComplete({ tenant_id: data.tenant_id, payload });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 font-sans">
      {/* STEP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-600 text-white mb-1">
            Step 1 of 6: Onboarding Core
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Business Identity & Operational Domain</h1>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Progress: 16%</span>
      </div>

      {error && (
        <div className="mb-4 p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ACCOUNT TYPE TOGGLE */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Account Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType('company')}
              className={`flex items-center gap-3 p-3.5 text-left border-2 rounded-lg transition-all ${
                accountType === 'company'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                accountType === 'company' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
              }`}>
                {accountType === 'company' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Company / Business</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Corporations, registered HP/VAT firms & trade businesses.</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('private')}
              className={`flex items-center gap-3 p-3.5 text-left border-2 rounded-lg transition-all ${
                accountType === 'private'
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                accountType === 'private' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
              }`}>
                {accountType === 'private' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Private Individual / Freelancer</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Sole proprietors, independent contractors & private buyers.</div>
              </div>
            </button>
          </div>
        </div>

        {/* DYNAMIC FORM FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* FIELD 1: NAME */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {accountType === 'company' ? 'Company Legal Name' : 'Full Legal Name'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder={accountType === 'company' ? 'e.g. Harel Projects Ltd' : 'e.g. Harel Natan'}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* FIELD 2: TAX ID / ID NUMBER */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {accountType === 'company' ? 'Tax ID / Business Registration (HP)' : 'National ID Number / Passport'}
            </label>
            <input
              type="text"
              value={taxId}
              onChange={e => setTaxId(e.target.value)}
              placeholder={accountType === 'company' ? 'e.g. 515432109' : 'e.g. 034567891'}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* FIELD 3: EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {accountType === 'company' ? 'Primary Business Email' : 'Personal Email Address'} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={primaryEmail}
              onChange={e => setPrimaryEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* FIELD 4: CELL PHONE */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cell Phone Number
            </label>
            <input
              type="tel"
              value={cellNumber}
              onChange={e => setCellNumber(e.target.value)}
              placeholder="+972-50-1234567"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* FIELD 5: PRIMARY BUSINESS DOMAIN (SINGLE QUESTION ARCHETYPE RESOLUTION) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Business / Industry Domain <span className="text-red-500">*</span>
            </label>
            <select
              value={domainCode}
              onChange={e => setDomainCode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
            >
              {domains.map(d => (
                <option key={d.code} value={d.code}>
                  {d.label}
                </option>
              ))}
            </select>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                {selectedDomain.description}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Auto-assigned Operational Archetypes: <span className="font-bold text-blue-600 dark:text-blue-400">{selectedDomain.default_service_models.join(' + ')}</span>
              </div>
            </div>
          </div>

          {/* FIELD 6: COUNTRY (INCLUDES CHINA) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Country of Primary Operations <span className="text-red-500">*</span>
            </label>
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="IL">Israel (IL)</option>
              <option value="US">United States (US)</option>
              <option value="DE">Germany (DE)</option>
              <option value="CN">China (CN) — Supplier Hub</option>
            </select>
          </div>

          {/* FIELD 7: CURRENCY */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default Operating Currency <span className="text-red-500">*</span>
            </label>
            <select
              value={currencyCode}
              onChange={e => setCurrencyCode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ILS">ILS (₪)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Skip for Now
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md shadow-sm transition-all"
          >
            {loading ? 'Provisioning Tenant...' : 'Save & Continue to Step 2 →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepOneIdentity;

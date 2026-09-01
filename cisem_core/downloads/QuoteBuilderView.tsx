/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: GOV-2026-08-31-QUOTE-BUILDER-REBUILD-V2
# original_claimed_signature: GOV-YARIV-20260831-QUOTE-BUILDER-REBUILD-V2
# status: RATIFIED_IMPLEMENTED
*/

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../types/database.types';
import { useUIStore } from '../../stores/useUIStore';
import { FileText, ArrowRight, DollarSign, CheckCircle2, ShieldCheck, Layers, Package, HelpCircle, User, FileSpreadsheet } from 'lucide-react';

type InquiryRow = Database['public']['Tables']['inquiries']['Row'];
type CatalogItemRow = Database['public']['Tables']['catalog_items']['Row'];
type PriceListLineRow = Database['public']['Tables']['price_list_lines']['Row'];

export default function QuoteBuilderView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useUIStore();
  const urlInquiryId = searchParams.get('inquiry_id') || '';

  // Data state
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(urlInquiryId);
  const [catalogItems, setCatalogItems] = useState<CatalogItemRow[]>([]);
  const [selectedCatalogItemId, setSelectedCatalogItemId] = useState<string>('');
  const [priceListLines, setPriceListLines] = useState<PriceListLineRow[]>([]);

  // Form line state
  const [quantity, setQuantity] = useState<number>(50); // Default 50 pcs (Tier 5)
  const [calculatedUnitPrice, setCalculatedUnitPrice] = useState<number>(247.00);
  const [lineDescription, setLineDescription] = useState<string>('TRI Vertical - Optic Crystal Award (50 pcs tier)');

  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; quoteId?: string } | null>(null);

  // 1. Load active inquiries and catalog items on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch inquiries
        const { data: inqData } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (inqData && inqData.length > 0) {
          setInquiries(inqData);
          if (!selectedInquiryId) {
            setSelectedInquiryId(inqData[0].id);
          }
        }

        // Fetch catalog items
        const { data: catData } = await supabase
          .from('catalog_items')
          .select('*')
          .eq('is_active', true);

        if (catData && catData.length > 0) {
          setCatalogItems(catData);
          const firstCat = catData[0];
          setSelectedCatalogItemId(firstCat.id);
          setLineDescription(`${firstCat.title_en} (${quantity} pcs tier)`);

          // Fetch price list lines for catalog item
          const { data: priceData } = await supabase
            .from('price_list_lines')
            .select('*')
            .eq('unit_id', firstCat.id)
            .order('min_quantity', { ascending: true });

          if (priceData && priceData.length > 0) {
            setPriceListLines(priceData);
            recalculateTierPrice(quantity, priceData);
          }
        }
      } catch (err) {
        console.error('Error loading QuoteBuilder data:', err);
      }
    }
    loadData();
  }, []);

  // Recalculate tier price based on quantity
  const recalculateTierPrice = (qty: number, linesList: PriceListLineRow[]) => {
    if (linesList.length === 0) return;
    // Find matching tier
    const matchedTier = linesList.find(line => {
      if (line.max_quantity === null) {
        return qty >= line.min_quantity;
      }
      return qty >= line.min_quantity && qty <= line.max_quantity;
    });

    if (matchedTier) {
      setCalculatedUnitPrice(matchedTier.unit_price);
    } else {
      setCalculatedUnitPrice(linesList[0].unit_price);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    recalculateTierPrice(newQty, priceListLines);
  };

  // Create Quote in Database
  const handleCreateQuote = async () => {
    if (!selectedInquiryId) {
      setStatusMessage({ type: 'error', text: 'Please select an active inquiry.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      // Fetch customer account ID from inquiry
      const targetInquiry = inquiries.find(i => i.id === selectedInquiryId);
      const customerAccountId = targetInquiry?.customer_account_id;
      if (!customerAccountId) {
        setStatusMessage({ type: 'error', text: 'Valid tenant session claim required to generate quote. Quote generation refused.' });
        setLoading(false);
        return;
      }
      const lineTotal = quantity * calculatedUnitPrice;

      // 1. Insert Quote Header
      const { data: quoteHeader, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          customer_account_id: customerAccountId,
          inquiry_id: selectedInquiryId,
          reference: `Q-AGN-${Date.now().toString().slice(-6)}`,
          status_code: 'proposal_draft',
          currency: 'ILS',
          version: 1,
          subtotal: lineTotal,
          total: lineTotal,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .select('*')
        .single();

      if (quoteError) throw quoteError;

      if (quoteHeader) {
        // 2. Insert Quote Line Item
        const { error: lineError } = await supabase
          .from('quote_lines')
          .insert({
            customer_account_id: customerAccountId,
            quote_id: quoteHeader.id,
            unit_id: selectedCatalogItemId || null,
            description: lineDescription,
            sort_order: 1,
            quantity: quantity,
            unit_price: calculatedUnitPrice,
            line_total: lineTotal,
            cost_breakdown: { base_unit_price: calculatedUnitPrice, tier_applied: quantity },
            attributes: { source: 'quote_builder_engine' }
          });

        if (lineError) throw lineError;

        // 3. Update Inquiry Status to 'brief_processed'
        await supabase
          .from('inquiries')
          .update({ status_code: 'brief_processed' })
          .eq('id', selectedInquiryId);

        setStatusMessage({
          type: 'success',
          text: `Quote successfully created and saved to database!`,
          quoteId: quoteHeader.id
        });
      }
    } catch (err: any) {
      console.error('Error creating quote:', err);
      setStatusMessage({ type: 'error', text: `Failed to create quote: ${err.message || String(err)}` });
    } finally {
      setLoading(false);
    }
  };

  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId);
  const selectedCatalogItem = catalogItems.find(c => c.id === selectedCatalogItemId);
  const runningTotal = quantity * calculatedUnitPrice;

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      {/* 1. MANDATORY SINGLE-ROW INSTANCE CONTEXT BANNER */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: 'var(--bg-secondary)', 
        border: '1px solid var(--border)', 
        borderRadius: 8, 
        padding: '10px 16px', 
        marginBottom: 20 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={16} style={{ color: 'var(--accent)' }} />
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', lineHeight: 1 }}>Customer</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>AGN Ltd</strong>
            </div>
          </div>

          <div style={{ width: 1, height: 20, backgroundColor: 'var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileSpreadsheet size={16} style={{ color: '#3b82f6' }} />
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', lineHeight: 1 }}>Target Inquiry</span>
              <strong style={{ fontSize: 13, color: 'var(--accent)' }}>
                {selectedInquiry ? selectedInquiry.title : '100 branded notebooks for a conference in March'}
              </strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', padding: '4px 12px', borderRadius: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Running Total:</span>
          <strong style={{ fontSize: 15, color: '#10b981', fontFamily: 'monospace' }}>
            {runningTotal.toFixed(2)} ₪
          </strong>
        </div>
      </div>

      {/* Header Title Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={24} style={{ color: 'var(--accent)' }} />
            {language === 'he' ? 'מחולל הצעות מחיר (Quote Builder Engine)' : 'Quote Builder Engine'}
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
            {language === 'he' 
              ? 'המרה ישירה מפנייה להצעת מחיר מאומתת במסד הנתונים' 
              : 'Direct Intake-to-Outcome pipeline converting inquiry into verified DB quote'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: 6, fontSize: 13, border: '1px solid var(--border)' }}>
          <ShieldCheck size={16} style={{ color: '#10b981' }} />
          <span>{language === 'he' ? 'סוגי נתונים מאומתים (Typegen)' : 'Type-Safe Schema Active'}</span>
        </div>
      </div>

      {statusMessage && (
        <div style={{ 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24,
          backgroundColor: statusMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: 14 }}>{statusMessage.text}</strong>
            {statusMessage.quoteId && (
              <span style={{ fontSize: 12, opacity: 0.9 }}>
                Database Quote ID: <code>{statusMessage.quoteId}</code>
              </span>
            )}
          </div>
          {statusMessage.type === 'success' && (
            <button 
              onClick={() => navigate('/work-order-acceptance')} 
              style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}
            >
              {language === 'he' ? 'עבור לאישור הזמנה ➔' : 'Proceed to Work Order ➔'}
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Step 1: Select Inquiry */}
        <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>1</span>
            {language === 'he' ? 'פנייה נכנסת (Inquiry Intake)' : 'Source Inquiry Intake'}
          </h3>

          {inquiries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>{language === 'he' ? 'בחר פנייה פעילה:' : 'Select Active Inquiry:'}</label>
              <select
                value={selectedInquiryId}
                onChange={(e) => setSelectedInquiryId(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 14 }}
              >
                {inquiries.map(inq => (
                  <option key={inq.id} value={inq.id}>
                    {inq.title} ({inq.reference || inq.id.slice(0, 8)})
                  </option>
                ))}
              </select>

              {selectedInquiry && (
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 12, borderRadius: 6, fontSize: 13, border: '1px solid var(--border)', marginTop: 8 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{selectedInquiry.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{selectedInquiry.description || 'No description provided.'}</div>
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--accent)' }}>
                    Status: <code>{selectedInquiry.status_code}</code> | Customer: <code>AGN Ltd</code>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading inquiries from database...</div>
          )}
        </div>

        {/* Step 2: Select Catalog Item */}
        <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>2</span>
            {language === 'he' ? 'מוצר מקטלוג (Catalog Item)' : 'Catalog Line Item'}
          </h3>

          {catalogItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>{language === 'he' ? 'בחר מוצר מקטלוג:' : 'Select Product:'}</label>
              <select
                value={selectedCatalogItemId}
                onChange={(e) => setSelectedCatalogItemId(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 14 }}
              >
                {catalogItems.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.internal_sku} - {language === 'he' ? cat.title_he : cat.title_en}
                  </option>
                ))}
              </select>

              {selectedCatalogItem && (
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 12, borderRadius: 6, fontSize: 13, border: '1px solid var(--border)', marginTop: 8 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{selectedCatalogItem.title_en}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>SKU: <code>{selectedCatalogItem.internal_sku}</code> | Lead Time: {selectedCatalogItem.supplier_lead_time_days} days</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading catalog items...</div>
          )}
        </div>
      </div>

      {/* Step 3: Quantity & Tier Pricing Section */}
      <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>3</span>
          {language === 'he' ? 'חישוב מדרגת מחיר וכמות' : 'Quantity & Tiered Price Engine'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{language === 'he' ? 'כמות מבוקשת (יחידות):' : 'Requested Quantity (pcs):'}</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 16, fontWeight: 'bold' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{language === 'he' ? 'מחיר ליחידה (מדרגה):' : 'Calculated Tier Unit Price:'}</label>
            <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#10b981', fontSize: 18, fontWeight: 'bold' }}>
              {calculatedUnitPrice.toFixed(2)} ₪
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{language === 'he' ? 'סה"כ שורה לתשלום:' : 'Total Line Price:'}</label>
            <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: 18, fontWeight: 'bold', color: 'var(--accent)' }}>
              {runningTotal.toFixed(2)} ₪
            </div>
          </div>
        </div>

        {/* Tier Reference Legend */}
        {priceListLines.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: 6 }}>
              {language === 'he' ? 'מדרגות מחיר פעילות מתוך מסד הנתונים:' : 'Active DB Quantity Tiers Applied:'}
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {priceListLines.map(line => {
                const isActive = (line.max_quantity === null ? quantity >= line.min_quantity : quantity >= line.min_quantity && quantity <= line.max_quantity);
                return (
                  <span 
                    key={line.id} 
                    style={{ 
                      padding: '2px 8px', 
                      borderRadius: 4, 
                      backgroundColor: isActive ? '#10b981' : 'var(--bg-secondary)',
                      color: isActive ? 'white' : 'var(--text-primary)',
                      fontWeight: isActive ? 'bold' : 'normal',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {line.max_quantity ? `${line.min_quantity}-${line.max_quantity}` : `${line.min_quantity}+`} pcs: {line.unit_price} ₪
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
        <div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block' }}>{language === 'he' ? 'סה"כ הצעת מחיר (כולל מע"מ 0%):' : 'Total Quote Value:'}</span>
          <span style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>{runningTotal.toFixed(2)} ₪</span>
        </div>

        <button
          onClick={handleCreateQuote}
          disabled={loading}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 'bold',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: loading ? 0.7 : 1
          }}
        >
          <CheckCircle2 size={18} />
          {loading ? (language === 'he' ? 'שומר במסד הנתונים...' : 'Saving to Database...') : (language === 'he' ? 'צור הצעת מחיר במסד הנתונים' : 'Create Quote in Database')}
        </button>
      </div>
    </div>
  );
}

/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: GOV-2026-08-31-CATALOGUE-LIST-VIEW-V2
# original_claimed_signature: GOV-YARIV-20260831-CATALOGUE-LIST-VIEW-V2
# status: RATIFIED_IMPLEMENTED
*/

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../types/database.types';
import { useUIStore } from '../../stores/useUIStore';
import { Package, Tag, Layers, ChevronDown, ChevronUp, Clock, CheckCircle2, AlertCircle, Box } from 'lucide-react';

type CatalogItemRow = Database['public']['Tables']['catalog_items']['Row'];
type ProductVariationRow = Database['public']['Tables']['product_variations']['Row'];
type PriceListLineRow = Database['public']['Tables']['price_list_lines']['Row'];
type TagRow = Database['public']['Tables']['tag_library']['Row'];

export interface CatalogItemWithDetails extends CatalogItemRow {
  variations: ProductVariationRow[];
  price_lines: PriceListLineRow[];
  tags: TagRow[];
}

export default function CatalogueListView() {
  const { language } = useUIStore();
  const [items, setItems] = useState<CatalogItemWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCatalogData() {
      setLoading(true);
      setError(null);
      try {
        const { data: catItems, error: catErr } = await supabase
          .from('catalog_items')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (catErr) throw catErr;

        if (catItems && catItems.length > 0) {
          const itemIds = catItems.map(i => i.id);

          const [varRes, priceRes, itemTagRes, tagLibRes] = await Promise.all([
            supabase.from('product_variations').select('*').in('catalog_item_id', itemIds),
            supabase.from('price_list_lines').select('*').order('min_quantity', { ascending: true }),
            supabase.from('catalog_item_tags').select('*').in('catalog_item_id', itemIds),
            supabase.from('tag_library').select('*')
          ]);

          const variations = varRes.data || [];
          const priceLines = priceRes.data || [];
          const itemTags = itemTagRes.data || [];
          const tagLibrary = tagLibRes.data || [];

          const tagMap = new Map<string, TagRow>();
          tagLibrary.forEach(t => tagMap.set(t.id, t));

          const enriched: CatalogItemWithDetails[] = catItems.map(item => {
            const itemVars = variations.filter(v => v.catalog_item_id === item.id);
            const itemPrices = priceLines.filter(p => p.unit_id === item.id);
            const linkedTagIds = itemTags.filter(it => it.catalog_item_id === item.id).map(it => it.tag_id);
            const resolvedTags = linkedTagIds.map(tid => tagMap.get(tid!)).filter(Boolean) as TagRow[];

            return {
              ...item,
              variations: itemVars,
              price_lines: itemPrices,
              tags: resolvedTags
            };
          });

          setItems(enriched);
          if (enriched.length > 0) {
            setExpandedItemId(enriched[0].id);
          }
        } else {
          setItems([]);
        }
      } catch (err: any) {
        console.error('Error fetching catalog data:', err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
        <Package size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <div>{language === 'he' ? 'טוען פריטי קטלוג ממסד הנתונים...' : 'Loading live catalog items...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444' }}>
        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={18} />
          {language === 'he' ? 'שגיאה שטופלה:' : 'Database Fetch Error:'}
        </div>
        <div style={{ fontSize: 13, marginTop: 4 }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box size={24} style={{ color: 'var(--accent)' }} />
            {language === 'he' ? 'קטלוג מוצרים מסחרי (Catalogue Live)' : 'Commercial Product Catalogue'}
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
            {language === 'he' 
              ? 'נתונים חיים מתוך מסד הנתונים: פריטים, 22 וריאציות ומדרגות מחיר' 
              : 'Live database schema: Items, 22 variations, and 7 price tiers'}
          </p>
        </div>
        <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#10b981', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 'bold' }}>
          {items.length} {language === 'he' ? 'פריטים בקטלוג' : 'Catalog Items Verified'}
        </div>
      </div>

      {/* Catalog List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map(item => {
          const isExpanded = expandedItemId === item.id;
          const title = language === 'he' ? item.title_he : item.title_en;

          // Extract material variation or attribute
          const materialVar = item.variations.find(v => v.variation_type === 'material')?.value 
            || (item.attributes && typeof item.attributes === 'object' ? (item.attributes as any).material : null);

          // Extract packaging variation or attribute
          const packagingVar = item.variations.find(v => v.variation_type === 'packaging')?.value 
            || (item.attributes && typeof item.attributes === 'object' ? (item.attributes as any).default_packaging : null);

          return (
            <div 
              key={item.id} 
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                border: '1px solid var(--border)', 
                borderRadius: 8, 
                overflow: 'hidden',
                boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {/* Item Summary Header */}
              <div 
                onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer', backgroundColor: isExpanded ? 'var(--bg-secondary)' : 'transparent', borderBottom: isExpanded ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <img src={item.image_urls[0]} alt={title} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--border)', padding: 2 }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 6, backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} />
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--accent)', backgroundColor: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                        {item.internal_sku}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.category}</span>
                    </div>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 'bold' }}>{title}</h3>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      <span>{item.supplier_lead_time_days || 5} {language === 'he' ? 'ימי אספקה' : 'days lead time'}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981', marginTop: 2 }}>
                      {item.price_lines && item.price_lines.length > 0 ? `${item.price_lines[0].unit_price} ₪ - ${item.price_lines[item.price_lines.length - 1].unit_price} ₪` : 'Custom Price'}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Details Grid */}
              {isExpanded && (
                <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, backgroundColor: 'var(--bg-primary)' }}>
                  {/* Column 1: Description & Attributes */}
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag size={16} />
                      {language === 'he' ? 'תיאור ומפרט טכני' : 'Item Specifications'}
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                      {item.description || 'No description provided.'}
                    </p>
                    
                    {/* CONDITIONALLY RENDER SPECIFICATION LABELS ONLY IF NON-EMPTY */}
                    {(materialVar || packagingVar) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                        {materialVar && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border-dashed var(--border)', paddingBottom: 4 }}>
                            <span style={{ color: 'var(--text-muted)' }}>{language === 'he' ? 'חומר גלם:' : 'Material:'}</span>
                            <span style={{ fontWeight: 'bold' }}>{materialVar}</span>
                          </div>
                        )}
                        {packagingVar && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border-dashed var(--border)', paddingBottom: 4 }}>
                            <span style={{ color: 'var(--text-muted)' }}>{language === 'he' ? 'אריזה דפולטיבית:' : 'Default Packaging:'}</span>
                            <span style={{ fontWeight: 'bold' }}>{packagingVar}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Variations Breakdown */}
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Layers size={16} />
                      {language === 'he' ? `וריאציות המוצר (${item.variations.length})` : `Product Variations (${item.variations.length})`}
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 160, overflowY: 'auto', paddingRight: 4 }}>
                      {item.variations.map(v => (
                        <span 
                          key={v.id} 
                          style={{ 
                            fontSize: 11, 
                            padding: '3px 8px', 
                            borderRadius: 4, 
                            backgroundColor: 'var(--bg-secondary)', 
                            border: '1px solid var(--border)',
                            display: 'inline-flex',
                            gap: 4
                          }}
                        >
                          <strong style={{ textTransform: 'capitalize' }}>{v.variation_type}:</strong> {v.value}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Quantity Discount Tier Table */}
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                      {language === 'he' ? 'מדרגות מחיר לכמות' : 'Quantity Discount Tiers'}
                    </h4>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                      {item.price_lines.map((p, idx) => (
                        <div 
                          key={p.id} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            padding: '6px 12px', 
                            fontSize: 12,
                            backgroundColor: idx % 2 === 0 ? 'var(--bg-secondary)' : 'transparent',
                            borderBottom: idx < item.price_lines.length - 1 ? '1px solid var(--border)' : 'none'
                          }}
                        >
                          <span>{p.max_quantity ? `${p.min_quantity} - ${p.max_quantity} pcs` : `${p.min_quantity}+ pcs`}</span>
                          <strong style={{ color: '#10b981' }}>{p.unit_price} ₪</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

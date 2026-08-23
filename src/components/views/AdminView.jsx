/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PRE-RATIFICATION-LEGACY
# governor_signature: GOV-LEGACY-BASELINE
# status: PRE_RATIFICATION_LEGACY
# reasoning: |
#   File created prior to formal plan ratification governance. Preserved as legacy baseline.
*/
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUIStore } from '../../stores/useUIStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { useAdminStore } from '../../stores/useAdminStore';
import { translations } from '../../utils/translations';
import AdminTable from '../shared/AdminTable';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import { FolderKanban, Users, ShieldAlert, Truck, UserCheck, Search, Download, Upload, Check, ShoppingBag, FileText } from 'lucide-react';
import { fetchMedusaProducts, fetchMedusaQuotes, syncMedusaProduct, createMedusaQuote } from '../../lib/2026-08-11__AntigravityLocal__YarivHuman__MedusaClientAdapter__V1.0';
import { useNotificationStore } from '../../stores/useNotificationStore';

export default function AdminView() {
  const language = useUIStore((s) => s.language);
  const t = translations[language] || translations.en;
  
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'projects';

  const { items: tasks, addItem, updateItem, deleteItem, addComment } = useTaskStore();

  const [medusaProducts, setMedusaProducts] = useState([]);
  const [medusaQuotes, setMedusaQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTab === 'products') {
      setLoading(true);
      fetchMedusaProducts()
        .then(data => setMedusaProducts(data))
        .finally(() => setLoading(false));
    } else if (currentTab === 'quotes') {
      setLoading(true);
      fetchMedusaQuotes()
        .then(data => setMedusaQuotes(data))
        .finally(() => setLoading(false));
    }
  }, [currentTab]);

  const productsColumns = React.useMemo(() => {
    return [
      { field: 'title', label: 'Title', type: 'text', width: '25%' },
      { field: 'handle', label: 'Handle', type: 'text', width: '20%' },
      { field: 'sku', label: 'SKU', type: 'text', width: '15%' },
      { field: 'price', label: 'Price', type: 'currency', width: '15%' },
      { field: 'inventoryQuantity', label: 'Stock', type: 'number', width: '15%' },
      { field: 'description', label: 'Description', type: 'text', width: '25%' },
      { field: 'actions', label: '', type: 'custom', width: '5%', sortable: false }
    ];
  }, []);

  const quotesColumns = React.useMemo(() => {
    return [
      { field: 'id', label: 'Quote ID', type: 'text', width: '20%' },
      { field: 'customerId', label: 'Customer ID', type: 'text', width: '20%' },
      { field: 'total', label: 'Total', type: 'currency', width: '20%' },
      { 
        field: 'status', 
        label: 'Status', 
        type: 'select', 
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'sent', label: 'Sent' },
          { value: 'accepted', label: 'Accepted' },
          { value: 'declined', label: 'Declined' }
        ],
        width: '15%'
      },
      { field: 'actions', label: '', type: 'custom', width: '5%', sortable: false }
    ];
  }, []);
  const { members, addMember, updateMember, removeMember, addMemberComment } = useCollabStore();
  const { 
    clients, addClient, updateClient, deleteClient, addClientComment, importClients,
    suppliers, addSupplier, updateSupplier, deleteSupplier, addSupplierComment, importSuppliers,
    clientCustomFields, supplierCustomFields, teamCustomFields
  } = useAdminStore();

  const activeUserId = useUIStore((s) => s.activeUserId);
  const currentUser = React.useMemo(() => {
    return members.find(m => m.id === activeUserId) || members[0];
  }, [members, activeUserId]);

  const rolesConfig = React.useMemo(() => ({
    owner: { permissions: ["*"] },
    boss: { permissions: ["*"] },
    admin: { permissions: ["read", "write", "delete", "settings"] },
    pm: { permissions: ["read", "write", "delete", "settings"] },
    finance_manager: { permissions: ["read", "write", "finance"] },
    finance: { permissions: ["read", "write", "finance"] },
    sales_rep: { permissions: ["read", "write", "crm"] },
    sales: { permissions: ["read", "write", "crm"] },
    viewer: { permissions: ["read"] }
  }), []);

  const hasPermission = React.useCallback((userRole, permission) => {
    const cfg = rolesConfig[userRole?.toLowerCase()] || rolesConfig.viewer;
    return cfg.permissions.includes("*") || cfg.permissions.includes(permission);
  }, [rolesConfig]);

  const allowedTabs = React.useMemo(() => {
    const role = currentUser?.role?.toLowerCase() || 'viewer';
    const tabs = [];
    
    if (role === 'viewer' || (!rolesConfig[role])) {
      return ['projects', 'clients', 'suppliers', 'team', 'products', 'quotes'];
    }
    
    if (hasPermission(role, 'settings') || hasPermission(role, '*')) {
      tabs.push('projects', 'clients', 'suppliers', 'team', 'products');
    } else {
      if (hasPermission(role, 'finance')) {
        tabs.push('projects', 'quotes');
      }
      if (hasPermission(role, 'crm')) {
        tabs.push('clients', 'products');
      }
    }
    
    if (hasPermission(role, '*')) {
      tabs.push('quotes');
    }
    
    return tabs;
  }, [currentUser, hasPermission, rolesConfig]);

  const isReadOnly = React.useMemo(() => {
    const role = currentUser?.role?.toLowerCase() || 'viewer';
    const cfg = rolesConfig[role] || rolesConfig.viewer;
    return cfg.permissions.length === 1 && cfg.permissions[0] === 'read';
  }, [currentUser, rolesConfig]);

  // Enforce redirection if accessing forbidden tab
  useEffect(() => {
    if (allowedTabs.length > 0 && !allowedTabs.includes(currentTab)) {
      setSearchParams({ tab: allowedTabs[0] });
    }
  }, [allowedTabs, currentTab, setSearchParams]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // 1. Projects Config
  const projectsData = React.useMemo(() => {
    return tasks.filter(item => item.type === 'project');
  }, [tasks]);

  const projectsColumns = React.useMemo(() => {
    return [
      { field: 'title', label: t.title, type: 'text', width: '25%' },
      { 
        field: 'status', 
        label: t.status, 
        type: 'select', 
        options: [
          { value: 'backlog', label: t.backlog },
          { value: 'todo', label: t.todo },
          { value: 'in_progress', label: t.in_progress },
          { value: 'review', label: t.review },
          { value: 'done', label: t.done },
          { value: 'blocked', label: t.blocked },
        ],
        width: '12%'
      },
      { field: 'assigneeId', label: t.assignee, type: 'select', width: '15%' },
      { field: 'startDate', label: t.startDate, type: 'date', width: '12%' },
      { field: 'dueDate', label: t.dueDate, type: 'date', width: '12%' },
      { field: 'budget', label: t.budget, type: 'currency', width: '10%' },
      { field: 'linkedClientId', label: t.clients, type: 'select', width: '15%' },
      { field: 'comments', label: t.comments, type: 'custom', width: '8%', sortable: false },
      { field: 'actions', label: '', type: 'custom', width: '5%', sortable: false }
    ];
  }, [t]);

  // 2. Clients Config
  const clientsColumns = React.useMemo(() => {
    const base = [
      { field: 'name', label: t.name, type: 'text', width: '20%' },
      { field: 'company', label: t.companyOrg, type: 'text', width: '20%' },
      { field: 'email', label: 'Email', type: 'text', width: '18%' },
      { field: 'phone', label: t.contactPhone, type: 'text', width: '15%' },
      { field: 'value', label: t.value, type: 'currency', width: '12%' },
      { field: 'linkedProjectIds', label: t.linkedProjects, type: 'multi-select', width: '20%', sortable: false },
      { field: 'tags', label: t.tags, type: 'tags', width: '20%', sortable: false },
    ];
    const custom = (clientCustomFields || []).map(f => ({ ...f, width: '15%', sortable: true }));
    return [
      ...base,
      ...custom,
      { field: 'comments', label: t.comments, type: 'custom', width: '8%', sortable: false },
      { field: 'actions', label: '', type: 'custom', width: '5%', sortable: false }
    ];
  }, [t, clientCustomFields]);

  // 3. Suppliers Config
  const suppliersColumns = React.useMemo(() => {
    const base = [
      { field: 'name', label: t.name, type: 'text', width: '20%' },
      { field: 'company', label: t.organization, type: 'text', width: '20%' },
      { field: 'email', label: 'Email', type: 'text', width: '18%' },
      { field: 'phone', label: t.contactPhone, type: 'text', width: '15%' },
      { field: 'materials', label: t.materials, type: 'tags', width: '25%', sortable: false },
      { 
        field: 'status', 
        label: t.status, 
        type: 'select', 
        options: [
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'on_hold', label: 'On Hold' }
        ],
        width: '12%'
      },
      { field: 'tags', label: t.tags, type: 'tags', width: '20%', sortable: false },
    ];
    const custom = (supplierCustomFields || []).map(f => ({ ...f, width: '15%', sortable: true }));
    return [
      ...base,
      ...custom,
      { field: 'comments', label: t.comments, type: 'custom', width: '8%', sortable: false },
      { field: 'actions', label: '', type: 'custom', width: '5%', sortable: false }
    ];
  }, [t, supplierCustomFields]);

  // 4. Team Members Config
  const teamColumns = React.useMemo(() => {
    const base = [
      { field: 'name', label: t.name, type: 'text', width: '20%' },
      { field: 'role', label: t.role, type: 'text', width: '15%' },
      { field: 'email', label: 'Email', type: 'text', width: '20%' },
      { field: 'phone', label: t.contactPhone, type: 'text', width: '15%' },
      { field: 'company', label: t.companyOrg, type: 'text', width: '15%' },
      { field: 'tags', label: t.tags, type: 'tags', width: '20%', sortable: false },
    ];
    const custom = (teamCustomFields || []).map(f => ({ ...f, width: '15%', sortable: true }));
    return [
      ...base,
      ...custom,
      { field: 'comments', label: t.comments, type: 'custom', width: '8%', sortable: false },
      { field: 'actions', label: '', type: 'custom', width: '5%', sortable: false }
    ];
  }, [t, teamCustomFields]);

  const [searchTerm, setSearchTerm] = useState('');
  const [maxColWidth, setMaxColWidth] = useState(160);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const exportRef = useRef(null);
  const importRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target) && document.body.contains(e.target)) {
        setExportOpen(false);
      }
      if (importRef.current && !importRef.current.contains(e.target) && document.body.contains(e.target)) {
        setImportOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const handleExportCsv = () => {
    const currentData = currentTab === 'projects' ? projectsData :
                       currentTab === 'clients' ? clients :
                       currentTab === 'suppliers' ? suppliers :
                       currentTab === 'products' ? medusaProducts :
                       currentTab === 'quotes' ? medusaQuotes : members;
    const currentCols = currentTab === 'projects' ? projectsColumns :
                       currentTab === 'clients' ? clientsColumns :
                       currentTab === 'suppliers' ? suppliersColumns :
                       currentTab === 'products' ? productsColumns :
                       currentTab === 'quotes' ? quotesColumns : teamColumns;
    if (currentData.length === 0) return;

    const fields = currentCols.filter(col => col.field !== 'actions' && col.field !== 'comments').map(col => col.field);
    let csvContent = fields.join(',') + '\n';

    currentData.forEach(row => {
      const line = fields.map(field => {
        let val = row[field];
        if (Array.isArray(val)) val = val.join('; ');
        const cleaned = val !== undefined && val !== null ? String(val) : '';
        return '"' + cleaned.replace(/"/g, '""') + '"';
      });
      csvContent += line.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cisem_report_${currentTab}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
  };

  const handleExportMd = () => {
    const currentData = currentTab === 'projects' ? projectsData :
                       currentTab === 'clients' ? clients :
                       currentTab === 'suppliers' ? suppliers :
                       currentTab === 'products' ? medusaProducts :
                       currentTab === 'quotes' ? medusaQuotes : members;
    const currentCols = currentTab === 'projects' ? projectsColumns :
                       currentTab === 'clients' ? clientsColumns :
                       currentTab === 'suppliers' ? suppliersColumns :
                       currentTab === 'products' ? productsColumns :
                       currentTab === 'quotes' ? quotesColumns : teamColumns;
    if (currentData.length === 0) return;

    const fields = currentCols.filter(col => col.field !== 'actions' && col.field !== 'comments').map(col => col.field);
    const labels = currentCols.filter(col => col.field !== 'actions' && col.field !== 'comments').map(col => col.label || col.field);

    let mdContent = `# CISEM System Report - ${currentTab.toUpperCase()}\n\n`;
    mdContent += `| ${labels.join(' | ')} |\n`;
    mdContent += `| ${labels.map(() => '---').join(' | ')} |\n`;

    currentData.forEach(row => {
      const line = fields.map(field => {
        let val = row[field];
        if (Array.isArray(val)) val = val.join(', ');
        return val !== undefined && val !== null ? String(val) : '';
      });
      mdContent += `| ${line.join(' | ')} |\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cisem_report_${currentTab}.md`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
  };

  const handleExportPdf = () => {
    setExportOpen(false);
    
    // Build the columns lists first to detect layout footprint
    const currentCols = currentTab === 'projects' ? projectsColumns :
                        currentTab === 'clients' ? clientsColumns :
                        currentTab === 'suppliers' ? suppliersColumns :
                        currentTab === 'products' ? productsColumns :
                        currentTab === 'quotes' ? quotesColumns : teamColumns;

    const fields = currentCols.filter(col => col.field !== 'actions' && col.field !== 'comments').map(col => col.field);
    const labels = currentCols.filter(col => col.field !== 'actions' && col.field !== 'comments').map(col => col.label || col.field);

    const isWideTable = fields.length > 5;
    const printOrientation = isWideTable ? 'landscape' : 'portrait';
    const cellFontSize = isWideTable ? '8pt' : '10pt';
    const cellPadding = isWideTable ? '4px' : '8px';

    // Inject print-only styles to hide layout chrome and format the report beautifully
    const style = document.createElement('style');
    style.id = 'print-helper-style';
    style.innerHTML = `
      @media print {
        @page {
          size: ${printOrientation};
          margin: 10mm;
        }
        body * {
          visibility: hidden;
        }
        #print-report-container, #print-report-container * {
          visibility: visible;
        }
        #print-report-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          color: #000 !important;
          background: #fff !important;
          padding: 24px;
        }
        .no-print {
          display: none !important;
        }
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin-top: 16px;
        }
        th, td {
          border: 1px solid #ddd !important;
          padding: ${cellPadding} !important;
          text-align: left !important;
          font-size: ${cellFontSize} !important;
          color: #000 !important;
        }
        th {
          background-color: #f2f2f2 !important;
          font-weight: bold !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Create a temporary container for clean printing
    const printContainer = document.createElement('div');
    printContainer.id = 'print-report-container';

    // Build the report content
    const currentData = currentTab === 'projects' ? projectsData :
                       currentTab === 'clients' ? clients :
                       currentTab === 'suppliers' ? suppliers :
                       currentTab === 'products' ? medusaProducts :
                       currentTab === 'quotes' ? medusaQuotes : members;

    let html = `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="font-size: 18pt; margin-bottom: 4px; border-bottom: 2px solid #333; padding-bottom: 8px;">CISEM Platform Official Contract Report</h1>
        <p style="font-size: 9pt; color: #555; margin-bottom: 24px;">Generated on: ${new Date().toLocaleString()} | Tab Context: ${currentTab.toUpperCase()}</p>
        
        <table>
          <thead>
            <tr>
              ${labels.map(lbl => `<th>${lbl}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${currentData.map(row => `
              <tr>
                ${fields.map(field => {
                  let val = row[field];
                  if (Array.isArray(val)) val = val.join(', ');
                  return `<td>${val !== undefined && val !== null ? String(val) : '-'}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 48px; display: flex; justify-content: space-between; font-size: 10pt;">
          <div>
            <p style="margin-bottom: 32px;">Operator Signature:</p>
            <p style="border-top: 1px solid #000; width: 160px;"></p>
          </div>
          <div>
            <p style="margin-bottom: 32px;">Governor Verification Sign-off:</p>
            <p style="border-top: 1px solid #000; width: 160px;"></p>
          </div>
        </div>
      </div>
    `;

    printContainer.innerHTML = html;
    document.body.appendChild(printContainer);

    // Trigger Print Dialog
    setTimeout(() => {
      window.print();
      // Cleanup
      document.body.removeChild(printContainer);
      document.head.removeChild(style);
    }, 100);
  };

  const handleExportOffice = (format) => {
    setExportOpen(false);
    
    const currentData = currentTab === 'projects' ? projectsData :
                       currentTab === 'clients' ? clients :
                       currentTab === 'suppliers' ? suppliers :
                       currentTab === 'products' ? medusaProducts :
                       currentTab === 'quotes' ? medusaQuotes : members;
                       
    const currentCols = currentTab === 'projects' ? projectsColumns :
                       currentTab === 'clients' ? clientsColumns :
                       currentTab === 'suppliers' ? suppliersColumns :
                       currentTab === 'products' ? productsColumns :
                       currentTab === 'quotes' ? quotesColumns : teamColumns;

    const fields = currentCols.filter(col => col.field !== 'actions' && col.field !== 'comments').map(col => col.field);
    const labels = currentCols.filter(col => col.field !== 'actions' && col.field !== 'comments').map(col => col.label || col.field);

    let docContent = '';
    let mimeType = 'text/csv';
    let fileExtension = 'csv';

    if (format === 'excel' || format === 'google sheets') {
      docContent = fields.join(',') + '\n';
      currentData.forEach(row => {
        const line = fields.map(field => {
          let val = row[field];
          if (Array.isArray(val)) val = val.join('; ');
          const cleaned = val !== undefined && val !== null ? String(val) : '';
          return '"' + cleaned.replace(/"/g, '""') + '"';
        });
        docContent += line.join(',') + '\n';
      });
      mimeType = 'application/vnd.ms-excel';
      fileExtension = format === 'excel' ? 'xls' : 'csv';
    } else {
      docContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head><title>CISEM Report</title><style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;text-align:left;font-family:Arial;font-size:10pt;}</style></head>
        <body>
          <h2>CISEM Official Document Report - ${currentTab.toUpperCase()}</h2>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>${labels.map(l => `<th>${l}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${currentData.map(row => `
                <tr>${fields.map(field => {
                  let val = row[field];
                  if (Array.isArray(val)) val = val.join(', ');
                  return `<td>${val !== undefined && val !== null ? String(val) : ''}</td>`;
                }).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      mimeType = 'application/msword';
      fileExtension = format === 'word' ? 'doc' : 'doc';
    }

    const blob = new Blob([docContent], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cisem_contract_${currentTab}_${format.replace(' ', '_')}.${fileExtension}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    useNotificationStore.getState().showToast({
      title: `${format.toUpperCase()} Exported`,
      message: `Downloaded document template for ${currentTab} successfully.`,
      type: 'success'
    });
  };

  const handleImportCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) return;

      const csvHeaders = lines[0].split(',').map(h => h.trim());
      const activeCustomFields = currentTab === 'clients' ? clientCustomFields :
                                 currentTab === 'suppliers' ? supplierCustomFields :
                                 currentTab === 'team' ? teamCustomFields : [];

      const matchedFields = [];
      const parsedRows = lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => {
          let cleaned = val.trim();
          if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
          return cleaned.replace(/""/g, '"');
        });

        const rowObj = {};
        csvHeaders.forEach((header, idx) => {
          let val = values[idx] || '';
          // Match by key name or human-friendly label (case-insensitive)
          const customFieldDef = activeCustomFields.find(cf => 
            cf.field.toLowerCase() === header.toLowerCase() || 
            cf.label.toLowerCase() === header.toLowerCase()
          );

          if (customFieldDef && !matchedFields.includes(customFieldDef.label)) {
            matchedFields.push(customFieldDef.label);
          }

          const targetKey = customFieldDef ? customFieldDef.field : header;

          if (targetKey === 'materials' || targetKey === 'tags' || (customFieldDef && customFieldDef.type === 'tags')) {
            rowObj[targetKey] = val ? val.split(/[;|\n]/).map(s => s.trim()).filter(Boolean) : [];
          } else if (targetKey === 'value' || targetKey === 'budget' || (customFieldDef && (customFieldDef.type === 'number' || customFieldDef.type === 'currency'))) {
            rowObj[targetKey] = Number(val) || 0;
          } else {
            rowObj[targetKey] = val;
          }
        });
        return rowObj;
      });

      if (currentTab === 'clients') importClients(parsedRows);
      else if (currentTab === 'suppliers') importSuppliers(parsedRows);
      else if (currentTab === 'team') {
        parsedRows.forEach(row => {
          useCollabStore.getState().addMember && useCollabStore.getState().addMember(row);
        });
      }

      useNotificationStore.getState().showToast({
        title: 'CSV Import Success',
        message: `Imported ${parsedRows.length} rows. Matched fields: ${matchedFields.length > 0 ? matchedFields.join(', ') : 'None'}.`,
        type: 'success'
      });

      setImportOpen(false);
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-hidden" style={{ direction: language === 'he' ? 'rtl' : 'ltr' }}>
      {/* Page Header */}
      <PageGreetingBanner view="admin" />

      {/* Merged Inline Tabs & Toolbar Row (Batch 10) */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-3 rounded-2xl glass-card border border-[var(--border-light)] bg-[var(--surface-elevated)]" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
        {/* Left Side: Tabs */}
        <div className="view-tabs flex items-center" style={{ margin: 0, flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
          {allowedTabs.includes('projects') && (
            <button
              onClick={() => handleTabChange('projects')}
              className={`view-tab ${currentTab === 'projects' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <FolderKanban size={15} />
              {t.projects}
            </button>
          )}
          {allowedTabs.includes('clients') && (
            <button
              onClick={() => handleTabChange('clients')}
              className={`view-tab ${currentTab === 'clients' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Users size={15} />
              {t.clients}
            </button>
          )}
          {allowedTabs.includes('suppliers') && (
            <button
              onClick={() => handleTabChange('suppliers')}
              className={`view-tab ${currentTab === 'suppliers' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Truck size={15} />
              {t.suppliers}
            </button>
          )}
          {allowedTabs.includes('team') && (
            <button
              onClick={() => handleTabChange('team')}
              className={`view-tab ${currentTab === 'team' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <UserCheck size={15} />
              {t.teamMembersTab}
            </button>
          )}
          {allowedTabs.includes('products') && (
            <button
              onClick={() => handleTabChange('products')}
              className={`view-tab ${currentTab === 'products' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <ShoppingBag size={15} />
              Products
            </button>
          )}
          {allowedTabs.includes('quotes') && (
            <button
              onClick={() => handleTabChange('quotes')}
              className={`view-tab ${currentTab === 'quotes' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <FileText size={15} />
              Quotes
            </button>
          )}
        </div>

        {/* Right Side: Toolbar controls (Search, MaxWidth, Import, Export) */}
        <div className="flex items-center gap-3 flex-shrink-0 flex-nowrap" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
          {/* Search Bar */}
          <div className="relative w-36">
            <Search 
              size={14} 
              className="absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)]" 
              style={{ left: language === 'he' ? 'auto' : 8, right: language === 'he' ? 8 : 'auto' }}
            />
            <input
              type="text"
              className="input w-full p-1.5 pl-7 pr-3 text-xs bg-transparent border rounded-lg focus:outline-none"
              style={{ 
                borderColor: 'var(--border)',
                paddingLeft: language === 'he' ? 8 : 26, 
                paddingRight: language === 'he' ? 26 : 8 
              }}
              placeholder={t.searchPlaceholder || "Search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Column Max-Width Controller Slider */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[var(--border)] bg-black/5 dark:bg-white/5">
            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Max: {maxColWidth}px</span>
            <input 
              type="range" 
              min="80" 
              max="400" 
              value={maxColWidth} 
              onChange={(e) => setMaxColWidth(Number(e.target.value))} 
              className="w-16 h-1 cursor-pointer accent-primary" 
            />
          </div>

          {/* Export Dropdown (Hover Label, Click toggle) */}
          <div className="relative inline-block text-left" ref={exportRef}>
            <button 
              className="btn-icon p-1.5 border rounded-lg hover:bg-gray-150/15 group relative"
              onClick={() => setExportOpen(!exportOpen)}
              style={{ borderColor: 'var(--border)' }}
            >
              <Download size={14} />
              {/* Hover Tooltip Label */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 px-2 py-1 text-[9px] rounded bg-gray-900 text-white shadow-lg whitespace-nowrap">Export</span>
            </button>
            {exportOpen && (
              <div 
                className="absolute mt-1 w-32 rounded-xl shadow-xl z-50 p-2 border" 
                style={{ 
                  background: 'var(--surface-elevated)', 
                  borderColor: 'var(--border)',
                  left: language === 'he' ? 0 : 'auto',
                  right: language === 'he' ? 'auto' : 0
                }}
              >
                <div className="px-2 py-1 text-[9px] uppercase font-bold text-[var(--text-muted)] border-b pb-1 mb-1" style={{ borderColor: 'var(--border-light)' }}>Format</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={handleExportCsv}>CSV (.csv)</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={handleExportMd}>Markdown (.md)</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={handleExportPdf}>PDF (.pdf)</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={() => handleExportOffice('excel')}>Excel (.xlsx)</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={() => handleExportOffice('word')}>Word (.docx)</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={() => handleExportOffice('google sheets')}>Google Sheets</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={() => handleExportOffice('google docs')}>Google Docs</div>
              </div>
            )}
          </div>

          {/* Import Dropdown */}
          <div className="relative inline-block text-left" ref={importRef}>
            <button 
              className="btn-icon p-1.5 border rounded-lg hover:bg-gray-150/15 group relative"
              onClick={() => setImportOpen(!importOpen)}
              style={{ borderColor: 'var(--border)' }}
            >
              <Upload size={14} />
              {/* Hover Tooltip Label */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 px-2 py-1 text-[9px] rounded bg-gray-900 text-white shadow-lg whitespace-nowrap">Import</span>
            </button>
            {importOpen && (
              <div 
                className="absolute mt-1 w-32 rounded-xl shadow-xl z-50 p-2 border" 
                style={{ 
                  background: 'var(--surface-elevated)', 
                  borderColor: 'var(--border)',
                  left: language === 'he' ? 0 : 'auto',
                  right: language === 'he' ? 'auto' : 0
                }}
              >
                <div className="px-2 py-1 text-[9px] uppercase font-bold text-[var(--text-muted)] border-b pb-1 mb-1" style={{ borderColor: 'var(--border-light)' }}>Format</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={() => fileInputRef.current.click()}>CSV (.csv)</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={() => { setImportOpen(false); alert('Excel batch importer loading...'); }}>Excel (.xlsx)</div>
                <div className="px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10" onClick={() => { setImportOpen(false); alert('Markdown reader parsing...'); }}>Markdown (.md)</div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportCsv} 
              accept=".csv" 
              style={{ display: 'none' }} 
            />
          </div>
        </div>
      </div>

      {/* Active Tab Panel */}
      <div className="flex-1 min-h-0">
        {currentTab === 'projects' && allowedTabs.includes('projects') && (
          <AdminTable
            type="projects"
            data={projectsData}
            columns={projectsColumns}
            groupByField="parentId"
            searchTerm={searchTerm}
            maxColWidth={maxColWidth}
            readOnly={isReadOnly}
            onAddRow={(groupKey) => {
              // Find parent node ID matching the group title
              const parentNode = tasks.find(item => item.title === groupKey);
              addItem({
                type: 'project',
                parentId: parentNode ? parentNode.id : null,
                title: 'New Project',
                status: 'todo',
                budget: 0,
                linkedClientId: ''
              });
              useNotificationStore.getState().fireEvent('task_created', {
                title: 'Project Created',
                message: `Created new project under group "${groupKey || 'root'}"`,
                type: 'info'
              });
            }}
            onUpdateRow={(id, updates) => {
              updateItem(id, updates);
              if (updates.status) {
                const targetTask = tasks.find(t => t.id === id);
                useNotificationStore.getState().fireEvent('status_change', {
                  title: 'Project Status Updated',
                  message: `Project "${targetTask?.title || 'New Project'}" moved to status "${updates.status.toUpperCase()}"`,
                  taskId: id,
                  type: 'info'
                });
              }
            }}
            onDeleteRow={(id) => {
              const targetTask = tasks.find(t => t.id === id);
              deleteItem(id);
              useNotificationStore.getState().fireEvent('task_deleted', {
                title: 'Project Deleted',
                message: `Removed project: "${targetTask?.title || 'Unnamed'}"`,
                type: 'danger'
              });
            }}
            onAddComment={(id, text, author) => {
              addComment(id, text, author);
              const targetTask = tasks.find(t => t.id === id);
              useNotificationStore.getState().fireEvent('comment_added', {
                title: 'New Project Comment',
                message: `"${author}" commented on project "${targetTask?.title || 'Project'}": "${text}"`,
                type: 'success'
              });
            }}
          />
        )}

        {currentTab === 'clients' && allowedTabs.includes('clients') && (
          <AdminTable
            type="clients"
            data={clients}
            columns={clientsColumns}
            groupByField="company"
            searchTerm={searchTerm}
            maxColWidth={maxColWidth}
            readOnly={isReadOnly}
            onAddRow={(companyGroup) => {
              addClient({
                name: 'New Contact',
                company: companyGroup === 'Unassigned' ? 'New Company' : companyGroup,
                value: 0,
                tags: []
              });
              useNotificationStore.getState().fireEvent('client_created', {
                title: 'Client Contact Added',
                message: `Created client contact under company "${companyGroup}"`,
                type: 'info'
              });
            }}
            onUpdateRow={(id, updates) => updateClient(id, updates)}
            onDeleteRow={(id) => {
              const target = clients.find(c => c.id === id);
              deleteClient(id);
              useNotificationStore.getState().fireEvent('client_deleted', {
                title: 'Client Removed',
                message: `Deleted client contact record: "${target?.name || 'Contact'}"`,
                type: 'danger'
              });
            }}
            onAddComment={(id, text, author) => {
              addClientComment(id, text, author);
              const target = clients.find(c => c.id === id);
              useNotificationStore.getState().fireEvent('comment_added', {
                title: 'New Client Comment',
                message: `"${author}" commented on client "${target?.name || 'Client'}": "${text}"`,
                type: 'success'
              });
            }}
          />
        )}

        {currentTab === 'suppliers' && allowedTabs.includes('suppliers') && (
          <AdminTable
            type="suppliers"
            data={suppliers}
            columns={suppliersColumns}
            groupByField="status"
            searchTerm={searchTerm}
            maxColWidth={maxColWidth}
            readOnly={isReadOnly}
            onAddRow={(statusGroup) => {
              addSupplier({
                name: 'New Supplier Contact',
                company: 'New Supply Corp',
                status: ['active', 'pending', 'on_hold'].includes(statusGroup) ? statusGroup : 'pending',
                materials: [],
                tags: []
              });
              useNotificationStore.getState().fireEvent('supplier_created', {
                title: 'Supplier Added',
                message: `Created supplier contact under status "${statusGroup}"`,
                type: 'info'
              });
            }}
            onUpdateRow={(id, updates) => updateSupplier(id, updates)}
            onDeleteRow={(id) => {
              const target = suppliers.find(s => s.id === id);
              deleteSupplier(id);
              useNotificationStore.getState().fireEvent('supplier_deleted', {
                title: 'Supplier Removed',
                message: `Deleted supplier contact record: "${target?.name || 'Contact'}"`,
                type: 'danger'
              });
            }}
            onAddComment={(id, text, author) => {
              addSupplierComment(id, text, author);
              const target = suppliers.find(s => s.id === id);
              useNotificationStore.getState().fireEvent('comment_added', {
                title: 'New Supplier Comment',
                message: `"${author}" commented on supplier "${target?.name || 'Supplier'}": "${text}"`,
                type: 'success'
              });
            }}
          />
        )}

        {currentTab === 'team' && allowedTabs.includes('team') && (
          <AdminTable
            type="team"
            data={members}
            columns={teamColumns}
            groupByField="role"
            searchTerm={searchTerm}
            maxColWidth={maxColWidth}
            readOnly={isReadOnly}
            onAddRow={(roleGroup) => {
              addMember(
                'New Team Member', 
                roleGroup === 'Unassigned' ? 'colleague' : roleGroup,
                '',
                '',
                'CISEM Corp',
                []
              );
              useNotificationStore.getState().fireEvent('member_created', {
                title: 'Team Member Registered',
                message: `Added new colleague under role group "${roleGroup}"`,
                type: 'info'
              });
            }}
            onUpdateRow={(id, updates) => updateMember(id, updates)}
            onDeleteRow={(id) => {
              const target = members.find(m => m.id === id);
              removeMember(id);
              useNotificationStore.getState().fireEvent('member_deleted', {
                title: 'Member Removed',
                message: `Deregistered team colleague: "${target?.name || 'Colleague'}"`,
                type: 'danger'
              });
            }}
            onAddComment={(id, text, actor) => {
              addMemberComment(id, text, actor);
              const target = members.find(m => m.id === id);
              useNotificationStore.getState().fireEvent('comment_added', {
                title: 'New Team Comment',
                message: `"${actor}" commented on team member "${target?.name || 'Member'}": "${text}"`,
                type: 'success'
              });
            }}
          />
        )}

        {currentTab === 'products' && allowedTabs.includes('products') && (
          <AdminTable
            type="products"
            data={medusaProducts}
            columns={productsColumns}
            groupByField="sku"
            searchTerm={searchTerm}
            maxColWidth={maxColWidth}
            readOnly={isReadOnly}
            onAddRow={() => {
              const newProd = {
                title: 'New Product',
                handle: 'new-product-' + Date.now(),
                sku: 'MOCK-SKU-' + Math.floor(Math.random() * 10000),
                price: 0,
                inventoryQuantity: 10,
                description: 'Newly created Medusa item'
              };
              syncMedusaProduct(newProd).then(res => {
                setMedusaProducts(prev => [...prev, { ...newProd, id: res.product_id || 'prod_' + Date.now() }]);
                useNotificationStore.getState().fireEvent('product_created', {
                  title: 'Medusa Product Synced',
                  message: `Registered catalog item: "${newProd.title}" (SKU: ${newProd.sku})`,
                  type: 'info'
                });
              });
            }}
            onUpdateRow={(id, updates) => {
              setMedusaProducts(prev => prev.map(p => {
                if (p.id === id) {
                  const updated = { ...p, ...updates };
                  syncMedusaProduct(updated).then(() => {
                    useNotificationStore.getState().fireEvent('product_updated', {
                      title: 'Medusa Catalog Sync',
                      message: `Synchronized updates for: "${updated.title}"`,
                      type: 'warning'
                    });
                  });
                  return updated;
                }
                return p;
              }));
            }}
            onDeleteRow={(id) => {
              const target = medusaProducts.find(p => p.id === id);
              setMedusaProducts(prev => prev.filter(p => p.id !== id));
              useNotificationStore.getState().fireEvent('product_deleted', {
                title: 'Medusa Product Removed',
                message: `Deregistered product item: "${target?.title || 'Catalog item'}"`,
                type: 'danger'
              });
            }}
            onAddComment={(id, text, author) => {
              alert(`Comments not supported on Medusa catalog schemas directly yet.`);
            }}
          />
        )}

        {currentTab === 'quotes' && allowedTabs.includes('quotes') && (
          <AdminTable
            type="quotes"
            data={medusaQuotes}
            columns={quotesColumns}
            groupByField="status"
            searchTerm={searchTerm}
            maxColWidth={maxColWidth}
            readOnly={isReadOnly}
            onAddRow={() => {
              const newQuote = {
                customerId: 'client_mock_new',
                items: [{ title: 'Services', quantity: 1, unitPrice: 500 }],
                taxRate: 0.17,
                total: 585,
                status: 'draft'
              };
              createMedusaQuote(newQuote).then(res => {
                setMedusaQuotes(prev => [...prev, { ...newQuote, id: res.quote_id || 'quote_' + Date.now() }]);
                useNotificationStore.getState().fireEvent('quote_created', {
                  title: 'Medusa Quote Synced',
                  message: `Registered headless sales quote for Customer: "${newQuote.customerId}"`,
                  type: 'info'
                });
              });
            }}
            onUpdateRow={(id, updates) => {
              setMedusaQuotes(prev => prev.map(q => {
                if (q.id === id) {
                  const updated = { ...q, ...updates };
                  createMedusaQuote(updated).then(() => {
                    useNotificationStore.getState().fireEvent('quote_updated', {
                      title: 'Medusa Quote Sync',
                      message: `Synchronized quote updates (Status: ${updated.status.toUpperCase()})`,
                      type: 'warning'
                    });
                  });
                  return updated;
                }
                return q;
              }));
            }}
            onDeleteRow={(id) => {
              const target = medusaQuotes.find(q => q.id === id);
              setMedusaQuotes(prev => prev.filter(q => q.id !== id));
              useNotificationStore.getState().fireEvent('quote_deleted', {
                title: 'Medusa Quote Removed',
                message: `Deregistered quote item ID: "${target?.id || id}"`,
                type: 'danger'
              });
            }}
            onAddComment={(id, text, author) => {
              alert(`Comments not supported on Medusa quote schemas directly yet.`);
            }}
          />
        )}
      </div>
    </div>
  );
}

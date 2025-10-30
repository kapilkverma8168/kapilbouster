import React, { useMemo, useState } from 'react';
import { DataTable, StatCard } from '../../../jsx/components/common';

const TemplateSetup = () => {
  const [query, setQuery] = useState('');

  const data = useMemo(() => (
    Array.from({ length: 7 }).map((_, i) => ({
      id: i + 1,
      userType: 'GMS',
      parentType: 'Parent Type Name',
      createdAt: '19/03/2025, 05:09pm',
    }))
  ), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(r => r.userType.toLowerCase().includes(q) || r.parentType.toLowerCase().includes(q));
  }, [data, query]);

  const columns = [
    { key: 'sno', header: 'S.No', cell: (_v, _r, idx) => idx + 1, width: 60 },
    { key: 'userType', header: 'User Type', accessor: 'userType' },
    { key: 'parentType', header: 'Parent Type', accessor: 'parentType' },
    { key: 'view', header: 'View Template', cell: () => (
      <button className="btn btn-outline-primary btn-sm">
        <i className="fa fa-eye me-1" /> View
      </button>
    ), align: 'center', width: 140 },
    { key: 'createdAt', header: 'Created At', accessor: 'createdAt', align: 'left', width: 200 },
    { key: 'action', header: 'Action', cell: () => (
      <button className="btn btn-outline-danger btn-sm">
        <i className="fa fa-trash" />
      </button>
    ), align: 'center', width: 100 },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex flex-wrap gap-3 mb-3">
          <StatCard title="Template List" value={<span className="text-muted">Manage your accreditation templates</span>} />
        </div>
        <div className="card mb-3">
          <div className="card-header d-flex align-items-center justify-content-between">
            <div className="w-50">
              <div className="input-group">
                <input className="form-control" placeholder="Search Template by User Type" value={query} onChange={(e) => setQuery(e.target.value)} />
                <span className="input-group-text"><i className="flaticon-381-search-2" /></span>
              </div>
            </div>
            <button className="btn btn-primary"><i className="fa fa-plus me-1" /> Add Template</button>
          </div>
        </div>
        <DataTable columns={columns} data={filtered} rowKey="id" />
      </div>
    </div>
  );
};

export default TemplateSetup;

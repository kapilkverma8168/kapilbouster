import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found',
  rowKey = 'id',
  selectable = false,
  selectedRowIds,
  onSelectChange,
  onRowClick,
  sortBy,
  onSortChange,
  page,
  pageSize,
  total,
  onPageChange,
  headerExtras,
  title,
  showIndex = false,
  stickyHeader = false,
  className,
  maxBodyHeight,
}) => {
  const selectedSet = useMemo(() => {
    if (!selectedRowIds) return new Set();
    return selectedRowIds instanceof Set ? selectedRowIds : new Set(selectedRowIds);
  }, [selectedRowIds]);

  const getRowId = (row) => (typeof rowKey === 'function' ? rowKey(row) : row[rowKey]);

  const handleToggleAll = (e) => {
    if (!onSelectChange) return;
    const checked = e.target.checked;
    if (checked) {
      const next = new Set(data.map(getRowId));
      onSelectChange(next);
    } else {
      onSelectChange(new Set());
    }
  };

  const handleToggleRow = (row) => (e) => {
    if (!onSelectChange) return;
    const next = new Set(selectedSet);
    const id = getRowId(row);
    if (e.target.checked) next.add(id); else next.delete(id);
    onSelectChange(next);
  };

  const totalPages = useMemo(() => {
    if (!page || !pageSize || !total) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [page, pageSize, total]);

  const renderCell = (col, row, rowIndex) => {
    const value = typeof col.accessor === 'function' ? col.accessor(row) : col.accessor ? row[col.accessor] : row[col.key];
    return col.cell ? col.cell(value, row, rowIndex) : value;
  };

  const isSortable = (col) => !!(onSortChange && (col.sortable || col.accessor || col.key));

  const nextSortFor = (key) => {
    if (!sortBy || sortBy.key !== key) return { key, direction: 'asc' };
    return { key, direction: sortBy.direction === 'asc' ? 'desc' : 'asc' };
  };

  return (
    <div className={className}>
      {stickyHeader && (
        <style>{`
          .data-table-sticky thead th { position: sticky; top: 0; z-index: 2; background: var(--primary); }
        `}</style>
      )}
      {(title || headerExtras) && (
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="h6 mb-0">{title}</div>
          <div>{headerExtras}</div>
        </div>
      )}
      <div className="">
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className='bg-blue-500' style={{ fontFamily: 'Lato, sans-serif' }}>
              <tr className="table-light">
                {selectable && (
                  <th style={{ width:'fit-content', backgroundColor: 'var(--primary)' }}>
                    <input type="checkbox" className="form-check-input" onChange={handleToggleAll} checked={data.length > 0 && selectedSet.size === data.length} />
                  </th>
                )}
                {showIndex && (
                  <th style={{ width: 60, backgroundColor: 'var(--primary)' }}>S.No</th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      width: col.width,
                      ...(stickyHeader ? { position: 'sticky', top: 0, zIndex: 1 , backgroundColor: 'var(--primary)' } : {}),
                    }}
                    className={col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : ''}
                    onClick={isSortable(col) ? () => onSortChange(nextSortFor(col.key)) : undefined}
                    role={isSortable(col) ? 'button' : undefined}
                  >
                    <span className="d-inline-flex align-items-center">
                      {col.header}
                      {isSortable(col) && (
                        <i className={`ms-1 fa ${sortBy?.key === col.key ? (sortBy.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={(columns?.length || 0) + (selectable ? 1 : 0) + (showIndex ? 1 : 0)}>
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                    </div>
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((row, idx) => (
                  <tr key={getRowId(row)} onClick={onRowClick ? () => onRowClick(row) : undefined} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                    {selectable && (
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedSet.has(getRowId(row))}
                          onChange={handleToggleRow(row)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {showIndex && (
                      <td>{typeof page === 'number' && typeof pageSize === 'number' ? (page - 1) * pageSize + (idx + 1) : idx + 1}</td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key}>
                        {renderCell(col, row, idx)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={(columns?.length || 0) + (selectable ? 1 : 0) + (showIndex ? 1 : 0)}>
                    <div className="text-center text-muted py-4">{emptyMessage}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {typeof page === 'number' && typeof pageSize === 'number' && typeof total === 'number' && onPageChange && (
          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="text-muted small">Page {page} of {totalPages}</div>
            <div className="btn-group">
              <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
              <button className="btn btn-outline-secondary btn-sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    cell: PropTypes.func,
    sortable: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selectable: PropTypes.bool,
  selectedRowIds: PropTypes.oneOfType([
    PropTypes.instanceOf(Set),
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  onSelectChange: PropTypes.func,
  onRowClick: PropTypes.func,
  sortBy: PropTypes.shape({ key: PropTypes.string, direction: PropTypes.oneOf(['asc', 'desc']) }),
  onSortChange: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  headerExtras: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  showIndex: PropTypes.bool,
  stickyHeader: PropTypes.bool,
  className: PropTypes.string,
};

export default DataTable;

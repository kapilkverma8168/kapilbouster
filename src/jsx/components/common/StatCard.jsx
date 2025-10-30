import React from 'react';
import PropTypes from 'prop-types';
import './statcard.css';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'light',
  loading = false,
  className = '',
}) => {

  return (
    <div className={`stat-card mb-3 ${className}`}>
      <div className="card-body w-100">
        <div className="d-flex align-items-start justify-content-between mb-2">
            <div className="stat-card__title">{title}</div>
          {icon ? <span className="stat-card__title">{icon}</span> : null}
        </div>
          <div className="stat-card__value">
          {loading ? (
            <span className="placeholder-glow">
              <span className="placeholder col-6" />
            </span>
          ) : (
            value
          )}
        </div>
        {subtitle ? <div className="text-muted small mt-1">{subtitle}</div> : null}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  color: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default StatCard;

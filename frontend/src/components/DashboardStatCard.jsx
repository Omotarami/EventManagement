import React from 'react';
import PropTypes from 'prop-types';

/**
 * DashboardStatCard -
 * 
 * @param {Object} props
 * @param {string} props.title 
 * @param {string|number} props.value 
 * @param {React.ReactNode} props.icon 
 * @param {string} props.accentColor 
 * @param {Object} props.customStyles 
 * @param {string} props.className  
 */
const DashboardStatCard = ({
  title,
  value,
  icon,
  accentColor = '#2A9D8F',
  customStyles = {},
  className = '',
}) => {
  // Default styles 
  const defaultStyles = {
    card: {
      width: '357px', // Explicit fixed width
      maxWidth: '100%', // Ensures responsiveness
      backgroundColor: '#f2f2f2',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    accentLine: {
      position: 'absolute',
      left: 0,
      top: '15%',
      height: '70%',
      width: '4px',
      backgroundColor: accentColor,
    },
    content: {
      marginLeft: '16px',
      flex: 1,
    },
    title: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#333',
      margin: 0,
    },
    value: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#000',
      margin: '4px 0 0 0',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  // Merge default styles with custom styles
  const mergedStyles = {
    card: { ...defaultStyles.card, ...customStyles.card },
    accentLine: { ...defaultStyles.accentLine, ...customStyles.accentLine },
    content: { ...defaultStyles.content, ...customStyles.content },
    title: { ...defaultStyles.title, ...customStyles.title },
    value: { ...defaultStyles.value, ...customStyles.value },
    iconContainer: { ...defaultStyles.iconContainer, ...customStyles.iconContainer },
  };

  return (
    <div 
      className={`dashboard-stat-card ${className}`} 
      style={mergedStyles.card}
    >
      <div 
        className="accent-line" 
        style={mergedStyles.accentLine} 
      />
      
      <div 
        className="card-content" 
        style={mergedStyles.content}
      >
        <h3 style={mergedStyles.title}>{title}</h3>
        <p style={mergedStyles.value}>{value}</p>
      </div>
      
      <div 
        className="card-icon" 
        style={mergedStyles.iconContainer}
      >
        {icon}
      </div>
    </div>
  );
};

DashboardStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  accentColor: PropTypes.string,
  customStyles: PropTypes.object,
  className: PropTypes.string,
};

export default DashboardStatCard;
'use client'

// import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import theme from '@/app/theme';

const CheckLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + div {
    background: rgba(97, 97, 97, .15);  
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 36px;
    border: 1px solid #000;
    border-radius: 18px;
    font-family: ${theme.fonts.primary};
    font-size: .75rem;
    color: #333;
    transition: 300ms ease;

    &:hover {
      background: ${theme.colors.lightTan} !important;
    }
  }
`;

const CheckButton = ({ isChecked, handleChange, name }) => {
  return (
    <CheckLabel>
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={(e) => handleChange(e, name)}
      />
      <div>
        <span>{ name }</span>
      </div>
    </CheckLabel>
  )
};

const CertificationsFilterContainer = styled.div`
  display: flex;
  gap: 6px;
`;

const CertificationsFilter = ({ certifications, handleCertificationsFilterChange }) => {
  return (
    <CertificationsFilterContainer>
      <CheckButton
        name="GIA" 
        isChecked={certifications.indexOf('GIA')>=0} 
        handleChange={handleCertificationsFilterChange} 
      />

      <CheckButton
        name="GCAL" 
        isChecked={certifications.indexOf('GCAL')>=0} 
        handleChange={handleCertificationsFilterChange} 
      />

      <CheckButton
        name="IGI" 
        isChecked={certifications.indexOf('IGI')>=0} 
        handleChange={handleCertificationsFilterChange} 
      />
    </CertificationsFilterContainer>
  )
}

export default CertificationsFilter;

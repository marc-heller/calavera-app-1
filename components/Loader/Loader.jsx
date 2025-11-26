'use client';

import React from 'react';
import styled from '@emotion/styled';
import theme from '@/app/theme';

const Container = styled.div`
  position: relative;
  width: 100% !important;
  height: 100%;
  display: flex;
  flex-direction: row !important;
  justify-content: center;
  margin: 10px 0;
  z-index: 999999999999;

  > div {
    flex: none;
    position: relative;
    width: ${props => props.$size ? props.$size : 60}px;
    max-width: 90%;
  }
`;

const Spinner = styled.div`
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  svg {
    width: 100%;
    height: 100%;
    animation: rotate 2s linear infinite;

    circle {
      stroke: ${theme.colors.primary};
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
  }
`;

const Loader = ({ size }) => {
  return (
    <Container $size={size}>
      <Spinner> 
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
      </Spinner>
    </Container>
  )
};

export default Loader;

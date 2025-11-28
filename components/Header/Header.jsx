'use client';

import styled from 'styled-components';
// import { Inter } from 'next/font/google';

const HeaderContainer = styled.div`
  width: 100%;
  background: #000;  
  display: flex;
  justify-content: flex-start;
  z-index: 1000;

  img {
    padding: 20px 20px 20px 60px;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <img src="/images/logo.png" alt="Calavera New York" />
    </HeaderContainer>
  );
}

export default Header;

'use client';
``
import { useState, useEffect, useMemo, useRef, Fragment } from 'react';
// import { Suspense } from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { notFound } from 'next/navigation';
// import { revalidatePath } from 'next/cache';
// import parse from 'html-react-parser';
// import ProgressBar from './progressBar';
// import styled from '@emotion/styled';
import styled from 'styled-components';
import DiamondSVG from '@/app/assets/DiamondSVG';
import ShapesFilter from '@/components/Filters/Shapes';
import CertificationsFilter from '@/components/Filters/Certifications';
import Select from 'react-select';
import Loader from '@/components/Loader/Loader';
import theme from '@/app/theme';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import sampleItems from './data';
import useIsIntersecting from '@/hooks/useIsIntersecting';
// import { avenir } from '@/app/fonts';

const breakpointFilters = '950px';

const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${theme.colors.lightestTan};
`;

const Header = styled.div`
  width: 100%;
  text-align: center;
  font-family: ${theme.fonts.primary};
  font-size: 1.9rem;
  font-weight: 600;
  padding: 30px 0 8px;
`;

const Filters = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
 
  > div {
    width: 100%;
    max-width: ${theme.breakpoints.xl};
    display: flex;
    flex-flow: row wrap;
    column-gap: 50px;
    row-gap: 24px;
    border: 1px solid hsl(0, 0%, 20%);
    border-radius: 6px;
    padding: 20px 30px;
    background: #fff;

    @media screen and (max-width: ${breakpointFilters}) {
      max-width: 600px;
      flex-flow: column nowrap;
    }
  }

  .rc-slider-dot { /* the dots at each step on the slider */
    display: none;
  }

  /* apply faded color to inactive marks; needs adjustment because of offsetting of marks compared to rail */
  .rc-slider-mark-text-active:has(+ .rc-slider-mark-text:not(.rc-slider-mark-text-active)) {
    color: #999;
  }

  .rc-slider-mark-text {
    color: hsl(0, 0%, 20%);
    font-family: ${theme.fonts.secondary};
    font-size: 1rem;
    font-weight: 600;
  }
  

  .rc-slider-handle {
    background: #000;
    border: none;
    box-shadow: none;
    width: 18px;
    height: 18px;
    margin-top: -7px;
    opacity: 1;
    transition: transform 0.2s ease;
  }

  .rc-slider-handle:focus-visible,
  .rc-slider-handle-dragging {
    border: none;
    box-shadow: none;
  }

  /* Halo ring */
  .rc-slider-handle::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 8px solid ${theme.colors.tan};
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  /* Show halo */
  .rc-slider-handle:hover::before,
  .rc-slider-handle-dragging::before {
    transform: translate(-50%, -50%) scale(1);
    opacity: .8;
  }

  /* Pressed: pulse animation */
  @keyframes sliderPulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50%      { transform: translateX(-50%) scale(1.2); }
  }

  .rc-slider-handle:active,
  .rc-slider-handle:focus {
    box-shadow: none;
    border: none;
    transform: translateX(-50%) scale(1);
    animation: sliderPulse 0.6s ease-in-out;
  }

  .rc-slider-handle:active::before {
    transform: translateX(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
`;

const MoreFilters = styled(Filters)`
  padding-top: 0;

  > div {
    border-top: none;
    padding-top: 20px;
  }
`;

const GridOptions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding: 0 20px;

  > div {
    width: 100%;
    max-width: ${theme.breakpoints.xl};
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: ${theme.breakpoints.sm}) {
      flex-direction: column;
    }
  }
`;

const ResultsCopy = styled.div`
  display: flex;
  align-items: center;
  font-family: ${theme.fonts.primary};
  font-size: 1rem;
  font-weight: 600;
  color: hsl(0, 0%, 20%);
  margin-left: 8px;

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: 4px;
  }
`;

const GridOptionsRight = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const GridContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
  padding: 0 20px 30px;

  > div {
    width: 100%;
    max-width: ${theme.breakpoints.xl};
    border: 4px solid #000;
    border-radius: 16px;
  }

  > div > div {
    width: 100%;
    border: 6px solid ${theme.colors.tan}; /* #bca86b; */
    border-radius: 12px;
    padding: 20px;
    background: ${theme.colors.lightGray};
  }
`;

const DiamondGrid = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  font-family: ${theme.fonts.primary};
`;

const Tile = styled.div`
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;

  &.flat {
    height: 0%;
  }

  a {
    color: #000;
    text-decoration: none;
    transition: 0.25s;

    &:focus,
    &:visited {
      color: #000000;
    }

    &:hover {
      text-decoration: underline;
    }
  }
`;

const DiamondImage = styled.div`
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  background-image: ${props => props.$src ? `url(${props.$src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  border: 1px solid hsl(0, 0%, 80%);
  overflow: hidden;
`;

const DiamondImageList = styled(DiamondImage)`
  width: 60px;
  margin: 5px 12px 5px 5px;
`;

const TileHeading = styled.div`
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 10px 0;
	color: hsl(0, 0%, 20%);
	margin-top: 1px;
`;

const TileDetails = styled.div`
  padding: 2px 10px 0;
  color: hsl(0, 0%, 20%);
  font-size: .75rem;

  span {
    font-weight: 600;
  }
`;

const TileFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 10px;
`;

const Price = styled.div`
  font-family: ${theme.fonts.secondary};
  font-size: 1rem;
  font-weight: 600;
`;

const Certification = styled.div`
  display: flex;
  flex-flow: row nowrap;
  color: ${theme.colors.darkestTan};
  font-family: ${theme.fonts.secondary};
  font-size: .75rem;
  margin-top: 2px;

  > div:first-of-type {
    margin-right: 3px;
  }

  > div:last-of-type {
    margin-top: 5px;
  }
`;

const DiamondList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  row-gap: 4px;

  > div {
    min-height: 36px;
    display: flex;
    align-items: center;
    font-family: ${theme.fonts.primary};
    font-size: 1rem;

    @media screen and (max-width: ${theme.breakpoints.sm}) {
      font-size: .75rem;
    }
  }

  @media screen and (max-width: 910px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    row-gap: 0;

    > *:nth-of-type(1),
    > *:nth-of-type(2),
    > *:nth-of-type(3),
    > *:nth-of-type(4),
    > *:nth-of-type(5),
    > *:nth-of-type(6),
    > *:nth-of-type(7),
    > *:nth-of-type(8) {
      align-items: flex-start;
    }

    > *:nth-of-type(8n + 5) {
      padding-left: 20px;
    }

    > *:nth-of-type(5) {
      margin-left: 8px;
      padding-left: 12px;
    }
    
    > *:nth-of-type(16n + 1) {
      border-radius: 12px 0 0 0 !important;
    }

    > *:nth-of-type(16n + 5) {
      border-radius: 0 0 0 12px;
    }

    > *:nth-of-type(16n + 4) {
      border-radius: 0 12px 0 0;
    }

    > *:nth-of-type(16n + 8) {
      border-radius: 0 0 12px 0 !important;
    }

    > *:nth-of-type(16n + 1),
    > *:nth-of-type(16n + 2),
    > *:nth-of-type(16n + 3),
    > *:nth-of-type(16n + 4) {
      margin-top: 4px;
    }

    > *:nth-of-type(8n + 1),
    > *:nth-of-type(8n + 2),
    > *:nth-of-type(8n + 3),
    > *:nth-of-type(8n + 4) {
      padding-top: 6px;
    }
  }

  > *:nth-of-type(8n + 1) {
    padding-left: 12px;
  }

  > *:nth-of-type(8n + 8) {
    padding-right: 12px;
  }
  
  > *:nth-of-type(8n + 1),
  > *:nth-of-type(16n + 1) {
    border-radius: 12px 0 0 12px;
  }

  > *:nth-of-type(8n + 8),
  > *:nth-of-type(16n + 8) {
    border-radius: 0 12px 12px 0;
  }

  
  > *:nth-of-type(1) {
    margin-left: 8px;
  }

  @media screen and (max-width: 910px) {
    > *:nth-of-type(1),
    > *:nth-of-type(2),
    > *:nth-of-type(3),
    > *:nth-of-type(4) {
      border-bottom: 1px solid hsl(0, 0%, 80%);
    }
  }

  > *:nth-of-type(1),
  > *:nth-of-type(2),
  > *:nth-of-type(3),
  > *:nth-of-type(4),
  > *:nth-of-type(5),
  > *:nth-of-type(6),
  > *:nth-of-type(7),
  > *:nth-of-type(8) { /* header */
    font-weight: 600;
  }

  > *:nth-of-type(16n + 1),
  > *:nth-of-type(16n + 2),
  > *:nth-of-type(16n + 3),
  > *:nth-of-type(16n + 4),
  > *:nth-of-type(16n + 5),
  > *:nth-of-type(16n + 6),
  > *:nth-of-type(16n + 7),
  > *:nth-of-type(16n + 8) {
    background-color: ${theme.colors.lightestTan}; /* every second row */
    
    @media screen and (max-width: 910px) {
      padding-top: 8px;
    }
  }
`;

const DiamondListCellContainer = styled.div`
  background: ${props => props.$isHovered ? theme.colors.lightTan + '!important' : 'initial'};
  cursor: pointer;
  user-select: none;
`;

const DiamondListCell = ({ row, hoveredRow, setHoveredRow, handleListItemClick, children }) => {
  return (
    <DiamondListCellContainer 
      $isHovered={row===hoveredRow}
      onMouseEnter={() => setHoveredRow(row)}
      onMouseLeave={() => setHoveredRow(null)}
      onClick={() => handleListItemClick(row)}
    >
      { children }
    </DiamondListCellContainer>
  )
};

const GridListIconContainer = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 4px;

  > svg {
    width: 100%;
    height: 100%;
    fill: hsl(0, 0%, 25%);
  }
`;

const GridIcon = () => {
  return (
    <GridListIconContainer>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
        <path style={{fill: 'none'}} d="M0 0 H24 V24 H0 V0 z" />
        <path d="M5,11h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2H5C3.9,3,3,3.9,3,5v4C3,10.1,3.9,11,5,11z" />
        <path d="M5,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2H5c-1.1,0-2,0.9-2,2v4C3,20.1,3.9,21,5,21z" />
        <path d="M13,5v4c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-4C13.9,3,13,3.9,13,5z" />
        <path d="M15,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2h-4c-1.1,0-2,0.9-2,2v4C13,20.1,13.9,21,15,21z" />
      </svg>
    </GridListIconContainer>
  )
}

const ListIcon = () => {
  return (
    <GridListIconContainer>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
        <path style={{fill: 'none'}} d="M0 0 H24 V24 H0 V0 z" />
        <path d="M19,13H5c-1.1,0-2,0.9-2,2v4c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-4C21,13.9,20.1,13,19,13z" />
        <path d="M19,3H5C3.9,3,3,3.9,3,5v4c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z" />
      </svg>
    </GridListIconContainer>
  )
}

const GridListButton = styled.button`
  display: flex;
  flex-flow: row nowrap;
  height: 38px;
  width: 82px;
  padding: 6px 10px 6px;
  outline: none;
  background: #fff;
  border: 1px solid hsl(0, 0%, 80%);
  color: ${props => props.$view===props.$name ? 'hsl(0, 0%, 20%)' : 'hsl(0, 0%, 30%)'};
  font-family: ${theme.fonts.primary};
  font-weight: ${props => props.$view===props.$name ? '600' : '400'};
  font-size: 1rem;
  cursor: ${props => props.$view===props.$name ? 'initial' : 'pointer'};

  path {
    fill: ${props => props.$view===props.$name ? 'hsl(0, 0%, 20%)' : 'hsl(0, 0%, 40%)'};
  }

  &:hover {
    color:hsl(0, 0%, 20%);
    font-weight: 600;

    path {
      fill:hsl(0, 0%, 20%);
    }
  }
  
  &:hover {
    background: ${props => props.$view===props.$name ? '#fff' : theme.colors.lightestTan};
  }

  > div {
    display: flex;
    align-items: center;
  }

  &:first-of-type {
    border-radius: 6px 0 0 6px;
  }

  &:last-of-type {
    border-radius: 0 6px 6px 0;
    border-left: none;
  }

  > div:last-of-type {
    margin-top: 2px;
  }
`;

const FilterItem = styled.div`
  flex: 1 45%;
  min-width: 325px;
  display: flex;
  flex-flow: column nowrap;

  &.girdle {
    margin-bottom: 12px;
  } 

  .certifications {
    display: flex;
    flex-flow: column nowrap;
    padding-right: 24px;

    @media screen and (max-width: ${breakpointFilters}) {
      margin-top: 12px;
    } 
  }

  .has-image {
    display: flex;
    flex-flow: row nowrap;

    margin-top: 12px;

    @media screen and (max-width: ${breakpointFilters}) {
      margin-top: 20px;
    } 

    label {
      span {
        font-family: ${theme.fonts.primary};
        font-size: 1rem;
        font-weight: 600;
        text-transform: capitalize;

        @media screen and (max-width: ${theme.breakpoints.sm}) {
          font-size: .75rem;
        }

        @media screen and (max-width: 500px) {
          margin-top: 12px;
        }
      }
    }

    input {
      margin-left: 10px;
    }

    input:checked {
      accent-color: ${theme.colors.darkestTan};
    }
  }
`;

const FilterItemSplit = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CertNumberFilterItem = styled.div`
  flex: 1 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: -12px 0 12px 0;

  > div:last-of-type {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`;

const RangeLabel = styled.div`
  flex: none;
  width: 100%;
  margin: 10px 0 0 -4px;
  color: ${theme.colors.darkestTan};
  font-family: ${theme.fonts.primary};
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    font-size: .75rem;
  }
`;

const CertNumberLabel = styled(RangeLabel)`
  width: initial;
  margin: 0;
  margin-bottom: 6px;
`;

const RangeFilter = styled.div(props => (`
  flex: none;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  
  .rc-slider-mark {
    left: ${props.$markLeft}% !important;
  }

  .rc-slider-mark-text {
    font-size: .75rem;

    @media screen and (max-width: ${theme.breakpoints.sm}) {
      font-size: .6rem;
    }
  }
`));


/* 
  .rc-slider-rail,
  .rc-slider-track,
  .rc-slider-step
*/

const RangeFields = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 8px 0 -16px;

  > div {
    position: relative;
  }

  input {
    position: relative;
    width: 90px;
    border-radius: 8px;
    padding: 2px 8px;
    outline: none;
    border: 1px solid #ccc;
    font-family: ${theme.fonts.secondary};
    font-size: .75rem;
  }
`;

const DollarRangeFields = styled(RangeFields)`
  > div::before {
    content: '$';
    position: absolute;
    left: 8px;
    top: 3px;
    z-index: 100;
    font-size: .75rem;
  }

  input {
    padding-left: 14px;
  }
`;

const CertNumberField = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  margin-right: 12px;

  > div {
    position: relative;
  }

  input {
    position: relative;
    width: 200px;
    height: 30px;
    border-radius: 8px;
    padding: 2px 8px;
    outline: none;
    border: 1px solid hsl(0, 0%, 20%);
    font-size: 1rem;
  }
`;

const CertNumberSubmitButton = styled.button`
  background: ${theme.colors.lightestTan};
  height: 30px;
  color: hsl(0, 0%, 20%);
  font-family: ${theme.fonts.primary};
  font-weight: 600;
  font-size: 1rem;
  padding: 3px 20px;
  outline: none;
  border: 1px solid hsl(0, 0%, 80%);
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.lightTan};
    border: 1px solid hsl(0, 0%, 40%);
  }
`;

const CollapsibleHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;

  > div {
    width: 100%;
    max-width: ${theme.breakpoints.xl};
    border: 1px solid hsl(0, 0%, 20%);
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    padding: 20px;
    background: #fff;
    font-family: ${theme.fonts.primary};
    font-size: 1rem;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
    user-select: none;
    
    @media screen and (max-width: ${breakpointFilters}) {
      max-width: 600px;
    }

    &:hover {
      background: ${theme.colors.lightTan};
      color: ${theme.colors.darkestTan}; 
      transition: .3s;

      path {
        fill: ${theme.colors.darkestTan}; 
      }
    }
  }
`;

const CaretContainer = styled.div`
  width: 40px;
  margin-left: 12px;
  cursor: pointer;
  transition: .6s;

  &.inverted {
    transform: rotate(180deg);
  }

  > svg {
    margin-bottom: -10px;
    width: 100%;
    height: 100%;
  }
`;

const Caret = ({ isExpanded }) => {
  return (
    <CaretContainer className={isExpanded ? 'inverted' : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0">
        <path d="m26.543 18.762c-0.49219 0-0.95312 0.23047-1.2461 0.62109l-12.688 17.094c-0.42969 0.58203-0.39844 1.3867 0.070313 1.9375l36.125 42.285c0.29687 0.34766 0.73047 0.54688 1.1875 0.54688 0.45703 0 0.89062-0.19922 1.1875-0.54688l36.125-42.285c0.46875-0.55078 0.5-1.3555 0.070312-1.9375l-12.688-17.094c-0.30078-0.39844-0.76953-0.62891-1.2695-0.62109zm0.78516 3.1367h45.305l11.488 15.434-34.117 39.953-34.141-39.953z"/>
        <path d="m13.855 35.832c-0.41797-0.003906-0.81641 0.16016-1.1133 0.45703-0.29297 0.29297-0.45703 0.69531-0.45703 1.1094 0 0.41797 0.16406 0.81641 0.45703 1.1133 0.29687 0.29297 0.69531 0.45703 1.1133 0.45703h72.25c0.41797 0 0.81641-0.16406 1.1094-0.45703 0.29688-0.29688 0.46094-0.69531 0.46094-1.1133 0-0.41406-0.16406-0.81641-0.46094-1.1094-0.29297-0.29687-0.69141-0.46094-1.1094-0.45703z"/>
        <path d="m37.246 19.773-6.5273 17.07c-0.14062 0.375-0.13281 0.78516 0.023438 1.1523l17.809 42.285 2.8828-1.2227-17.578-41.684 6.3203-16.492z"/>
        <path d="m59.809 20.883 6.2969 16.492-17.555 41.684 2.8828 1.2227 17.809-42.285c0.14844-0.37109 0.14844-0.78125 0-1.1523l-6.5273-17.07z"/>
      </svg>
    </CaretContainer>
  )
}

const CollapsibleContent = styled.div`
  width: 100%;
  max-height: 0;
  overflow: hidden;
  transition: 1s;

  &.expanded {
    max-height: 1500px;
  }
`;

const FilterIconContainer = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;

  &+ div {
    margin-top: 2px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const FilterIcon = () => {
  return (
    <FilterIconContainer>
      <svg viewBox="0 0 24 24">
        <path style={{fill: 'none'}} d="M0 0h24v24H0z" />
        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
      </svg>
    </FilterIconContainer>
  )
}

const LoaderWrapper = styled.div`
  padding: 60px;  
`;

const DiamondGridLoaderWrapper = styled.div`
  padding: 90px 60px;  
`;

const DiamondListLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  grid-column: span 8;
  padding: 24px 8px 0;

  @media screen and (max-width: 910px) {
    grid-column: span 4;
  }
`;

const NoResults = styled.div`
  width: 100%;
  padding: 40px 0 60px;
  display: flex;
  justify-content: center;
  font-family: ${theme.fonts.primary};
  color: hsl(0, 0%, 20%);
  font-weight: 600;
  font-size: 1rem;
`;


const colorMarks = {
  0: 'M',
  1: 'L',
  2: 'K',
  3: 'J',
  4: 'I',
  5: 'H',
  6: 'G',
  7: 'F',
  8: 'E',
  9: 'D',
  10: <>&nbsp;</>
  /*
  D, E, F, G, H, I, J,
  K, L, M, N, NO, O,
  OP, PR, P, Q, QR,
  R, S, SZ, ST, T ,U
  ,UV ,V ,W ,WX ,X
  ,XY ,Y ,YZ ,Z ,
  FANCY
  */
};

const colorValues = ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'];


const clarityMarks = {
  0: 'SI2',
  1: 'SI1',
  2: 'VS2',
  3: 'VS1',
  4: 'IF',
  5: 'FL',
  6: <>&nbsp;</>
}

const clarityValues = ['SI2', 'SI1', 'VS2', 'VS1', 'IF', 'FL'];


const cutMarks = {
  0: 'Good',
  1: <>Very<br />Good</>,
  2: 'Excellent',
  3: 'Ideal',
  4: <>&nbsp;</>
/*
  P (poor), F (fair), G (good),
  VG (very good), EX (excellent), ID (ideal), EIGHTX (8X)
*/
};

const cutValues = ['G', 'VG', 'EX', 'ID'];


const polishMarks = {
  0: 'Good',
  1: <>Very<br />Good</>,
  2: 'Excellent',
  3: <>&nbsp;</>
};

const polishValues = ['G', 'VG', 'EX'];


const symmetryMarks = {
  0: 'Good',
  1: <>Very<br />Good</>,
  2: 'Excellent',
  3: <>&nbsp;</>
};

const symmetryValues = ['G', 'VG', 'EX'];


const fluorescenceMarks = {
  0: 'None',
  1: 'Faint',
  2: 'Med.',
  3: 'Strong',
  4: <>Very<br />Strong</>,
  5: <>&nbsp;</>
};

const fluorescenceValues = ['NON', 'FNT', 'MED', 'STG', 'VST'];


const girdleMarks = {
  0: <>Ext.<br />Thin</>,
  1: <>Very<br />Thin</>,
  2: 'Thin',
  3: 'Med.',
  4: <>Sli.<br />Thick</>,
  5: 'Thick',
  6: <>Very<br />Thick</>,
  7: <>Ext.<br />Thick</>,
  8: <>&nbsp;</>
};

const girdleValues = ['ETN', 'VTN', 'THN', 'MED', 'STK', 'THK', 'VTK', 'ETK'];

/*
{
    style: {
      color: 'red',
    },
    label: <strong>100°C</strong>,
  },
*/

/*
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState();

  const initialRender = useRef(true); 

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      console.log('setDebouncedValue initial', value);
      setDebouncedValue(value); 
      return; 
    }

    const handler = setTimeout(() => {
      console.log('setDebouncedValue', value);
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
*/

export default function Diamonds () {
  // revalidatePath(`/articles/${slug}`);


  // 200 - 1,200 = increments of 50
  // 1,200 - 12,000 = increments of 100
  // 12,000 - 24,000 = increments of 500
  // 24,000 - 40,000 = increments of 1,000
  // 40,000 - 100,000 = increments of 5,000
  // 100,000 - 500,000 = increments of 50,000
  // 500,000 - 2,000,000 = increments of 100,000
  // 2,000,000 - 4,000,000 = increments of 200,000

  const priceTable = useMemo(() => {
    const ranges = [
      { start: 200, end: 1200, step: 50 },
      { start: 1300, end: 12000, step: 100 },
      { start: 12500, end: 24000, step: 500 },
      { start: 25000, end: 40000, step: 1000 },
      { start: 45000, end: 100000, step: 5000 },
      { start: 150000, end: 500000, step: 50000 },
      // { start: 600000, end: 2000000, step: 100000 },
      // { start: 2200000, end: 4000000, step: 200000 }
    ];

    const values = [];
    for (const { start, end, step } of ranges) {
      for (let v = start; v <= end; v += step) {
        values.push(v);
      }
    }
    // console.log('priceTable', values);
    return values;
  });

  const pricePerCaratTable = useMemo(() => {
    const ranges = [
      { start: 0, end: 1200, step: 50 },
      { start: 1300, end: 12000, step: 100 },
      { start: 12500, end: 24000, step: 500 },
      { start: 25000, end: 50000, step: 1000 },
    ];

    const values = [];
    for (const { start, end, step } of ranges) {
      for (let v = start; v <= end; v += step) {
        values.push(v);
      }
    }
    // console.log('pricePerCaratTable', values);
    return values;
  });

  const [filters, setFilters] = useState({
    labgrown: false,
    shapes: ["ROUND"], // Will default to just ROUND if leave empty
    carat: [.15, 35],
    color: [0, 10],
    clarity: [0, 6],
    cut: [0, 4],
    price: [0, priceTable.length - 1],
    polish: [0, 3],
    symmetry: [0, 3],
    fluorescence: [0, 5],
    certifications: [],
    table: [0, 100],
    depth: [0, 100],
    lwRatio: [1, 2.75],
    length: [3, 20],
    width: [3, 20],
    height: [2, 12],
    crownAngle: [23, 40],
    pavilionAngle: [38, 43],
    girdle: [0, 8],
    pricePerCarat: [0, pricePerCaratTable.length - 1],
    hasImage: true,
  });

  const [submitFilters, setSubmitFilters] = useState({...filters});
  // const submitFilters = useDebounce(filters, 300);
  const [sortOrder, setSortOrder] = useState({
    value: {type: 'price', direction: 'ASC'}, 
    label: 'Price: Low to High'
  });

  const [certNumber, setCertNumber] = useState('');
  const [submitCertNumber, setSubmitCertNumber] = useState('');
  
  const [view, setView] = useState('grid');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1); // triggers async fetchData call
  const [loadedPage, setLoadedPage] = useState(0); 
  const [isMoreData, setIsMoreData] = useState(true); 
  const loadMoreRef = useRef(null);
  const isIntersectingLoadMore = useIsIntersecting(loadMoreRef, '500px', 0, loading);
  const [totalCount, setTotalCount] = useState(0);
  const [resultCount, setResultCount] = useState(0);
  
  // const [isFilterValuesChanging, setIsFilterValuesChanging] = useState(false);

  useEffect(() =>  {
    if (  isIntersectingLoadMore && 
          isMoreData && 
          loadedPage===page && 
          !loading) {
      setPage(prev => prev + 1);
    } else if (loadedPage===page && loading) {
      setLoading(false);
    }
  }, [isIntersectingLoadMore, page, loadedPage, isMoreData]);
  
  useEffect(() => {
    // Reset page for when fetching data again with new filters
    setPage(1);
    setItems([]); // Clear displayed items
    setIsMoreData(true);
  }, [submitFilters, sortOrder, submitCertNumber]);


  const controllerRef = useRef(null);

  const [fetchDataSuccess, setFetchDataSuccess] = useState(false);
  const [fetchDataTrigger, setFetchDataTrigger] = useState(0);

  useEffect(() => {
    // Retry fetching data if it has failed
    if (!loading && fetchDataSuccess===false) {
      setFetchDataTrigger(prev => prev + 1);
    }
  }, [loading, fetchDataSuccess]);

  
  useEffect(() => {
    // console.log('RUNNING FETCH DATA USE EFFECT LINE 1063 submitCertNumber, sortOrder, page, isMoreData, submitFilters', 
    //  submitCertNumber, sortOrder, page, isMoreData, submitFilters );

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    /*
    async function auth() {
       const API_URL = 'http://wdc-intg-customer-staging.herokuapp.com/api/diamonds';
        // the API_URL for production is https://integrations.nivoda.net/api/diamonds';

        const username = 'testaccount@sample.com'; // For staging only
        const password = 'staging-nivoda-22'; // For staging only

        // Great documentation can be found here:
        // https://graphql.org/graphql-js/graphql-clients/

        // authentication query
        // for production, the username and password are the same as what you would use to login to the Nivoda platform
        // for staging, the username and password can be requested from tech @ nivoda dot net
         
        let authenticate_query = `{
          authenticate { 
            username_and_password(username: "${username}", password: "${password}") {
              token
            }
          }
        }
        `;

      let authenticate_result = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: authenticate_query }),
      });
      
      let res = await authenticate_result.json();
      console.log('authenticate_result', authenticate_result);
      console.log('authenticate_result res', res);

      // the authentication token to get in future requests
      if (res?.data?.authenticate?.username_and_password?.token) {
        
        let { token } = res?.data?.authenticate?.username_and_password;
        console.log('TOKEN', token);
      }
    }

    auth();
*/

    async function fetchData(page) {
      setLoading(true);
      setFetchDataSuccess(false);
      // console.log('fetchData setLoading true');
      setError(null);
      setIsMoreData(true);
      const { 
        labgrown, shapes, carat, color, clarity, cut, polish, symmetry, fluorescence,
        certifications, table, depth, lwRatio, length, width, height, 
        crownAngle, pavilionAngle, girdle, hasImage
      } = submitFilters;

      try {
        const payload = {
            ...(submitCertNumber!=='' && { certNumber: submitCertNumber }),
            page: page,
            order: {
              type: sortOrder.value.type || 'price',
              direction: sortOrder.value.direction || 'ASC'
            },
            labgrown: labgrown,
            ...(shapes.length>0 && { shapes: shapes }),
            carat: carat,
            color: colorValues.slice(color[0], color[1]),
            clarity: clarityValues.slice(clarity[0], clarity[1]),
            cut: cutValues.slice(cut[0], cut[1]),
            price: priceValues,
            polish: polishValues.slice(polish[0], polish[1]),
            symmetry: symmetryValues.slice(symmetry[0], symmetry[1]),
            fluorescence: fluorescenceValues.slice(fluorescence[0], fluorescence[1]),
            ...(certifications.length>0 && { certifications: certifications }),
            table: table,
            depth: depth,
            lwRatio: lwRatio,
            length: length,
            width: width,
            height: height,
            crownAngle: crownAngle,
            pavilionAngle: pavilionAngle,
            girdle: girdleValues.slice(girdle[0], girdle[1]),
            pricePerCarat: pricePerCaratValues,
            hasImage: hasImage
          };

        // console.log('================= fetchData payload', payload);
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal
          /*
          next: {
            revalidate: isEnabled ? 0 : 86400,
          },
          cache: isEnabled ? 'no-store' : undefined,
          */
        };

        // console.log('options', options);
        const response = await fetch(
          `/api/getDiamonds`,
          options,
        );

        // console.log('response', response);

        if (response.status===499) { // Call was aborted
          console.log('RESPONSE ABORTED 499');
          return;
        }

        if (!response.ok) {
          throw new Error(
            `API response was not OK. Status: ${response.status}, ${response.statusText}`,
          );
        }

        const json = await response.json();
        // console.log('page json', json);
        if (json?.errors !== null && json?.errors !== undefined) {
          const message = json.errors[0]?.message;
          throw new Error(`GraphQL error: ${message}`);
        }

        if (json.success === false || json.items === null || json.items === undefined) {
          throw new Error(`GraphQL error.`);
        }

        let { items, totalCount, resultCount, isMore } = json;

        items = items.map(item => {
          return {
            ...item, 
            price: item.price>0 ? item.price/100 : 0,
            id: item.id.replace('DIAMOND/', '')
          }
        });
        
        // console.log('items', items);
        if (!items || items === null) {
          console.log('ITEMS NOT FOUND');
          // revalidatePath(`/articles/${slug}`);
          // notFound();
        } else {
    
          setFetchDataSuccess(true);
          // console.log('totalCount', totalCount, 'page', page, 'isMore', isMore);
          if (page>1) {
            setItems(prev => [...prev, ...items]);
          } else {
            setItems(items);
          }
          setTotalCount(totalCount);
          setResultCount(resultCount);
          setLoadedPage(page);
          setIsMoreData(isMore);
        }
        // console.log('setLoading false line 1238');
        setLoading(false);
        // clear controller ref so next fetch can start immediately
      } catch (err) {
        if (err.name === "AbortError") {
          // 👍 Request was cancelled — do nothing
          // ensure loading flag is cleared when request was aborted
          console.log('fetch aborted (client)');
          return;
        }
        setError(err);
        // console.log('setLoading false line 1246');
        setLoading(false);
      } finally {
        controllerRef.current = null;
      }
    }

    // console.log('LINE 884', isMoreData, submitFilters);
    if (!submitFilters || !isMoreData) return;
    // console.log('LINE 886');
    fetchData(page);
    
    /*
    setLoading(true);
    setTimeout(() => {
      setItems(prev => [...prev, ...sampleItems]);
      setLoadedPage(page);
      // setPage(prev => prev + 1);
      setIsMoreData((page < 4) ? true : false);
    }, 500);
    */

    return () => {
      // console.log('CANCELLED FETCH DATA USE EFFECT');
      controllerRef.current?.abort();
    };
  }, [submitFilters, submitCertNumber, sortOrder, page, isMoreData, fetchDataTrigger]); // sampleItems

  
  const handleFilterDescriptiveRangeChange = (name, value, isChangeComplete) => {
    if (value[1] - value[0] > 0 && (filters[name][0]!==value[0] || filters[name][1]!==value[1])) {
      setFilters((prev) => {
        return {
          ...prev,
          [name]: value
        }
      })
    }
    if (isChangeComplete && value[1] - value[0] > 0 && (submitFilters[name][0]!==value[0] || submitFilters[name][1]!==value[1])) {
      setSubmitFilters((prev) => {
        return {
          ...prev,
          [name]: value
        }
      })
    }
  }

  const handleFilterNumericRangeChange = (name, value, isChangeComplete) => {
    if (value[1] < value[0]) value[1] = value[0];
    if (value[0] > value[1]) value[0] = value[1];
    if (filters[name][0]!==value[0] || filters[name][1]!==value[1]) {
      setFilters((prev) => {
        return {
          ...prev,
          [name]: value
        }
      })
    }
    if (isChangeComplete && (submitFilters[name][0]!==value[0] || submitFilters[name][1]!==value[1])) {
      setSubmitFilters((prev) => {
        return {
          ...prev,
          [name]: value
        }
      }) 
    }
  }

  const cursorPosRef = useRef(0);

  const handleCursorPosRef = (el) => {
    if (!el) return;
    const pos = cursorPosRef.current;
    const hasSelection = el.selectionStart !==  el.selectionEnd;
    if (!hasSelection) el.setSelectionRange(pos, pos);
  }

  const handleFilterFieldChange = (e) => {
    // console.log('handleFilterFieldChange e.target.selectionStart', e.target.selectionStart)
    cursorPosRef.current = e.target.selectionStart;
    let { name, value } = e.target;
    let [filterName, index] = name.split('[');
    index = parseInt(index.replace(']', ''));
    let newRange = [...filters[filterName]];
    value = value.replace(/[^0-9.]/g, '');
    value = value.replace(/(?<=\..*)\./g, '');
    if (value==='' || Number.isNaN(value)) {
      value = index === 0 ? e.target.min : e.target.max;
    } 
    newRange[index] = value; 
    setFilters((prev) => {
      return {
        ...prev,
        [filterName]: newRange
      }
    });
  }

  const handleFilterFieldBlur = (e) => {
    let { name, value } = e.target;
    let [filterName, index] = name.split('[');
    index = parseInt(index.replace(']', ''));
    value = parseFloat(value);
    console.log('handleFilterFieldBlur value', value);
    let newRange = [parseFloat(filters[filterName][0]), parseFloat(filters[filterName][1])]; 
    if (index === 0 && value < parseFloat(e.target.min)) {
      newRange[0] = parseFloat(e.target.min);
          console.log('handleFilterFieldBlur a newRange[0]', newRange[0]);
    } else if (index === 1 && value > parseFloat(e.target.max)) {
      newRange[1] = parseFloat(e.target.max);
    }
    if (index===0 && value > newRange[1]) {
      
      newRange[0] = parseFloat(newRange[1]);
      newRange[0] = Math.round(newRange[0] * 100) / 100;
      console.log('handleFilterFieldBlur b newRange[0]', newRange[0]);
    }
    if (index===1 && value < newRange[0]) {
      newRange[1] = parseFloat(newRange[0]);
      newRange[1] = Math.round(newRange[1] * 100) / 100;
    }
    console.log('handleFilterFieldBlur newRange', newRange);
    if (filters[filterName][0]!==newRange[0] || filters[filterName][1]!==newRange[1]) {
      setFilters((prev) => {
        return {
          ...prev,
          [filterName]: newRange
        }
      });
    }
    if (submitFilters[filterName][0]!==newRange[0] || submitFilters[filterName][1]!==newRange[1]) {
      setSubmitFilters((prev) => {
        return {
          ...prev,
          [filterName]: newRange
        }
      })  
    }
  }

   
  const priceValueToKey = (index, value) => { // 
    let key = 0;
    for (let i = 0; i < priceTable.length; i++) {
      if (value >= priceTable[i] && value < priceTable[i+1]) {
        if (index===0) key = i; // min range
        if (index===1) key = i + 1; // max range
      }
    }
    if (value >= priceTable[priceTable.length - 1]) {
      key = priceTable.length - 1;
    }
    return key;
  }

  const pricePerCaratValueToKey = (index, value) => { // 
    let key = 0;
    for (let i = 0; i < pricePerCaratTable.length; i++) {
      if (value >= pricePerCaratTable[i] && value < pricePerCaratTable[i+1]) {
        if (index===0) key = i; // min range
        if (index===1) key = i + 1; // max range
      }
    }
    if (value >= pricePerCaratTable[pricePerCaratTable.length - 1]) {
      key = pricePerCaratTable.length - 1;
    }
    return key;
  }


  const [priceValues, setPriceValues] = useState([priceTable[0], priceTable[priceTable.length - 1]]);
  const [pricePerCaratValues, setPricePerCaratValues] = useState([pricePerCaratTable[0], pricePerCaratTable[pricePerCaratTable.length - 1]]);

  const handlePriceFilterChange = (name, value, isChangeComplete) => {
    if (name==='pricePerCarat') {
      setPricePerCaratValues([pricePerCaratTable[value[0]], pricePerCaratTable[value[1]]]);
    } else {
      setPriceValues([priceTable[value[0]], priceTable[value[1]]]);
    }
    if (filters[name][0]!==value[0] || filters[name][1]!==value[1]) {
      setFilters((prev) => {
        return {
          ...prev,
          [name]: value
        }
      });

    }
  if (isChangeComplete && (submitFilters[name][0]!==value[0] || submitFilters[name][1]!==value[1])) {
      setSubmitFilters((prev) => {
        return {
          ...prev,
          [name]: value
        }
      });
    }
  }

  const handlePriceFilterFieldChange = (e) => {
    let { name, value } = e.target;
    let [filterName, index] = name.split('[');
    index = parseInt(index.replace(']', ''));
    value = value.replace(/[^0-9]/g, '');
    value = parseInt(value);
    if (index===0) {
      if (filterName==='pricePerCarat') {
        setPricePerCaratValues(prev => [value, prev[1]]);
      } else {
        setPriceValues(prev => [value, prev[1]]);
      }
    } else {
      if (filterName==='pricePerCarat') {
        setPricePerCaratValues(prev => [prev[0], value]);
      } else {
        setPriceValues(prev => [prev[0], value]);
      }
    }
  }

  const handlePriceFilterFieldBlur = (e) => {
    let { name, value } = e.target;
    let [filterName, index] = name.split('[');
    index = parseInt(index.replace(']', ''));
    let newRange = [...filters[filterName]];
    value = value.replace(/[^0-9]/g, '');
    value = parseInt(value);
    if (Number.isNaN(value)) {
      value = index === 0 ? e.target.min : e.target.max;
    } 
    if (index === 0 && value < e.target.min) {
      value = e.target.min;
    } else if (index === 1 && value > e.target.max) {
      value = e.target.max;
    } else if (filterName==='price' && index === 0 && value > priceValues[1]) {
      value = priceValues[1];
    } else if (filterName==='price' && index === 1 && value < priceValues[0]) {
      value = priceValues[0];
    } else if (filterName==='pricePerCarat' && index === 0 && value > pricePerCaratValues[1]) {
      value = pricePerCaratValues[1];
    } else if (filterName==='pricePerCarat' && index === 1 && value < pricePerCaratValues[0]) {
      value = pricePerCaratValues[0];
    }
    let key;
    if (filterName==='pricePerCarat') {
      key = pricePerCaratValueToKey(index, value);
    } else {
      key = priceValueToKey(index, value);
    }
    newRange[index] = key; 
    if (filters[filterName][0]!==newRange[0] || filters[filterName][1]!==newRange[1]) {
      setFilters((prev) => {
        return {
          ...prev,
          [filterName]: newRange
        }
      });
    }
    if (submitFilters[filterName][0]!==newRange[0] || submitFilters[filterName][1]!==newRange[1]) {
      setSubmitFilters((prev) => {
        return {
          ...prev,
          [filterName]: newRange
        }
      });
    }
    if (index===0) {
      if (filterName==='pricePerCarat') {
        setPricePerCaratValues(prev => [value, prev[1]]);
      } else {
        setPriceValues(prev => [value, prev[1]]);
      }
    } else {
      if (filterName==='pricePerCarat') {
        setPricePerCaratValues(prev => [prev[0], value]);
      } else {
        setPriceValues(prev => [prev[0], value]);
      }
    }
  }

  const handleShapesFilterChange = (e, name) => {
    name = name.toUpperCase()
    let newShapes = [...filters.shapes];
    if (e.target.checked===true && filters.shapes.indexOf(name)<0) {
      newShapes.push(name);
    } else if (e.target.checked===false && filters.shapes.indexOf(name)>-1) {
      newShapes = newShapes.filter(item => item !== name);
    }
    setFilters((prev) => {
      return {
        ...prev,
        shapes: newShapes
      }
    });
    setSubmitFilters((prev) => {
      return {
        ...prev,
        shapes: newShapes
      }
    }); 
  };

  const handleCertificationsFilterChange = (e, name) => {
    let newCerts = [...filters.certifications];
    if (e.target.checked===true && filters.shapes.indexOf(name)<0) {
      newCerts.push(name);
    } else if (e.target.checked===false && filters.certifications.indexOf(name)>-1) {
      newCerts = newCerts.filter(item => item !== name);
    }
    setFilters((prev) => {
      return {
        ...prev,
        certifications: newCerts
      }
    });
    setSubmitFilters((prev) => {
      return {
        ...prev,
        certifications: newCerts
      }
    });
  };

  const handleChangeSortOrder = (selectedOption) => {
    if (sortOrder.value.type!==selectedOption.value.type || sortOrder.value.direction!==selectedOption.value.direction) setSortOrder(selectedOption);
  };

  const toggleHasImage = () => {
    setFilters((prev) => {
      return {
        ...prev,
        hasImage: !prev.hasImage
      }
    });
    setSubmitFilters((prev) => {
      return {
        ...prev,
        hasImage: !prev.hasImage
      }
    });
  };

  const [expanded, setExpanded] = useState('');

  const toggleCollapsible = (name) => {
    if (expanded===name) {
      setExpanded('');
    } else if (expanded!==name) {
      setExpanded(name);
    }
  };
  
  const handleCertNumberFieldChange = (e) => {
    const { value } = e.target;
    setCertNumber(value);
  };

  const handleCertNumberFieldBlur = (e) => {
    setSubmitCertNumber(certNumber.trim());
  };

  const handleCertNumberSubmitClick = () => {
    if (certNumber!=='') setSubmitCertNumber(certNumber.trim());
  };
  
  const handleClickView = (view) => {
    setView(view);
  };

  const [hoveredRow, setHoveredRow] = useState(null);

  const router = useRouter();

  const handleListItemClick = (index) => {
    if (items[index] && items[index].id) {
      router.push('/diamond/'+items[index].id);
    }
  }

  return (
    <Background>
      <Header>
        {filters.labgrown ? 'Lab Grown' : 'Natural'} Diamonds
      </Header>
      <Filters>
        <div>
          <FilterItem>
            <RangeLabel>Shapes</RangeLabel>
            <RangeFilter>
              <ShapesFilter 
                shapes={filters.shapes} 
                handleShapesFilterChange={handleShapesFilterChange} 
              />
            </RangeFilter>
          </FilterItem>

          <FilterItem>
            <RangeLabel>Carat</RangeLabel>
            <RangeFilter>
              <Slider 
                value={[filters.carat[0], filters.carat[1]]}
                onChange={(value) => handleFilterNumericRangeChange('carat', value, false)}
                onChangeComplete={(value) => handleFilterNumericRangeChange('carat', value, true)}
                range 
                step={.05} 
                min={.15} 
                max={35} 
                allowCross={false}
                dots={false}
                styles={{
                  track:{ 
                    background: '#000',
                    height: 2
                  },
                  rail: { 
                    background: '#cccccc',
                    height: 2
                  }
                }}

              />
              <RangeFields>
                <input
                  name="carat[0]"
                  type="text"
                  value={filters.carat[0]}
                  onChange={handleFilterFieldChange} 
                  onBlur={handleFilterFieldBlur}
                  accept=".0-9"
                  min="0.15"
                  max="35"
                />
                <input
                  name="carat[1]"
                  type="text"
                  value={filters.carat[1]}
                  onChange={handleFilterFieldChange}
                  onBlur={handleFilterFieldBlur}
                  accept=".0-9"
                  min="0.15"
                  max="35"
                />
              </RangeFields>
            </RangeFilter>
          </FilterItem>

          <FilterItem>
            <RangeLabel>Color</RangeLabel>
            <RangeFilter $markLeft={5}>
              <Slider 
                value={[filters.color[0], filters.color[1]]}
                onChange={(value) => handleFilterDescriptiveRangeChange('color', value, false)}
                onChangeComplete={(value) => handleFilterDescriptiveRangeChange('color', value, true)}
                range 
                marks={colorMarks} 
                step={1} 
                min={0} 
                max={10} 
                // defaultValue={[0, 10]} 
                allowCross={false}
                dots={false}
                styles={{
                  track:{ 
                    background: 'repeating-linear-gradient(to right, transparent 0 2px, #000 3px '+(100/(filters.color[1]-filters.color[0]))+'%)',
                    height: 2
                  },
                  /* 
                  handle: { 
                    borderColor: '#000',
                    transition: 'transform .26667s ease-out, opacity .26667s ease-out, background-color .26667s ease-out',
                    transitionDelay: '.14s'
                  }, *//* .rc-slider-handle */
                  rail: { 
                    background: '#cccccc',
                    height: 2
                  }
                }}

              />
            </RangeFilter>
          </FilterItem>

          <FilterItem>
            <RangeLabel>Clarity</RangeLabel>
            <RangeFilter $markLeft={8}>
              <Slider 
                value={[filters.clarity[0], filters.clarity[1]]}
                onChange={(value) => handleFilterDescriptiveRangeChange('clarity', value, false)}
                onChangeComplete={(value) => handleFilterDescriptiveRangeChange('clarity', value, true)}
                range 
                marks={clarityMarks} 
                step={1} 
                min={0} 
                max={6} 
                allowCross={false}
                dots={false}
                styles={{
                  track:{ 
                    background: 'repeating-linear-gradient(to right, transparent 0 2px, #000 3px '+(100/(filters.clarity[1]-filters.clarity[0]))+'%)',
                    height: 2
                  },
                  rail: { 
                    background: '#cccccc',
                    height: 2
                  }
                }}

              />
            </RangeFilter>
          </FilterItem>
        
          <FilterItem>
            <RangeLabel>Cut</RangeLabel>
            <RangeFilter $markLeft={12}>
              <Slider 
                value={[filters.cut[0], filters.cut[1]]}
                onChange={(value) => handleFilterDescriptiveRangeChange('cut', value, false)}
                onChangeComplete={(value) => handleFilterDescriptiveRangeChange('cut', value, true)}
                range 
                marks={cutMarks} 
                step={1} 
                min={0} 
                max={4} 
                allowCross={false}
                dots={false}
                styles={{
                  track:{ 
                    background: 'repeating-linear-gradient(to right, transparent 0 2px, #000 3px '+(100/(filters.cut[1]-filters.cut[0]))+'%)',
                    height: 2
                  },
                  rail: { 
                    background: '#cccccc',
                    height: 2
                  }
                }}

              />
            </RangeFilter>
          </FilterItem>

          <FilterItem>
            <RangeLabel>Price</RangeLabel>
            <RangeFilter>
              <Slider 
                name="price"
                value={[filters.price[0], filters.price[1]]}
                onChange={(value) => handlePriceFilterChange('price', value, false)}
                onChangeComplete={(value) => handlePriceFilterChange('price', value, true)}
                range 
                step={1} 
                min={0} 
                max={priceTable.length - 1} 
                allowCross={false}
                dots={false}
                styles={{
                  track:{ 
                    background: '#000',
                    height: 2
                  },
                  rail: { 
                    background: '#cccccc',
                    height: 2
                  }
                }}

              />
              <DollarRangeFields>
                <div>
                  <input
                    name="price[0]"
                    type="text"
                    value={priceValues[0].toLocaleString()}
                    onChange={handlePriceFilterFieldChange} 
                    onBlur={handlePriceFilterFieldBlur}
                    accept="0-9"
                    min="200"
                    max="4000000"
                  />
                </div>
                <div>
                  <input
                    name="price[1]"
                    type="text"
                    value={priceValues[1].toLocaleString()}
                    onChange={handlePriceFilterFieldChange} 
                    onBlur={handlePriceFilterFieldBlur}
                    accept="0-9"
                    min="200"
                    max="4000000"
                  />
                </div>
              </DollarRangeFields>
            </RangeFilter>
          </FilterItem>

          <FilterItem>
          </FilterItem>
          
        </div>
      </Filters>

      <CollapsibleHeader>
        <div onClick={() => toggleCollapsible('more')}>
          <FilterIcon />
          <div>More Filters</div>
          <Caret isExpanded={expanded === 'more' ? true : false} />
        </div>
      </CollapsibleHeader>
          
      <CollapsibleContent className={expanded === 'more' ? 'expanded' : ''}>
        <MoreFilters>
          <div>
            <FilterItem>
              <RangeLabel>Fluorescence</RangeLabel>
              <RangeFilter $markLeft={10}>
                <Slider 
                  value={[filters.fluorescence[0], filters.fluorescence[1]]}
                  onChange={(value) => handleFilterDescriptiveRangeChange('fluorescence', value, false)}
                  onChangeComplete={(value) => handleFilterDescriptiveRangeChange('fluorescence', value, true)}
                  range 
                  marks={fluorescenceMarks} 
                  step={1} 
                  min={0} 
                  max={5} 
                  allowCross={false}
                  dots={true}
                  styles={{
                    track:{ 
                      background: 'repeating-linear-gradient(to right, transparent 0 2px, #000 3px '+(100/(filters.fluorescence[1]-filters.fluorescence[0]))+'%)',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}
                />
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Table</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.table[0], filters.table[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('table', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('table', value, true)}
                  range 
                  step={1} 
                  min={0} 
                  max={100} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="table[0]"
                    type="text"
                    value={filters.table[0]+'%'}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept="0-9"
                    min="0"
                    max="100"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="table[1]"
                    type="text"
                    value={filters.table[1]+'%'}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept="0-9"
                    min="0"
                    max="100"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Depth</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.depth[0], filters.depth[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('depth', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('depth', value, true)}
                  range 
                  step={.5} 
                  min={0} 
                  max={100} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="depth[0]"
                    type="text"
                    value={filters.depth[0]+'%'}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="0"
                    max="100"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="depth[1]"
                    type="text"
                    value={filters.depth[1]+'%'}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="0"
                    max="100"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Polish</RangeLabel>
              <RangeFilter $markLeft={16}>
                <Slider 
                  value={[filters.polish[0], filters.polish[1]]}
                  onChange={(value) => handleFilterDescriptiveRangeChange('polish', value, false)}
                  onChangeComplete={(value) => handleFilterDescriptiveRangeChange('polish', value, true)}
                  range 
                  marks={polishMarks} 
                  step={1} 
                  min={0} 
                  max={3} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: 'repeating-linear-gradient(to right, transparent 0 2px, #000 3px '+(100/(filters.polish[1]-filters.polish[0]))+'%)',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Symmetry</RangeLabel>
              <RangeFilter $markLeft={16}>
                <Slider 
                  value={[filters.symmetry[0], filters.symmetry[1]]}
                  onChange={(value) => handleFilterDescriptiveRangeChange('symmetry', value, false)}
                  onChangeComplete={(value) => handleFilterDescriptiveRangeChange('symmetry', value, true)}
                  range 
                  marks={symmetryMarks} 
                  step={1} 
                  min={0} 
                  max={3} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: 'repeating-linear-gradient(to right, transparent 0 2px, #000 3px '+(100/(filters.symmetry[1]-filters.symmetry[0]))+'%)',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}
                />
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>L/W Ratio</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.lwRatio[0], filters.lwRatio[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('lwRatio', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('lwRatio', value, true)}
                  range 
                  step={.01} 
                  min={1} 
                  max={2.75} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="lwRatio[0]"
                    type="text"
                    value={filters.lwRatio[0]}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="1"
                    max="2.75"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="lwRatio[1]"
                    type="text"
                    value={filters.lwRatio[1]}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="1"
                    max="2.75"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>


            <FilterItem>
              <RangeLabel>Length</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.length[0], filters.length[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('length', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('length', value, true)}
                  range 
                  step={.01} 
                  min={3} 
                  max={20} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="length[0]"
                    type="text"
                    value={filters.length[0]+'mm'}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="3"
                    max="20"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="length[1]"
                    type="text"
                    value={filters.length[1]+'mm'}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="3"
                    max="20"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Width</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.width[0], filters.width[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('width', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('width', value, true)}
                  range 
                  step={.01} 
                  min={3} 
                  max={20} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="width[0]"
                    type="text"
                    value={filters.width[0]+'mm'}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="3"
                    max="20"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="width[1]"
                    type="text"
                    value={filters.width[1]+'mm'}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="3"
                    max="20"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Height</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.height[0], filters.height[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('height', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('height', value, true)}
                  range 
                  step={.01} 
                  min={2} 
                  max={12} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="height[0]"
                    type="text"
                    value={filters.height[0]+'mm'}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="2"
                    max="12"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="height[1]"
                    type="text"
                    value={filters.height[1]+'mm'}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="2"
                    max="12"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Crown Angle</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.crownAngle[0], filters.crownAngle[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('crownAngle', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('crownAngle', value, true)}
                  range 
                  step={.5} 
                  min={23} 
                  max={40} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="crownAngle[0]"
                    type="text"
                    value={filters.crownAngle[0]+'°'}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="23"
                    max="40"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="crownAngle[1]"
                    type="text"
                    value={filters.crownAngle[1]+'°'}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="23"
                    max="40"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Pavilion Angle</RangeLabel>
              <RangeFilter>
                <Slider 
                  value={[filters.pavilionAngle[0], filters.pavilionAngle[1]]}
                  onChange={(value) => handleFilterNumericRangeChange('pavilionAngle', value, false)}
                  onChangeComplete={(value) => handleFilterNumericRangeChange('pavilionAngle', value, true)}
                  range 
                  step={.5} 
                  min={38} 
                  max={43} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <RangeFields>
                  <input
                    ref={handleCursorPosRef}
                    name="pavilionAngle[0]"
                    type="text"
                    value={filters.pavilionAngle[0]+'°'}
                    onChange={handleFilterFieldChange} 
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="38"
                    max="43"
                  />
                  <input
                    ref={handleCursorPosRef}
                    name="pavilionAngle[1]"
                    type="text"
                    value={filters.pavilionAngle[1]+'°'}
                    onChange={handleFilterFieldChange}
                    onBlur={handleFilterFieldBlur}
                    accept=".0-9"
                    min="38"
                    max="43"
                  />
                </RangeFields>
              </RangeFilter>
            </FilterItem>

            <FilterItem className="girdle">
              <RangeLabel>Girdle Thickness</RangeLabel>
              <RangeFilter $markLeft={6}>
                <Slider 
                  value={[filters.girdle[0], filters.girdle[1]]}
                  onChange={(value) => handleFilterDescriptiveRangeChange('girdle', value, false)}
                  onChangeComplete={(value) => handleFilterDescriptiveRangeChange('girdle', value, true)}
                  range 
                  marks={girdleMarks} 
                  step={1} 
                  min={0} 
                  max={8} 
                  allowCross={false}
                  dots={true}
                  styles={{
                    track:{ 
                      background: 'repeating-linear-gradient(to right, transparent 0 2px, #000 3px '+(100/(filters.girdle[1]-filters.girdle[0]))+'%)',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}
                />
              </RangeFilter>
            </FilterItem>

            <FilterItem>
              <RangeLabel>Price per Carat</RangeLabel>
              <RangeFilter>
                <Slider 
                  name="pricePerCarat"
                  value={[filters.pricePerCarat[0], filters.pricePerCarat[1]]}
                  onChange={(value) => handlePriceFilterChange('pricePerCarat', value, false)}
                  onChangeComplete={(value) => handlePriceFilterChange('pricePerCarat', value, true)}
                  range 
                  step={1} 
                  min={0} 
                  max={pricePerCaratTable.length - 1} 
                  allowCross={false}
                  dots={false}
                  styles={{
                    track:{ 
                      background: '#000',
                      height: 2
                    },
                    rail: { 
                      background: '#cccccc',
                      height: 2
                    }
                  }}

                />
                <DollarRangeFields>
                  <div>
                    <input
                      name="pricePerCarat[0]"
                      type="text"
                      value={pricePerCaratValues[0].toLocaleString()}
                      onChange={handlePriceFilterFieldChange} 
                      onBlur={handlePriceFilterFieldBlur}
                      accept="0-9"
                      min="0"
                      max="50000"
                    />
                  </div>
                  <div>
                    <input
                      name="pricePerCarat[1]"
                      type="text"
                      value={pricePerCaratValues[1].toLocaleString()}
                      onChange={handlePriceFilterFieldChange} 
                      onBlur={handlePriceFilterFieldBlur}
                      accept="0-9"
                      min="0"
                      max="50000"
                    />
                  </div>
                </DollarRangeFields>
              </RangeFilter>
            </FilterItem>


            <FilterItem>
              <FilterItemSplit>
                <div className="certifications">
                  <RangeLabel>Certifications</RangeLabel>
                  <RangeFilter>
                    <CertificationsFilter
                      certifications={filters.certifications}
                      handleCertificationsFilterChange={handleCertificationsFilterChange}
                    />
                  </RangeFilter>
                </div>
                <div className="has-image">
                  <label>
                    <span>Image Available</span>
                    <input 
                      type="checkbox" 
                      checked={filters.hasImage} 
                      onChange={toggleHasImage}
                    />
                  </label>
                </div>
              </FilterItemSplit>
            </FilterItem>

            <FilterItem>
            </FilterItem>
        
            <CertNumberFilterItem>
              <CertNumberLabel>
                IGI/GIA Certificate No.
              </CertNumberLabel>
              <div>
                <CertNumberField>
                  <input
                    name="certNumber"
                    type="text"
                    value={certNumber}
                    onChange={handleCertNumberFieldChange} 
                    onBlur={handleCertNumberFieldBlur}
                    accept="0-9"
                  />
                </CertNumberField>
                <CertNumberSubmitButton onClick={handleCertNumberSubmitClick}>
                  Submit
                </CertNumberSubmitButton>
              </div>
            </CertNumberFilterItem>

          </div>  
        </MoreFilters>

      </CollapsibleContent>


      {loading && items.length === 0 && 
        <LoaderWrapper>
          <Loader size={80} />
        </LoaderWrapper>
      }
      {!loading && loadedPage>0 && resultCount === 0 &&
        <NoResults>
          No matches found
        </NoResults>
      }
      {items && items.length > 0 && (
        <>
          <GridOptions>
            <div>
              <ResultsCopy>
                {resultCount.toLocaleString()} result{resultCount>1 ? 's' : ''}
              </ResultsCopy>
              <GridOptionsRight>
                <GridListButton onClick={() => handleClickView('grid')} $name="grid" $view={view}>
                  <GridIcon />
                  <div>Grid</div>
                </GridListButton>
                <GridListButton onClick={() => handleClickView('list')} $name="list" $view={view}>
                  <ListIcon />
                  <div>List</div>
                </GridListButton>
                <Select
                  value={sortOrder}
                  onChange={handleChangeSortOrder}
                  /*
                    POSSIBILITIES:
                    price
                    discount
                    color
                    clarity
                    cut
                    size
                    none
                    insert = Order by insertion (newest to oldest)
                    price_per_carat
                  */
                  options={[
                    { value: {type: 'price', direction: 'ASC'}, label: 'Price: Low to High' },
                    { value: {type: 'price', direction: 'DESC'}, label: 'Price: High to Low' },
                    { value: {type: 'size', direction: 'ASC'}, label: 'Carat: Low to High' },
                    { value: {type: 'size', direction: 'DESC'}, label: 'Carat: High to Low' },
                  ]}
                  styles={{
                    container: (baseStyles) => ({
                      ...baseStyles,
                      width: 200,
                      /* color: theme.colors.primary, */
                      fontFamily: theme.fonts.primary,
                      fontSize: '1rem',
                      margin: '0 10px 0 14px',
                    }),
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      /* color: theme.colors.primary, */
                      textAlign: 'left',
                      borderColor: state.isFocused ? theme.colors.darkTan : 'hsl(0, 0%, 80%)',
                      boxShadow: state.isFocused ? '0 0 0 1px ' + theme.colors.darkTan : 'initial',
                      '&:hover': {
                        borderColor: theme.colors.darkTan,
                        boxShadow: '0 0 0 1px '+theme.colors.darkTan,
                      },       
                    }),
                    /* 
                    singleValue: (baseStyles) => ({
                      ...baseStyles,
                      color: theme.colors.primary,
                    }),
                    */
                    menu: (baseStyles, state) => ({
                      ...baseStyles,
                      /* color: theme.colors.primary, */
                      textAlign: 'left'
                    }),
                    option: (baseStyles, { 
                      // data,     
                      isDisabled, isFocused, isSelected 
                    }) => {
                      // const color = chroma(data.color);
                      return {
                        ...baseStyles,
                        backgroundColor: isDisabled
                          ? undefined
                          : isSelected  
                          ? theme.colors.lightTan
                          : isFocused
                          ? theme.colors.lightestTan // color.alpha(0.1).css()
                          : undefined,
                        /* color: theme.colors.primary, */
                        /*
                        color: isDisabled
                          ? '#ccc'
                          : isSelected
                          ? chroma.contrast(color, 'white') > 2
                            ? 'white'
                            : 'black'
                          : data.color,
                        cursor: isDisabled ? 'not-allowed' : 'default',

                        ':active': {
                          ...styles[':active'],
                          backgroundColor: !isDisabled
                            ? isSelected
                              ? data.color
                              : chroma(theme.colors.lightYellow).darken(0.2).hex() // color.alpha(0.3).css()
                            : undefined,
                        },
                        */
                      };
                    },
                  }}
                />
              </GridOptionsRight>
            </div>
          </GridOptions>
          <GridContainer>
            <div>
              <div>
              {/* 
                <ProgressBar
                  topTarget="headlineContainer"
                  bottomTarget="articleContainer"
                />
              */}
                {view==='list' &&
                  <DiamondList>
                    <div>Image</div>
                    <div>Carat</div>
                    <div>Shape</div>
                    <div>Color</div>
                    <div>Clarity</div>
                    <div>Cut</div>
                    <div>Cert #</div>
                    <div>Price (USD)</div>
                    {items.map((item, index) => {
                      return (
                        <Fragment key={item.id+index}>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            <DiamondImageList
                              $src={item.diamond.image}
                              // alt={item.id}
                            />
                          </DiamondListCell>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            {item.diamond.certificate.carats}
                          </DiamondListCell>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            { 
                              item.diamond.certificate.shape.charAt(0).toUpperCase() + 
                              item.diamond.certificate.shape.toLowerCase().slice(1)
                            }
                          </DiamondListCell>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            {item.diamond.certificate.color}
                          </DiamondListCell>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            {item.diamond.certificate.clarity}
                          </DiamondListCell>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            {item.diamond.certificate.cut}
                          </DiamondListCell>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            {item.diamond.certificate.lab}
                          </DiamondListCell>

                          <DiamondListCell 
                            row={index}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            handleListItemClick={handleListItemClick}
                          >
                            ${item.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </DiamondListCell>
                        </Fragment>
                      )
                    })}
                    {loading && 
                      <DiamondListLoaderWrapper>
                        <Loader size={36} />
                      </DiamondListLoaderWrapper>
                    }
                  </DiamondList>
                }
                {view==='grid' &&
                  <DiamondGrid>
                      {items.map((item, index) => {
                        return (
                          <Tile key={item.id+index}>
          
                            {item?.diamond?.image && 
                              <>
                                <Link
                                  href={`/diamond/${item.id}`}
                                >     
                                  <DiamondImage
                                    $src={item.diamond.image}
                                    // alt={item.id}
                                  />
                                  {/* 
                                    <Image
                                      src={item.diamond.image}
                                      width={200}
                                      height={200}
                                      alt={item.id}
                                    />
                                  */}

                                <TileHeading>
                                    {item?.diamond?.certificate?.carats && 
                                      <>
                                        {item.diamond.certificate.carats}ct{' '}
                                      </>
                                    }
                                    {item?.diamond?.certificate?.shape && 
                                      <>
                                        { 
                                          item.diamond.certificate.shape.charAt(0).toUpperCase() + 
                                          item.diamond.certificate.shape.toLowerCase().slice(1)
                                        }{' '}
                                      </>
                                    }
                                    {item?.diamond?.certificate?.labgrown &&
                                      <>
                                        {item?.diamond?.certificate?.labgrown === true 
                                          ? <>Lab Grown{' '}</>
                                          : <>Natural{' '}</>
                                        }
                                      </>
                                    }
                                    Diamond
                                  
                                  </TileHeading>
                                </Link> 

                                <TileDetails>
                                  <div>
                                    {item?.diamond?.certificate?.color &&
                                      <>Color: <span>{item.diamond.certificate.color}</span></>
                                    }
                                    {item?.diamond?.certificate?.color && (item?.diamond?.certificate?.clarity || item?.diamond?.certificate?.cut) &&
                                      <>,{' '}</> 
                                    }
                                    {item?.diamond?.certificate?.clarity &&
                                      <>Clarity: <span>{item.diamond.certificate.clarity}</span></>
                                    }
                                    {item?.diamond?.certificate?.clarity && item?.diamond?.certificate?.cut &&
                                      <>,{' '}</> 
                                    }
                                    {item?.diamond?.certificate?.cut &&
                                      <>Cut: <span>{item.diamond.certificate.cut}</span></>
                                    }
                                  </div>
                                </TileDetails>

                                <TileFooter>   
                                  {item?.price && 
                                    <Price>
                                      ${item.price.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })} USD
                                    </Price>
                                  }  
                                  {item?.diamond?.certificate?.lab && 
                                    <Certification>    
                                      <div><DiamondSVG /></div>
                                      <div>{item.diamond.certificate.lab} Certified</div>
                                    </Certification> 
                                  }
                                </TileFooter>     
                              </>
                            } 
                            {/*(index/9)===Math.floor(index/9) &&
                              <div style={{ height: "30px", width: '100%', background: 'red' }}></div>
                            */}                     
                          </Tile>
                        );
                      })}

                      {loading && 
                        <Tile>
                          <DiamondGridLoaderWrapper>
                            <Loader size={80} />
                          </DiamondGridLoaderWrapper>
                        </Tile>
                      }

                      <Tile className="flat" />
                      <Tile className="flat" />
                      <Tile className="flat" />
                  </DiamondGrid>
                }
              </div>
            </div>
          </GridContainer>
          <div ref={loadMoreRef} style={{ height: "1px"}} />
        </>
      )}
    </Background>
  );
}

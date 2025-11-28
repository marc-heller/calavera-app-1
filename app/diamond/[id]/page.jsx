'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
// import { Suspense } from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
// import { revalidatePath } from 'next/cache';
// import parse from 'html-react-parser';
// import styled from '@emotion/styled';
import styled from 'styled-components';
import Loader from '@/components/Loader/Loader';
import theme from '@/app/theme';

// const breakpointFilters = '950px';

const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${theme.colors.lightestTan};
`;

const BackButton = styled.div`
  font-family: ${theme.fonts.primary};
  font-weight: 600;  
  font-size: 1rem;
  line-height: 1;
  padding-bottom: 6px;

  a {
    display: flex;
    align-items: center;
  }
`;

const LeftChevronContainer = styled.div`
  width: 20px;
  height: 20px;
  margin: -5px 4px 0 0;
  color: hsl(0, 0%, 20%);

  svg {
    width: 100%;
    height: 100%;
  }
`;

const LeftChevron = () => {
  return (
    <LeftChevronContainer>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="m15 6-6 6 6 6" />
      </svg>
    </LeftChevronContainer>
  )
};

const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px 30px;

  > div:first-of-type {
    width: 100%;
    max-width: ${theme.breakpoints.lg};
    margin-bottom: 6px;
    margin-left: 4px;
    color: hsl(0, 0%, 20%);
  }

  > div:nth-of-type(2) {
    width: 100%;
    max-width: ${theme.breakpoints.lg};
    border: 4px solid hsl(0, 0%, 20%);
    border-radius: 16px;
  }

  > div:nth-of-type(2) > div {
    width: 100%;
    border: 6px solid ${theme.colors.tan}; // #d5c7a1 // #bca86b
    border-radius: 12px;
    padding: 20px;
    background: ${theme.colors.lightGray};
  }
`;

const ItemMain = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 30px;

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    flex-flow: column nowrap;
  }

  > div {
    flex: 1 45%;
    display: flex;
    align-items: center;
  }
`;

const ItemHeader = styled.div`
  width: 100%;
  font-family: ${theme.fonts.primary};
  font-size: 1.9rem;
  font-weight: 600;
  letter-spacing: -.04rem;
  line-height: 1.2;
  margin-bottom: 8px;

  @media screen and (max-width: ${theme.breakpoints.lg}) {
    font-size: 1.5rem;
  }

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    font-size: 1.9rem;
  }
`;

const ItemDescription = styled.div`
  display: flex;
  flex-flow: row wrap;
  color: hsl(0, 0%, 20%);
  font-family: ${theme.fonts.primary};
  font-size: 1.2rem;

  > span {
    color: #000;
    font-weight: 600;
    margin-left: 6px;
  }

  @media screen and (max-width: ${theme.breakpoints.lg}) {
    font-size: 1rem;
  }

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const ItemPrice = styled.div`
  margin-top: 30px;
  font-family: ${theme.fonts.primary};
  font-size: 1.5rem;
  font-weight: 600;

  > span {
    color: hsl(0, 0%, 20%);
    font-size: 1rem;
    font-weight: 400;
  }

  @media screen and (max-width: ${theme.breakpoints.lg}) {
    font-size: 1.2rem;
  }

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    font-size: 1.5rem;
  }
`;

const DiamondImage = styled.img`
  width: 100%;
  height: auto; 
  border-radius: 10px;
  overflow: hidden;
`;

const DiamondVideo = styled.iframe`
  width: 100%;
  height: auto; 
  min-height: 300px;
  border-radius: 10px;
  overflow: hidden;
`;

const ItemNotes = styled.div`
  margin-top: 60px;  
  color: hsl(0, 0%, 20%);
  font-size: 1rem;
  font-weight: 400;


  > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 8px;

    > div:nth-last-of-type(2) {
      color: hsl(0, 0%, 20%);
    }
  }

    
  @media screen and (max-width: ${theme.breakpoints.lg}) {
    margin-top: 30px; 
    font-size: .8rem;

    > div {
      margin-bottom: 5px;
    }
  }

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const NotesIconContainer = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 6px;
  color: ${theme.colors.darkestTan};

  > svg {
    width: 100%;
    height: 100%;
  }
`;

const SmallDiamondIcon = () => {
  return (
    <NotesIconContainer>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M6 5h12l3 5-8.5 9.5a.7.7 0 0 1-1 0L3 10z" />
        <path d="M10 12 8 9.8l.6-1" />
      </svg>
    </NotesIconContainer>
  )
};

const StarIcon = () => {
  return (
    <NotesIconContainer>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="m12 17.75-6.172 3.245 1.179-6.873-5-4.867 6.9-1 3.086-6.253 3.086 6.253 6.9 1-5 4.867 1.179 6.873z" />
      </svg>
    </NotesIconContainer>
  )
};

const HeartIcon = () => {
  return (
    <NotesIconContainer>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
      </svg>
    </NotesIconContainer>
  )
};

const AddToCartButton = styled.button`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.lightTan};
  height: 50px;
  color: hsl(0, 0%, 20%);
  font-family: ${theme.fonts.primary};
  font-weight: 600;
  font-size: 1.5rem;
  padding: 8px 30px;
  outline: none;
  border: 1px solid hsl(0, 0%, 20%);
  border-radius: 6px;
  cursor: pointer;
  transition: 300ms;

  &:hover {
    background: #e1d9bd;
    border: 1px solid hsl(0, 0%, 40%);
  }


  @media screen and (max-width: ${theme.breakpoints.lg}) {
    margin-top: 30px;
    height: 42px;
    font-size: 1.2rem;
  }

  @media screen and (max-width: ${theme.breakpoints.sm}) {
    margin-top: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`;

const CollapsibleHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;

  > div {
    width: 100%;
    border: 1px solid hsl(0, 0%, 20%);
    border-radius: 6px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 10px 20px 10px 12px;
    background: ${theme.colors.lightestTan};
    font-family: ${theme.fonts.primary};
    font-size: 1rem;
    text-transform: uppercase;
    text-align: center;
    user-select: none;
    
    /*
    &:hover {
      background: ${theme.colors.lightTan};
      color: ${theme.colors.darkTan}; 
      transition: .3s;

      path {
        fill: ${theme.colors.primary};
      }
    }
    */
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

const LoaderWrapper = styled.div`
  padding: 60px;  
`;

const NoResult = styled.div`
  width: 100%;
  padding: 40px 0 60px;
  display: flex;
  justify-content: center;
  font-family: ${theme.fonts.primary};
  color: hsl(0, 0%, 20%);
  font-weight: 600;
  font-size: 1rem;
`;

const DiamondDetails = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  margin-top: 30px;
  font-size: 1rem;
  font-weight: 400;
  
  > div {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    margin-left: 30px;

    @media screen and (max-width: 700px) {
      flex-flow: column nowrap;
      justify-content: flex-start;
    }

    > div {
      flex: 1 45%;
      max-width: 310px;
      display: flex;
      flex-flow: row wrap;

      > div {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;

        > div:nth-of-type(2n+1) {
          width: 140px;
          font-weight: 600;
          color: rgba(0, 0, 0, 96%);
        }

        > div:nth-of-type(2n+2) {
          flex: 1 50%;
          max-width: 180px;
          color: hsl(0, 0%, 20%);
        }
      }
    }
  }

  a {
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const abbreviationLookup = {
  'G': 'Good',
  'VG': 'Very Good',
  'EX': 'Excellent',
  'ID': 'Ideal',
  '8X': 'EightX',
  'NON': 'None',
  'FNT': 'Faint',
  'MED': 'Medium',
  'STG': 'Strong',
  'VST': 'Very Strong',
  'ETN': 'Extra Thin',
  'VTN': 'Very Thin',
  'THN': 'Thin',
  'STK': 'Slightly Thick',
  'THK': 'Thick',
  'VTK': 'Very Thick',
  'ETK': 'Extremely Thick'
};

function expandAbbreviation(abbr) {
  return abbreviationLookup[abbr.toUpperCase()] || abbr;
}

export default function Diamond ({ params }) {
  // revalidatePath(`/articles/${slug}`);

  const { id } = useParams();

  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  useEffect(() => {
    // console.log('RUNNING FETCH DATA USE EFFECT');

    if (!id) return;

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const payload = {id: id};

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
          `/api/getDiamond`,
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

        if (json.success === false || json.item === null || json.item === undefined) {
          throw new Error(`GraphQL error.`);
        }

        let { item } = json;

        if (!item) {
          console.log('DIAMOND NOT FOUND');
          // revalidatePath(`/articles/${slug}`);
          notFound();
        }

        item = {
          ...item,
          id: item.id.replace('DIAMOND/', ''),
          price: (item?.price>0) ? item.price/100 : 0,  
        }

        let certPdfLink = null;

        if (item?.diamond?.certificate?.certNumber && item.diamond.certificate.certNumber.indexOf('*')===-1) {
          if (item.diamond.certificate.lab==='IGI') {
            item.certPdfLink = 'https://www.igi.org/verify-your-report/?r='+item.diamond.certificate.certNumber;
          } else if (item.diamond.certificate.lab==='GIA') {
            item.certPdfLink = 'https://www.gia.edu/report-check?reportno='+item.diamond.certificate.certNumber;
          } else if (item.diamond.certificate.lab==='GCAL') {
            item.certPdfLink = 'https://www.gcalusa.com/certificate-search.html?certificate_id='+item.diamond.certificate.certNumber;
          }
        }

        // console.log('item', item);

        setItem(item);
        
        // console.log('setLoading false line 336');
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
        // console.log('setLoading false line 347');
        setLoading(false);
      } finally {
        controllerRef.current = null;
      }
    }

    // console.log('LINE 354');
    fetchData();
    
    return () => {
      // console.log('CANCELLED FETCH DATA USE EFFECT');
      controllerRef.current?.abort();
    };
  }, [id]); 

  
  const [expanded, setExpanded] = useState('');

  const toggleCollapsible = (name) => {
    if (expanded===name) {
      setExpanded('');
    } else if (expanded!==name) {
      setExpanded(name);
    }
  };
  
  return (
    <Background>
      <ItemContainer>
        <BackButton>
          <Link href="/diamonds">
            <LeftChevron /> 
            <div>Back</div>
          </Link>
        </BackButton>
        <div>
          <div>
            {loading && !item && 
              <LoaderWrapper>
                <Loader size={80} />
              </LoaderWrapper>
            }
            {!loading && !item &&
              <NoResult>
                Diamond not found
              </NoResult>
            }
            {!loading && item && 
              <>
                <ItemMain>
                  <div>
                    {/*item.diamond.video 
                      ? <DiamondVideo
                          src={item.diamond.video}
                        />
                      : <DiamondImage
                          src={item.diamond.image}
                          // alt={item.id}
                        />
                     */}
                     <DiamondImage
                        src={item.diamond.image}
                        // alt={item.id}
                      />
                  </div>
                  <div>
                    <div>
                      <ItemHeader>
                        {item.diamond.certificate.carats}ct{' '}
                        { 
                          item.diamond.certificate.shape.charAt(0).toUpperCase() + 
                          item.diamond.certificate.shape.toLowerCase().slice(1)
                        }{' '}
                        {item.diamond?.certificate?.labgrown ? 'Lab Grown ' : 'Natural '} 
                        Diamond
                      </ItemHeader>
                      <ItemDescription>
                        Color: <span>{item.diamond.certificate.color}</span>,
                        Clarity: <span>{item.diamond.certificate.clarity}</span>,
                        Cut: <span>{item.diamond.certificate.cut}</span>
                      </ItemDescription>
                      <ItemPrice>
                          ${item.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} USD <span>for the diamond&nbsp;only</span>
                      </ItemPrice>
                      <ItemNotes>
                        {item.diamond.certificate?.lab && 
                          <div>
                            <SmallDiamondIcon /> 
                            <div>{item.diamond.certificate.lab} Certified</div>
                          </div>
                        }
                        <div>
                          <StarIcon />
                          <div>Only one available</div>
                        </div>
                        <div>
                          <HeartIcon /> 
                          <div>Sourced with care</div>
                        </div>
                      </ItemNotes>
                      <AddToCartButton>
                        Add to cart
                      </AddToCartButton>
                    </div>
                  </div>
                </ItemMain>

                <CollapsibleHeader>
                  <div onClick={() => toggleCollapsible('more')}>
                    <Caret isExpanded={false} />
                    <div>Details</div>
                  </div>
                </CollapsibleHeader>
                    
                {/* 
                <CollapsibleContent className={expanded === 'more' ? 'expanded' : ''}>
                */}

                <DiamondDetails>
                  <div>
                    <div>
                      <div>
                        <div>Type</div>
                        <div> 
                          {item.diamond?.certificate?.labgrown ? 'Lab Grown' : 'Natural'}
                        </div>
                      </div>

                      <div>
                        <div>Shape</div>
                        <div>
                          { 
                            item.diamond.certificate.shape.charAt(0).toUpperCase() + 
                            item.diamond.certificate.shape.toLowerCase().slice(1)
                          }
                        </div>
                      </div>

                      <div>
                        <div>Carat</div>
                        <div> 
                          {item.diamond.certificate.carats}
                        </div>
                      </div>

                      <div>
                        <div>Color</div>
                        <div> 
                          {item.diamond.certificate.color}
                        </div>
                      </div>

                      <div>
                        <div>Cut</div>
                        <div> 
                          {expandAbbreviation(item.diamond.certificate.cut)}
                        </div>
                      </div>

                      <div>
                        <div>Polish</div>
                        <div> 
                          {expandAbbreviation(item.diamond.certificate.polish)}
                        </div>
                      </div>

                      <div>                      
                        <div>Symmetry</div>
                        <div> 
                          {expandAbbreviation(item.diamond.certificate.symmetry)}
                        </div>
                      </div>

                    </div>

                    <div>

                      <div>
                        <div>Fluorescence</div>
                        <div> 
                          {expandAbbreviation(item.diamond.certificate.floInt)}
                        </div>
                      </div>

                      <div>
                        <div>Measurements</div>
                        <div> 
                          { (item.diamond.certificate.length * 1).toLocaleString("en-US", {maximumFractionDigits: 2})+'x'+
                            (item.diamond.certificate.width * 1).toLocaleString("en-US", {maximumFractionDigits: 2})+'x'+
                            (item.diamond.certificate.depth* 1).toLocaleString("en-US", {maximumFractionDigits: 2})+'mm'
                          }
                        </div>
                      </div>

                      <div>        
                        <div>L/W Ratio</div>
                        <div> 
                          {(item.diamond.certificate.length/item.diamond.certificate.width).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      </div>

                      <div>                      
                        <div>Table</div>
                        <div> 
                          {item.diamond.certificate.table * 1}%
                        </div>
                      </div>

                      <div>                                          
                        <div>Depth</div>
                        <div> 
                          {item.diamond.certificate.depth * 1}%
                        </div>
                      </div>

                      <div>                                                              
                        <div>Certificate</div>
                        <div> 
                          {item.diamond.certificate.lab}
                        </div>
                      </div>

                      <div>                                                                                  
                        <div>Certificate #</div>
                        <div> 
                          {item.diamond.certificate.certNumber}
                        </div>
                      </div>

                      <div>                                                                                                      
                        <div>
                          {
                            item.certPdfLink 
                              ? 'Certificate PDF' 
                              : <>&nbsp;</>
                          }
                        </div>
                        <div> 
                          {item.certPdfLink 
                            ? <a href={item.certPdfLink}>View</a>
                            : <>&nbsp;</>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
{/* 
Cut
Very Good

Polish
Very Good

Symmetry
Very Good

Fluorescence
Faint
*/}
                  </DiamondDetails>
                {/* 
                </CollapsibleContent>
                */}
              </>
            }
          </div>
        </div>
      </ItemContainer>
    </Background>
  );
}

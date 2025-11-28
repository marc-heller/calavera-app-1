import { NextResponse } from 'next/server';
// import parse from 'html-react-parser';

// GraphiQL: https://intg-customer-staging.nivodaapi.net/api/diamonds-graphiql

/*
const API_URL = 'http://wdc-intg-customer-staging.herokuapp.com/api/diamonds';
const username = 'testaccount@sample.com'; // For staging only
const password = 'staging-nivoda-22'; // For staging only
*/
const API_URL = 'https://intg-customer-staging.nivodaapi.net/api/diamonds';
// for production, the username and password are the same as what you would use to login to the Nivoda platform
// for staging, the username and password can be requested from tech @ nivoda dot net 
const username = 'testaccount@sample.com';
const password = 'staging-nivoda-22';
// the API_URL for production is https://integrations.nivoda.net/api/diamonds';

// Great documentation can be found here:
// https://graphql.org/graphql-js/graphql-clients/

let cachedToken = null;
let cachedTokenExpires = null;

async function getToken(internalSignal) {
  if (cachedToken && cachedTokenExpires > Date.now()) {
    console.log("USING CACHED TOKEN");
    return cachedToken;
  }
  
  const startTime = Date.now();

  let authenticate_query = `{
    authenticate { 
      username_and_password(username: "${username}", password: "${password}") {
        token
        expires
      }
    }
  }`;

  let authenticate_result;

  try {
    authenticate_result = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: authenticate_query }),
      signal: internalSignal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Client aborted during authentication fetch');
      return NextResponse.json({ success: false, aborted: true }, { status: 499 });
    }
    clientSignal.removeEventListener('abort', abortListener);
    return NextResponse.json({ success: false, error: 'Authentication failed' });
    // throw err;
  }
  
  // console.log('++)))) authenticate_result', authenticate_result);

  if (!authenticate_result.ok) {
    clientSignal.removeEventListener('abort', abortListener);
    return NextResponse.json({ success: false, error: `API network response for authentication was not OK. Status: ${authenticate_result.status}, ${authenticate_result.statusText}` });
    /*
    throw new Error(
      `API network response was not OK. Status: ${authenticate_result.status}, ${authenticate_result.statusText}`,
    );
    */
  }

  const authenticateTime = Date.now() - startTime;
  console.log('authenticateTime', authenticateTime);

  let res = await authenticate_result.json();
  
  console.log('++ getDiamonds authenticate_result.json', res);

  // the authentication token to get in future requests
  if (res?.data?.authenticate?.username_and_password?.token) {

    let { token, expires } = res?.data?.authenticate?.username_and_password;

    cachedToken = token;
    cachedTokenExpires = expires;

    console.log('++ TOKEN', token, expires);
  } else {
    clientSignal.removeEventListener('abort', abortListener);
    return NextResponse.json({ success: false, error: 'Authentication failed' });
  }

  return cachedToken;
}

export async function POST(request) {

  const internalController = new AbortController();
  const internalSignal = internalController.signal;

  // forward the client's abort signal to any downstream fetches so
  // we don't keep doing work after the client has disconnected
  // const { signal } = request;
  const clientSignal = request.signal;
  
  const abortListener = () => {
    console.log('Client disconnected. Aborting internal fetch.');
    internalController.abort();
  }
  clientSignal.addEventListener('abort', abortListener);

  console.log('getDiamonds clientSignal', clientSignal);

  const requestJson = await request.json();

  const { 
    page, order, certNumber, labgrown, shapes, carat, color, clarity, cut, price, polish, symmetry, fluorescence,
    certifications, table, depth, lwRatio, length, width, height, 
    crownAngle, pavilionAngle, girdle, pricePerCarat, hasImage
  } = requestJson;

  if (!page || page===0) {
    clientSignal.removeEventListener('abort', abortListener);
    return NextResponse.json({ success: false });
  }
  
  console.log('getDiamonds requestJson', requestJson);
  /*
  const [WORDPRESS_SEARCH_REST_API_URL, searchTerm, page] = CheckForUndefined([
    process.env.WORDPRESS_SEARCH_REST_API_URL,
    requestJson.searchTerm,
    requestJson.nextPage,
  ]);
  */

  const token = await getToken(internalSignal);
  
  if (token instanceof NextResponse) {
    return token;
  }

  const startTime = Date.now();

  // example diamond query
  // note that this does not include all available fields, to see more fields please refer to the documentation
  
  /*
  query ($token:String!) {
    as(token:$token) {
    diamonds_by_query(
    query: {
      labgrown: true ,
      dollar_value: {from:0,to:63395},
      has_image: true,
      sizes: {from:0.5, to:16}
      returns: true
      color:[D,E]
      clarity: [VVS2, VS1]
      cut: [EX]
      shapes:"OVAL"
      eyeClean:Yes
      sue:false
    }
    offset: 0,
  */

  /*
  let labgrown = true,
      shapes = 'OVAL', // ROUND
      caratSizesFrom = .5,
      caratSizesTo = 16,
      color = '[D, E]',
  */
      /*
      cut = '[EX]',
      clarity = '[VVS2, VS1]',
      priceFrom  = 0,
      priceTo = 63395,

      hasImage = true,
      hasVideo = true,

      isReturnable = true,
      
      deliveryTime = 30, // Days

      certificateLab = '[GIA, GCAL, IGI]', // NO COMMAS????

      fluorescence = '[NON, FNT, MED, STG, STN, VST]', // OR single input: STG
      /* 
        NON (none)
        VSL (very slight),
        SLT (slight),
        FNT (faint),
        MED (medium),
        STG (strong),
        STN (strong),
        VST (very strong)
      *//*

      tableFrom = 0,
      tableTo = 100,

      depthFrom = 0,
      depthTo = 100,

      polish = '[G, VG, EX]', 
      symmetry = '[G, VG, EX]', */
      /*
      POLISH and SYMMETRY possible values:
      P (poor),
      F (fair),
      G (good),
      VG (very good),
      EX (excellent),
      ID (ideal),
      EIGHTX (8X)
      *//*

      lWRatioFrom = 1, // 0
      lWRatioTo = 2.75, // 100

      lengthFrom = 3, // 0
      lengthTo = 20, // 100

      widthFrom = 3, // 0
      widthTo = 20,// 100

      heightFrom = 2, // 0
      heightTo = 12,// 100

      crownAngleFrom = 23, // 0
      crownAngleTo = 40,// 100

      pavilionAngleFrom = 38, // 0
      pavilionAngleTo = 43,// 100  

      girdleThickness = 'ANY',*/
      /*
        ACT
        ETK
        VTK
        THK
        STK
        MED
        STN
        THN
        VTN
        ETN
        ANY
      *//*
      pricePerCaratFrom = 0,
      pricePerCaratTo = 50000,

      eyeClean = 'Yes',
      sue = false,
      */
      
      // offset = 0;

      /*
          delivery_time: ${deliveryTime},
          certificate_lab: "${certificateLab}",
          fluorescence: "${fluorescence}",
          table_percentage: {
            from: ${tableFrom}, 
            to: ${tableTo} 
          }
          depth_percentage: {
            from: ${depthFrom}, 
            to: ${depthTo} 
          },
          polish: "${polish}",
          symmetry: "${symmetry}",
          ratio: {
            from: ${lWRatioFrom}, 
            to: ${lWRatioTo} 
          },
          length_mm: {
            from: ${lengthFrom}, 
            to: ${lengthTo} 
          },
          width_mm: {
            from: ${widthFrom}, 
            to: ${widthTo} 
          },
          depth_mm: {
            from: ${heightFrom}, 
            to: ${heightTo} 
          },
          crown_angle: {
            from: ${crownAngleFrom}, 
            to: ${crownAngleTo} 
          },
          pav_angle: {
            from: ${pavilionAngleFrom}, 
            to: ${pavilionAngleTo} 
          },
          girdle: "${girdleThickness}",
          dollar_per_carat: {
            from: ${pricePerCaratFrom}, 
            to: ${pricePerCaratTo} 
          }, 

          has_image: ${hasImage},
          has_v360: ${hasVideo},

          returns: ${isReturnable},
          eyeClean: "${eyeClean}",
          sue: ${sue}
          */

   
  
   // NOTE dollar_value and dollar_per_carat return values including cents without the . (e.g. $100 = 10000)
   // API spells fluorescence wrong as flouresence
    
    /*
      dollar_value: { 
        from: ${price[0]}00, 
        to: ${price[1]}00 
      },
    */
    /*
      search_on_preferred_currency: true,
    */

      /*
FULL ITEMS:

 items {
          id
          diamond {
            id
            video
            image
            availability
            supplierStockId
            brown
            green
            milky
            eyeClean
            mine_of_origin
            certificate {
              id
              lab
              labgrown
              shape
              certNumber
              cut
              carats
              clarity
              polish
              symmetry
              color
              width
              length
              depth
              girdle
              floInt
              floCol
              depthPercentage
              table
            }
          }
          price
          discount
        }
        
PARTIAL ITEMS JUST FOR CATEGORY PAGE:

 items {
          id
          diamond {
            id
            image
            certificate {
              id
              lab
              labgrown
              shape
              cut
              carats
              clarity
              color
            }
          }
          price
        }
*/

  const limit = 50;
  const offset = (page - 1) * limit;

  // If certificate numbers is provided, it is going to search only for that and ignore the rest of the query.
  // ${certNumber!==undefined ? 'certificate_numbers: "'+certNumber+'",' : ''}
  const query = certNumber!==undefined && certNumber!=='' 
        ? `{
            certificate_numbers: ["${certNumber}"],
          }`
        : `{
          labgrown: ${labgrown},
          preferred_currency: USD,
          dollar_value: { 
            from: ${price[0]}, 
            to: ${price[1]} 
          },
          dollar_per_carat: { 
            from: ${pricePerCarat[0]}, 
            to: ${pricePerCarat[1]} 
          }, 
          ${shapes!==undefined ? 'shapes: '+JSON.stringify(shapes)+',' : ''}
          sizes: [{ 
            from: ${carat[0]}, 
            to: ${carat[1]}
          }],
          color: [${color}], 
          cut: [${cut}],
          clarity: [${clarity}],
          flouresence: [${fluorescence}],
          table_percentage: {
            from: ${table[0]}, 
            to: ${table[1]} 
          }
          depth_percentage: {
            from: ${depth[0]}, 
            to: ${depth[1]} 
          },
          polish: [${polish}],
          symmetry: [${symmetry}],
          ratio: {
            from: ${lwRatio[0]}, 
            to: ${lwRatio[1]} 
          },
          length_mm: {
            from: ${length[0]}, 
            to: ${length[1]} 
          },
          width_mm: {
            from: ${width[0]}, 
            to: ${width[1]} 
          },
          depth_mm: {
            from: ${height[0]}, 
            to: ${height[1]} 
          },
          crown_angle: {
            from: ${crownAngle[0]}, 
            to: ${crownAngle[1]} 
          },
          pav_angle: {
            from: ${pavilionAngle[0]}, 
            to: ${pavilionAngle[1]} 
          },
          girdle: [${girdle}],
          ${certifications!==undefined ? `certificate_lab: [${certifications}],` : ''}
          has_image: ${hasImage},
        }`;

  let diamond_query = `
    query {
      diamonds_by_query_count (
        offset: ${offset},
        limit: ${limit}, 
        order: { 
          type: ${order?.type || 'price'}, 
          direction: ${order?.direction || 'ASC'} 
        },
        query: ${query}
      ),
      diamonds_by_query (
        offset: ${offset},
        limit: ${limit}, 
        order: { 
          type: ${order?.type || 'price'}, 
          direction: ${order?.direction || 'ASC'} 
        },
        query: ${query}
      ) {
        items {
          id
          diamond {
            id
            video
            image
            availability
            supplierStockId
            brown
            green
            milky
            eyeClean
            mine_of_origin
            certificate {
              id
              lab
              labgrown
              shape
              certNumber
              cut
              carats
              clarity
              polish
              symmetry
              color
              width
              length
              depth
              girdle
              floInt
              floCol
              depthPercentage
              table
            }
          }
          price
          discount
        }
        total_count
      }
    }
  `;

  console.log('***** diamond_query', diamond_query);

  let result;

  try {
    result = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        query: diamond_query,
        /*
        variables: {
          color: color,
        } 
        */
      }),
      signal: internalSignal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Client aborted during diamonds fetch');
      clientSignal.removeEventListener('abort', abortListener);
      return NextResponse.json({ success: false, aborted: true }, { status: 499 });
    }
    throw err;
  }

  const resultsTime = Date.now() - startTime;
  console.log('resultsTime', resultsTime);

  console.log('*****++ result', result);

  if (!result.ok) {
    clientSignal.removeEventListener('abort', abortListener);
    return NextResponse.json({ success: false, error: `API network response was not OK. Status: ${result.status}, ${result.statusText}` });
    /*
    throw new Error(
      `API network response was not OK. Status: ${result.status}, ${result.statusText}`,
    );
    */
  }


  let diamond_res = await result.json();

  console.log('))))))))))))))))))) diamond_res', diamond_res);

  clientSignal.removeEventListener('abort', abortListener);
  
  if (diamond_res?.data?.diamonds_by_query) {
    let { items, total_count } = diamond_res.data.diamonds_by_query;
    const resultCount = diamond_res.data?.diamonds_by_query_count
  
    let isMore = items.length === limit ? true : false;
    console.log('***** SUCCESS TRUE total_count, isMore', total_count, isMore);
    return NextResponse.json({ 
      success: true, 
      items, 
      totalCount: total_count, 
      resultCount: resultCount,
      isMore: isMore 
    });
  } else {
    console.log('***** SUCCESS FALSE diamond_res.data', diamond_res.data);
    let error = '';
    if (diamond_res?.errors.length > 0) {
      error = diamond_res?.errors[0]?.message;
    }
    return NextResponse.json({ success: false, error: error});
  }
  // console.log('ITEMS', items, 'total_count', total_count);
  
  // example to access a diamond is mapping over the items
  // i.e. items[0].diamond.certificate.certNumber will give you the certificate number of the first item

  /*
  const diamonds = [];
  items.forEach((item) => {
    const tempDiamond = {
      __typename: 'Post',
      id: wpArticle.id.toString(),
      title: parse(wpArticle.title.rendered),
      dateGmt: wpArticle.date_gmt,
      slug: wpArticle.slug,
      featuredImage:
        wpArticle._embedded['wp:featuredmedia'] !== undefined
          ? {
              node: {
                mediaItemUrl:
                  wpArticle._embedded['wp:featuredmedia'][0].source_url,
              },
            }
          : null,
    
    };
    // diamonds.push(tempDiamond);
  });
  */
}

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

  const requestJson = await request.json();

  const { id } = requestJson;

  if (!id) {
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

  // note that this does not include all available fields, to see more fields please refer to the documentation
  
  let diamond_query = `
    query {
      get_diamond_by_id(diamond_id:"${id}", preferred_currency: USD){
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
      console.log('Client aborted during diamond fetch');
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
  
  if (diamond_res?.data?.get_diamond_by_id) {
    let item = diamond_res.data.get_diamond_by_id;
  
    return NextResponse.json({ 
      success: true,
      item: item, 
    });
  } else {
    console.log('***** SUCCESS FALSE diamond_res.data', diamond_res.data);
    let error = '';
    if (diamond_res?.errors.length > 0) {
      error = diamond_res?.errors[0]?.message;
    }
    return NextResponse.json({ success: false, error: error});
  }

  // example to access a diamond is mapping over the items
  // i.e. items[0].diamond.certificate.certNumber will give you the certificate number of the first item
}

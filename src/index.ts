import { SoapClient, SoapServer } from './soap';

const port = 6000;

const testWebClient = async () => {
  try {
    const soap = new SoapClient({
      url: 'http://ws.cdyne.com/ip2geo/ip2geo.asmx?wsdl',
    });

    console.log('Methods: ', await soap.getMethods());

    const { result } = await soap.call('ResolveIP', {
      ipAddress: '177.95.228.97',
      licenseKey: '',
    });

    console.log('Result: \n' + JSON.stringify(result));
  } catch (e) {
    console.error('Error: ', e);
  }
};

const testServer = async () => {
  const services = {
    MyService: {
      MyPort: {
        MyFunction: ({ name }) => ({ name }),

        // This is how to define an asynchronous function.
        MyAsyncFunction: ({ name }, callback) => callback({ name }),

        // This is how to receive incoming headers
        HeadersAwareFunction: (args, cb, { Token: name }) => ({ name }),

        // You can also inspect the original `req`
        reallyDetailedFunction: (args, cb, { Token: name }, req) => {
          console.log(
            'SOAP `reallyDetailedFunction` request from ' +
              req.connection.remoteAddress,
          );
          return { name };
        },
      },
    },
  };

  const wsdlFile = 'myservice.wsdl';

  const server = new SoapServer({ services, wsdlFile, port });
  return server.start();
};

const testClient = async () => {
  try {
    const soap = new SoapClient({
      url: `http://localhost:${port}/wsdl`,
    });

    console.log('Methods: ', await soap.getMethods());

    const { result } = await soap.call('MyFunction', {
      name: 'G]agsd',
    });

    console.log('Result: \n' + JSON.stringify(result));
  } catch (e) {
    console.error('Error: ', e);
  }
};

testWebClient()
  .then(testServer)
  // .then(testClient);

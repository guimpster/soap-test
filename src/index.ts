import Soap from './soap';

const main = async () => {
  try {
    const soap = new Soap({ url: 'http://ws.cdyne.com/ip2geo/ip2geo.asmx?wsdl' });
  
    console.log('Methods: ', await soap.getMethods());
  
    const { result } = await soap.call('ResolveIP', {
      ipAddress: '177.95.228.97',
      licenseKey: ''
    });
  
    console.log('Result: \n' + JSON.stringify(result));
  } catch(e) {
    console.error('Error: ', e);
  }
};

main();
